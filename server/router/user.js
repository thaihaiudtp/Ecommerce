const router = require('express').Router()
const controll = require('../controller/user')
router.post('/regester', controll.dangky)
router.post('/login', controll.dangnhap)
module.exports = router