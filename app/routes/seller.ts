import { Router } from 'express';
import sellerModel from '../models/seller.model';
import auctionModel from '../models/auction.model';
import productModel from '../models/product.model';
import bidderModel from '../models/bidder.model';
import { findUserById, updateUser } from '../models/user.model';
import { getSubcategoryList } from '../models/category.model';
import { upload } from '../config/multer';
import { addProductValidator } from '../validators/product.validator';
import cloudinary, { UploadApiResponse } from 'cloudinary';
import { validationResult } from 'express-validator';
import { bulkUpload, singleUpload } from '../utils/cloudinary';
import { sendDenyBidder } from '../utils/email';
import moment from 'moment';

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
    element.winner = element.firstName + ' ' + element.lastName;
  });

  res.render('seller/myProduct', {
    layout: 'user',
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

sellerRouter.get('/add-product', async function (req, res) {
  const listSubCategory = await getSubcategoryList();
  res.render('seller/addProduct', {
    layout: 'user',
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

    const uploadResponse = await Promise.all(
      bulkUpload(buffers, { folder: '/product' })
    );

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
      thumbnailId: uploadResponse[0].public_id,
    });

    await productModel.addProductImage(productId, uploadResponse);

    // const uploadResponse = ['a', 'b'];

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
    //   thumbnailId: uploadResponse[0],
    // });

    // jQuery ajax cannot understand res.redirect
    // res.redirect('/seller/add-product');
    res
      .status(200)
      .send({ url: '/seller/add-product', msg: 'success', redirect: true });
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
    moment(new Date()).format('DD/MM/YYYY') +
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

    const bidderEmail = (await findUserById(bidderId, ['email']))!.email;
    const product = productDetail[0];
    // Mail chung cho c??? 3 tr?????ng h???p
    sendDenyBidder(bidderEmail, {
      id: proId,
      name: product.proName,
      price: product.currentPrice,
      thumbnailUrl: product.secureUrl,
    });

    if (highestUserHistory != highestBidder && highestUserHistory != 0) {
      //T???i:
      //bidderId : l?? n?? b??? t??? ch???i ?????u gi?? v???i s???n ph???m (proId), s??? ???????c kh??ng ???????c ?????u gi?? n???a.
      sellerModel.denyHighestBidder(
        proId,
        bidderId,
        highestUserInHistoryList[0].auctionPrice,
        highestUserHistory
      );
      res.redirect(url);
    } else {
      if (secondHighestUserHistory != 0) {
        //T???i:
        //bidderId : l?? n?? b??? t??? ch???i ?????u gi?? v???i s???n ph???m (proId) v?? n?? kh??ng c??n l?? ng?????i gi??? gi?? v?? s??? ???????c kh??ng ???????c ?????u gi?? n???a.
        sellerModel.denyHighestBidder(
          proId,
          bidderId,
          highestUserInHistoryList[1].auctionPrice,
          secondHighestUserHistory
        );
        res.redirect(url);
      } else {
        //T???i:
        //bidderId : l?? n?? b??? t??? ch???i ?????u gi?? v???i s???n ph???m (proId) v?? n?? kh??ng c??n l?? ng?????i gi??? gi?? v?? s??? ???????c kh??ng ???????c ?????u gi?? n???a.
        sellerModel.denyHighestBidder(proId, bidderId, basePrice, null);

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
  //     console.log("v?? if 2");
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
