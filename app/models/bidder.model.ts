import db from '../config/database';
import moment from 'moment';

export default {
  async getRatingList(userId: number) {
    return db('ratingHistory')
      .join('products as p', { 'ratingHistory.proId': 'p.proId' })
      .join('categories as cat', { 'p.catId': 'cat.catId' })
      .join('users as u', { 'p.sellerId': 'u.userId' })
      .where('ratingHistory.rateId', userId)
      .select(
        'ratingHistory.*',
        'p.proName',
        'u.firstname',
        'u.lastname',
        'cat.catName'
      );
  },
  async getFavoriteList(bidderId: number) {
    return db('watchlist')
      .join('products as p', { 'watchlist.proId': 'p.proId' })
      .leftJoin('users', { 'p.bidderId': 'users.userId' })
      .where('watchlist.bidderId', bidderId)
      .andWhere('p.expiredDate', '>=', new Date())
      .select('p.*', 'users.firstname', 'users.lastname');
  },
  async getWinningList(bidderId: number) {
    return db('products')
      .where('bidderId', bidderId)
      .andWhere('expiredDate', '<', new Date())
      .leftJoin('users as u', { 'products.sellerId': 'u.userId' });
  },
  async isAlreadyRated(bidderId: number, proId: number) {
    const ratingList = await db('ratingHistory')
      .where('userId', bidderId)
      .andWhere('proId', proId);
    if (ratingList.length === 0) return false;
    return true;
  },
  async isAlreadyUsed(email: string, userId: number) {
    const usedList = await db('users')
      .whereNot('userId', userId)
      .andWhere('email', email);
    if (usedList.length === 0) return false;
    return true;
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
  async rate(entity: any) {
    return db('ratingHistory').insert(entity);
  },
};
