const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  username:{
  type:String,
  unique:[true,'The usernamename has to be unique'],
  required:[true,'Need a username to sign in'],
  minlength:3,
  maxlength:50
  },
  email:{
    type:String,
    required:[true,'Email id is required'],
    match:[
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    ],
    unique:true
  },
  password: {
    type:String,
    required:[true,'Please provide a password'],
    minlength:8
  }
})


UserSchema.pre('save', async function(next){
  console.log('In save')
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password,salt)
  next()
})

UserSchema.methods.getName = function(){
  return this.username
}

UserSchema.methods.createJWT = function(){
  return jwt.sign({userId:this._id,name:this.name},process.env.JWT_KEY,{expiresIn:process.env.JWT_LIFE})
}

UserSchema.methods.compare = function(password){
  console.log("in here")
  return new Promise((resolve,reject) =>{
  bcrypt.compare(password,this.password,(err,isMatch) =>{
      if(err)
      reject(err)
      if(isMatch)
      resolve(true)
      reject({err:'Incorrect User details'})
    })
  })
}


module.exports = mongoose.model('User',UserSchema)
