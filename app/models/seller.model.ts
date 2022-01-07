import db from '../config/database';
import moment from 'moment';

export default {
  //   async denyHighestBidderOnHighestHistory(
  //     proId: any,
  //     bidderId: any,
  //     highestMoneyInHistory: any,
  //     bidderSecond: any,
  //     secondPrice: any
  //   ) {
  //     return db('deniedbidder')
  //       .insert({ proId: proId, bidderId: bidderId })
  //       .then(function (result) {
  //         db('aunctionauto')
  //           .where({ proId: proId, bidderId: bidderId })
  //           .del()
  //           .then(function (result) {
  //             db('auctionhistory')
  //               .where({ proId: proId, auctionPrice: highestMoneyInHistory })
  //               .del()
  //               .then(function (result) {
  //                 db('products')
  //                   .where({ proId: proId })
  //                   .update({ currentPrice: secondPrice, bidderId: bidderSecond })
  //                   .then(function (result) {});
  //               });
  //           });
  //       });
  //   },
  async denyBidder(proId: any, bidderId: any,priceUpdate: any) {
    return db('deniedbidder')
      .insert({ proId: proId, bidderId: bidderId })
      .then(function (result) {
        db('aunctionauto')
          .where({ proId: proId, userId: bidderId })
          .del()
          .then(function (result) {
            db('auctionhistory')
              .where({ proId: proId, bidderId: bidderId })
              .update({ isDenied: 0 })
              .then(function (result){
                db('products')
                .where({ proId: proId})
                .update({ currentPrice:priceUpdate })
                .then();
              });
          });
      });
  },
  async denyHighestBidder(
    proId: any,
    bidderId: any,
    priceUpdate: any,
    secondHighestBidder: any
  ) {
    return db('deniedbidder')
      .insert({ proId: proId, bidderId: bidderId })
      .then(function (result) {
        db('aunctionauto')
          .where({ proId: proId, userId: bidderId })
          .del()
          .then(function (result) {
            db('auctionhistory')
              .where({ proId: proId, bidderId: bidderId })
              .update({ isDenied: 0 })
              .then(function (result){
                db('products')
                .where({ proId: proId})
                .update({ bidderId: secondHighestBidder, currentPrice:priceUpdate })
                .then();
              });
          });
      });
  },
  async addDescription(proId: any, fullDes: any){
    return db('products').where('proId',proId).update({fulldes: fullDes}).then();
  }
};
