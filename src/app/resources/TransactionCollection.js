class Transaction {
  constructor(transactions) {
    this.transactions = transactions.map(transaction => ({
      id: transaction.id,
      type: transaction.type,
      value: transaction.value,
      category: transaction.category,
      description: transaction.description,
    }));
  }
}

export default Transaction;
