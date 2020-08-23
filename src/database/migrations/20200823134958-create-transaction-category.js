'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('transactioncategories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      create_at: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at',
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at',
      },
      category_id: {
        type: Sequelize.INTEGER,
        field: 'category_id',
        onDelete: 'CASCADE',
        references: {
          model: {
            tableName: 'categories',
          },
          key: 'id',
        },
        allowNull: false,
      },
      transaction_id: {
        type: Sequelize.INTEGER,
        field: 'transaction_id',
        onDelete: 'CASCADE',
        references: {
          model: {
            tableName: 'transactions',
          },
          key: 'id',
        },
        allowNull: false,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('TransactionCategories');
  },
};

