"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _database = _interopRequireDefault(require("../config/database"));

var _user = _interopRequireDefault(require("../app/models/user"));

var _cashier = _interopRequireDefault(require("../app/models/cashier"));

var _category = _interopRequireDefault(require("../app/models/category"));

var _transaction = _interopRequireDefault(require("../app/models/transaction"));

var _transactioncategory = _interopRequireDefault(require("../app/models/transactioncategory"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const env = process.env.NODE_ENV;
const models = [_user.default, _cashier.default, _category.default, _transaction.default, _transactioncategory.default];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new _sequelize.default(_database.default[env]);
    models.map(model => model.init(this.connection)).map(model => model.associate && model.associate(this.connection.models));
  }

}

var _default = new Database();

exports.default = _default;
//# sourceMappingURL=index.js.map