import { Router } from 'express';
import passport from 'passport';

const loginRouter = Router();

loginRouter.get('/', (req, res) => {
  if (req.user) return res.redirect('/');
  res.render('auth/login', {
    layout: 'auth',
  });
});

loginRouter.post(
  '/',
  passport.authenticate('local', {
    failureMessage: 'Invalid email or password',
  })
);

export default loginRouter;
