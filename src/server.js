import app from './app';

const port = process.env.NODE_ENV === 'development' ? 3333 : 3339;

app.listen(port);

export default app;
