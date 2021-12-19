import db from '../config/database';
import moment from 'moment';

export default {
  async getFavoriteList(bidderId: number) {
    return db('watchlist')
      .join('products as p', { 'watchlist.proId': 'p.proId' })
      .where('watchlist.bidderId', bidderId)
      .andWhere('p.expiredDate', '>=', new Date())
      .select('p.*');
  },
  async getWinningList(bidderId: number) {
    return db('products')
      .where('bidderId', bidderId)
      .andWhere('expiredDate', '<', new Date());
  },
  async getCurrentBids(bidderId: number) {
    return db('auctionhistory')
      .join('products as pro', { 'auctionhistory.proId': 'pro.proId' })
      .where('auctionhistory.bidderId', bidderId)
      .andWhere('pro.expiredDate', '>=', new Date())
      .groupBy('auctionhistory.proId');
  },
  async upgradeToSeller(bidderId: number) {
    const upgradeRequest = {
      bidderId: bidderId,
      registerTime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      status: -1,
    };
    return db('upgradeList').insert(upgradeRequest);
  },
  async getBidderStatus(bidderId: number) {
    const result =
      db('upgradeList')
        .where('bidderId', bidderId)
        .select('upgradeList.status') || null;
    return result;
  },
};
