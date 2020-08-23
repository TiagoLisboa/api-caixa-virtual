class Transaction {
  constructor(transactions) {
    this.transactions = transactions.map(transaction => ({
      id: transaction.id,
      type: transaction.type,
      value: transaction.value,
      categories: transaction.categories,
      description: transaction.description,
    }));
  }
}

export default Transaction;
