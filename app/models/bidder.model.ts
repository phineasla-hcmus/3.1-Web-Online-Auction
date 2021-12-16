import db from '../config/database';
export default {
  async getFavoriteList(bidderId: number) {
    return db('watchlist')
      .where('watchlist.bidderId', bidderId)
      .join('products as p', { 'watchlist.proId': 'p.proId' })
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
};
