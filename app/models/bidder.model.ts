import db from '../config/database';
export default {
  async getFavoriteList(bidderId: number) {
    return db('watchlist')
      .where('watchlist.bidderId', bidderId)
      .join('products as p', 'watchlist.proId', 'p.proId')
      .select('p.*');
  },
  async getWinningList(bidderId: number) {
    return db('watchlist')
      .where('bidderId', bidderId)
      .join('products as p', 'watchlist.proId', 'p.proId')
      .select('p.*');
  },
};
