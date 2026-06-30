const express = require('express')
const { register, login, currentUser } = require('../controllers/User/UserAuth')


const router = express.Router()

router.post('/user/register' ,register)
router.post('/user/login' ,login)
router.post('/user/current-user' ,currentUser)


module.exports = router  