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
    this.belongsTo(models.Cashier, { foreignKey: 'cashierId', as: 'cashier' });
  }
}

export default Transaction;

