import Joi from 'joi';

import validateSchema from '../utils/validateSchema';
import ValidationException from '../exceptions/ValidationException';
import Cashier from '../models/cashier';
import Transaction from '../models/transaction';
import TransactionResource from '../resources/Transaction';
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
  async store(req, res) {
    const transactionSchema = Joi.object({
      type: Joi.number().required(),
      value: Joi.number().required(),
      category: Joi.number().required(),
      description: Joi.string().required(),
    });
    try {
      const result = validateSchema(req.body, transactionSchema);
      const { type, value, category, description } = result;

      const cashier = await Cashier.findByPk(req.params.cashierId);
      // TODO: create model related services to handle database operations
      // such this, and throw proper exceptions case not found
      if (!cashier) {
        return res.status(404).send({
          error: 'Cashier not found!',
        });
      }
      const transaction = await cashier.createTransaction({
        type,
        value,
        category,
        description,
      });
      return res.send(new TransactionResource(transaction));
    } catch (err) {
      if (err instanceof ValidationException) {
        return res.status(422).send(err);
      }
      return res
        .status(400)
        .send({ message: 'error while creating transaction.' });
    }
  }
}

export default new TransactionsController();
