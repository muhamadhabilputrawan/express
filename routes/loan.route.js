const express = require('express')
const router = express.Router()

const loanController = require('../controllers/loan.controller')
const upload = require('../middlewares/upload')

// untuk post/put perlu manggil upload middleware
router.post('/', upload.none(), loanController.createLoan)
router.get('/',loanController.getLoans)
router.post('/return',upload.none(),loanController.createReturn)

module.exports = router

// untuk post/put perlu manggil upload middleware
// upload.none()= jika post/put/pacth tidak perlu ada file yang di upload
