import { Router } from 'express';
import passport from 'passport';

const logoutRouter = Router();

logoutRouter.post('/', (req, res) => {
  req.logout();
  res.redirect(req.headers.referer || '/');
  // const url = req.headers.referer || '/';
  // // I like to just throw the user back home
  // res.redirect(url);
});

export default logoutRouter;
