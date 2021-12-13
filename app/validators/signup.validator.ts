import axios from 'axios';
import { check } from 'express-validator';
import { stringify } from 'querystring';

import logger from '../utils/logger';
import { findUserByEmail } from '../models/user.model';
import { RECAPTCHA_SECRET } from '../config/secret';

const passwordLength = {
  min: 5,
  max: 50,
};
const nameLength = { max: 40 };
const dobMin = new Date(1900, 0);

const signUpValidator = [
  check('email', 'Email is not valid')
    .isEmail()
    .custom(async (email) => {
      const user = await findUserByEmail(email);
      if (user) {
        throw new Error('E-mail already in use');
      }
    }),
  check('password')
    .isLength(passwordLength)
    .withMessage('Password must be at least 5 characters long'),
  check('passwordConfirmation').custom((pwd, { req }) => {
    if (pwd !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
  check('g-recaptcha-response').custom(async (recaptcha) => {
    if (!recaptcha) throw new Error('Please complete reCAPTCHA');
    const query = stringify({
      secret: RECAPTCHA_SECRET,
      response: recaptcha,
    });
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?${query}`;
    const res = await axios.post(verifyUrl);
    if (res.data['success'] !== undefined && !res.data['success']) {
      throw new Error('Failed reCAPTCHA verification');
    }
    return true;
  }),
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
