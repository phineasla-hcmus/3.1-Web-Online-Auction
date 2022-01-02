import moment from 'moment';
import db from '../config/database';
export default {
  async findMaxPrice(proId: any) {
    return db('aunctionauto')
      .where('proId', '=', proId)
      .orderBy('maxPrice', 'DESC');
  },

  bidProduct(productId: any, uID: any, mPrice: any, cPrice: any) {
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
      bidderName: "Tam Nguyen",
      auctionPrice: cPrice,
    };

    db('aunctionauto')
      .insert(insertAunctionAuto)
      .then(function (result) {
        console.log("insertAunctionAuto");
        db('auctionhistory')
          .insert(insertAunctionHistory)
          .then(function (result) {
            console.log("insertAunctionHistory");
            db('products')
              .where({ proId: productId })
              .update({ currentPrice: cPrice })
              .then(function (result) {
                console.log("update");
                
              });
          });
      });
      return true;
  },
};
