const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require("../errors")

const auth = (req,res,next) => {
  const authHeader = req.headers.authorization
  if(!authHeader || !authHeader.startsWith('Bearer')){
    throw new UnauthenticatedError('Authentication invalid')
  }
  const token = authHeader.split(" ")[1]
  try {
    console.log("Reached validation")
      const payload = jwt.verify(token,process.env.JWT_KEY)
      //attatch the user to the job routes

      req.user = {userId:payload.userId,username:payload.usernamename}
      next()

  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }

}

module.exports = auth
