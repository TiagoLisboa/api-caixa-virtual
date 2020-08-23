"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

var _validateSchema = _interopRequireDefault(require("../utils/validateSchema"));

var _ValidationException = _interopRequireDefault(require("../exceptions/ValidationException"));

var _cashier = _interopRequireDefault(require("../models/cashier"));

var _category = _interopRequireDefault(require("../models/category"));

var _transaction = _interopRequireDefault(require("../models/transaction"));

var _user = _interopRequireDefault(require("../models/user"));

var _Cashier = _interopRequireDefault(require("../resources/Cashier"));

var _CashierCollection = _interopRequireDefault(require("../resources/CashierCollection"));

var _Report = _interopRequireDefault(require("../resources/Report"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    const {
      page = 1
    } = req.query;
    const cashiers = await _cashier.default.findAll({
      where: {
        user_id
      },
      limit: 20,
      offset: (page - 1) * 20
    });
    return res.send(new _CashierCollection.default(cashiers));
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
    const cashier = await _cashier.default.findOne({
      where: {
        id
      },
      include: [{
        model: _transaction.default,
        as: 'transactions',
        include: _category.default
      }]
    });

    if (!cashier) {
      return res.status(404).send({
        error: 'Cashier not found!'
      });
    }

    return res.send(new _Report.default(cashier));
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
    const cashierSchema = _joi.default.object({
      name: _joi.default.string().required()
    });

    let result;

    try {
      result = (0, _validateSchema.default)(req.body, cashierSchema);
    } catch (e) {
      if (e instanceof _ValidationException.default) {
        return res.status(422).send(e);
      }
    }

    try {
      const user = await _user.default.findByPk(req.userId);
      const cashier = await user.createCashier({
        name: result.name
      });
      return res.send(new _Cashier.default(cashier));
    } catch (err) {
      return res.status(400).send({
        message: 'error while creating cashier.'
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
    const id = req.params.cashierId;

    const cashierSchema = _joi.default.object({
      name: _joi.default.string().required()
    });

    let result;

    try {
      result = (0, _validateSchema.default)(req.body, cashierSchema);
    } catch (e) {
      if (e instanceof _ValidationException.default) {
        return res.status(422).send(e);
      }
    }

    const cashier = await _cashier.default.findByPk(id);

    if (!cashier) {
      return res.status(404).send({
        message: 'Not found'
      });
    }

    try {
      const {
        name
      } = result;
      await cashier.update({
        name
      });
      return res.send(new _Cashier.default(cashier));
    } catch (err) {
      return res.status(400).send({
        message: 'error while updating cashier.'
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
    const id = req.params.cashierId;
    const cashier = await _cashier.default.findByPk(id);

    if (!cashier) {
      return res.status(404).send({
        message: 'Not found'
      });
    }

    try {
      await cashier.destroy();
      return res.send({
        message: 'cashier sucessfully deleted.'
      });
    } catch (err) {
      return res.status(400).send({
        message: 'error while updating cashier.'
      });
    }
  }

}

var _default = new CashierController();

exports.default = _default;
//# sourceMappingURL=CashierController.js.map