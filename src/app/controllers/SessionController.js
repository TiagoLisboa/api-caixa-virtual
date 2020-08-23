import jwt from 'jsonwebtoken';
import Joi from 'joi';

import authConfig from '../../config/auth';
import ValidationException from '../exceptions/ValidationException';
import User from '../models/user';
import SessionResource from '../resources/Session';
import validateSchema from '../utils/validateSchema';

class SessionController {
  /**
   * stores a instance of the resource.
   *
   * @param {Request}  req
   * @param {Response} res
   *
   * @return {void}
   */
  async store(req, res, next) {
    const { email, password } = req.body;
    const loginSchema = Joi.object({
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string().required(),
    });
    let result;
    try {
      result = validateSchema(req.body, loginSchema);
    } catch (e) {
      if (e instanceof ValidationException) {
        res.status(422).send(e);
      }
    }
    const user = await User.findOne({
      where: { email },
    });
    if (!user) {
      res.status(401).json({ error: 'User not found' });
    }
    if (!(await user.checkPassword(password))) {
      res.status(401).json({ error: 'Password does not match' });
    }
    const { id } = user;
    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.expiresIn,
    });
    res.send(new SessionResource(user, token));
  }
}

export default new SessionController();
