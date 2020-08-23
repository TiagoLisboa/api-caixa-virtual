"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

var _validateSchema = _interopRequireDefault(require("../utils/validateSchema"));

var _ValidationException = _interopRequireDefault(require("../exceptions/ValidationException"));

var _user = _interopRequireDefault(require("../models/user"));

var _User = _interopRequireDefault(require("../resources/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UserController {
  /**
   * stores a instance of the resource.
   *
   * @param {Request}  req
   * @param {Response} res
   *
   * @return {void}
   */
  async store(req, res, next) {
    const userSchema = _joi.default.object({
      name: _joi.default.string().required(),
      email: _joi.default.string().required().email(),
      password: _joi.default.string().required()
    });

    let result;

    try {
      result = (0, _validateSchema.default)(req.body, userSchema);
    } catch (e) {
      if (e instanceof _ValidationException.default) {
        return res.status(422).send(e);
      }
    }

    try {
      const user = await _user.default.create(result);
      return res.send(new _User.default(user));
    } catch (err) {
      return res.status(400).send({
        message: 'error while creating user.'
      });
    }
  }

}

var _default = new UserController();

exports.default = _default;
//# sourceMappingURL=UserController.js.map