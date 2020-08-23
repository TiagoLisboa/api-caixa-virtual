import app from './app';

const port = process.env.NODE_ENV === 'development' ? 3333 : 3339;

const server = app.listen(process.env.PORT || port);

export const stop = () => server.close();

export default server;
