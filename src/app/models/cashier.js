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
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
}

export default Cashier;

