import { Router } from 'express';
import passport from 'passport';
import { COOKIE_MAX_AGE } from '../../config/secret';

const loginRouter = Router();

loginRouter.get('/', (req, res) => {
  res.render('auth/login', {
    layout: 'auth',
  });
});

loginRouter.post('/', passport.authenticate('local'), (req, res) => {
  // Checkbox = "on" | undefined. https://stackoverflow.com/a/11424089/12405558
  if (req.body.rememberMe) {
    req.session.cookie.maxAge = COOKIE_MAX_AGE;
  } else {
    req.session.cookie.expires = undefined;
  }
  res.redirect(req.session.returnTo || '/');
});

export default loginRouter;
