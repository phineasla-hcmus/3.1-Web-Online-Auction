import db from '../config/database';
import moment from 'moment';

export default {
  async getRatingList(bidderId: number) {
    return db('ratingHistory')
      .join('products as p', { 'ratingHistory.proId': 'p.proId' })
      .where('ratingHistory.bidderId', bidderId)
      .select('ratingHistory.*', 'p.proName');
  },
  async getFavoriteList(bidderId: number) {
    return db('watchlist')
      .join('products as p', { 'watchlist.proId': 'p.proId' })
      .join('users', { 'p.bidderId': 'users.userId' })
      .where('watchlist.bidderId', bidderId)
      .andWhere('p.expiredDate', '>=', new Date())
      .select('p.*', 'users.firstname', 'users.lastname');
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
      expiredDate: null,
    };
    return db('upgradeList').insert(upgradeRequest);
  },
  async getBidderStatus(bidderId: number) {
    const result = db('upgradeList')
      .where('bidderId', bidderId)
      .orderBy('registerTime', 'desc')
      .limit(1)
      .select('upgradeList.status');
    return result;
  },
};
