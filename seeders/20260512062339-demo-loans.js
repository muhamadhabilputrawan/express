'use strict';

const {Item} = require ('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    const items = await Item.findAll();
    const data = [];
    // membuat data sebanyak 25 kali
    for(let i = 1; i<25; i++){
      const randomItem=items[Math.floor(Math.random()*items.length)];
      // mengambil item_id secara acak
      // .floor : membulatkan (ambil angka sbelum koma), .random : generate desimal 0-1
      //contoh : random (0.5), item.length (3) : 0.5 *3 -1.5 : floor - 1(item_id
      // yang digunakan 1)
      data.push({
        item_id: randomItem.id,
        name: `peminjam ke ${i}`,
        total_item:1,
        date: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    // simpan ke table loans
    await queryInterface.bulkInsert('Loans',data)
  },


  async down (queryInterface, Sequelize) {

    // menghapus data 
    await queryInterface.bulkDelete('Loans',null, {});
  }
};
