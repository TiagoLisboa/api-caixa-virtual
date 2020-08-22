'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cashier = sequelize.define('Cashier', {
    name: DataTypes.STRING
  }, {});
  Cashier.associate = function(models) {
    // associations can be defined here
  };
  return Cashier;
};