import { Router } from 'express';
import moment from 'moment';
import auctionModel from '../models/auction.model';
import bidderModel from '../models/bidder.model';
import {
  findCategory,
  findParentCategoryByKeyword,
  getCategories,
  getChildCategories,
  getParentCategories,
} from '../models/category.model';
import productModel from '../models/product.model';
import { findUserById } from '../models/user.model';
import { sendUpdate } from '../utils/email';
import bcrypt from 'bcrypt';
const homeRouter = Router();

homeRouter.get('/', async (req, res) => {
  const userId = res.locals.user ? res.locals.user.userId : 0;
  const nearEndList = await productModel.findNearEndProducts();
  nearEndList.forEach((element) => {
    if (element.firstName != null && element.lastName != null) {
      element.bidderName = element.firstName + ' ' + element.lastName;
    } else element.bidderName = '';
    element.typeHome = 1;
  });

  const mostBidsList = await productModel.findMostBidsProducts();
  mostBidsList.forEach((element) => {
    if (element.firstName != null && element.lastName != null) {
      element.bidderName = element.firstName + ' ' + element.lastName;
    } else element.bidderName = '';
    element.typeHome = 2;
  });

  const highestPriceList = await productModel.findHighestPriceProducts();
  highestPriceList.forEach((element) => {
    if (element.firstName != null && element.lastName != null) {
      element.bidderName = element.firstName + ' ' + element.lastName;
    } else element.bidderName = '';
    element.typeHome = 3;
  });

  //get favorite Product
  if (userId != 0) {
    const listFavorite = await productModel.getFavoriteList(userId);

    const FavoriteProduct = [];
    for (let i = 0; i < listFavorite.length; i++) {
      FavoriteProduct.push({
        proId: listFavorite[i].proId,
      });
    }

    for (let i = 0; i < nearEndList.length; i++) {
      nearEndList[i].FavoriteProduct = FavoriteProduct;
    }
    for (let i = 0; i < mostBidsList.length; i++) {
      mostBidsList[i].FavoriteProduct = FavoriteProduct;
    }
    for (let i = 0; i < highestPriceList.length; i++) {
      highestPriceList[i].FavoriteProduct = FavoriteProduct;
    }
  }

  res.render('home', {
    nearEndList,
    mostBidsList,
    highestPriceList,
  });
});

homeRouter.get('/category', async (req, res) => {
  const userId = res.locals.user ? 1 : 0;
  const catid = req.query.catId || 0;

  const childs = await getChildCategories();
  let parentId = 0;
  childs.forEach((element) => {
    if (element.catId === +catid) {
      element.isActive = true;
      parentId = element.parentId;
    }
  });
  res.locals.childCategories = childs;

  const parents = await getParentCategories();
  parents.forEach((element) => {
    if (element.catId === +catid) {
      element.isActive = true;
    } else if (element.catId === parentId) {
      element.collapsed = true;
    }
  });
  res.locals.parentCategories = parents;

  let amountPro: any = 0;

  const currentCat = await findCategory(catid);
  if (currentCat !== undefined && currentCat.parentId === null) {
    amountPro = await productModel.countProductbyParentCategory(catid);
  } else {
    amountPro = await productModel.countProductbyCategory(catid);
  }

  const limitpage = 5;

  let numPage = Math.floor(amountPro / limitpage);
  if (amountPro % limitpage != 0) numPage++;

  const page: any = req.query.page || 1;
  const offset = (page - 1) * limitpage;

  let list = [];

  if (currentCat !== undefined && currentCat.parentId === null) {
    list = await productModel.findProductbyParentCategoryPaging(
      catid,
      offset,
      limitpage
    );
  } else {
    list = await productModel.findProductbyCategoryPaging(
      catid,
      offset,
      limitpage
    );
  }

  list.forEach((element) => {
    if (element.firstName != null && element.lastName != null) {
      element.bidderName = element.firstName + ' ' + element.lastName;
    } else element.bidderName = '';
  });

  const listofPage = [];
  for (let i = 1; i <= numPage; i++) {
    listofPage.push({
      prev: i - 1 == 0 ? i : i - 1,
      next: i + 1 > numPage ? i : i + 1,
      value: i,
      cateId: currentCat?.catId,
      isCurrent: +page === i,
    });
  }

  for (let i = 0; i < list.length; i++) {
    list[i].user = res.locals.user;
  }

  //get favorite Product
  const userIdAfter = res.locals.user ? res.locals.user.userId : 0;
  if (userId != 0) {
    const listFavorite = await productModel.getFavoriteList(userIdAfter);

    const FavoriteProduct = [];
    for (let i = 0; i < listFavorite.length; i++) {
      FavoriteProduct.push({
        proId: listFavorite[i].proId,
      });
    }

    for (let i = 0; i < list.length; i++) {
      list[i].FavoriteProduct = FavoriteProduct;
    }
  }

  res.render('category/viewCategory', {
    pages: listofPage,
    cateName: currentCat?.catName,
    listProductByCategory: list,
    empty: list.length === 0,
  });
});

homeRouter.get('/product', async (req, res) => {
  const productID = req.query.proId || 0;
  const userId = res.locals.user ? res.locals.user.userId : 0;
  const isUserId = res.locals.user ? 1 : 0;
  const detailedProduct = await productModel.findProductbyId(productID);
  const listofDeniedBidder = await productModel.getDeniedBidder(
    productID as any
  );

  detailedProduct.forEach((element) => {
    if (element.firstName != null && element.lastName != null) {
      element.bidderName = element.firstName + ' ' + element.lastName;
    } else element.bidderName = '';
    element.userId = userId;
  });

  const sellerName = await productModel.getSellerName(
    detailedProduct[0].sellerId
  );

  detailedProduct.forEach((element) => {
    element.sellerName = sellerName[0].firstName + ' ' + sellerName[0].lastName;
  });

  const listRelatedProduct = await productModel.findRelatedProduct(productID);
  listRelatedProduct.forEach((element) => {
    if (element.firstName != null && element.lastName != null) {
      element.bidderName = element.firstName + ' ' + element.lastName;
    } else element.bidderName = '';
  });

  const auctionHistory = await productModel.getAuctionHistory(productID);

  const listBidder = await productModel.getListBidder(productID);

  listBidder.forEach((element) => {
    element.bidderName = element.firstName + ' ' + element.lastName;
  });

  const listFavorite = await productModel.checkIfLike_or_Unlike(
    userId,
    productID
  );

  if (userId != 0) {
    for (let i = 0; i < listRelatedProduct.length; i++) {
      listRelatedProduct[i].user = res.locals.user;
    }

    const listFavorite = await productModel.getFavoriteList(userId);

    const favoriteProduct = [];
    for (let i = 0; i < listFavorite.length; i++) {
      favoriteProduct.push({
        proId: listFavorite[i].proId,
      });
    }

    for (let i = 0; i < listRelatedProduct.length; i++) {
      listRelatedProduct[i].FavoriteProduct = favoriteProduct;
    }
  }

  const { currentPrice, stepPrice, bidderId, sellerId } = detailedProduct[0];
  detailedProduct[0].minimumBidPrice = currentPrice + stepPrice;

  // const bidderRating = await getRatingUser(bidderId);
  // const sellerRating = await getRatingUser(sellerId);

  const bidderRating = (await findUserById(bidderId, ['rating']))?.rating;
  const sellerRating = (await findUserById(sellerId, ['rating']))?.rating;

  detailedProduct[0].bidderRating = bidderRating || 'x';
  detailedProduct[0].sellerRating = sellerRating || 'x';

  if (userId != 0) {
    const user = await findUserById(userId, ['rating']);
    if (user?.rating === null) {
      if (detailedProduct[0].isAllowRating == '1')
        detailedProduct[0].userRating = 1;
      else detailedProduct[0].userRating = 3;
    } else {
      detailedProduct[0].userRating = user?.rating >= 8 ? 1 : 2;
    }
  }
  //get favorite list
  const FavoriteProduct = [];
  for (let i = 0; i < listFavorite.length; i++) {
    FavoriteProduct.push({
      proId: listFavorite[i].proId,
    });
  }

  const listImage = await productModel.findProductImage(+productID);

  //create a temp array to pass into hbs
  const numberofPic = [];
  for (let i = 0; i < listImage.length; i++) {
    numberofPic.push({
      value: i + 1,
      secureUrl: listImage[i].secureUrl,
    });
  }

  res.render('product/viewDetailProduct', {
    product: detailedProduct[0],
    listProduct: listRelatedProduct,
    auctionHistory,
    empty: auctionHistory.length === 0,
    amountPic: numberofPic,
    FavoriteProduct: FavoriteProduct,
    isUserId: isUserId,
    listBidder: listBidder,
    listofDeniedBidder: listofDeniedBidder,
    emptyBidderList: listBidder.length === 0,
  });
});

homeRouter.get('/product/rating', async (req, res) => {
  const userId = req.query.userId ? +req.query.userId : 0;
  const mask = req.query.mask ? false : true;
  const ratingList = await bidderModel.getRatingList(userId);
  ratingList.forEach((element, index) => {
    element.rateName = element.firstName + ' ' + element.lastName;
    if (index === ratingList.length - 1) {
      element.last = true;
    }
  });
  const rateNums = ratingList.length;
  const user = await findUserById(userId);
  const ratingPoint = user?.rating;
  const name = user?.firstName + ' ' + user?.lastName;
  res.render('rating', {
    ratingList,
    rating: true,
    empty: ratingList.length === 0,
    rateNums,
    ratingPoint,
    myRating: true,
    name,
    mask,
  });
});

homeRouter.post('/product', async (req, res, next) => {
  const user = req.user;
  const content = req.body.content;
  const url = req.headers.referer || '/';
  // const userId = req.user ? res.locals.user.userId : 0;

  if (!user) {
    return next();
  }

  const { userId, firstName, lastName } = user;
  const biddername = firstName + ' ' + lastName;

  if (content === 'buyNow') {
    const buynowPrice = req.body.buyNowPrice;
    const proId = req.body.proId;

    const bidderPassword = (await findUserById(userId, ['password']))!.password;

    if (
      (await bcrypt.compare(req.body.password, bidderPassword as string)) ==
      false
    ) {
      return res.json({
        status: 'error',
        msg: 'Your password is incorrect',
      });
    }

    auctionModel.buyNowProduct(userId, proId, buynowPrice);
    return res.json({
      status: 'success',
      msg: `Buy now product successfully with price =${buynowPrice}`,
    });
  }

  if (content === 'Submit') {
    const password = req.body.password;
    const proId = req.body.proId;
    const price = parseInt(req.body.price);
    const minimumPrice = parseInt(req.body.minimumPrice);
    const stepPrice = parseInt(req.body.stepPrice);

    const product = (await productModel.findProductbyId(proId))[0];
    const bidderPassword = (await findUserById(userId, ['password']))!.password;

    if (
      (await bcrypt.compare(req.body.password, bidderPassword as string)) ==
      false
    ) {
      return res.json({
        status: 'error',
        msg: 'Your password is incorrect',
      });
    }
    const now = new Date();
    const differentMinutes =
      (product.expiredDate.getTime() - now.getTime()) / (1000 * 60);
    const newTimeafterExtend = moment(now).add(10, 'm').toDate();

    const sellerId = product.sellerId;
    const numberofbids = product.numberOfBids + 1;
    const isExtendLimit = product.isExtendLimit;

    // sellerId and bidderId must be valid
    const sellerEmail = (await findUserById(sellerId, ['email']))!.email;
    const userEmail = (await findUserById(userId, ['email']))!.email;

    const productEmail = {
      id: proId,
      name: product.proName,
      price: product.currentPrice,
      thumbnailUrl: product.secureUrl,
    };

    if ((price - (minimumPrice - stepPrice)) % stepPrice != 0) {
      return res.json({
        status: 'error',
        msg: 'Your input price is not in ratio with step price',
      });
    }

    if (price < minimumPrice) {
      return res.json({
        status: 'error',
        msg: 'Not enough money',
      });
    } else {
      const userMaxPrice = await auctionModel.findMaxPrice(proId);

      if (userMaxPrice.length === 0) {
        if (
          auctionModel.bidProductwithPriceLarger(
            proId,
            userId,
            biddername,
            price,
            minimumPrice,
            numberofbids
          ) === true
        ) {
          if (isExtendLimit == 1 && differentMinutes <= 5) {
            auctionModel.updateProductExpiredDate(proId, newTimeafterExtend);
          }
          // T???i:
          // seller l?? s???n ph???m n??y(Proid) gi?? ???????c c???p nh???t = minimumPrice ,
          // userId l?? ?????u gi?? th??nh c??ng s???n ph???m n??y v???i gi?? = price
          sendUpdate([sellerEmail, userEmail], productEmail);

          //TODO need to reload page
          return res.json({
            status: 'success',
            msg: 'Bid Successfully!!!',
          });
        } else {
          return res.json({
            status: 'error',
            msg: 'Error!!!',
          });
        }
      } else {
        const maxPrice: number = userMaxPrice[0].maxPrice;
        const userWithMaxPrice = userMaxPrice[0].userId;
        if (userWithMaxPrice == userId) {
          return res.json({
            status: 'error',
            msg: `You are the highest bidder in this product with auction auto price =${maxPrice} !!!!<br> Please bid again if there is a bidder bid higher than you`,
          });
        } else {
          if (maxPrice < price) {
            const newPrice = maxPrice + stepPrice;
            if (
              auctionModel.bidProductwithPriceLarger(
                proId,
                userId,
                biddername,
                price,
                newPrice,
                numberofbids
              ) === true
            ) {
              if (isExtendLimit == 1 && differentMinutes <= 5) {
                auctionModel.updateProductExpiredDate(
                  proId,
                  newTimeafterExtend
                );
              }

              const userMaxPriceEmail = (await findUserById(userWithMaxPrice, [
                'email',
              ]))!.email;
              //T???i :
              // seller l?? s???n ph???m n??y(Proid) gi?? ???????c c???p nh???t = newPrice ,
              // userId l?? ?????u gi?? th??nh c??ng s???n ph???m n??y v???i gi?? = price
              // userwithMaxPrice l?? s???n ph???m n??y b???n kh??ng c??n l?? ng?????i gi??? gi?? cao nh???t do c?? tg UserId ?????u gi?? cao h??n
              sendUpdate(
                [sellerEmail, userEmail, userMaxPriceEmail],
                productEmail
              );
              //TODO need to reload page

              return res.json({
                status: 'success',
                msg: 'Bid Successfully!!!',
              });
            } else {
              return res.json({
                status: 'error',
                msg: 'Error!!!',
              });
            }
          } else {
            if (
              auctionModel.bidProductWithPriceSmaller(
                proId,
                userId,
                biddername,
                price,
                price,
                numberofbids
              ) === true
            ) {
              if (isExtendLimit == 1 && differentMinutes <= 5) {
                auctionModel.updateProductExpiredDate(
                  proId,
                  newTimeafterExtend
                );
              }
              // T???i :
              // seller l?? s???n ph???m n??y(Proid) gi?? ???????c c???p nh???t = price ,
              // userId n?? ?????u gi?? th??nh c??ng nh??ng gi?? c???a n?? v???n ch??a = gi?? cao nh???t c???a tg kh??c n??n n?? ko gi??? gi??.
              sendUpdate([sellerEmail, userEmail], productEmail);
              //TODO need to reload page
              return res.json({
                status: 'info',
                msg: 'Bid Successfully BUT your price is not high enough to beat a highest bidder',
              });
            } else {
              return res.json({
                status: 'error',
                msg: 'Error!!!',
              });
            }
          }
        }
      }
    }
  }
  if (content === 'like') {
    productModel.addFavoriteList(userId, req.body.proId);

    return res.json({
      status: 'success',
      msg: 'Add product to favorite successfully!!!',
    });
  }
  if (content === 'unlike') {
    productModel.removeFavoriteList(userId, req.body.proId);

    return res.json({
      status: 'success',
      msg: 'Remove product from favorite successfully!!!',
    });
  }
});

homeRouter.get('/search', async (req, res) => {
  const keyword = req.query.keyword;
  const catId = req.query.category ? +req.query.category : 0;
  let parentCat = false;
  const category = await findCategory(catId);
  if (category?.parentId === null) parentCat = true;

  const sortby = req.query.sortby;
  if (keyword) {
    let list = [];

    let amountPro: any = await productModel.countProductByKeyword(
      keyword,
      catId,
      parentCat
    );
    amountPro = amountPro.length;

    const limitpage = 5;

    let numPage = Math.floor(amountPro / limitpage);
    if (amountPro % limitpage != 0) numPage++;

    let page: any = req.query.page || 1;
    let offset = (page - 1) * limitpage;
    let listofPage = [];

    if (sortby === 'date') {
      list = await productModel.findProductByExpiredDate(
        keyword,
        offset,
        limitpage,
        catId,
        parentCat
      );
    } else if (sortby === 'price') {
      list = await productModel.findProductByPrice(
        keyword,
        offset,
        limitpage,
        catId,
        parentCat
      );
    } else
      list = await productModel.findProductByKeyword(
        keyword,
        offset,
        limitpage,
        catId,
        parentCat
      );

    // parent categories
    // if (list[0] === undefined) {
    //   const category = await findParentCategoryByKeyword(keyword);
    //   if (category[0] !== undefined) {
    //     amountPro = await productModel.countProductByKeywordAndParentCat(
    //       keyword,
    //       category[0].catId
    //     );
    //     amountPro = amountPro.length;

    //     numPage = Math.floor(amountPro / limitpage);
    //     if (amountPro % limitpage != 0) numPage++;

    //     offset = (page - 1) * limitpage;

    //     if (sortby === 'date') {
    //       list = await productModel.findProductByExpiredDateAndParentCat(
    //         keyword,
    //         offset,
    //         limitpage,
    //         category[0].catId
    //       );
    //     } else if (sortby === 'price') {
    //       list = await productModel.findProductByPriceAndParentCat(
    //         keyword,
    //         offset,
    //         limitpage,
    //         category[0].catId
    //       );
    //     } else {
    //       list = await productModel.findProductByKeywordAndParentCat(
    //         keyword,
    //         category[0].catId,
    //         offset,
    //         limitpage
    //       );
    //     }
    //   }
    // }

    const userId = res.locals.user ? res.locals.user.userId : 0;
    if (userId != 0) {
      const listFavorite = await bidderModel.getFavoriteList(userId);

      const FavoriteProduct = [];
      for (let i = 0; i < listFavorite.length; i++) {
        FavoriteProduct.push({
          proId: listFavorite[i].proId,
        });
      }

      for (let i = 0; i < list.length; i++) {
        list[i].FavoriteProduct = FavoriteProduct;
      }
    }
    list.forEach((element: any) => {
      if (element.firstName != null && element.lastName != null) {
        element.bidderName = element.firstName + ' ' + element.lastName;
      } else element.bidderName = '';
    });
    for (let i = 1; i <= numPage; i++) {
      listofPage.push({
        value: i,
        isCurrent: +page === i,
      });
    }
    res.render('search', {
      pages: listofPage,
      listProductByKeyword: list,
      empty: list.length === 0,
      keyword: keyword,
      numberOfProducts: amountPro,
      sortByDate: sortby === 'date',
      sortByPrice: sortby === 'price',
      prev: +page - 1 > 0 ? +page - 1 : 1,
      next: +page + 1 <= listofPage.length ? +page + 1 : listofPage.length,
    });
  }
});

export default homeRouter;
