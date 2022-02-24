const express = require('express')
const router = express.Router()

const {login,register} = require('../controllers/auth')


router.route('/login').post(login)
//router.post('/login',login)
router.post('/register',register)

module.exports = router
