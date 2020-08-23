"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _util = require("util");

var _auth = _interopRequireDefault(require("../../config/auth"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AuthMiddleware {
  async auth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: 'Token not privided'
      });
    }

    const [, token] = authHeader.split(' ');

    try {
      const decoded = await (0, _util.promisify)(_jsonwebtoken.default.verify)(token, _auth.default.secret);
      req.userId = decoded.id;
      return next();
    } catch (err) {
      return res.status(401).json({
        error: 'Token invalid'
      });
    }
  }

}

var _default = new AuthMiddleware();

exports.default = _default;
//# sourceMappingURL=AuthMiddleware.js.map