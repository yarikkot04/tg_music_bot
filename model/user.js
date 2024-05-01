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

export default model('User', userSchema)