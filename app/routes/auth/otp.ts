import { Router } from 'express';
import { deleteOtp, findOtp, getOtp, OtpType } from '../../models/otp.model';
import { RoleType } from '../../models/role.model';
import { updateUser } from '../../models/user.model';
import { sendVerify } from '../../utils/email';

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
  res.redirect('/recovery/otp?id=' + userId);
});

recoveryRouter.get('/otp', (req, res) => {
  res.render('recovery/requestOtp', { layout: 'auth' });
});

recoveryRouter.post('/otp', (req, res) => {
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
    res.render('verify', { layout: 'auth' });
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
