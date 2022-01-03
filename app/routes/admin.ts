import { Router } from 'express';
import adminModel from '../models/admin.model';
import { updateBidderToSeller, findUserById } from '../models/user.model';

const adminRouter = Router();

// TODO
adminRouter.get('/manage/categories', async function (req, res) {
  res.render('admin/manageCategory', { layout: 'admin', category: true });
});

// TODO
adminRouter.get('/manage/products', async function (req, res) {
  res.render('admin/manageProduct', { layout: 'admin', product: true });
});

adminRouter.get('/manage/users', async function (req, res) {
  const list = await adminModel.getListUsers();
  const requests = await adminModel.getUpgradeRequests();
  res.render('admin/manageUser', {
    layout: 'admin',
    users: true,
    list,
    requests,
    emptyRequest: requests.length === 0,
    emptyList: list.length === 0,
  });
});

adminRouter.get('/manage/users/:id', async function (req, res) {
  const id = +req.params.id;
  const user = await findUserById(id, [
    'userId',
    'roleId',
    'firstName',
    'lastName',
    'email',
    'dob',
    'address',
    'rating',
  ]);
  const stars = (user.rating / 10) * 5;
  const rate = [];
  for (let i = 1; i <= 5; i++) {
    if (stars >= i) {
      rate.push('full');
    } else {
      rate.push('empty');
    }
  }
  res.render('admin/userDetail', { layout: 'admin', user, rate });
});

adminRouter.post('/approveRequest', async function (req, res) {
  adminModel.approveRequest(req.body.approveid);
  await updateBidderToSeller(req.body.approveid);
  res.redirect('/admin/manage/users');
});

adminRouter.post('/declineRequest', async function (req, res) {
  adminModel.declineRequest(req.body.declineid);
  res.redirect('/admin/manage/users');
});
adminRouter.post('/downgradeSeller', async function (req, res) {
  adminModel.downgradeSeller(req.body.downid);
  res.redirect('/admin/manage/users');
});

export default adminRouter;
