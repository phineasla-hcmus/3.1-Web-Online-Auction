import { buildCheckFunction, check, param, query } from 'express-validator';
import { findOtp, OtpType } from '../models/otp.model';

const checkBodyAndQuery = buildCheckFunction(['body', 'query']);

export const recoveryTokenValidator = query('token')
  .notEmpty()
  .bail()
  .custom(async (token, { req }) => {
    const userId = req.params?.id;
    const otp = await findOtp(userId, OtpType.Recovery);
    if (otp?.token !== token) {
      throw new Error('Invalid token');
    }
    return true;
  });
