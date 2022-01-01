import { Router } from 'express';
import { findOtp } from '../../models/otp.model';
import { RoleType } from '../../models/role.model';
import { updateUser } from '../../models/user.model';

const verifyRouter = Router();

verifyRouter.post('/resend/:userId', (req, res) => {
  //TODO: find otp, then resend email
});

verifyRouter.get('/:userId', (req, res) => {
  if (req.user?.roleId == RoleType.Unverified)
    res.render('auth/verify', { layout: 'auth' });
  else res.redirect(req.session.returnTo || '/');
});

verifyRouter.post('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { token } = req.body;
  const dbToken = await findOtp(req.params.userId);
  if (dbToken === token) {
    // User is now verified
    updateUser(userId, { roleId: RoleType.Bidder });
    res.redirect(req.session.returnTo || '/');
  } else {
    res.redirect('/verify/' + userId);
  }
});

export default verifyRouter;
