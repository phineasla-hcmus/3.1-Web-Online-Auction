import { Router } from 'express';

const errorRoute = Router();

errorRoute.get('/', (req, res) =>
  res.sendFile('views/error.html', { root: '.' })
);

export default errorRoute;
