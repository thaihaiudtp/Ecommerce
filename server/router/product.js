const router = require('express').Router()
const controll = require('../controller/product')
const {verifiAccessToken, isAdmin} = require('../middleware/verifiToken')
router.post('/', verifiAccessToken, isAdmin, controll.createProduct)
router.get('/', controll.getAllProduct)
router.put('/:pid', verifiAccessToken, isAdmin, controll.updateProduct)
router.delete('/:pid', verifiAccessToken, isAdmin, controll.deleteProduct)
router.get('/:pid', controll.getOneProduct)
module.exports = router