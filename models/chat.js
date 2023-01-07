const mongoose = require('mongoose');


const chatSchema = new mongoose.Schema({
  chatName:{
      type: String,
      trim : true,
      required: [true,'Please provide a chat name'],
      maxlength: [40,'Chat name should be under 40 characters']
  },
  isGroupChat:{
      type:Boolean,
      default:false
  },
  users:[
      {
          type: mongoose.Schema.ObjectId,
          ref: 'User'
      }
  ],
  latestMessage: {
      type: mongoose.Schema.ObjectId,
      ref : 'Message' 
  },
  groupAdmin:{
      type: mongoose.Schema.ObjectId,
      ref: 'User'
  },
  createdAt:{
        type:Date,
        default:Date.now
 }

})

module.exports = mongoose.model('Chat',chatSchema)