"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class CashierCollection {
  constructor(cashiers) {
    this.cashiers = cashiers.map(cashier => ({
      id: cashier.id,
      name: cashier.name
    }));
  }

}

var _default = CashierCollection;
exports.default = _default;
//# sourceMappingURL=CashierCollection.js.map