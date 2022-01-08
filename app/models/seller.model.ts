import db from '../config/database';

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
  //         db('auctionauto')
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
  async denyBidder(proId: any, bidderId: any, priceUpdate: any) {
    return db('deniedbidder')
      .insert({ proId: proId, bidderId: bidderId })
      .then(function (result) {
        db('auctionauto')
          .where({ proId: proId, userId: bidderId })
          .del()
          .then(function (result) {
            db('auctionhistory')
              .where({ proId: proId, bidderId: bidderId })
              .update({ isDenied: 0 })
              .then(function (result) {
                db('products')
                  .where({ proId: proId })
                  .update({ currentPrice: priceUpdate })
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
    console.log(secondHighestBidder);
    return db('deniedbidder')
      .insert({ proId: proId, bidderId: bidderId })
      .then(function (result) {
        db('auctionauto')
          .where({ proId: proId, userId: bidderId })
          .del()
          .then(function (result) {
            db('auctionhistory')
              .where({ proId: proId, bidderId: bidderId })
              .update({ isDenied: 0 })
              .then(function (result) {
                db('products')
                  .where({ proId: proId })
                  .update({
                    bidderId: secondHighestBidder,
                    currentPrice: priceUpdate,
                  })
                  .then();
              });
          });
      });
  },
  async addDescription(proId: any, description: any) {
    return db('products')
      .where('proId', proId)
      .update({ description: description })
      .then();
  },
  async getBiddingProducts(sellerId: number) {
    return db('products')
      .where('sellerId', sellerId)
      .andWhere('expiredDate', '>=', new Date())
      .leftJoin('productimages', { 'products.thumbnailId': 'imgId' });
  },
  async getWinningProducts(sellerId: number) {
    return db('products')
      .where('sellerId', sellerId)
      .andWhere('expiredDate', '<', new Date())
      .andWhereNot('bidderId', null)
      .leftJoin('productimages', { 'products.thumbnailId': 'imgId' });
  },
  async isAlreadyRated(sellerId: number, proId: number) {
    const ratingList = await db('ratingHistory')
      .where('userId', sellerId)
      .andWhere('proId', proId);
    if (ratingList.length === 0) return false;
    return true;
  },
  async cancelTransaction(proId: number) {
    return db('products').where('proId', proId).update({ bidderId: null });
  },
};
