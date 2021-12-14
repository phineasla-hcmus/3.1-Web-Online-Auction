import { Router } from 'express';

const verifyRouter = Router();

verifyRouter.get('/:userId', (req, res) => {
  res.render('auth/verify', { layout: 'auth' });
});

export default verifyRouter;
