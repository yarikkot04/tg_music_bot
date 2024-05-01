import { config } from 'dotenv'
import { Telegraf } from 'telegraf'
import mongoose from 'mongoose'
import Controler from './Controller/Controller.js'
import messages from './Controller/messages.js'

config()

const botToken = process.env.BOT_TOKEN
const bot = new Telegraf(botToken)
const controller = new Controler(bot)

const startBot = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    controller.initBot()
    console.log(messages.startBotMsg)
  } catch (e) {
    console.error(e)
  }
}

startBot()
