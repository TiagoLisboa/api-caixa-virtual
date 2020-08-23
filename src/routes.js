import Router from 'express';

import AuthMiddleware from './app/middlewares/AuthMiddleware';
import CashierController from './app/controllers/CashierController';
import CategoryController from './app/controllers/CategoryController';
import SessionController from './app/controllers/SessionController';
import TransactionController from './app/controllers/TransactionController';
import UserController from './app/controllers/UserController';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/login', SessionController.store);

routes.use(AuthMiddleware.auth);

routes.get('/cashiers', CashierController.index);
routes.post('/cashiers', CashierController.store);
routes.get('/cashiers/:cashierId', CashierController.show);

routes.get('/categories', CategoryController.index);
routes.post('/categories', CategoryController.store);

routes.get('/cashiers/:cashierId/transactions', TransactionController.index);
routes.post('/cashiers/:cashierId/transactions', TransactionController.store);

export default routes;
