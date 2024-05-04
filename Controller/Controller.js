import { Markup } from 'telegraf'
import messages from './messages.js'
import User from '../model/user.js'

export default class Controler {
  constructor(tgBot) {
    this._bot = tgBot
  }

  initBot() {
    try {
      this.start()
      this.setLanguageHandlers()
      this.chooseLang()
      this.setDownloadFormatHandlers()
      this.chooseDownloadFormat()
      this.setDownloadMethodHandlers()
      this.chooseDownloadMethod()
      this.bot_launch()
      this.stop()
    } catch (e) {
      console.error(e)
    }
  }

  start() {
    try {
      this._bot.start(async (ctx) => {
        const chatId = ctx.chat.id
        const isUserExist = await User.findOne({ userTgId: ctx.chat.id })
        if (!isUserExist) {
          const user = new User({
            userTgId: ctx.chat.id,
            userName: ctx.chat.first_name,
            userHistory: { musics: [] }
          })
          await user.save()
          ctx.telegram.sendMessage(chatId, messages[user.loc].greetings)
        } else {
          ctx.telegram.sendMessage(chatId, messages[isUserExist.loc].greetings)
        }
      })
    } catch (e) {
      console.error(e)
    }
  }

  chooseLang() {
    try {
      this._bot.command('choose_language', async (ctx) => {
        const user = await User.findOne({ userTgId: ctx.chat.id })
        ctx.reply(
          messages[`${user.loc}`].chooseLanguage,
          Markup.inlineKeyboard([
            [Markup.button.callback(messages[user.loc].languages[0], 'eng')],
            [Markup.button.callback(messages[user.loc].languages[1], 'ukr')]
          ])
        )
      })
    } catch (e) {
      console.error(e)
    }
  }

  async setLanguageHandlers() {
    this._handleLanguageAction('eng', 'eng')
    this._handleLanguageAction('ukr', 'ukr')
  }

  async _handleLanguageAction(action, lang) {
    this._bot.action(action, async (ctx) => {
      const user = await User.findOne({ userTgId: ctx.chat.id })
      this._setLang(lang, user, ctx)
    })
  }

  async _setLang(lang, user, ctx) {
    user.loc = lang
    await user.save()
    ctx.telegram.sendMessage(user.userTgId, messages[user.loc].chatLang)
  }

  chooseDownloadFormat() {
    try {
      this._bot.command('choose_format', async (ctx) => {
        const user = await User.findOne({ userTgId: ctx.chat.id })
        ctx.reply(
          messages[`${user.loc}`].chooseFormat,
          Markup.inlineKeyboard([
            [Markup.button.callback('MP3', 'format_mp3')],
            [Markup.button.callback('MP4', 'format_mp4')]
          ])
        )
      })
    } catch (e) {
      console.error(e)
    }
  }

  async setDownloadFormatHandlers() {
    this._handleDownloadAction('format_mp3', 'MP3', this._setDownloadFormat)
    this._handleDownloadAction('format_mp4', 'MP4', this._setDownloadFormat)
  }

  async _setDownloadFormat(format, user, ctx) {
    user.downloadFormat = format
    await user.save()
    ctx.telegram.sendMessage(user.userTgId, messages[user.loc].downloadFormat + user.downloadFormat)
  }

  chooseDownloadMethod() {
    try {
      this._bot.command('choose_method', async (ctx) => {
        const user = await User.findOne({ userTgId: ctx.chat.id })
        ctx.reply(
          messages[`${user.loc}`].chooseMethod,
          Markup.inlineKeyboard([
            [Markup.button.callback(messages[user.loc].downloadMethods[0], 'name')],
            [Markup.button.callback(messages[user.loc].downloadMethods[1], 'link')]
          ])
        )
      })
    } catch (e) {
      console.error(e)
    }
  }

  async setDownloadMethodHandlers() {
    this._handleDownloadAction('name', 'Name', this._setDownloadMethod)
    this._handleDownloadAction('link', 'Link', this._setDownloadMethod)
  }

  async _setDownloadMethod(method, user, ctx) {
    user.downloadMethod = method
    await user.save()
    if (user.loc === 'ukr' && user.downloadMethod === 'Name') {
      ctx.telegram.sendMessage(user.userTgId, messages[user.loc].downloadMethod + messages.ukr.downloadMethods[0])
    } else if (user.loc === 'ukr' && user.downloadMethod === 'Link') {
      ctx.telegram.sendMessage(user.userTgId, messages[user.loc].downloadMethod + messages.ukr.downloadMethods[1])
    } else {
      ctx.telegram.sendMessage(user.userTgId, messages[user.loc].downloadMethod + user.downloadMethod)
    }
  }

  async _handleDownloadAction(action, value, handler) {
    this._bot.action(action, async (ctx) => {
      const user = await User.findOne({ userTgId: ctx.chat.id })
      handler.call(this, value, user, ctx)
    })
  }

  async bot_launch() {
    await this._bot.launch()
  }

  stop() {
    process.once('SIGINT', () => this._bot.stop('SIGINT'))
    process.once('SIGTERM', () => this._bot.stop('SIGTERM'))
  }
}
