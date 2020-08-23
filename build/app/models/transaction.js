"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireWildcard(require("sequelize"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class Transaction extends _sequelize.Model {
  static init(sequelize) {
    super.init({
      type: _sequelize.default.INTEGER,
      value: _sequelize.default.FLOAT,
      description: _sequelize.default.TEXT
    }, {
      sequelize
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Cashier, {
      foreignKey: 'cashier_id',
      as: 'cashier',
      onDelete: 'CASCADE'
    });
    this.belongsToMany(models.Category, {
      through: models.TransactionCategory
    });
  }

}

var _default = Transaction;
exports.default = _default;
//# sourceMappingURL=transaction.js.map