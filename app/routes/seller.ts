import { Router } from 'express';
import sellerModel from '../models/seller.model';
import aunctionModel from '../models/aunction.model';
import productModel from '../models/product.model';
import { getSubcategoryList } from '../models/category.model';
import { upload } from '../config/multer';
import { addProductValidator } from '../validators/product.validator';

const sellerRouter = Router();

//TODO PhineasLa
sellerRouter.get('/my-product', async function (req, res) {
  res.render('seller/myProduct', {
    layout: 'bidder',
    postedProduct: true,
  });
});

//TODO PhineasLa
sellerRouter.get('/add-product', async function (req, res) {
  const listSubCategory = await getSubcategoryList();
  console.log(listSubCategory);
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
    console.log(req.files);
    console.log(req.body);
  }
);
sellerRouter.post(`/add-description`, async function (req,res){

  const proId = req.body.proId;
  const fullDes= req.body.description;
  const list= await productModel.findProductbyId(proId);


  list[0].fullDes = list[0].fullDes+"<hr>" +"<div>" + new Date() + "</div>" + fullDes;
  sellerModel.addDescription(proId,list[0].fullDes);

  const url = req.headers.referer || '/';
  res.redirect(url);

});

sellerRouter.post('/denyBidder', async function (req, res) {
  const proId = req.body.proId;
  const bidderId = req.body.bidderId;
  const stepPrice = req.body.stepPrice;

  const maxPriceOfUserInHistory =
    await aunctionModel.findMaxPriceOfUserInHistory(proId, bidderId);

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
    const highestUserInHistoryList = await aunctionModel.findMaxPriceInHistory(
      proId
    );
    const highestUserHistory = highestUserInHistoryList[0].bidderId;
    const secondHighestUserHistory = highestUserInHistoryList[1]
      ? highestUserInHistoryList[1].bidderId
      : 0;

    if (highestUserHistory != highestBidder) {
      //TODO Phineas Mail
      //Tới:
      //bidderId : là nó bị từ chối đấu giá với sản phẩm (proId) , sẽ được không được đấu giá nữa.
      sellerModel.denyHighestBidder(
        proId,
        bidderId,
        highestUserInHistoryList[0].auctionPrice,
        highestUserHistory
      );
      const url = req.headers.referer || '/';
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
        const url = req.headers.referer || '/';
        res.redirect(url);
      } else {
        //TODO Phineas Mail
        //Tới:
        //bidderId : là nó bị từ chối đấu giá với sản phẩm (proId) và nó không còn là người giữ giá và sẽ được không được đấu giá nữa.
        sellerModel.denyHighestBidder(proId, bidderId, basePrice, 0);
        const url = req.headers.referer || '/';
        res.redirect(url);
      }
    }
  }

  // const getHighestBidder = await aunctionModel.findMaxPrice(proId);
  // const highestUser = getHighestBidder[0].userId;
  // const secondHighestUser = getHighestBidder[1]
  //   ? getHighestBidder[1].userId
  //   : 0;

  // if (bidderId == highestUser) {
  // const highestUserInHistoryList = await aunctionModel.findMaxPriceInHistory(
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
