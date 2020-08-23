"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class TransactionCollection {
  constructor(transactions) {
    this.transactions = transactions.map(transaction => ({
      id: transaction.id,
      type: transaction.type,
      value: transaction.value,
      categories: transaction.Categories.map(({
        name
      }) => ({
        name
      })),
      description: transaction.description
    }));
  }

}

var _default = TransactionCollection;
exports.default = _default;
//# sourceMappingURL=TransactionCollection.js.map