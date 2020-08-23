"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _AuthMiddleware = _interopRequireDefault(require("./app/middlewares/AuthMiddleware"));

var _CashierController = _interopRequireDefault(require("./app/controllers/CashierController"));

var _CategoryController = _interopRequireDefault(require("./app/controllers/CategoryController"));

var _SessionController = _interopRequireDefault(require("./app/controllers/SessionController"));

var _TransactionController = _interopRequireDefault(require("./app/controllers/TransactionController"));

var _UserController = _interopRequireDefault(require("./app/controllers/UserController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = new _express.default();
routes.post('/users', _UserController.default.store);
routes.post('/login', _SessionController.default.store);
routes.use(_AuthMiddleware.default.auth);
routes.get('/cashiers', _CashierController.default.index);
routes.post('/cashiers', _CashierController.default.store);
routes.get('/cashiers/:cashierId', _CashierController.default.show);
routes.put('/cashiers/:cashierId', _CashierController.default.update);
routes.delete('/cashiers/:cashierId', _CashierController.default.destroy);
routes.get('/categories', _CategoryController.default.index);
routes.post('/categories', _CategoryController.default.store);
routes.put('/categories/:categoryId', _CategoryController.default.update);
routes.delete('/categories/:categoryId', _CategoryController.default.destroy);
routes.get('/cashiers/:cashierId/transactions', _TransactionController.default.index);
routes.post('/cashiers/:cashierId/transactions', _TransactionController.default.store);
routes.put('/cashiers/:cashierId/transactions/:transactionId', _TransactionController.default.update);
routes.delete('/cashiers/:cashierId/transactions/:transactionId', _TransactionController.default.destroy);
var _default = routes;
exports.default = _default;
//# sourceMappingURL=routes.js.map