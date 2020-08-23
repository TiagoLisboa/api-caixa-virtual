"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Transaction {
  constructor(transaction) {
    this.transaction = {
      id: transaction.id,
      type: transaction.type,
      value: transaction.value,
      categories: transaction.categories,
      description: transaction.description
    };
  }

}

var _default = Transaction;
exports.default = _default;
//# sourceMappingURL=Transaction.js.map