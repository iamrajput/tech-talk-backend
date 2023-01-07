const BigPromise = require('../middlewares/bigPromise')
const CustomError = require('../utils/customError')
const User = require('../models/user')


exports.signup = BigPromise(async (req,res,next) => {
    
    const {name, email,password,photo} = req.body;

 if(!email || !name || !password){
     res.status(400)
     throw new CustomError('Name , email and passwors required')
}

  const userExists = await User.findOne({email})
  if(userExists){
      res.status(404)
      throw new CustomError('User with this email already exists')
  }

   const user = await User.create({
       name,
       email,
       password,
       photo
   });

   user.password = undefined

  res.status(200).json({
     success:true,
     user,
     token: user.getJwtToken()
 })

})



exports.login = BigPromise(async(req,res,next) => {
    const {email,password} = req.body;
    
     // check for email and password
    if(!email || !password){
        res.status(400)
        throw new CustomError('Name , email and passwors required')
    }

    const user = await User.findOne({email}).select("+password");
    
    if(!user){
        res.status(404)
        throw new CustomError('No user found')
    }

     //valiadte the password with db
   const isPasswordMatch = await user.isValidatePassword(password)
   
   if(!isPasswordMatch){
        res.status(404)
        throw new CustomError('Sorry no users found with this email and password')
   }
 user.password = undefined
 
  res.status(200).json({
     success:true,
     user,
     token: user.getJwtToken()
 })
})


exports.allUsers = BigPromise(async(req,res,next) => {
    // $option = "i" // case insensetive
    const keyword = req.query.keyword ? {
        $or:[
            {name: { $regex: req.query.keyword, $options:"i" }},
            {email: { $regex: req.query.keyword, $options:"i" }},
        ]
    } : {};

    const users = await User.find(keyword).find({_id:{$ne:req.user.id}})
    res.send(users);
})