import Sequelize, { Model } from 'sequelize';

class Transaction extends Model {
  static init(sequelize) {
    super.init(
      {
        type: Sequelize.INTEGER,
        value: Sequelize.FLOAT,
        category: Sequelize.INTEGER,
        description: Sequelize.TEXT,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Cashier, {
      foreignKey: 'cashier_id',
      as: 'cashier',
      onDelete: 'CASCADE',
    });
  }
}

export default Transaction;
