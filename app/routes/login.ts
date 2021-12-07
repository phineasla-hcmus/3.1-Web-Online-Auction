import { Router } from 'express';

const loginRouter = Router();

loginRouter.get('/', (req, res) => {
  if (req.user) return res.redirect('/');
  res.render('auth/login', {
    layout: 'auth',
  });
});

loginRouter.post('/', (req, res) => {
  // Authentication stuff here
});

export default loginRouter;
