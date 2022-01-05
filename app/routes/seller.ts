import { Router } from 'express';
import sellerModel from '../models/seller.model';
import aunctionModel from '../models/aunction.model';
import productModel from '../models/product.model';

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
  res.render('seller/addProduct', {
    layout: 'bidder',
    uploadProduct: true,
  });
});

sellerRouter.post('/denyBidder', async function (req, res) {
  const proId = req.body.proId;
  const bidderId = req.body.bidderId;
  const stepPrice = req.body.stepPrice;

  const maxPriceOfUserInHistory = await  aunctionModel.findMaxPriceOfUserInHistory(proId,bidderId);

  
  const productDetail = await productModel.findProductbyId(proId);
  const basePrice=productDetail[0].basePrice;
  const highestBidder = productDetail[0].bidderId;

  if(highestBidder!= bidderId){
    sellerModel.denyBidder(proId,bidderId,maxPriceOfUserInHistory[0].auctionPrice);
    const url = req.headers.referer || '/';
    res.redirect(url);
  }
  else{
    const highestUserInHistoryList = await aunctionModel.findMaxPriceInHistory(
      proId);
    const highestUserHistory = highestUserInHistoryList[0].bidderId;
    const SecondhighestUserHistory =highestUserInHistoryList[1]?highestUserInHistoryList[1].bidderId:0;
    console.log(SecondhighestUserHistory);
    if(highestUserHistory!=highestBidder){
      
      sellerModel.denyHighestBidder(proId,bidderId,highestUserInHistoryList[0].auctionPrice,highestUserHistory);
      const url = req.headers.referer || '/';
      res.redirect(url);
    }
    else{
      if(SecondhighestUserHistory!=0){
        sellerModel.denyHighestBidder(proId,bidderId,highestUserInHistoryList[1].auctionPrice,SecondhighestUserHistory);
        const url = req.headers.referer || '/';
        res.redirect(url);
      }
      else{
        sellerModel.denyHighestBidder(proId,bidderId,basePrice,0);
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
