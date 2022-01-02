import { Router } from 'express';
import { deleteOtp, findOtp, getOtp, OtpType } from '../../models/otp.model';
import { RoleType } from '../../models/role.model';
import { updateUser } from '../../models/user.model';
import { sendVerify } from '../../utils/email';

/**
 * Reset password can both be used in authenticated and unauthenticated user
 * Route:
 * 1. Forgot password
 *    - If authenticated, continue to step 2, else ask for email.  
 * 1.2. asdf  
 * 2. asdf
 */
export const recoveryRouter = Router();

/**
 * Must check logged in before access this route
 */
export const verifyRouter = Router();

recoveryRouter.get('/email', (req, res) => {
  res.render('recovery/requestEmail', { layout: 'auth' });
});

recoveryRouter.post('/email', (req, res) => {
  //TODO@phineasla: AJAX to check for email, if found then send email
  const userId = 0;
  // Reset password can both be used in authenticated and unauthenticated user
  res.redirect('/recovery?id=' + userId);
});

recoveryRouter.get('/', (req, res) => {
  res.render('verify', {
    layout: 'auth',
    submitAction: '/recovery',
    resendAction: '/recovery/resend',
  });
});

recoveryRouter.post('/', (req, res) => {
  const { id } = req.query;
  const { token } = req.body;
});

verifyRouter.post('/resend', async (req, res) => {
  const { userId, email } = req.user!;
  const otp = await getOtp(userId, OtpType.Verify);
  if (otp) {
    sendVerify(email, otp.token);
  } else {
    res.redirect(req.session.returnTo || '/');
  }
});

verifyRouter.get('/', (req, res) => {
  if (req.user?.roleId !== RoleType.Unverified) {
    res.redirect(req.session.returnTo || '/');
  } else {
    res.render('verify', {
      layout: 'auth',
      submitAction: '/verify',
      resendAction: '/verify/resend',
    });
  }
});

verifyRouter.post('/', async (req, res) => {
  const { userId } = req.user!;
  const { token } = req.body;
  const dbToken = await findOtp(userId);
  if (dbToken === token) {
    // User is now verified
    updateUser(userId, { roleId: RoleType.Bidder });
    deleteOtp(userId);
    res.redirect(req.session.returnTo || '/');
  } else {
    res.redirect('/verify');
  }
});
