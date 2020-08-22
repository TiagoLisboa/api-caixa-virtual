'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    type: DataTypes.INTEGER,
    value: DataTypes.FLOAT,
    category: DataTypes.INTEGER,
    description: DataTypes.TEXT
  }, {});
  Transaction.associate = function(models) {
    // associations can be defined here
  };
  return Transaction;
};