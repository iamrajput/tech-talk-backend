const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({
  sender:{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
  },
  content:{
      type: String,
      trim: true
  },
  chat:{
      type: mongoose.Schema.ObjectId,
      ref: 'Chat'
  },
  createdAt:{
        type:Date,
        default:Date.now
 }
})

module.exports = mongoose.model('Message',messageSchema)