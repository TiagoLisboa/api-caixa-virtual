import Sequelize from 'sequelize';

import databaseConfig from '../config/database';

import User from '../app/models/user';
import Cashier from '../app/models/cashier';
import Category from '../app/models/category';
import Transaction from '../app/models/transaction';
import TransactionCategory from '../app/models/transactioncategory';

const env = process.env.NODE_ENV;
const models = [User, Cashier, Category, Transaction, TransactionCategory];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig[env]);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
