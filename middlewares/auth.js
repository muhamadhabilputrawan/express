

const jwt = require('jsonwebtoken')
const { response } = require('../helpers/response.formatter')
const { auth_secret } = require('../config/base.config')
const { verify } = require('password-hash')

module.exports = {
    verifyToken: async (req, res, next) => {
        // next: memperbolehkan akses ke halaman terkait


        try {

            const token = req.header('Authorization'); // ambil headere yang nyimpen token jwt
            if (!token) {
                // 401 : error perlu login
                return res.status(401).json(response(401, "unauthorized"))

            }
            // verifikasi apakah tokenjwt masih aktif, kalo iya ambil data user didalamanya
            const checkToken = jwt.verify(token, auth_secret);
            // isis dari checkToken : data parameter pertama di jwt.sign login controller. simpan data user di loginnya di req.user
            req.user = checkToken;
            next(); // perbolehkan akses halaman yang diminta

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))

        }
    }
}