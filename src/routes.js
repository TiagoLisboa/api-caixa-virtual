import Router from 'express';

import AuthMiddleware from './app/middlewares/AuthMiddleware';
import CashierController from './app/controllers/CashierController';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/login', SessionController.store);

routes.use(AuthMiddleware.auth);

routes.get('/cashiers', CashierController.index);
routes.post('/cashiers', CashierController.store);

export default routes;
