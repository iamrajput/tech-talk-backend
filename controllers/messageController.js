const BigPromise = require('../middlewares/bigPromise')
const CustomError = require('../utils/customError')
const Chat = require('../models/chat')
const Message = require('../models/message')
const User = require('../models/user')



exports.sendMessage = BigPromise(async (req,res,next) => {
   const {content,threadId} = req.body;
   if(!content || !threadId){
       res.status(400)
       throw new CustomError('Invalid data pass')
   }

   var newMessage = {
       sender: req.user._id,
       content: content,
       chat:threadId
   };

   try {
       var message = await Message.create(newMessage);
       message = await message.populate("sender","name photo");
       message = await message.populate("chat");
       message = await User.populate(message,{
           path:'chat.users',
           select:"name pic email"
       })

       await Chat.findByIdAndUpdate(req.body.chatId,{
           latestMessage:message
       })

       res.json(message)
   } catch (error) {
       res.status(400)
       throw new CustomError(error.message)
   }
})

exports.getMessagesOfThread = BigPromise(async (req,res,next) => {
    const threadId = req.params.threadId;
    const thread = await Chat.findById(threadId);
 
    if(!thread){
        res.status(404)
        throw new CustomError("No thread found");
    }
    
    const messages = await Message.find({chat:threadId})
                                  .populate("sender","name photo")
                                  .populate("chat");
    res.json(messages);

})

