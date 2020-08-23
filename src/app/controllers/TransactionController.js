import Cashier from '../models/cashier';
import User from '../models/user';
import Transaction from '../models/transaction';

import TransactionSchema from '../resources/Transaction';
import TransactionCollection from '../resources/TransactionCollection';

class TransactionsController {
  /**
   * displays a listing of the resource.
   *
   * @param {Request}  req
   * @param {Response} res
   *
   * @return {void}
   */
  async index(req, res) {
    const user_id = req.userId;
    const { page = 1 } = req.query;
    const cashier_id = req.params.cashierId;

    const transactions = await Transaction.findAll({
      where: { cashier_id },
      limit: 20,
      offset: (page - 1) * 20,
    });

    res.send(new TransactionCollection(transactions));
  }
  /**
   * stores a instance of the resource.
   *
   * @param {Request}  req
   * @param {Response} res
   *
   * @return {void}
   */
  async store(req, res) {}
}

export default new TransactionsController();
