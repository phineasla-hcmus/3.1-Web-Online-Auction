import { Router } from 'express';
import adminModel from '../models/admin.model';
import bidderModel from '../models/bidder.model';
import productModel from '../models/product.model';
import { RoleType } from '../models/role.model';
import { findUserById, updateUser, USER_BASIC } from '../models/user.model';

const adminRouter = Router();

adminRouter.get('/manage/categories', async function (req, res) {
  res.render('admin/manageCategory', { layout: 'user', category: true });
});

adminRouter.post('/manage/categories', async function (req, res) {
  const content = req.body.content; // type of action
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
        res.render('admin/manageCategory', {
          layout: 'user',
          category: true,
          HaveChildCat: true,
        });
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
      if (listProduct.length == 0) {
        adminModel.deleteCategory(req.body.childCateId);
        res.redirect('/admin/manage/categories');
      } else {
        res.render('admin/manageCategory', {
          layout: 'user',
          category: true,
          childCatHaveProduct: true,
        });
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
    layout: 'user',
    category: true,
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
    layout: 'user',
    category: true,
    Category,
  });
});

adminRouter.get('/manage/products', async function (req, res) {
  const limitpage = 5;
  const page = 1;
  const offset = (page - 1) * limitpage;

  const listDisable = await adminModel.getDisableProduct();

  for (let i = 0; i < listDisable.length; i++) {
    listDisable[i].isDisable = 1;
  }

  const amountDisable = listDisable.length;
  let numPageDisable = Math.floor(amountDisable / limitpage);
  if (amountDisable % limitpage != 0) numPageDisable++;

  const listofPageDisable = [];

  const listProduct = await adminModel.getListProduct();

  const pagingDisableList = await adminModel.getListDisableByPaging(
    offset,
    limitpage
  );

  for (let i = 1; i <= numPageDisable; i++) {
    listofPageDisable.push({
      value: i,
      isCurrent: +page === i,
    });
  }

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
    layout: 'user',
    product: true,
    listDisable,
    emptyDisable: listDisable.length === 0,
    pagesProduct: listofPageProduct,
    pagesDisable: listofPageDisable,
    pagingProductList,
    pagingDisableList,
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

adminRouter.get('/manage/disablesByPaging', async function (req, res) {
  const limitpage = 5;
  const page: any = req.query.page || 1;
  const offset = (page - 1) * limitpage;
  const pagingDisableList = await adminModel.getListDisableByPaging(
    offset,
    limitpage
  );
  res.json(pagingDisableList);
});

adminRouter.post('/deleteProduct', async function (req, res) {
  const content = req.body.content;

  if (content == 'disableProduct') {
    const proId = req.body.proId;
    adminModel.disableProduct(proId);
    const url = req.headers.referer || '/';
    res.redirect(url);
  } else if (content == 'deleteProduct') {
    const proId = req.body.proId;
    adminModel.deleteProduct(proId);
    const url = req.headers.referer || '/';
    res.redirect(url);
  } else if (content == 'recoveryProduct') {
    const proId = req.body.proId;
    adminModel.recoveryProduct(proId);
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
    layout: 'user',
    users: true,
    pagingUserList,
    pagingRequestList,
    emptyRequest: pagingRequestList.length === 0,
    emptyList: pagingUserList.length === 0,
    pagesUser: listofPageUser,
    pagesRequest: listofPageRequest,
    nPagesUser: listofPageUser.length,
    nPagesRequest: listofPageRequest.length,
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
  const id = req.params.id;
  const user = await findUserById(id, [
    ...USER_BASIC,
    'dob',
    'address',
    'rating',
  ]);
  if (!user) {
    return res.redirect(req.url);
  }
  const stars = (user.rating / 10) * 5;
  const rate = [];
  for (let i = 1; i <= 5; i++) {
    rate.push(stars >= i ? 'full' : 'empty');
  }
  res.render('admin/userDetail', { layout: 'user', user, rate, users: true });
});

adminRouter.post('/approveRequest', async function (req, res) {
  adminModel.approveRequest(req.body.approveid);
  await updateUser(req.body.approveid, { roleId: RoleType.Seller });
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

adminRouter.post('/deleteUser', async function (req, res) {
  const userId = req.body.deleteid;
  // lấy danh sách list product đang bid
  const biddingList = await bidderModel.getCurrentBids(userId);
  //  xoá auction history, auction auto(?) của bidder đó trong các product đang diễn ra
  await adminModel.removeCurrentBids(userId);
  await adminModel.removeAuctionAuto(userId);
  //cập nhật người đang giữ giá cao nhất của từng product
  //-> cập nhật currentPrice, numberOfBids và bidderId
  for (let i = 0; i < biddingList.length; i++) {
    const highestBid = await adminModel.getHighestBid(biddingList[i].proId);
    const bidderId = highestBid.length === 0 ? null : highestBid[0].userId;
    const currentBid = await adminModel.getCurrentPrice(biddingList[i].proId);

    let currentPrice = 0;
    if (currentBid.length === 0) {
      const product = await productModel.findProductbyId(biddingList[i].proId);
      currentPrice = product[0].basePrice;
    } else {
      currentPrice = currentBid[0].auctionPrice;
    }
    const numberOfBids = await adminModel.getNumberOfBids(biddingList[i].proId);
    await adminModel.updateProduct(
      biddingList[i].proId,
      currentPrice,
      +numberOfBids > 0 ? +numberOfBids : 0,
      bidderId
    );
  }
  // kết thúc các sản phẩm mà bidder đó đăng bán
  await adminModel.endProducts(userId);
  // xoá các product đó khỏi active product
  await adminModel.removeActiveProducts(userId);
  // cập nhật banned cho user đó
  await adminModel.deleteUser(userId);

  res.redirect('/admin/manage/users');
});
export default adminRouter;
