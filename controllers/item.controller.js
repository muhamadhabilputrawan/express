const Validator = require("fastest-validator");

const v = new Validator();

// pake {} karena ngambil class item dari folder models/item.js

const { Item } = require('../models')
//pake {}karena mau ambil function di file tersebut 
const { response } = require('../helpers/response.formatter')

const { Op, where } = require("sequelize");

const path = require("path");
//untuk hapus file foto
const fs = require("fs"); // package file system


module.exports = {
    // membuat method atau function controller, formatnya :
    // nama: asnyc (req,res) => {...}
    // req : ambil inputan, res: membuat input

    createItem: async (req, res) => {
        try {
            // req.body : mengambil inputan selain file
            const { name, stock } = req.body;

            const schema = {
                name: { type: "string", min: 3 },
                stock: { type: "number", positive: true, integer: true }

            }
            // siapkan data yang akan di validate, data json berupa string semua . selain string perlu doparse/diganti tipe datanya
            const data = {
                name: name,
                stock: Number(stock), // ubah stock dr json yang string jadi number
            }

            const validate = v.validate(data, schema);
            // jika ada error validasi 
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate));
            }
            // memastikan gambar di upload, buat ambil file : req.file
            if (!req.file) {
                return res.status(400).json(response(400, "Image must be upload"));
            }

            const item = await Item.create({
                name: data.name,/// data yang disimpan di hasil validasi
                stock: data.stock,
                image: req.file.filename// gambar di db disimpen nama filenyaa
            });

            return res.status(201).json(response(201, "Created", item));

        } catch (error) {
            // pemnagangan error 500 (error dikodingan dalem try)
            return res.status(500).json(response(500, "Server Error", error.message));

        }
    },
    getItem: async (req, res) => {
        try {
            const { name, sortBy, order } = req.query;// buat ambil data dari tabs params postman atau fe input method get (searching/sorting)

            // findAll: mengambil semua data dari model
            const items = await Item.findAll({
                // mencari data jika req.query name ada (sedang mencari)

                where: name ? {
                    name: {
                        [Op.like]: `%${name}%` // like : mencari data yang mirip
                    }

                } : {},

                order: sortBy && order ? [
                    [sortBy, order],
                ] : [],


            });


            return res.status(200).json(response(200, "success", items));

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));

        }
    },

    detailItem: async (req, res) => {
        try {
            // req.params : mengambil path dinamis (/id: ambil angka id dari url)
            const { id } = req.params;
            const detail = await Item.findByPk(id); //mencari berdasarkan pk
            return res.status(200).json(response(200, "success", detail))

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));

        }
    },

    updateItem: async (req, res) => {
        try {
            // const { id } = req.params;
            // const update = await Item.update.findByPk(id);
            // return res.status(200).json(response(200, "success", detail))

            const { name, stock } = req.body;

            const schema = {
                name: { type: "string", min: 3 },
                stock: { type: "number", positive: true, integer: true }
            }

            const data = {
                name: name,
                stock: Number(stock),
            }

            const validate = v.validate(data, schema);

            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate));
            }

            // ambil data item sebelumnya
            const { id } = req.params;
            const itemBefore = await Item.findByPk(id);
            // jika ada gambar baru yang diupload, hapus gambar lama 
            if (req.file) {
                // ambil nama asli gambar yg ada didatabase 
                const imageName = itemBefore.getDataValue('image');
                // cek folder uploads
                const filePosition = path.join(__dirname, '../uploads', imageName);
                if (fs.existsSync(filePosition)) {
                    fs.unlinkSync(filePosition); //hapus file
                }
            }

            const update = await Item.update({
                name: data.name,
                stock: data.stock,
                // jika tidak adaa gambar baru, ambil gambar lama 
                image: req.file ? req.file.filename : itemBefore.image
            }, {
                where: { id: id } // update data berdasarkan idnya
            });
            // ambil data baru yang terupdate

            const newItem = await Item.findByPk(id);

            return res.status(200).json(response(200, "update", newItem))

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));

        }
    },

    deleteItem: async (req, res) => {
        try {
            const {id} = req.params;
            const deleteProcess = await Item.destroy({
                where: {id:id}
            });
            return res.status(200).json(response(200,"Deleted"))

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message));

        }
    }
}
