import messages from './messages.js'
import User from '../model/user.js'

export default class Controler {
  constructor(tgBot) {
    this._bot = tgBot
  }

  initBot() {
    try {
      this.start()
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

  async bot_launch() {
    await this._bot.launch()
  }

  stop() {
    process.once('SIGINT', () => this._bot.stop('SIGINT'))
    process.once('SIGTERM', () => this._bot.stop('SIGTERM'))
  }
}
