import Sequelize, { Model } from 'sequelize';

class Cashier extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.hasMany(models.Transaction, {
      foreignKey: 'cashier_id',
      as: 'transacions',
      onDelete: 'CASCADE',
    });
    this.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'CASCADE',
    });
  }
}

export default Cashier;
