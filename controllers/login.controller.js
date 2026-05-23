const Validator = require("fastest-validator");
const v = new Validator();
const { User } = require('../models')
const { response } = require('../helpers/response.formatter')
const passwordHash = require('password-hash')
const jwt = require('jsonwebtoken')
const { auth_secret } = require('../config/base.config')

module.exports = {
    loginAuth: async (req, res) => {
        try {
            const { username, password } = req.body;

            const schema = {
                username: { type: "string" },
                password: { type: "string" }
            }

            const data = {
                username: username,
                password: password,
            }

            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                return res.status(400).json(response(400,"Validasi Error", validate))
            }

            // ambil data ke model User cari apakah usernamenya terdaftar atau tidak 
            // findOne : mencari 1 data bukan dari primary Key, fidByPk: mencari 1 data dari primary Key(id)
            const user = await User.findOne({ where: { username: data.username } });
            if (!user) {// jika tidak ada data username di db 
                return res.status(400).json(response("Validasi Error", "Username Not registered"));
            }
            // cek apakah password yang  diinput sesuai dengan encrpty password yang didatabase 
            const checkPassword = passwordHash.verify(data.password, user.password);
            if (!checkPassword) {
                return res.status(400).json(response(400,"Validasi Error", "Password doesnt macth"));

            }
            // jika username dana password sesuai simpan data user (selain password)
            // ke jwt lalu buat tokennya
            const token = jwt.sign({ username: data.username, name: data.name, userId: user.id }, auth_secret, {
                expiresId: '1h'
            });
            // format output : data user dan token jwt
            const formmatOutput = {
                user: {
                    id: user.id,
                    username: user.username,
                    name: user.name, // ambil data selain password

                },
                token: token
            }
            return res.status(200).json(response(200, "success",formmatOutput ))


        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))

        }
    }
}