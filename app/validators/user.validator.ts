import axios from 'axios';
import { body } from 'express-validator';
import { stringify } from 'querystring';
import { RECAPTCHA_SECRET } from '../config/secret';
import { findUserByEmail } from '../models/user.model';

const nameLength = { max: 40 };
const dobMin = new Date(1900, 0);

const passwordLength = {
  min: 5,
  max: 50,
};

export const registerEmailValidator = body('email', 'Email is not valid')
  .isEmail()
  .bail()
  .custom(async (email) => {
    const user = await findUserByEmail(email);
    if (user) {
      throw new Error('E-mail already in use');
    }
  });

export const passwordValidator = body('password')
  .isLength(passwordLength)
  .withMessage(
    `Password must be at least ${passwordLength.min} characters long`
  );

export const confirmPasswordValidator = body('passwordConfirmation').custom(
  (pwd, { req }) => {
    if (pwd !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }
);

export const recaptchaValidator = body('g-recaptcha-response').custom(
  async (recaptcha) => {
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
  }
);

export const dobValidator = body('dob').custom((dob) => {
  const d = new Date(dob);
  const today = new Date();
  if (d >= today) {
    throw new Error("Sorry, we don't allow time travelling");
  }
  if (d <= dobMin) {
    throw new Error(
      `Are you sure you are ${today.getFullYear() - d.getFullYear()} years old?`
    );
  }
  return true;
});

export const signUpValidator = [
  registerEmailValidator,
  passwordValidator,
  confirmPasswordValidator,
  recaptchaValidator,
  body('firstName').isLength(nameLength).withMessage('First name too long'),
  body('lastName').isLength(nameLength).withMessage('Last name too long'),
  dobValidator,
];
