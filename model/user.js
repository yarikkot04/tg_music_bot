import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  userTgId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userHistory: {
    songs: [
      {
        songName: {
          type: String,
          required: true
        },
        songId: {
          type: String,
          required: true
        }
      }
    ]
  },
  loc: {
    type: String,
    default: 'eng'
  },
  downloadFormat: {
    type: String,
    default: 'MP3'
  },
  downloadMethod: {
    type: String,
    default: 'Name'
  }
})

userSchema.methods.addToHistory = async function({ songName, songId }) {
  const songs = [...this.userHistory.songs]
  const idx = songs.findIndex(m => m.songName === songName)

  if (idx >= 0) {
    songs.splice(idx, 1)
  }

  songs.push({ songName, songId })

  if (songs.length > 10) {
    songs.shift()
  }

  this.userHistory.songs = songs

  try {
    await this.save()
  } catch (err) {
    console.error(err)
  }
}
export default model('User', userSchema)
