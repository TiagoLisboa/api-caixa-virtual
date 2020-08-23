import Joi from 'joi';

import validateSchema from '../utils/validateSchema';
import ValidationException from '../exceptions/ValidationException';

import Category from '../models/category';
import User from '../models/user';

import CategoryResourcer from '../resources/Category';
import CategoryCollection from '../resources/CategoryCollection';

class CategoryController {
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

    const categories = await Category.findAll({
      where: { user_id },
      limit: 20,
      offset: (page - 1) * 20,
    });

    res.send(new CategoryCollection(categories));
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
    const categorySchema = Joi.object({
      name: Joi.string().required(),
    });
    let result;
    try {
      result = validateSchema(req.body, categorySchema);
    } catch (e) {
      if (e instanceof ValidationException) {
        res.status(422).send(e);
      }
    }
    try {
      const user = await User.findByPk(req.userId);
      const category = await user.createCategory({ name: result.name });
      res.send(new CategoryResourcer(category));
    } catch (err) {
      res.status(400).send({ message: 'error while creating category.' });
    }
  }
}

export default new CategoryController();