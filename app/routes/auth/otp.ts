import bcrypt from 'bcrypt';
import { Response, Router } from 'express';
import { validationResult } from 'express-validator';
import { addOtp, deleteOtp, findOtp, OtpType } from '../../models/otp.model';
import { RoleType } from '../../models/role.model';
import {
  findUserByEmail,
  findUserById,
  updateUser,
} from '../../models/user.model';
import { sendRecovery, sendVerify } from '../../utils/email';
import { recoveryTokenValidator } from '../../validators/otp.validator';
import {
  confirmPasswordValidator,
  passwordValidator,
} from '../../validators/user.validator';

/**
 * Reset password can both be authenticated and unauthenticated user
 * @route
 * 1. Forgot password
 *    - If authenticated, continue to step 2, else ask for email
 *    - Validate email (`POST /auth/recovery/request-email`)
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

interface Alert {
  type: string;
  message: string;
}

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

function renderRequestEmail(res: Response, alert?: Alert) {
  res.render('auth/recovery/requestEmail', {
    layout: 'auth',
    alert,
  });
}

recoveryRouter.get('/request-email', (req, res) => {
  renderRequestEmail(res);
});

recoveryRouter.post('/request-email', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    renderRequestEmail(res, alert.emailNotFound);
  }
  const user = await findUserByEmail(email, ['userId']);
  if (user) {
    const token = await addOtp(user.userId, OtpType.Recovery);
    sendRecovery(req.body.email, token);
    res.redirect('/auth/recovery/' + user.userId);
  } else {
    renderRequestEmail(res, alert.emailNotFound);
  }
});

function renderVerifyRecovery(res: Response, userId: any, alert?: Alert) {
  res.render('auth/verify', {
    layout: 'auth',
    submitAction: `/auth/recovery/${userId}`,
    resendAction: `/auth/recovery/${userId}/resend`,
    alert,
  });
}

recoveryRouter.post('/:id/resend', async (req, res) => {
  const userId = req.params.id;
  const otp = await findOtp(userId, OtpType.Recovery);
  const user = await findUserById(userId, ['email']);
  if (otp && user) {
    sendRecovery(user.email, otp.token);
    renderVerifyRecovery(res, userId, alert.resendEmail);
  } else {
    // User modified the URL, reject resend
    renderVerifyRecovery(res, userId, alert.emailNotFound);
  }
});

function renderResetPassword(
  res: Response,
  userId: any,
  token: any,
  alert?: Alert
) {
  res.render('auth/recovery/resetPassword', {
    layout: 'auth',
    submitAction: `/auth/recovery/${userId}/password?token=${token}`,
    alert,
  });
}

recoveryRouter.get('/:id/password', (req, res) => {
  renderResetPassword(res, req.params.id, req.query.token);
});

recoveryRouter.post(
  '/:id/password',
  recoveryTokenValidator,
  passwordValidator,
  confirmPasswordValidator,
  async (req, res) => {
    const userId = req.params?.id;
    const token = req.params?.token;
    const password = req.body?.password;
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const hashedPassword = await bcrypt.hash(password, 10);
      deleteOtp(userId, OtpType.Recovery);
      updateUser(userId, { password: hashedPassword });
      res.redirect(req.session.returnTo || '/');
    } else {
      renderResetPassword(res, userId, token, {
        type: 'info',
        message: errors.array()[0].msg,
      });
    }
  }
);

recoveryRouter.get('/:id', (req, res) => {
  renderVerifyRecovery(res, req.params.id);
});

recoveryRouter.post('/:id', async (req, res) => {
  const userId = req.params.id;
  const { token } = req.body;
  const otp = await findOtp(userId, OtpType.Recovery);
  if (otp?.token === token) {
    res.redirect(`/auth/recovery/${userId}/password?token=${token}`);
  } else {
    renderVerifyRecovery(res, userId, alert.invalidCode);
  }
});

function renderVerify(res: Response, alert?: Alert) {
  res.render('auth/verify', {
    layout: 'auth',
    submitAction: '/auth/verify',
    resendAction: '/auth/verify/resend',
    alert,
  });
}

verifyRouter.post('/resend', async (req, res) => {
  const { userId, email } = req.user!;
  const otp = await findOtp(userId, OtpType.Verify);
  if (otp) {
    sendVerify(email, otp.token);
  }
  renderVerify(res, alert.resendEmail);
});

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
    deleteOtp(userId, OtpType.Verify);
    res.redirect(req.session.returnTo || '/');
  } else {
    renderVerify(res, alert.invalidCode);
  }
});
