import { Router } from 'express';
import passport from 'passport';

const loginRouter = Router();

loginRouter.get('/', (req, res) => {
  res.render('auth/login', {
    layout: 'auth',
  });
});

loginRouter.post('/', passport.authenticate('local'), (req, res) => {
  res.redirect(req.session.returnTo || '/');
});

export default loginRouter;
