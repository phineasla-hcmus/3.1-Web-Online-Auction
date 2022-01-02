import { Router } from 'express';
import adminModel from '../models/admin.model';
import { updateBidderToSeller } from '../models/user.model';

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
