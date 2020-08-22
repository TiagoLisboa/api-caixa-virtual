import Joi from 'joi';

import validateSchema from '../utils/validateSchema';
import ValidationException from '../exceptions/ValidationException';

import Cashier from '../models/cashier';

import CashierResourcer from '../resources/Cashier';

class CashierController {
  async store(req, res, next) {
    const cashierSchema = Joi.object({
      name: Joi.string().required(),
      user_id: Joi.number().required(),
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
      const cashier = await Cashier.create(result);
      res.send(new CashierResourcer(cashier));
    } catch (err) {
      res.status(400).send({ message: 'error while creating cashier.' });
    }
  }
}

export default new CashierController();
