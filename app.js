const express = require('express')
const app = express()
const port = 3000

const db = require('./models')
// cek kondisi model sudah bisa digunakan untuk proses crud data blm
const itemRouter = require('./routes/item.route')
const loanRouter = require('./routes/loan.route')
const loginRouter = require('./routes/login.route')
const {verifyToken} = require('./middlewares/auth')

db.sequelize.authenticate()
//Sequelize bisa digunakan untuk proses crud data blm
.then(() => console.log('Sequelize ORM sudah dapat digunakan'))
.catch((error) => console.error(error.message));

// express.json(): agar bisa mengirim dan menampilkan data json
app.use(express.json());
// static ('/uploads') : agar gambar di folders uploads bisa diakses FE/dimunculin di browser
app.use('/uploads',express.static('uploads'));
app.use('/items',verifyToken,itemRouter)
app.use('/loans',verifyToken,loanRouter)
app.use('/login',verifyToken,loginRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})