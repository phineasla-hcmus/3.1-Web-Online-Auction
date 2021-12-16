import { Router } from 'express';
import passport from 'passport';

const logoutRouter = Router();

logoutRouter.post('/', (req, res) => {
  req.logout();
  // I like to just throw the user back home
  res.redirect(req.headers.referer || '/');
  //   const url = req.headers.referer || '/';
  //   res.redirect(url);
});

export default logoutRouter;
