'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Returns', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      loan_id: {
        type: Sequelize.INTEGER
      },
      total_item: {
        type: Sequelize.INTEGER
      },
      notes: {
        type: Sequelize.TEXT
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
    await queryInterface.addConstraint("Returns",{
      fields:['loan_id'],//column fk
      type:'foreign key',
      name:'fk_returns_loan_id',
      references:{
        // tabel tujuan relasi (pk)
        table:'Loans',
        field:'id'
      },
      onDelete:'CASCADE', // ketika PK dihapus, data FK ikut terhapus
      onUpdate:'CASCADE',//Ketika PK diubah/diupdate ,data FK ikut berubah

    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Returns');
  }
};