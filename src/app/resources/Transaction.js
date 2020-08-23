class Transaction {
  constructor(transaction) {
    this.transaction = {
      id: transaction.id,
      type: transaction.type,
      value: transaction.value,
      category: transaction.category,
      description: transaction.description,
    };
  }
}

export default Transaction;
