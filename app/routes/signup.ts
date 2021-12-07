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
      logger.debug(JSON.stringify(user));
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
  const reqBody = req.body;
  const result = await addUser({
    email: reqBody.email,
    username: reqBody.username,
    password: hashedPassword,
    firstname: reqBody.firstName,
    lastname: reqBody.lastName,
    dob: new Date(reqBody.dob),
    address: reqBody.address,
  });

  logger.debug(JSON.stringify(reqBody));
  logger.debug('Insert result: ' + result);
  // Send OTP to user
  res.redirect('/auth/otp');
});

export default signUpRouter;
