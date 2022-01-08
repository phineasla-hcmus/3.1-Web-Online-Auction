import { Router } from 'express';
import adminModel from '../models/admin.model';
import productModel from '../models/product.model';
import { updateBidderToSeller, findUserById } from '../models/user.model';

const adminRouter = Router();

adminRouter.get('/manage/categories', async function (req, res) {
  res.render('admin/manageCategory', { layout: 'admin', category: true });
});

adminRouter.post('/manage/categories', async function (req, res) {
  const content = req.body.content; // type of action
  console.log(req.body);
  switch (content) {
    case 'addRootCate': {
      adminModel.addRootCategory(req.body.rootCateName);
      res.redirect('/admin/manage/categories');
      break;
    }
    case 'deleteRootCate': {
      const listChild = await adminModel.checkRootCategoryHaveChildren(
        req.body.rootCateId
      );
      if (listChild.length == 0) {
        adminModel.deleteCategory(req.body.rootCateId);
        res.redirect('/admin/manage/categories');
      } else {
        //TODO: ALERT THAT THIS ROOT HAVE CHILD
        res.redirect('/admin/manage/categories');
      }
      break;
    }
    case 'addChildCate': {
      adminModel.addChildCategory(req.body.childName, req.body.parentId);
      res.redirect('/admin/manage/categories');
      break;
    }
    case 'editCate': {
      adminModel.editCategory(req.body.newName, req.body.catId);
      res.redirect('/admin/manage/categories');
      break;
    }
    case 'deleteChildCate': {
      const listProduct = await adminModel.checkCategoryHaveProduct(
        req.body.childCateId
      );
      console.log(listProduct.length);
      if (listProduct.length == 0) {
        adminModel.deleteCategory(req.body.childCateId);
        res.redirect('/admin/manage/categories');
      } else {
        //TODO: ALERT THAT THIS CATE HAVE PRODUCT
        res.redirect('/admin/manage/categories');
      }
      break;
    }
  }
});

adminRouter.get('/manage/categories/addChildCat', async function (req, res) {
  const parentID = req.query.catId;
  const parentName = req.query.catName;
  const parentCategory = {
    parentID: parentID,
    parentName: parentName,
  };
  res.render('admin/ManageCategory/addChildCategory', {
    layout: 'admin',
    product: true,
    parentCategory,
  });
});

adminRouter.get('/manage/categories/editCat', async function (req, res) {
  const catID = req.query.catId;
  const catName = req.query.catName;
  const Category = {
    catID: catID,
    catName: catName,
  };
  res.render('admin/ManageCategory/editCategory', {
    layout: 'admin',
    product: true,
    Category,
  });
});

adminRouter.get('/manage/products', async function (req, res) {
  const listDisable = await adminModel.getDisableProduct();

  for (let i = 0; i < listDisable.length; i++) {
    listDisable[i].isDisable = 1;
  }

  const listProduct = await adminModel.getListProduct();

  const limitpage = 5;
  const page = 1;
  const offset = (page - 1) * limitpage;

  const amountProduct = listProduct.length;

  let numPageProduct = Math.floor(amountProduct / limitpage);
  if (amountProduct % limitpage != 0) numPageProduct++;

  const listofPageProduct = [];

  const pagingProductList = await adminModel.getListProductsByPaging(
    offset,
    limitpage
  );

  for (let i = 1; i <= numPageProduct; i++) {
    listofPageProduct.push({
      value: i,
      isCurrent: +page === i,
    });
  }

  res.render('admin/manageProduct', {
    layout: 'admin',
    product: true,
    listDisable,
    emptyDisable: listDisable.length === 0,
    pagesProduct: listofPageProduct,
    pagingProductList,
  });
});

adminRouter.get('/manage/productsByPaging', async function (req, res) {
  const limitpage = 5;
  const page: any = req.query.page || 1;
  const offset = (page - 1) * limitpage;
  const pagingProductList = await adminModel.getListProductsByPaging(
    offset,
    limitpage
  );
  res.json(pagingProductList);
});

adminRouter.post('/deleteProduct', async function (req, res) {
  const content = req.body.content;

  if (content == 'disableProduct') {
    const proId = req.body.proId;
    adminModel.disableProduct(proId);
    const url = req.headers.referer || '/';
    res.redirect(url);
  } else {
    if (content == 'recovery') {
      const listDisable = await adminModel.getDisableProduct();
      for (let i = 0; i < listDisable.length; i++) {
        adminModel.recoveryProduct(listDisable[i].proId);
      }

      const url = req.headers.referer || '/';
      res.redirect(url);
    } else {
      if (content == 'delete') {
        const listDisable = await adminModel.getDisableProduct();
        for (let i = 0; i < listDisable.length; i++) {
          adminModel.deleteProduct(listDisable[i].proId);
        }

        const url = req.headers.referer || '/';
        res.redirect(url);
      }
    }
  }
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
