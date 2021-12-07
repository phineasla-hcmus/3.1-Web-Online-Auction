import { check } from 'express-validator';

import logger from '../utils/logger';
import { findUserByEmail } from '../models/user.model';

const passwordLength = {
  min: 5,
  max: 50,
};

const usernameLength = {
  min: 3,
  max: 30,
};

const nameLength = {
  max: 40,
};

const dobMin = new Date(1900, 0);

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
  check('username')
    .isLength(usernameLength)
    .withMessage('Username must be at least 3 characters long'),
  check('password')
    .isLength(passwordLength)
    .withMessage('Password must be at least 5 characters long'),
  check('firstName').isLength(nameLength).withMessage('First name too long'),
  check('lastName').isLength(nameLength).withMessage('Last name too long'),
  check('dob').custom((dob) => {
    const d = new Date(dob);
    const today = new Date();
    if (d >= today) {
      throw new Error("Sorry, we don't allow time travelling");
    }
    if (d <= dobMin) {
      throw new Error(
        `Are you sure you are ${
          today.getFullYear() - d.getFullYear()
        } years old?`
      );
    }
    return true;
  }),
];

export default signUpValidator;
