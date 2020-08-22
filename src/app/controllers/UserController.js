import Joi from 'joi';

import validateSchema from '../utils/validateSchema';
import ValidationException from '../exceptions/ValidationException';

import User from '../models/user';

import userResourcer from '../resources/user';

class UserController {
  async store(req, res, next) {
    const userSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string().required(),
    });
    let result;
    try {
      result = validateSchema(req.body, userSchema);
    } catch (e) {
      if (e instanceof ValidationException) {
        res.status(422).send(e);
      }
    }
    try {
      const user = await User.create(result);
      res.send(userResourcer(user));
    } catch (err) {
      res.status(400).send({ message: 'error while creating user.' });
    }
  }
}

export default new UserController();
