import Joi from 'joi';

import User from '../models/user';

import userResourcer from '../resources/user';

class UserController {
  async store(req, res, next) {
    const userSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const result = userSchema.validate(req.body, { abortEarly: false });
    const valid = result.error === undefined;
    if (!valid) {
      const fields = result.error.details.reduce(
        (obj, { message, context }) => ({
          ...obj,
          [context.key]: message,
        }),
        {}
      );
      const message = {
        error: 'Missing Fields',
        fields,
      };
      res.status(422).send(message);
    } else {
      try {
        const user = await User.create(result.value);
        res.send(userResourcer(user));
      } catch (err) {
        console.error(err);
      }
    }
  }
}

export default new UserController();
