class Report {
  constructor(cashier) {
    this.saldoTotal = cashier.transactions.reduce(
      (acc, transaction) =>
        acc + transaction.value * (transaction.type ? 1 : -1),
      0
    );
    this.movimentacoes = cashier.transactions.map(transaction => ({
      data: transaction.createdAt,
      id: transaction.id,
      tipo: transaction.type ? 'ganho' : 'gasto',
      valor: transaction.value,
      descricao: transaction.description,
      categorias: transaction.Categories.map(({ id, name }) => ({
        id,
        nome: name,
      })),
    }));
  }
}

export default Report;
