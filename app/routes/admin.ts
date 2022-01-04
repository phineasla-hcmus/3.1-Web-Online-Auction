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
  const amountPro = list.length;
  const limitpage = 6;

  let numPage = Math.floor(amountPro / limitpage);
  if (amountPro % limitpage != 0) numPage++;

  const page: any = req.query.page || 1;
  const offset = (page - 1) * limitpage;
  const listofPage = [];

  const pagingUserList = await adminModel.getListUsersByPaging(
    offset,
    limitpage
  );

  for (let i = 1; i <= numPage; i++) {
    listofPage.push({
      value: i,
      isCurrent: +page === i,
    });
  }
  const requests = await adminModel.getUpgradeRequests();
  res.render('admin/manageUser', {
    layout: 'admin',
    users: true,
    pagingUserList,
    requests,
    emptyRequest: requests.length === 0,
    emptyList: pagingUserList.length === 0,
    pages: listofPage,
  });
});

adminRouter.get('/manage/usersByPaging', async function (req, res) {
  const list = await adminModel.getListUsers();
  const amountPro = list.length;
  const limitpage = 6;

  let numPage = Math.floor(amountPro / limitpage);
  if (amountPro % limitpage != 0) numPage++;

  const page: any = req.query.page || 1;
  const offset = (page - 1) * limitpage;
  const listofPage = [];

  const pagingUserList = await adminModel.getListUsersByPaging(
    offset,
    limitpage
  );

  for (let i = 1; i <= numPage; i++) {
    listofPage.push({
      value: i,
      isCurrent: +page === i,
    });
  }

  res.json(pagingUserList);

  // res.render('admin/manageUser', {
  //   layout: 'admin',
  //   users: true,
  //   pagingUserList,
  //   emptyList: pagingUserList.length === 0,
  //   pages: listofPage,
  // });
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
