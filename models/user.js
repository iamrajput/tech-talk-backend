const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
          type: String,
          required: [true,'Please provide a name'],
          maxlength: [40,'Name should be under 40 characters']
    },
    email: {
          type: String,
          required: [true,'Please provide a email'],
          validate:[validator.isEmail,'Please enter the email in correct formate'],
          unique: true
    },
    password: {
          type: String,
          required: [true,'Please provide a password'],
          minlength:[6,'Password should be atleast 6 characters'],
          select: false
    },
    role: {
          type: String,
          default:'user'
    },
    photo: {
          type: String,
          default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

})


//encrypt password brfore save
userSchema.pre('save', async function (next){
   // Only run this function if password was modified (not on other update functions)
  if (!this.isModified('password')) {
      return next();
  }
   // Hash password with strength of 10
  this.password = await bcrypt.hash(this.password, 10);
});


//validate the password
userSchema.methods.isValidatePassword = async function(userPassword){
    return await bcrypt.compare(userPassword,this.password)
}


// create and return jwt token
userSchema.methods.getJwtToken = function(){
   return jwt.sign({id: this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRY
    }) //jwt.sign({id: this._id,email:this.email}) we can do this as well
}





module.exports = mongoose.model('User',userSchema)