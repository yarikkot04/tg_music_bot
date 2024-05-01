export default class Controler {
  constructor(tgBot) {
    this._bot = tgBot
  }

  initBot() {
    try {
      this.bot_launch()
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
