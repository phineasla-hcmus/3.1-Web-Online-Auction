import { Router } from 'express';
import productModel from '../models/product.model';
import auctionModel from '../models/auction.model';
import bidderModel from '../models/bidder.model';
import { findUserById, getRatingUser } from '../models/user.model';
import path from 'path';
import fs from 'fs';
import { findParentCategoryByKeyword } from '../models/category.model';

const homeRouter = Router();

homeRouter.get('/', async (req, res) => {
  const userId = res.locals.user ? res.locals.user.userId : 0;
  const nearEndList = await productModel.findNearEndProducts();
  nearEndList.forEach((element) => {
    if (element.firstname != null && element.lastname != null) {
      element.bidderName = element.firstname + ' ' + element.lastname;
    } else element.bidderName = '';
  });

  const mostBidsList = await productModel.findMostBidsProducts();
  mostBidsList.forEach((element) => {
    if (element.firstname != null && element.lastname != null) {
      element.bidderName = element.firstname + ' ' + element.lastname;
    } else element.bidderName = '';
  });

  const highestPriceList = await productModel.findHighestPriceProducts();
  highestPriceList.forEach((element) => {
    if (element.firstname != null && element.lastname != null) {
      element.bidderName = element.firstname + ' ' + element.lastname;
    } else element.bidderName = '';
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
      prev: i - 1 == 0 ? i : i - 1,
      next: i + 1 > numPage ? i : i + 1,
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
  const listofDeniedBidder = await productModel.getDeniedBidder(
    productID as any
  );

  detailedProduct.forEach((element) => {
    if (element.firstname != null && element.lastname != null) {
      element.bidderName = element.firstname + ' ' + element.lastname;
    } else element.bidderName = '';
    element.userId = userId;
  });

  const sellerName = await productModel.getSellerName(
    detailedProduct[0].sellerId
  );

  detailedProduct.forEach((element) => {
    element.sellerName = sellerName[0].firstname + ' ' + sellerName[0].lastname;
  });

  const listRelatedProduct = await productModel.findRelatedProduct(productID);
  listRelatedProduct.forEach((element) => {
    if (element.firstname != null && element.lastname != null) {
      element.bidderName = element.firstname + ' ' + element.lastname;
    } else element.bidderName = '';
  });

  const auctionHistory = await productModel.getAuctionHistory(productID);

  const listBidder = await productModel.getListBidder(productID);

  listBidder.forEach((element) => {
    element.bidderName = element.firstname + ' ' + element.lastname;
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

  const { bidderRating } = (await findUserById(bidderId, ['rating']))?.rating;
  const { sellerRating } = (await findUserById(sellerId, ['rating']))?.rating;

  detailedProduct[0].bidderRating = bidderRating || 'x';
  detailedProduct[0].sellerRating = sellerRating || 'x';

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
    listBidder: listBidder,
    listofDeniedBidder: listofDeniedBidder,
  });
});

homeRouter.post('/product', async (req, res) => {
  const user = req.user;
  const content = req.body.content;
  // const userId = req.user ? res.locals.user.userId : 0;

  if (user) {
    const { userId, firstName, lastName } = user;
    const biddername = firstName + ' ' + lastName;
    if (content === 'Submit') {
      const proId = req.body.proId;
      const price = parseInt(req.body.price);
      const minimumPrice = parseInt(req.body.minimumPrice);
      const stepPrice = parseInt(req.body.stepPrice);

      const product = await productModel.findProductbyId(proId);

      const sellerId = product[0].sellerId;
      const numberofbids = product[0].numberOfBids + 1;

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
        const UsermaxPrice = await auctionModel.findMaxPrice(proId);

        if (UsermaxPrice.length === 0) {
          if (
            auctionModel.bidProductwithPriceLarger(
              proId,
              userId,
              biddername,
              price,
              minimumPrice,
              numberofbids
            ) === true
          )
            //TODO Phineas Mail
            //Tới :
            // seller là sản phẩm này(Proid) giá được cập nhật = minimumPrice ,
            // userId là đấu giá thành công sản phẩm này với giá = price

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
          const userwithMaxPrice = UsermaxPrice[0].bidderId;
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
            )
              //TODO Phineas Mail
              //Tới :
              // seller là sản phẩm này(Proid) giá được cập nhật = newPrice ,
              // userId là đấu giá thành công sản phẩm này với giá = price
              // userwithMaxPrice là sản phẩm này bạn không còn là người giữ giá cao nhất do có tg UserId đấu giá cao hơn

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
              auctionModel.bidProductWithPriceSmaller(
                proId,
                userId,
                biddername,
                price,
                price,
                numberofbids
              ) === true
            )
              //TODO Phineas Mail
              //Tới :
              // seller là sản phẩm này(Proid) giá được cập nhật = price ,
              // userId nó đấu giá thành công nhưng giá của nó vẫn chưa = giá cao nhất của tg khác nên nó ko giữ giá.

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
  const sortby = req.query.sortby;
  if (keyword) {
    let amountPro: any = await productModel.countProductByKeyword(keyword);
    const limitpage = 6;

    let numPage = Math.floor(amountPro / limitpage);
    if (amountPro % limitpage != 0) numPage++;

    let page: any = req.query.page || 1;
    let offset = (page - 1) * limitpage;
    let listofPage = [];

    let list = [];
    if (sortby === 'date') {
      list = await productModel.findProductByExpiredDate(
        keyword,
        offset,
        limitpage
      );
    } else if (sortby === 'price') {
      list = await productModel.findProductByPrice(keyword, offset, limitpage);
    } else
      list = await productModel.findProductByKeyword(
        keyword,
        offset,
        limitpage
      );

    // parent categories
    if (list[0] === undefined) {
      const category = await findParentCategoryByKeyword(keyword);
      amountPro = await productModel.countProductByKeywordAndParentCat(
        keyword,
        category[0].catId
      );
      numPage = Math.floor(amountPro / limitpage);
      if (amountPro % limitpage != 0) numPage++;

      offset = (page - 1) * limitpage;

      if (sortby === 'date') {
        list = await productModel.findProductByExpiredDateAndParentCat(
          keyword,
          offset,
          limitpage,
          category[0].catId
        );
      } else if (sortby === 'price') {
        list = await productModel.findProductByPriceAndParentCat(
          keyword,
          offset,
          limitpage,
          category[0].catId
        );
      } else {
        list = await productModel.findProductByKeywordAndParentCat(
          keyword,
          category[0].catId,
          offset,
          limitpage
        );
      }
    }

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
      if (element.firstname != null && element.lastname != null) {
        element.bidderName = element.firstname + ' ' + element.lastname;
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
      prev: +page - 1,
      next: +page + 1,
    });
  }
});

export default homeRouter;
