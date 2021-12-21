#!/usr/bin/env node

import errorhandler from 'errorhandler';
import { ErrorRequestHandler } from 'express';
import app from './app';
import logger from './utils/logger';

if (process.env.NODE_ENV === 'development') {
  // Only use in development
  app.use(errorhandler());
} else {
  app.use((req, res) => {
    res.render('error', { layout: false, code: 404 });
  });
  app.use(((err, req, res, next) => {
    logger.error(err);
    res.render('error', { layout: false, code: 500 });
  }) as ErrorRequestHandler);
}

const port = process.env.PORT || '3000';
app.set('port', port);

const server = app.listen(port, () => {
  if (process.env.NODE_ENV === 'development')
    console.log('App is running at http://localhost:%d', port);
});

process.on('SIGTERM', () => {
  server.close(() => {
    logger.info('Server closed');
  });
});

export default server;
