import bcrypt from 'bcrypt';
import { Router } from 'express';
import { validationResult } from 'express-validator';
import { RECAPTCHA_SITE } from '../../config/secret';
import { addOtp, OtpType } from '../../models/otp.model';
import { RoleType } from '../../models/role.model';
import { addUser } from '../../models/user.model';
import { sendVerify } from '../../utils/email';
import logger from '../../utils/logger';
import { signUpValidator } from '../../validators/user.validator';

const signUpRouter = Router();

signUpRouter.get('/', (req, res) => {
  res.render('auth/signup', {
    layout: 'auth',
    recaptcha: RECAPTCHA_SITE,
  });
});

/**
 * Create a new local account.
 * @route POST /signup
 */
signUpRouter.post('/', ...signUpValidator, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(errors.array());
  }
  // Insert user to DB
  const { email, password, firstName, lastName, dob, address } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = await addUser({
    email,
    password: hashedPassword,
    firstName,
    lastName,
    dob: new Date(dob),
    address,
  });

  logger.debug('New user added: ' + userId);

  // Create token on database, ignore any knex error
  const token = await addOtp(userId, OtpType.Verify);
  sendVerify(req.body.email, token);
  req.login(
    { userId, email, firstName, lastName, roleId: RoleType.Unverified },
    (err: any) => {
      if (err) return next(err);
      return res.redirect('/auth/verify');
    }
  );
});

export default signUpRouter;
