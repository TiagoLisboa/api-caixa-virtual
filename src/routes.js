import Router from 'express';

import authMiddleware from './app/middlewares/auth';
import UserController from './app/controllers/UserController';

const routes = new Router();

routes.post('/users', UserController.store);

routes.use(authMiddleware);

export default routes;
