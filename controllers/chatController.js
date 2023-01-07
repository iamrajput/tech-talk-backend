const BigPromise = require('../middlewares/bigPromise')
const CustomError = require('../utils/customError')
const Chat = require('../models/chat')
const User = require('../models/user')


/**
 This function will create one to one thread 
 if the thread is alredy exits then will return that
 else we are gonna create new one
 */
exports.createThread = BigPromise(async (req,res,next) => {
    const {userId} = req.body;
    if(!userId){
       res.status(400)
       throw new CustomError('UserId is required to create one and one chat')
    }

   var isChat = await Chat.find({
       isGroupChat: false,
       $and:[
           {users:{$elemMatch:{$eq:req.user.id}}},
           {users:{$elemMatch:{$eq:userId}}}
       ]
   }).populate("users","-password")
     .populate("latestMessage");

    isChat = await User.populate(isChat,{
        path:"latestMessage.sender",
        select:"name pic email"
    });

    if(isChat.length > 0){
        res.send(isChat[0])
    }else{
        var charData = {
            chatName:"sender",
            isGroupChat: false,
            users:[req.user.id,userId]
        }
       try {
           const createThread = await Chat.create(charData);
           const data = await Chat.findById(createThread._id).populate("users","-password");
           res.status(200).json({
                success:true,
                thread: data
            })
       } catch (error) {
            res.status(400)
             throw new CustomError('Somthing went wrong')
       }
    }
})

//all the threads

exports.getThread = BigPromise(async (req,res,next) => {
    
     const threads =  await Chat.find({users:{$elemMatch:{$eq:req.user.id}}})
     .populate("users","-password")
     .populate("groupAdmin","-password")
     .populate("latestMessage")
     .sort({updatedAt: -1});

     const myThread = await User.populate(threads,{
        path:"latestMessage.sender",
        select:"name pic email"
    })

     res.status(200).json({
        success:true,
        threads: myThread
    })
})

/**
create group chat 
 */
exports.createGroupthread = BigPromise(async (req,res,next) => {
    if(!req.body.users || !req.body.name){
        res.status(400);
        throw new CustomError('Please fill all the field');
    }

    var user = JSON.parse(req.body.users);

    if(user.length < 2){
        res.status(400);
        throw new CustomError('More than 2 users required to create group chat');
    }

    user.push(req.user);

    try {
        const  groupChat = await Chat.create({
            chatName: req.body.name,
            users:user,
            isGroupChat: true,
            groupAdmin: req.user,
        });
       const groupThread = await Chat.findById(groupChat._id)
                            .populate("users","-password")
                            .populate("groupAdmin","-password")
       res.status(200).json({
        success:true,
        thread: groupThread
       });

    } catch (error) {
        res.status(400)
        throw new CustomError(error.message);
    }
})


exports.renameGroupthread = BigPromise(async (req,res,next) => {
  const threadId = req.params.threadId;
  
  const thread = await Chat.findById(threadId);
 
  if(!thread){
      res.status(404)
      throw new CustomError("No thread found");
  }

  const updatedGroupThread = await Chat.findByIdAndUpdate(threadId,{
      chatName: req.body.name},{
        new: true,
        runValidators: true,
        useFindAndModify: false
    }).populate("users","-password")
      .populate("groupAdmin","-password")
   
  res.status(200).json({
        success:true,
        thread: updatedGroupThread
    });
})

exports.addMembersToGroupthread = BigPromise(async (req,res,next) => {
  const threadId = req.params.threadId;
  const userId = req.body.user_id;
  
  const thread = await Chat.findById(threadId);
 
  if(!thread){
      res.status(404)
      throw new CustomError("No thread found");
  }

  if(!userId){
    res.status(400)
    throw new CustomError("Please provide user's id you want to add to group");
  }
  const added = await Chat.findByIdAndUpdate(threadId,
    {
      $push:{users:userId}
    },
    {
       new: true,
    }
    )
    
    .populate("users","-password")
      .populate("groupAdmin","-password")
   
  res.status(200).json({
        success:true,
        thread: added
    });
})


exports.removeMembersToGroupthread = BigPromise(async (req,res,next) => {
  const threadId = req.params.threadId;
  const userId = req.body.user_id;
  
  const thread = await Chat.findById(threadId);
 
  if(!thread){
      res.status(404)
      throw new CustomError("No thread found");
  }

  if(!userId){
    res.status(400)
    throw new CustomError("Please provide user's id you want to remove to group");
  }
  const added = await Chat.findByIdAndUpdate(threadId,{$pull:{users: userId}},
   {new: true,
    runValidators: true,
    useFindAndModify: false
    }).populate("users","-password")
      .populate("groupAdmin","-password")
   
  res.status(200).json({
        success:true,
        thread: added
    });
})









