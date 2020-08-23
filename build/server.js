"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.stop = void 0;

var _app = _interopRequireDefault(require("./app"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const port = process.env.NODE_ENV === 'development' ? 3333 : 3339;

const server = _app.default.listen(port);

const stop = () => server.close();

exports.stop = stop;
var _default = server;
exports.default = _default;
//# sourceMappingURL=server.js.map