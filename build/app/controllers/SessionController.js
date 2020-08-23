"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _joi = _interopRequireDefault(require("joi"));

var _auth = _interopRequireDefault(require("../../config/auth"));

var _ValidationException = _interopRequireDefault(require("../exceptions/ValidationException"));

var _user = _interopRequireDefault(require("../models/user"));

var _Session = _interopRequireDefault(require("../resources/Session"));

var _validateSchema = _interopRequireDefault(require("../utils/validateSchema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
    const {
      email,
      password
    } = req.body;

    const loginSchema = _joi.default.object({
      email: _joi.default.string().required().email(),
      password: _joi.default.string().required()
    });

    let result;

    try {
      result = (0, _validateSchema.default)(req.body, loginSchema);
    } catch (e) {
      if (e instanceof _ValidationException.default) {
        return res.status(422).send(e);
      }
    }

    const user = await _user.default.findOne({
      where: {
        email
      }
    });

    if (!user) {
      return res.status(401).json({
        error: 'User not found'
      });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({
        error: 'Password does not match'
      });
    }

    const {
      id
    } = user;

    const token = _jsonwebtoken.default.sign({
      id
    }, _auth.default.secret, {
      expiresIn: _auth.default.expiresIn
    });

    return res.send(new _Session.default(user, token));
  }

}

var _default = new SessionController();

exports.default = _default;
//# sourceMappingURL=SessionController.js.map