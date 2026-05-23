'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Loans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      item_id: {
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      total_item: {
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
    // mendefinisikan relasi (bikin fk)
    await queryInterface.addConstraint("Loans",{
      fields:['item_id'],//column fk
      type:'foreign key',
      name:'fk_loans_item_id',
      references:{
        // tabel tujuan relasi (pk)
        table:'Items',
        field:'id'
      },
      onDelete:'CASCADE', // ketika PK dihapus, data FK ikut terhapus
      onUpdate:'CASCADE',//Ketika PK diubah/diupdate ,data FK ikut berubah

    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Loans');
  }
};