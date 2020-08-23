"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

var _validateSchema = _interopRequireDefault(require("../utils/validateSchema"));

var _ValidationException = _interopRequireDefault(require("../exceptions/ValidationException"));

var _category = _interopRequireDefault(require("../models/category"));

var _user = _interopRequireDefault(require("../models/user"));

var _Category = _interopRequireDefault(require("../resources/Category"));

var _CategoryCollection = _interopRequireDefault(require("../resources/CategoryCollection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    const {
      page = 1
    } = req.query;
    const categories = await _category.default.findAll({
      where: {
        user_id
      },
      limit: 20,
      offset: (page - 1) * 20
    });
    return res.send(new _CategoryCollection.default(categories));
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
    const categorySchema = _joi.default.object({
      name: _joi.default.string().required()
    });

    let result;

    try {
      result = (0, _validateSchema.default)(req.body, categorySchema);
    } catch (e) {
      if (e instanceof _ValidationException.default) {
        return res.status(422).send(e);
      }
    }

    try {
      const user = await _user.default.findByPk(req.userId);
      const category = await user.createCategory({
        name: result.name
      });
      return res.send(new _Category.default(category));
    } catch (err) {
      return res.status(400).send({
        message: 'error while creating category.'
      });
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
    const id = req.params.categoryId;

    const categorySchema = _joi.default.object({
      name: _joi.default.string().required()
    });

    let result;

    try {
      result = (0, _validateSchema.default)(req.body, categorySchema);
    } catch (e) {
      if (e instanceof _ValidationException.default) {
        return res.status(422).send(e);
      }
    }

    const category = await _category.default.findByPk(id);

    if (!category) {
      return res.status(404).send({
        message: 'Not found'
      });
    }

    try {
      const {
        name
      } = result;
      await category.update({
        name
      });
      return res.send(new _Category.default(category));
    } catch (err) {
      return res.status(400).send({
        message: 'error while updating category.'
      });
    }
  }
  /**
   * deletes a instance of the resource.
   *
   * @param {Request}  req
   * @param {Response} res
   *
   * @return {void}
   */


  async destroy(req, res) {
    const id = req.params.categoryId;
    const category = await _category.default.findByPk(id);

    if (!category) {
      return res.status(404).send({
        message: 'Not found'
      });
    }

    try {
      await category.destroy();
      return res.send({
        message: 'category sucessfully deleted.'
      });
    } catch (err) {
      return res.status(400).send({
        message: 'error while updating category.'
      });
    }
  }

}

var _default = new CategoryController();

exports.default = _default;
//# sourceMappingURL=CategoryController.js.map