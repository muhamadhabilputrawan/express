const express = require('express')
const router = express.Router()

const upload = require('../middlewares/upload')
const loginController = require('../controllers/login.controller')

router.post('/', upload.none(), loginController.loginAuth)

module.exports = router