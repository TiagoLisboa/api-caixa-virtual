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

    return res.send(new CashierCollection(cashiers));
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

    const cashier = await Cashier.findOne({
      where: { id },
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

    return res.send(new ReportResourcer(cashier));
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
        return res.status(422).send(e);
      }
    }
    try {
      const user = await User.findByPk(req.userId);
      const cashier = await user.createCashier({ name: result.name });
      return res.send(new CashierResourcer(cashier));
    } catch (err) {
      return res.status(400).send({ message: 'error while creating cashier.' });
    }
  }

  /**
   * updates a instance of the resource.
   *
   * @param {Request}  req
   * @param {Response} res
   *
   * @return {void}
   */
  async update(req, res) {
    const id = req.params.cashierId;
    const cashierSchema = Joi.object({
      name: Joi.string().required(),
    });
    let result;
    try {
      result = validateSchema(req.body, cashierSchema);
    } catch (e) {
      if (e instanceof ValidationException) {
        return res.status(422).send(e);
      }
    }
    const cashier = await Cashier.findByPk(id);
    if (!cashier) {
      return res.status(404).send({ message: 'Not found' });
    }
    try {
      const { name } = result;
      await cashier.update({ name });
      return res.send(new CashierResourcer(cashier));
    } catch (err) {
      console.log(err);
      return res.status(400).send({ message: 'error while updating cashier.' });
    }
  }
}

export default new CashierController();
