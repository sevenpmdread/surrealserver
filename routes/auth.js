const express = require('express')
const router = express.Router()

const {login,register} = require('../controllers/auth')


router.route('/signin').post(login)
//router.post('/login',login)
router.post('/signup',register)

module.exports = router
