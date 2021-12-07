import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

import { addUser, findUserByEmail, User } from '../models/user.model';
import logger from '../utils/logger';

const signUpRouter = Router();

const passwordLength = {
  min: 5,
  max: 50,
};

const usernameLength = {
  min: 3,
};

const signUpValidator = [
  check('email', 'Email is not valid')
    .isEmail()
    .custom(async (email) => {
      const user = await findUserByEmail(email);
      if (user) {
        throw new Error('E-mail already in use');
      }
    }),
  check('password', 'Password must be at least 5 characters long').isLength(
    passwordLength
  ),
  check('username', 'Username must be at least 3 characters long').isLength(
    usernameLength
  ),
];

signUpRouter.get('/', (req, res) => {
  if (req.user) return res.redirect('/');
  res.render('auth/signup', {
    layout: 'auth',
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
  const result = await addUser(
    req.body.email,
    req.body.username,
    hashedPassword
  );

  logger.info(result);
  // Send OTP to user
  res.redirect('/auth/otp');
});

export default signUpRouter;
