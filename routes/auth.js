const express = require('express')
const router =  express.Router({ mergeParams: false });

const {login,register,updatetoken} = require('../controllers/auth')


router.post('/signin',login)
//router.post('/login',login)
router.post('/signup',register)
router.post('/updatetoken',updatetoken)
module.exports = router
