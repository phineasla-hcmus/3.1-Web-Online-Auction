import { Router } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import logger from '../utils/logger';
import { addUser } from '../models/user.model';
import signUpValidator from '../validators/signup.validator';
import { RECAPTCHA_SITE } from '../config/secret';

const signUpRouter = Router();

signUpRouter.get('/', (req, res) => {
  if (req.user) return res.redirect('/');
  res.render('auth/signup', {
    layout: 'auth',
    recaptcha: RECAPTCHA_SITE,
  });
});

/**
 * Create a new local account.
 * @route POST /signup
 */
signUpRouter.post('/', ...signUpValidator, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(errors.array());
  }
  // Insert user to DB
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const reqBody = req.body;
  const userId = await addUser({
    email: reqBody.email,
    password: hashedPassword,
    firstName: reqBody.firstName,
    lastName: reqBody.lastName,
    dob: new Date(reqBody.dob),
    address: reqBody.address,
  });
  
  logger.debug('Insert result: ' + userId);

  // Send OTP to user
  res.redirect(`/verify/${userId}`);
});

export default signUpRouter;
