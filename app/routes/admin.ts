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
  const limitpage = 5;
  const page = 1;
  const offset = (page - 1) * limitpage;

  // for list users
  const listUser = await adminModel.getListUsers();
  const amountUser = listUser.length;

  let numPageUser = Math.floor(amountUser / limitpage);
  if (amountUser % limitpage != 0) numPageUser++;

  const listofPageUser = [];

  const pagingUserList = await adminModel.getListUsersByPaging(
    offset,
    limitpage
  );

  for (let i = 1; i <= numPageUser; i++) {
    listofPageUser.push({
      value: i,
      isCurrent: +page === i,
    });
  }

  // for list requests
  const listRequest = await adminModel.getUpgradeRequests();
  const amountRequest = listRequest.length;

  let numPageRequest = Math.floor(amountRequest / limitpage);
  if (amountRequest % limitpage != 0) numPageRequest++;

  const listofPageRequest = [];

  const pagingRequestList = await adminModel.getUpgradeRequestsByPaging(
    offset,
    limitpage
  );

  for (let i = 1; i <= numPageRequest; i++) {
    listofPageRequest.push({
      value: i,
      isCurrent: +page === i,
    });
  }

  res.render('admin/manageUser', {
    layout: 'admin',
    users: true,
    pagingUserList,
    pagingRequestList,
    emptyRequest: pagingRequestList.length === 0,
    emptyList: pagingUserList.length === 0,
    pagesUser: listofPageUser,
    pagesRequest: listofPageRequest,
  });
});

adminRouter.get('/manage/usersByPaging', async function (req, res) {
  const limitpage = 5;
  const page: any = req.query.page || 1;
  const offset = (page - 1) * limitpage;
  const pagingUserList = await adminModel.getListUsersByPaging(
    offset,
    limitpage
  );
  res.json(pagingUserList);
});

adminRouter.get('/manage/requestsByPaging', async function (req, res) {
  const limitpage = 5;
  const page: any = req.query.page || 1;
  const offset = (page - 1) * limitpage;
  const pagingRequestList = await adminModel.getUpgradeRequestsByPaging(
    offset,
    limitpage
  );
  res.json(pagingRequestList);
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
