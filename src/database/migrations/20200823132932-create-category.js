'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        unique: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at',
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at',
      },
      user_id: {
        type: Sequelize.INTEGER,
        field: 'user_id',
        onDelete: 'CASCADE',
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id',
        },
        allowNull: false,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('categories');
  },
};
