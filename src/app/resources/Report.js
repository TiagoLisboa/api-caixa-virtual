class Report {
  constructor(cashier) {
    const today = new Date().setHours(0, 0, 0, 0);

    this.saldoTotal = cashier.transactions.reduce(
      (acc, transaction) =>
        acc + transaction.value * (transaction.type ? 1 : -1),
      0
    );
    this.movimentacoes = cashier.transactions.map(transaction => ({
      data: transaction.createdAt,
      id: transaction.id,
      tipo: transaction.type ? 'entrada' : 'saida',
      valor: transaction.value,
      descricao: transaction.description,
      categorias: transaction.Categories.filter(({ createdAt }) => {
        const thatDay = new Date(createdAt).setHours(0, 0, 0, 0);
        return today === thatDay;
      }).map(({ id, name }) => ({
        id,
        nome: name,
      })),
    }));
  }
}

export default Report;
