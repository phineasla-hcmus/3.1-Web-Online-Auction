import { Router } from 'express';
import adminModel from '../models/admin.model';

const adminRouter = Router();

// TODO
adminRouter.get('/manage/categories', async function (req, res) {
  res.render('admin/manageCategory', { layout: 'admin' });
});

// TODO
adminRouter.get('/manage/products', async function (req, res) {
  res.render('admin/manageProduct', { layout: 'admin' });
});

adminRouter.get('/manage/users', async function (req, res) {
  const list = await adminModel.getListUsers();
  console.log(list);
  res.render('admin/manageUser', { layout: 'admin' });
});

export default adminRouter;
