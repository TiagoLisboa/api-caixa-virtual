"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Report {
  constructor(cashier) {
    this.saldoTotal = cashier.transactions.reduce((acc, transaction) => acc + transaction.value * (transaction.type ? 1 : -1), 0);
    this.movimentacoes = cashier.transactions.map(transaction => ({
      data: transaction.createdAt,
      id: transaction.id,
      tipo: transaction.type ? 'ganho' : 'gasto',
      valor: transaction.value,
      descricao: transaction.description,
      categorias: transaction.Categories.map(({
        id,
        name
      }) => ({
        id,
        nome: name
      }))
    }));
  }

}

var _default = Report;
exports.default = _default;
//# sourceMappingURL=Report.js.map