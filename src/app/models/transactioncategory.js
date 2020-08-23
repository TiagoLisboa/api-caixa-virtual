import Sequelize, { Model } from 'sequelize';

class TransactionCategory extends Model {
  static init(sequelize) {
    super.init({}, { sequelize });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Transaction, {
      foreignKey: 'transaction_id',
      as: 'transaction',
      onDelete: 'CASCADE',
    });
    this.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category',
      onDelete: 'CASCADE',
    });
  }
}

export default TransactionCategory;

