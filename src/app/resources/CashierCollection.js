class CashierCollection {
  constructor(cashiers) {
    this.cashiers = cashiers.map(cashier => ({
      id: cashier.id,
      name: cashier.name,
    }));
  }
}

export default CashierCollection;
