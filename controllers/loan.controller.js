const Validator = require("fastest-validator");
const v = new Validator();
const { Item, Loan, Return } = require('../models')
const { response } = require('../helpers/response.formatter')

module.exports =
{
    createLoan: async (req, res) => {
        try {
            const { item_id, name, total_item, date } = req.body;
            const schema = {
                item_id: { type: "number", positive: true, integer: true },
                name: { type: "string" },
                total_item: { type: "number", positive: true, integer: true },
                date: { type: "date" }
            }

            const data = {
                item_id: Number(item_id),
                name: name,
                total_item: Number(total_item),
                date: new Date(date), // menggubah string jadi date(tanggal)

            }

            const validate = v.validate(data, schema);

            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate));
            }

            // item id harus id dari items yang ada didatabase

            const item = await Item.findByPk(item_id);
            if (!item) {// jika tidak ada item, artina item_id salah
                return res.status(400).json(response(400, "Validasi Error", "item not found"));
            }

            // total_item (barang dipinjam) gakboleh lebih dari stock yang ada di diitem
            if (data.total_item > item.stock) {
                return res.status(500).json(response(500, "Validasi Error", `Stock only available ${item.stock}`));

            }

            const createData = await Loan.create({
                item_id: data.item_id,
                name: data.name,
                total_item: data.total_item,
                date: data.date,
            });

            // kurangi stock item dari total_item yang dipinjam
            const updateStock = await Item.update({
                stock: item.stock - data.total_item
            }, {
                where: { id: data.item_id }
            });
            return res.status(201).json(response(201, "Created", createData))



        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))
        }
    },

    getLoans: async (req, res) => {
        try {
            // page : acuan halaman pagination, limit : data yang di munculkan per berapa data
            // dimunculkan per berapa data
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10; // default data yang dimunculkan sebanyak 10 data

            // offset : memulai data dari angka berupa (offset 10 : mulainya data ke 11)
            const offset = (page - 1) * limit;
            // contoh : halaman 1 : 1 -1 * 10 = 0. jadi offset = 0 (data dimulai dari 1)
            // halaman 2 : 2 -1 * 10 -1 * 10 =10, jadi dat dimulai dari 11


            // count : jumllah data, rows, data yang dimunculin
            // dipake buat pagination : findAndCountAll
            const { count, rows } = await Loan.findAndCountAll({ include: Item, offset: offset, limit: limit });
            // include : mengambil relasi ke model tersebut 
            const formatPagination = {
                data: rows, // data yg dimunculkan
                limit: limit, // jumlah data yang dimunculkan
                rangeData: (offset + 1) + "-" + (offset + rows.length),
                // rangeData munculkan tulisan "1-10" atau "11-20"
                // count(rows) hitung jumlah  data yang dimunculin
                // offset 10 : (10 + 1) (10+10) : 11-20 data yang dimunculkan
                currentPage: page, // data yang diambil di halaman berapa
                totalpage: Math.round(count / limit), // jumlah halaman dari data
                // data 25 : (25/10) : round(2,5) = 3 : ada 3 halaman yang bisa diakses
                total: count, // jumlah seluruh data
            }

            return res.status(200).json(response(200, "success", formatPagination));

        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))

        }
    },

    createReturn: async (req, res) => {
        try {
            const { loan_id, total_item, notes ,date} = req.body;
            const schema = {
                loan_id: { type: "number", positive: true, integer: true },
                total_item: { type: "number", positive: true, integer: true },
                notes: { type: "string" },
                date: { type: "date" }
            }

            const data = {
                loan_id: Number(loan_id),
                total_item: Number(total_item),
                notes: notes ?? '-', // jika tidak ada note data beri '-'
                date: new Date()
            }

            const validate = v.validate(data, schema);
            if (validate.length > 0) {
                return res.status(400).json(response(400, "Validasi Error", validate));
            }

            // cek data loan _id apakah id tersebut ada datanya di database (ada data peminjamannya atau tidak)
            const loanData = await Loan.findByPk(loan_id);
            if(!loanData){
                return res.status(400).json(response(400,"Validasi error ","loan Not Found"));
            }

            // data total_item return (pengembalian) tidak boleh lebih dari total_item yang di peminjamannya
            if(data.total_item > loanData.total_item){
                return res.status(400).json(response(400,"Validasi error "," total item retrun more than loan"));
            }

                // ambil data barang dari item_id di loan
            const itemData = await Item.findByPk(loanData.item_id);
            const createReturn = await Return.create({
                loan_id: data.loan_id,
                total_item: data.total_item,
                notes: data.notes,
                date: data.date
            });
            // update stok, stok item di tambah total_item yang dikembalikan
            const updateStock = await Item.update({
                stock: itemData.stock + data.total_item
            },{
                where: {id:itemData.id}
            });
                        return res.status(201).json(response(201, "Created", createReturn))


        } catch (error) {
            return res.status(500).json(response(500, "Server Error", error.message))

        }
    }

}