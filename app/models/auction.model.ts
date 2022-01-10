import moment from 'moment';
import db from '../config/database';

export default {
  async findMaxPrice(proId: any) {
    return db('auctionAuto')
      .where('proId', '=', proId)
      .orderBy('maxPrice', 'DESC');
  },
  async findMaxPriceInHistory(proId: any, userId: any) {
    return db('auctionHistory')
      .where('proId', '=', proId)
      .where('bidderId', '<>', userId)
      .orderBy('auctionPrice', 'DESC')
      .where({ isDenied: 1 });
  },
  async findMaxPriceOfUserInHistory(proId: any, bidderId: any) {
    return db('auctionHistory')
      .where('proId', '=', proId)
      .where('bidderId', '=', bidderId)
      .orderBy('auctionPrice', 'DESC')
      .where({ isDenied: 1 });
  },

  bidProductwithPriceLarger(
    productId: any,
    uID: any,
    uName: any,
    mPrice: any,
    cPrice: any,
    numberofBids: any
  ) {
    const insertauctionAuto = {
      proId: productId,
      userId: uID,
      maxPrice: mPrice,
      time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    };

    const insertauctionHistory = {
      proId: productId,
      auctionTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      bidderId: uID,
      bidderName: uName,
      auctionPrice: cPrice,
    };

    db('auctionAuto')
      .insert(insertauctionAuto)
      .then(function (result) {
        db('auctionHistory')
          .insert(insertauctionHistory)
          .then(function (result) {
            db('products')
              .where({ proId: productId })
              .update({
                currentPrice: cPrice,
                bidderId: uID,
                numberOfBids: numberofBids,
              })
              .then(function (result) {});
          });
      });
      return true;
  },
  bidProductWithPriceSmaller(
    productId: any,
    uID: any,
    uName: any,
    mPrice: any,
    cPrice: any,
    numberofBids: any
  ) {
    const insertauctionAuto = {
      proId: productId,
      userId: uID,
      maxPrice: mPrice,
      time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    };

    const insertauctionHistory = {
      proId: productId,
      auctionTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      bidderId: uID,
      bidderName: uName,
      auctionPrice: cPrice,
    };

    db('auctionAuto')
      .insert(insertauctionAuto)
      .then(function (result) {
        db('auctionHistory')
          .insert(insertauctionHistory)
          .then(function (result) {
            db('products')
              .where({ proId: productId })
              .update({ currentPrice: cPrice, numberOfBids: numberofBids })
              .then(function (result) {});
          });
      });
      return true;
  },

  updateProductExpiredDate(proId: any, newExpiredDate: any) {
    return db('products')
      .where('proId', '=', proId)
      .update({ expiredDate: newExpiredDate })
      .then();
  },
  buyNowProduct(userId: number,proId: number , price: number){
    return db('products')
      .where('proId', '=', proId)
      .update({ expiredDate: new Date() , bidderId : userId, currentPrice:price})
      .then();
  }
};
