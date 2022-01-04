import bcrypt from 'bcrypt';
import { Response, Router } from 'express';
import { addOtp, deleteOtp, findOtp, OtpType } from '../../models/otp.model';
import { RoleType } from '../../models/role.model';
import { findUserByEmail, updateUser } from '../../models/user.model';
import { sendRecovery, sendVerify } from '../../utils/email';

/**
 * Reset password can both be authenticated and unauthenticated user
 * @route
 * 1. Forgot password
 *    - If authenticated, continue to step 2, else ask for email
 *    - AJAX to validate email (`POST /auth/recovery/request-email`)
 * 2. Send code to email
 * 3. Validate code (`POST /auth/recovery?id=`)
 *    - If code is valid, generate unique token then redirect to
 * `/auth/recovery/password?id=&token=`
 * 4. Reset password (`POST /auth/recovery/password?id=&token=`)
 */
export const recoveryRouter = Router();

/**
 * Must check logged in before access this route
 */
export const verifyRouter = Router();

const alert = {
  invalidCode: {
    type: 'info',
    message: 'Oops! Invalid verification code',
  },
  resendEmail: {
    type: 'info',
    message: 'Please check your email',
  },
  emailNotFound: {
    type: 'info',
    message: "Oof! Can't find your email",
  },
};

// const alertMessage = new Map();
// alertMessage.set('invalid', {
//   type: 'info',
//   message: 'Oops! Invalid verification code',
// });
// alertMessage.set('resend', {
//   type: 'info',
//   message: 'Please check your email',
// });
// alertMessage.set('not-found', {
//   type: 'info',
//   message: "Oof! Can't find your email",
// });

recoveryRouter.get('/request-email', (req, res) => {
  res.render('recovery/requestEmail', { layout: 'auth' });
});

recoveryRouter.post('/request-email', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send('Missing parameters');
  }
  const { userId } = await findUserByEmail(email, ['userId']);
  if (userId) {
    const token = await addOtp(userId, OtpType.Recovery);
    sendRecovery(req.body.email, token);
    // Reset password can both be used in authenticated and unauthenticated user
    res.redirect('/auth/recovery?id=' + userId);
  } else {
    res.render('recovery/requestEmail', {
      layout: 'auth',
    });
  }
});

recoveryRouter.get('/', (req, res) => {
  res.render('verify', {
    layout: 'auth',
    submitAction: '/auth/recovery',
    resendAction: '/auth/recovery/resend',
  });
});

recoveryRouter.post('/', async (req, res) => {
  const userId = req.user?.userId || req.query.id;
  if (!userId) {
    return res.status(400).send('Missing parameters');
  }
  const { token } = req.body;
  const otp = await findOtp(userId, OtpType.Recovery);
  if (otp?.token === token) {
    const recoveryToken = await bcrypt.hash(token, 5);
    console.log(token);
    console.log(recoveryToken);

    res.redirect(`/auth/recovery/password?id=${userId}&token=${recoveryToken}`);
  }
});

recoveryRouter.get('/password', (req, res) => {
  res.render('recovery/resetPassword', { layout: 'auth' });
});

recoveryRouter.post('/password', (req, res) => {});

function renderVerify(
  res: Response,
  alert?: { type: string; message: string }
) {
  res.render('auth/verify', {
    layout: 'auth',
    submitAction: '/auth/verify',
    resendAction: '/auth/verify/resend',
    alert,
  });
}

verifyRouter.get('/', (req, res) => {
  if (req.user?.roleId !== RoleType.Unverified) {
    res.redirect(req.session.returnTo || '/');
  } else {
    renderVerify(res);
  }
});

verifyRouter.post('/', async (req, res) => {
  const { userId } = req.user!;
  const { token } = req.body;
  const otp = await findOtp(userId, OtpType.Verify);
  if (otp?.token === token) {
    // User is now verified
    updateUser(userId, { roleId: RoleType.Bidder });
    deleteOtp(userId);
    res.redirect(req.session.returnTo || '/');
  } else {
    renderVerify(res, alert.invalidCode);
  }
});

verifyRouter.post('/resend', async (req, res) => {
  const { userId, email } = req.user!;
  const otp = await findOtp(userId, OtpType.Verify);
  if (otp) {
    sendVerify(email, otp.token);
  }
  renderVerify(res, alert.resendEmail);
});
