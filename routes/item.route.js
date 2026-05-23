const express = require('express')
const router = express.Router()


const itemController = require('../controllers/item.controller')
const upload = require("../middlewares/upload") 

// format membuat route 
//router.httpMethod('/path',middleware,functionDiController)
// upload.single('image') : upload 1 file dari inputan namanya image
router.post('/', upload.single('image'),itemController.createItem)
router.get('/',itemController.getItem)
// path dinamis gunakan (:)
router.get('/:id',itemController.detailItem)
router.put('/:id', upload.single('image'), itemController.updateItem)
router.delete('/:id',itemController.deleteItem)

module.exports=router