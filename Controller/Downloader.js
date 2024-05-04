import { config } from 'dotenv'
import { google } from 'googleapis'
import { createWriteStream } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import ytdl from 'ytdl-core'
import messages from './messages.js'

config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default class Downloader {
  static _apiKey = process.env.YOUTUBE_API_KEY

  static _youtube = google.youtube({
    version: 'v3',
    auth: this._apiKey
  })

  static async downloadByLink(videoLink, format) {
    try {
      const info = await ytdl.getInfo(videoLink)
      const videoTitle = info.videoDetails.title
      if (format === 'MP3') {
        return this._downloadAudio(info, videoTitle, videoLink)
      }
      return this._downloadVideo(info, videoTitle, videoLink)
    } catch (e) {
      if (e.message.includes(messages.server_errors.noVideoIdFind)) {
        return false
      }
      console.error(e)
    }
  }

  static async _downloadAudio(videoInfo, videoTitle, link) {
    const audioFormat = ytdl.chooseFormat(videoInfo.formats, {
      filter: 'audioonly'
    })
    if (!audioFormat) {
      throw new Error(messages.server_errors.notFoundAudioFormat)
    }
    const audioStream = ytdl(link, {
      quality: audioFormat.itag,
      filter: 'audioonly'
    })
    const sanitizedTitle = Downloader._sanitizeFileName(videoTitle)
    const filePath = resolve(__dirname, `./song/${sanitizedTitle}.mp3`)
    const writeStream = createWriteStream(filePath)
    audioStream.pipe(writeStream)
    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => {
        resolve(filePath)
      })
      writeStream.on('error', (err) => {
        reject(err)
      })
    })
  }

  static async _downloadVideo(videoInfo, videoTitle, link) {
    const formats = ytdl.filterFormats(videoInfo.formats, 'audioandvideo')
    const videoFormat = ytdl.chooseFormat(formats, { quality: 'highestvideo' })

    if (!videoFormat) {
      throw new Error(messages.server_errors.notFoundVideoFormat)
    }

    const videoStream = ytdl(link, {
      format: videoFormat
    })

    const sanitizedTitle = Downloader._sanitizeFileName(videoTitle)
    const filePath = resolve(__dirname, `./song/${sanitizedTitle}.mp4`)

    const writeStream = createWriteStream(filePath)
    videoStream.pipe(writeStream)

    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => {
        resolve(filePath)
      })
      writeStream.on('error', (err) => {
        reject(err)
      })
    })
  }

  static _sanitizeFileName(filename) {
    return filename.replace(/[^\w\sа-яА-Я]/g, '').replace(/\s+/g, '_')
  }
}
