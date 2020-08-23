"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

var _validateSchema = _interopRequireDefault(require("../utils/validateSchema"));

var _ValidationException = _interopRequireDefault(require("../exceptions/ValidationException"));

var _category = _interopRequireDefault(require("../models/category"));

var _cashier = _interopRequireDefault(require("../models/cashier"));

var _transaction = _interopRequireDefault(require("../models/transaction"));

var _Transaction = _interopRequireDefault(require("../resources/Transaction"));

var _TransactionCollection = _interopRequireDefault(require("../resources/TransactionCollection"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    const {
      page = 1
    } = req.query;
    const cashier_id = req.params.cashierId;
    const transactions = await _transaction.default.findAll({
      where: {
        cashier_id
      },
      limit: 20,
      offset: (page - 1) * 20,
      include: _category.default
    });
    return res.send(new _TransactionCollection.default(transactions));
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
    const transactionSchema = _joi.default.object({
      type: _joi.default.number().required(),
      value: _joi.default.number().required(),
      categories: _joi.default.array().items(_joi.default.number()),
      description: _joi.default.string()
    });

    try {
      const result = (0, _validateSchema.default)(req.body, transactionSchema);
      const {
        type,
        value,
        categories,
        description
      } = result;
      const cashier = await _cashier.default.findByPk(req.params.cashierId); // TODO: create model related services to handle database operations
      // such this, and throw proper exceptions case not found

      if (!cashier) {
        return res.status(404).send({
          error: 'Cashier not found!'
        });
      }

      const transaction = await _transaction.default.create({
        type,
        value,
        description,
        cashier_id: cashier.id
      }, {
        include: [{
          model: _cashier.default,
          as: 'cashier'
        }, _category.default]
      });
      await transaction.addCategories(categories);
      transaction.categories = await transaction.getCategories();
      transaction.categories = transaction.categories.map(({
        name
      }) => ({
        name
      }));
      return res.send(new _Transaction.default(transaction));
    } catch (err) {
      if (err instanceof _ValidationException.default) {
        return res.status(422).send(err);
      }

      return res.status(400).send({
        message: 'error while creating transaction.'
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
    const id = req.params.transactionId;

    const transactionSchema = _joi.default.object({
      type: _joi.default.number().required(),
      value: _joi.default.number().required(),
      description: _joi.default.string()
    });

    let result;

    try {
      result = (0, _validateSchema.default)(req.body, transactionSchema);
    } catch (e) {
      if (e instanceof _ValidationException.default) {
        return res.status(422).send(e);
      }
    }

    const transaction = await _transaction.default.findByPk(id);

    if (!transaction) {
      return res.status(404).send({
        message: 'Not found'
      });
    }

    try {
      const {
        type,
        value,
        description
      } = result;
      await transaction.update({
        type,
        value,
        description
      });
      return res.send(new _Transaction.default(transaction));
    } catch (err) {
      return res.status(400).send({
        message: 'error while updating transaction.'
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
    const id = req.params.transactionId;
    const transaction = await _transaction.default.findByPk(id);

    if (!transaction) {
      return res.status(404).send({
        message: 'Not found'
      });
    }

    try {
      await transaction.destroy();
      return res.send({
        message: 'transaction sucessfully deleted.'
      });
    } catch (err) {
      return res.status(400).send({
        message: 'error while updating transaction.'
      });
    }
  }

}

var _default = new TransactionsController();

exports.default = _default;
//# sourceMappingURL=TransactionController.js.map