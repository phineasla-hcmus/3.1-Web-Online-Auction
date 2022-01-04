import { Router } from 'express';
import productModel from '../models/product.model';
import aunctionModel from '../models/aunction.model';
import { getRatingUser } from '../models/user.model';
import path from 'path';
import fs from 'fs';
import { userInfo } from 'os';

const homeRouter = Router();

homeRouter.get('/', async (req, res) => {
  const userId = res.locals.user ? res.locals.user.userId : 0;
  const nearEndList = await productModel.findNearEndProducts();
  nearEndList.forEach((element) => {
    element.bidderName = element.firstname + ' ' + element.lastname;
  });

  const mostBidsList = await productModel.findMostBidsProducts();
  mostBidsList.forEach((element) => {
    element.bidderName = element.firstname + ' ' + element.lastname;
  });

  const highestPriceList = await productModel.findHighestPriceProducts();
  highestPriceList.forEach((element) => {
    element.bidderName = element.firstname + ' ' + element.lastname;
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
      mostBidsList[i].FavoriteProduct = FavoriteProduct;
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

  const amountPro: any = await productModel.countProductbyCategory(catid);
  const limitpage = 5;

  let numPage = Math.floor(amountPro / limitpage);
  if (amountPro % limitpage != 0) numPage++;

  const page: any = req.query.page || 1;
  const offset = (page - 1) * limitpage;
  const list = await productModel.findProductbyCategoryPaging(
    catid,
    offset,
    limitpage
  );

  const listofPage = [];
  for (let i = 1; i <= numPage; i++) {
    listofPage.push({
      value: i,
      cateId: list.length === 0 ? 0 : list[0].catId,
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
    cateName: list.length === 0 ? 0 : list[0].catName,
    listProductByCategory: list,
    empty: list.length === 0,
  });
});

homeRouter.get('/product', async (req, res) => {
  const productID = req.query.proId || 0;
  const userId = res.locals.user ? res.locals.user.userId : 0;
  const isUserId = res.locals.user ? 1 : 0;
  const detailedProduct = await productModel.findProductbyId(productID);

  const listRelatedProduct = await productModel.findRelatedProduct(productID);

  const auctionHistory = await productModel.getAuctionHistory(productID);

  const listFavorite = await productModel.checkIfLike_or_Unlike(
    userId,
    productID
  );

  if (userId != 0) {
    for (let i = 0; i < listRelatedProduct.length; i++) {
      listRelatedProduct[i].user = res.locals.user;
    }

    const listFavorite = await productModel.getFavoriteList(userId);

    const FavoriteProduct = [];
    for (let i = 0; i < listFavorite.length; i++) {
      FavoriteProduct.push({
        proId: listFavorite[i].proId,
      });
    }

    for (let i = 0; i < listRelatedProduct.length; i++) {
      listRelatedProduct[i].FavoriteProduct = FavoriteProduct;
    }
  }
  detailedProduct[0].minimumBidPrice =
    detailedProduct[0].currentPrice + detailedProduct[0].stepPrice;

  const bidderRating = await getRatingUser(detailedProduct[0].bidderId);
  const sellerRating = await getRatingUser(detailedProduct[0].sellerId);

  detailedProduct[0].bidderRating = bidderRating[0].rating
    ? bidderRating[0].rating
    : 'x';
  detailedProduct[0].sellerRating = sellerRating[0].rating
    ? bidderRating[0].rating
    : 'x';
  if (userId != 0) {
    const userRating = await getRatingUser(userId);
    if (userRating[0].rating === null) {
      if (detailedProduct[0].isAllowRating == '1')
        detailedProduct[0].userRating = 1;
      else detailedProduct[0].userRating = 3;
    } else {
      detailedProduct[0].userRating = userRating[0].rating >= 8 ? 1 : 2;
    }
  }
  //get favorite list
  const FavoriteProduct = [];
  for (let i = 0; i < listFavorite.length; i++) {
    FavoriteProduct.push({
      proId: listFavorite[i].proId,
    });
  }

  //get path to root
  let rootProject = path.join(__dirname, '../../');

  //count number of file in folder
  const filelength = fs.readdirSync(
    rootProject + `/public/images/product/${productID}/`
  ).length;

  //create a temp array to pass into hbs
  const numberofPic = [];
  for (let i = 1; i < filelength + 1; i++) {
    numberofPic.push({
      value: i,
    });
  }

  res.render('product/viewDetailProduct', {
    product: detailedProduct,
    listProduct: listRelatedProduct,
    auctionHistory,
    empty: auctionHistory.length === 0,
    amountPic: numberofPic,
    FavoriteProduct: FavoriteProduct,
    isUserId: isUserId,
  });
});

homeRouter.post('/product', async (req, res) => {
  const userId = res.locals.user ? res.locals.user.userId : 0;

  const content = req.body.content;

  if (userId != null) {
    const biddername =
      res.locals.user.firstName + ' ' + res.locals.user.lastName;
    if (content === 'Submit') {
      const proId = req.body.proId;
      const price = parseInt(req.body.price);
      const minimumPrice = parseInt(req.body.minimumPrice);
      const stepPrice = parseInt(req.body.stepPrice);

      // check ratio ( does it necessary ?)
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
        const UsermaxPrice = await aunctionModel.findMaxPrice(proId);
        if (UsermaxPrice.length === 0) {
          if (
            aunctionModel.bidProductwithPriceLarger(
              proId,
              userId,
              biddername,
              price,
              minimumPrice
            ) === true
          )
            //TODO need to reload page
            return res.json({
              status: 'success',
              msg: 'Bid Successfully!!!',
            });
          else {
            return res.json({
              status: 'error',
              msg: 'Error!!!',
            });
          }
        } else {
          const maxPrice: number = UsermaxPrice[0].maxPrice;
          if (maxPrice < price) {
            const newPrice = maxPrice + stepPrice;
            if (
              aunctionModel.bidProductwithPriceLarger(
                proId,
                userId,
                biddername,
                price,
                newPrice
              ) === true
            )
              //TODO need to reload page
              return res.json({
                status: 'success',
                msg: 'Bid Successfully!!!',
              });
            else {
              return res.json({
                status: 'error',
                msg: 'Error!!!',
              });
            }
          } else {
            if (
              aunctionModel.bidProductWithPriceSmaller(
                proId,
                userId,
                biddername,
                price,
                price
              ) === true
            )
              //TODO need to reload page
              return res.json({
                status: 'info',
                msg: 'Bid Successfully BUT your price is not high enough to beat a highest bidder',
              });
            else {
              return res.json({
                status: 'error',
                msg: 'Error!!!',
              });
            }
          }
        }
      }
    }
    if (content === 'like') {
      productModel.addFavoriteList(userId, req.body.proId);

      const url = req.headers.referer || '/';
      res.redirect(url);
    }
    if (content === 'unlike') {
      productModel.removeFavoriteList(userId, req.body.proId);
      const url = req.headers.referer || '/';
      res.redirect(url);
    }
  }
});

homeRouter.get('/search', async (req, res) => {
  const keyword = req.query.keyword;
  if (keyword) {
    const amountPro: any = await productModel.countProductByKeyword(keyword);
    const limitpage = 6;

    let numPage = Math.floor(amountPro / limitpage);
    if (amountPro % limitpage != 0) numPage++;

    const page: any = req.query.page || 1;
    const offset = (page - 1) * limitpage;
    const listofPage = [];

    const list = await productModel.findProductByKeyword(
      keyword,
      offset,
      limitpage
    );
    list.forEach((element: any) => {
      element.bidderName = element.firstname + ' ' + element.lastname;
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
    });
  }
});

homeRouter.get(
  '/search/get-list-products-by-expired-date',
  async (req, res) => {
    const keyword = req.query.keyword;
    if (keyword) {
      const amountPro: any = await productModel.countProductByKeyword(keyword);
      const limitpage = 5;

      let numPage = Math.floor(amountPro / limitpage);
      if (amountPro % limitpage != 0) numPage++;

      const page: any = req.query.page || 1;
      const offset = (page - 1) * limitpage;
      const listofPage = [];

      const list = await productModel.findProductByExpiredDate(
        keyword,
        offset,
        limitpage
      );

      for (let i = 1; i <= numPage; i++) {
        listofPage.push({
          value: i,
          isCurrent: +page === i,
        });
      }

      const data = {
        list,
        user: res.locals.user,
        pages: listofPage,
      };
      res.json(data);
    }
  }
);

homeRouter.get('/search/get-list-products-by-price', async (req, res) => {
  const keyword = req.query.keyword;
  if (keyword) {
    const amountPro: any = await productModel.countProductByKeyword(keyword);
    const limitpage = 5;
    let numPage = Math.floor(amountPro / limitpage);
    if (amountPro % limitpage != 0) numPage++;
    const page: any = req.query.page || 1;
    const offset = (page - 1) * limitpage;
    const listofPage = [];
    const list = await productModel.findProductByPrice(
      keyword,
      offset,
      limitpage
    );

    for (let i = 1; i <= numPage; i++) {
      listofPage.push({
        value: i,
        isCurrent: +page === i,
      });
    }
    const data = {
      list,
      user: res.locals.user,
    };
    res.json(data);
  }
});
export default homeRouter;
