const express = require('express')
const router =  express.Router({ mergeParams: false });

const {login,register} = require('../controllers/auth')


router.post('/signin',login)
//router.post('/login',login)
router.post('/signup',register)

module.exports = router
