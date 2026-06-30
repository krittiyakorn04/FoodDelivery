const express = require('express')
const { register, login, currentRestau } = require('../controllers/Store/StoreAuth')

const router = express.Router()

router.post('/restau/register' ,register)
router.post('/restau/login' ,login)
router.post('/restau/current-restau' ,currentRestau)


module.exports = router  