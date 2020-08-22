import Router from 'express';

import AuthMiddleware from './app/middlewares/AuthMiddleware';
import CashierController from './app/controllers/CashierController';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/login', SessionController.store);

if (process.env.NODE_ENV !== 'test') {
  routes.use(AuthMiddleware.auth);
}

routes.post('/cashiers', CashierController.store);

export default routes;
