import { Router } from 'express';
import sellerModel from '../models/seller.model';
import auctionModel from '../models/auction.model';
import productModel from '../models/product.model';
import bidderModel from '../models/bidder.model';
import { updateUser } from '../models/user.model';
import { getSubcategoryList } from '../models/category.model';
import { upload } from '../config/multer';
import { addProductValidator } from '../validators/product.validator';
import cloudinary, { UploadApiResponse } from 'cloudinary';
import { validationResult } from 'express-validator';
import { bulkUpload, singleUpload } from '../utils/cloudinary';

const sellerRouter = Router();

sellerRouter.get('/my-product', async function (req, res) {
  const sellerId = res.locals.user.userId;
  const biddingList = await sellerModel.getBiddingProducts(sellerId);
  const winningList = await sellerModel.getWinningProducts(sellerId);
  winningList.forEach(async function (element) {
    const rated = await sellerModel.isAlreadyRated(sellerId, element.proId);
    if (rated) {
      element.rated = true;
    } else element.rated = false;
  });

  res.render('seller/myProduct', {
    layout: 'bidder',
    postedProduct: true,
    biddingList,
    winningList,
    emptyBidding: biddingList.length === 0,
    emptyWinning: winningList.length === 0,
  });
});

sellerRouter.post('/rateBidder', async function (req, res) {
  const opinion = req.body.opinion;
  let satisfied = false;
  if (opinion === 'satisfied') {
    satisfied = true;
  }
  const comment = req.body.commentBox;
  const bidder = +req.body.bidderid;
  const product = +req.body.proid;

  const rating = {
    userId: res.locals.user.userId,
    rateId: bidder,
    proId: product,
    ratingTime: new Date(),
    satisfied,
    comment,
  };

  await bidderModel.rate(rating);

  // update rating point for seller
  const ratingList = await bidderModel.getRatingList(bidder);
  const rateNums = ratingList.length;
  const satisfiedList = ratingList.filter((item) => item.satisfied === 1);
  const ratingPoint = Math.round((satisfiedList.length / rateNums) * 100) / 10;
  await updateUser(req.body.bidderid, { rating: ratingPoint });

  const url = req.headers.referer || '/';
  res.redirect(url);
});

sellerRouter.post('/cancelTransaction', async function (req, res) {
  const proId = req.body.proId;
  const bidderId = req.body.bidderId;
  await sellerModel.cancelTransaction(proId);
  const rating = {
    userId: res.locals.user.userId,
    rateId: bidderId,
    proId,
    ratingTime: new Date(),
    satisfied: false,
    comment: 'The winner does not pay',
  };
  await bidderModel.rate(rating);

  const url = req.headers.referer || '/';
  res.redirect(url);
});

//TODO PhineasLa
sellerRouter.get('/add-product', async function (req, res) {
  const listSubCategory = await getSubcategoryList();
  res.render('seller/addProduct', {
    layout: 'bidder',
    uploadProduct: true,
    listSubCategory: listSubCategory,
  });
});

sellerRouter.post(
  '/add-product',
  upload.array('images'),
  ...addProductValidator,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json(errors.array());
    }
    // Required fields
    const {
      name,
      category,
      basePrice,
      stepPrice,
      description,
      timeNum,
      timeType,
    } = req.body;

    const userId = req.user?.userId;

    // Optional fields
    const buyNowPrice = req.body.buyNowPrice || null;
    const isAllow = req.body.isAllow ? true : false;
    const isAuto = req.body.isAuto ? true : false;

    const expiredDate = new Date();
    const hour = expiredDate.getHours();
    const date = expiredDate.getDate();
    const month = expiredDate.getMonth();
    switch (timeType) {
      case 'hour':
        expiredDate.setHours(hour + timeNum);
        break;
      case 'day':
        expiredDate.setDate(date + timeNum);
        break;
      case 'week':
        expiredDate.setDate(date + timeNum * 7);
        break;
      case 'month':
        expiredDate.setMonth(month + timeNum);
        break;
      default:
        break;
    }

    const files = req.files as Express.Multer.File[];
    const buffers = files.map((file) => file.buffer);

    // const uploadResponse = await Promise.all(
    //   bulkUpload(buffers, { folder: '/product' })
    // );

    const uploadResponse = ['a', 'b'];

    const productId = await productModel.addProduct({
      proName: name,
      sellerId: userId,
      catId: category,
      basePrice,
      stepPrice,
      description,
      expiredDate,
      buyNowPrice,
      isAllowRating: isAllow,
      isExtendLimit: isAuto,
      thumbnailId: uploadResponse[0],
    });

    // const productId = await productModel.addProduct({
    //   proName: name,
    //   sellerId: userId,
    //   catId: category,
    //   basePrice,
    //   stepPrice,
    //   description,
    //   expiredDate,
    //   buyNowPrice,
    //   isAllowRating: isAllow,
    //   isExtendLimit: isAuto,
    //   thumbnailId: uploadResponse[0].public_id,
    // });

    // await productModel.addProductImage(productId, uploadResponse);

    res.redirect('/seller/add-product');
  }
);
sellerRouter.post(`/add-description`, async function (req, res) {
  const proId = req.body.proId;
  const description = req.body.description;
  const list = await productModel.findProductbyId(proId);

  list[0].description =
    list[0].description +
    '<hr>' +
    '<div>' +
    new Date() +
    '</div>' +
    description;
  sellerModel.addDescription(proId, list[0].description);

  const url = req.headers.referer || '/';
  res.redirect(url);
});

sellerRouter.post('/denyBidder', async function (req, res) {
  const proId = req.body.proId;
  const bidderId = req.body.bidderId;
  const stepPrice = req.body.stepPrice;
  const url = req.headers.referer || '/';
  const maxPriceOfUserInHistory =
    await auctionModel.findMaxPriceOfUserInHistory(proId, bidderId);

  const productDetail = await productModel.findProductbyId(proId);
  const basePrice = productDetail[0].basePrice;
  const highestBidder = productDetail[0].bidderId;

  if (highestBidder != bidderId) {
    sellerModel.denyBidder(
      proId,
      bidderId,
      maxPriceOfUserInHistory[0].auctionPrice
    );
    const url = req.headers.referer || '/';
    res.redirect(url);
  } else {
    const highestUserInHistoryList = await auctionModel.findMaxPriceInHistory(
      proId,
      bidderId
    );

    const highestUserHistory = highestUserInHistoryList[0]
      ? highestUserInHistoryList[0].bidderId
      : 0;
    const secondHighestUserHistory = highestUserInHistoryList[1]
      ? highestUserInHistoryList[1].bidderId
      : 0;

    if (highestUserHistory != highestBidder && highestUserHistory != 0) {
      //TODO Phineas Mail
      //Tới:
      //bidderId : là nó bị từ chối đấu giá với sản phẩm (proId) , sẽ được không được đấu giá nữa.
      sellerModel.denyHighestBidder(
        proId,
        bidderId,
        highestUserInHistoryList[0].auctionPrice,
        highestUserHistory
      );

      res.redirect(url);
    } else {
      if (secondHighestUserHistory != 0) {
        //TODO Phineas Mail
        //Tới:
        //bidderId : là nó bị từ chối đấu giá với sản phẩm (proId) và nó không còn là người giữ giá và sẽ được không được đấu giá nữa.
        sellerModel.denyHighestBidder(
          proId,
          bidderId,
          highestUserInHistoryList[1].auctionPrice,
          secondHighestUserHistory
        );

        res.redirect(url);
      } else {
        console.log(basePrice);
        //TODO Phineas Mail
        //Tới:
        //bidderId : là nó bị từ chối đấu giá với sản phẩm (proId) và nó không còn là người giữ giá và sẽ được không được đấu giá nữa.
        sellerModel.denyHighestBidder(proId, bidderId, basePrice, 0);

        res.redirect(url);
      }
    }
  }

  // const getHighestBidder = await auctionModel.findMaxPrice(proId);
  // const highestUser = getHighestBidder[0].userId;
  // const secondHighestUser = getHighestBidder[1]
  //   ? getHighestBidder[1].userId
  //   : 0;

  // if (bidderId == highestUser) {
  // const highestUserInHistoryList = await auctionModel.findMaxPriceInHistory(
  //   proId

  // const highestUserHistory = highestUserInHistoryList[0].bidderId;

  //   const secondhighestUserHistory = highestUserInHistoryList[1]
  //     ? highestUserInHistoryList[1].userId
  //     : 0;

  //   console.log(highestUser);
  //   console.log(highestUserHistory)
  //   if (highestUser === highestUserHistory) {
  //     console.log("vô if 2");
  //     //(remove history list)
  //     sellerModel.denyHighestBidderOnHighestHistory(
  //       proId,
  //       bidderId,
  //       highestUserInHistoryList[0].auctionPrice,
  //       secondhighestUserHistory,
  //       highestUserInHistoryList[1]
  //         ? highestUserInHistoryList[1].auctionPrice
  //         : highestUserInHistoryList[0].auctionPrice - stepPrice
  //     );

  //   }
  // }
});
export default sellerRouter;
