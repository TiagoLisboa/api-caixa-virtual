import Joi from 'joi';

import validateSchema from '../utils/validateSchema';
import ValidationException from '../exceptions/ValidationException';

import Cashier from '../models/cashier';
import Category from '../models/category';
import Transaction from '../models/transaction';
import User from '../models/user';

import CashierResourcer from '../resources/Cashier';
import CashierCollection from '../resources/CashierCollection';
import ReportResourcer from '../resources/Report';

class CashierController {
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

    const cashiers = await Cashier.findAll({
      where: { user_id },
      limit: 20,
      offset: (page - 1) * 20,
    });

    res.send(new CashierCollection(cashiers));
  }

  /**
   * displays a visualization of the specified resource.
   *
   * @param {Request}  req
   * @param {Response} res
   *
   * @return {void}
   */
  async show(req, res) {
    const id = req.params.cashierId;
    const { page = 1 } = req.query;

    const cashier = await Cashier.findOne({
      where: { id },
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Transaction,
          as: 'transactions',
          include: Category,
        },
      ],
    });
    if (!cashier) {
      return res.status(404).send({
        error: 'Cashier not found!',
      });
    }

    res.send(new ReportResourcer(cashier));
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
    const cashierSchema = Joi.object({
      name: Joi.string().required(),
    });
    let result;
    try {
      result = validateSchema(req.body, cashierSchema);
    } catch (e) {
      if (e instanceof ValidationException) {
        res.status(422).send(e);
      }
    }
    try {
      const user = await User.findByPk(req.userId);
      const cashier = await user.createCashier({ name: result.name });
      res.send(new CashierResourcer(cashier));
    } catch (err) {
      res.status(400).send({ message: 'error while creating cashier.' });
    }
  }
}

export default new CashierController();
