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

  async bot_launch() {
    await this._bot.launch()
  }

  stop() {
    process.once('SIGINT', () => this._bot.stop('SIGINT'))
    process.once('SIGTERM', () => this._bot.stop('SIGTERM'))
  }
}
