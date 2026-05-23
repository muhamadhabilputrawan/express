const multer = require('multer')
/// path : mengakses folder file
const path = require('path')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const exFile = path.extname(file.originalname)
    // gabungan nama dan extensi file
    const name = uniqueSuffix + exFile
    cb(null, name)
  }
})


module.exports = multer({ storage })

