import moment from 'moment';
import db from '../config/database';

export default {
  async findMaxPrice(proId: any) {
    return db('aunctionauto')
      .where('proId', '=', proId)
      .orderBy('maxPrice', 'DESC');
  },
  async findMaxPriceInHistory(proId: any){
    return db('auctionHistory')
    .where('proId', '=', proId)
    .orderBy('auctionPrice', 'DESC').where({isDenied:1});
  },
  async findMaxPriceOfUserInHistory(proId: any,bidderId: any){
    return db('auctionHistory')
    .where('proId', '=', proId)
    .where('bidderId', '=', bidderId)
    .orderBy('auctionPrice', 'DESC').where({isDenied:1});
  },

  bidProductwithPriceLarger(productId: any, uID: any,uName: any, mPrice: any, cPrice: any,numberofBids: any) {
    const insertAunctionAuto = {
      proId: productId,
      userId: uID,
      maxPrice: mPrice,
      time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    };

    const insertAunctionHistory = {
      proId: productId,
      auctionTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      bidderId: uID,
      bidderName: uName,
      auctionPrice: cPrice,
    };

    db('aunctionauto')
      .insert(insertAunctionAuto)
      .then(function (result) {
        db('auctionhistory')
          .insert(insertAunctionHistory)
          .then(function (result) {
            db('products')
              .where({ proId: productId })
              .update({ currentPrice: cPrice ,bidderId: uID,numberOfBids :numberofBids })
              .then(function (result) {
              });
          });
      });
      return true;
  },
  bidProductWithPriceSmaller(productId: any, uID: any,uName: any ,mPrice: any, cPrice: any,numberofBids: any){
    const insertAunctionAuto = {
      proId: productId,
      userId: uID,
      maxPrice: mPrice,
      time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    };

    const insertAunctionHistory = {
      proId: productId,
      auctionTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      bidderId: uID,
      bidderName: uName,
      auctionPrice: cPrice,
    };

    db('aunctionauto')
      .insert(insertAunctionAuto)
      .then(function (result) {
        db('auctionhistory')
          .insert(insertAunctionHistory)
          .then(function (result) {
            db('products')
              .where({ proId: productId })
              .update({ currentPrice: cPrice,numberOfBids: numberofBids})
              .then(function (result) {
              });
          });
      });
      return true;
  }
};
