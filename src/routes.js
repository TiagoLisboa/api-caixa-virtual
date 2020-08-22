import Router from 'express';

import authMiddleware from './app/middlewares/auth';
import CashierController from './app/controllers/CashierController';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/login', SessionController.store);

routes.post('/cashiers', CashierController.store);

routes.use(authMiddleware);

export default routes;
