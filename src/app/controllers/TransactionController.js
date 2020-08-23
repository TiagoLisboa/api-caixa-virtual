import Joi from 'joi';

import validateSchema from '../utils/validateSchema';
import ValidationException from '../exceptions/ValidationException';
import Category from '../models/category';
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
      include: Category,
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
      categories: Joi.array().items(Joi.number()),
      description: Joi.string(),
    });
    try {
      const result = validateSchema(req.body, transactionSchema);
      const { type, value, categories, description } = result;

      const cashier = await Cashier.findByPk(req.params.cashierId);
      // TODO: create model related services to handle database operations
      // such this, and throw proper exceptions case not found
      if (!cashier) {
        return res.status(404).send({
          error: 'Cashier not found!',
        });
      }
      const transaction = await Transaction.create(
        { type, value, description, cashier_id: cashier.id },
        {
          include: [{ model: Cashier, as: 'cashier' }, Category],
        }
      );
      await transaction.addCategories(categories);
      transaction.categories = await transaction.getCategories();
      transaction.categories = transaction.categories.map(({ name }) => ({
        name,
      }));
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
