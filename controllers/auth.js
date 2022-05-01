const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError} = require('../errors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const register = async (req,res) => {
  try{
    const {email,username} = req.body
    const userfind = await User.findOne({email,username})
    if(userfind)
    throw new BadRequestError('User already exists')

  const user = await User.create({...req.body})
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({user: user.getName(),token})
  }
  catch(error)
  {
    console.log(error)
    if(error.code = 11000 && error.keyPattern.username)
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({err:'Username already exists'})
else if(error.code = 11000 && error.keyPattern.email)
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send({err:'User already exists,please login with email'})
  }
}

const login = async (req,res) => {
  console.log("Reched login")
  const {email:email,password:password} = req.body
  console.log(req.body)
  if(!email || !password)
  return res.status(StatusCodes.BAD_REQUEST)
  const user = await User.findOne({email})
  console.log(user)
  if(!user)
  return res.status(StatusCodes.BAD_REQUEST).send({err:"User does not exists"})
  try
  {
    console.log(password)
    const verify = await user.compare(password)
    console.log("comparison failed",verify)
    if(!verify)
    {
      console.log("veirrrrr",verify)
    return res.status(StatusCodes.BAD_REQUEST).send({err:"ksjdhfsjh"})
  }
    const token = user.createJWT()
    return res.json({username:user.getName(),token:token})
  }
  catch(error)
  {
      console.log(error)
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).send(error)
  }
  res.json({...req.body})
  console.log(req)

}

module.exports = {
  login,register
}
