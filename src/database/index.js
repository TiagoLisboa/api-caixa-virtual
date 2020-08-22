import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/user';
import Cashier from '../app/models/cashier';
import Transaction from '../app/models/transaction';

const models = [User, Cashier, Transaction];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
