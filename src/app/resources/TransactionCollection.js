class TransactionCollection {
  constructor(transactions) {
    this.transactions = transactions.map(transaction => ({
      id: transaction.id,
      type: transaction.type,
      value: transaction.value,
      categories: transaction.Categories.map(({ name }) => ({ name })),
      description: transaction.description,
    }));
  }
}

export default TransactionCollection;
