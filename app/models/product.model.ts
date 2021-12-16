import db from '../config/database';
export default {
  findNearEndProducts() {
    let date = new Date();
    return db('products')
      .where('expiredDate', '>=', date)
      .orderBy('expiredDate', 'asc')
      .limit(5);
  },
  findMostBidsProducts() {
    let date = new Date();
    return db('products')
      .where('expiredDate', '>=', date)
      .orderBy('numberOfBids', 'desc')
      .limit(5);
  },
  findHighestPriceProducts() {
    let date = new Date();
    return db('products')
      .where('expiredDate', '>=', date)
      .orderBy('currentPrice', 'desc')
      .limit(5);
  },
  getCurrentBidder(proId: number) {
    return db('products')
      .join('users', { 'products.bidderId': 'users.userId' })
      .where('products.proId', proId)
      .select('firstname');
  },
  async findProductbyCategory(catid: string | number | Readonly<any> | null) {
    return db('products')
      .join('categories AS cat', { 'products.catId': 'cat.catId' })
      .where('cat.catId', catid);
  },
  async countProductbyCategory(catid: string | number | Readonly<any> | null) {
    const list = await db('products')
      .join('categories AS cat', { 'products.catId': 'cat.catId' })
      .where('cat.catId', catid)
      .count({ amount: 'proId' });
    return list[0].amount;
  },
  async findProductbyCategoryPaging(
    catid: string | number | Readonly<any> | null,
    offset: number,
    limit: number
  ): Promise<any[]> {
    return db('products')
      .join('categories AS cat', { 'products.catId': 'cat.catId' })
      .where('cat.catId', catid)
      .limit(limit)
      .offset(offset);
  },
  async findProductbyId(proId: any) {
    return db('products').where('proId', proId);
  },
  async findRelatedProduct(proID: any) {
    return db('products')
      .join('products AS relatedProduct', {
        'products.catId': 'relatedProduct.catId',
      })
      .where('relatedProduct.proId', '<>', proID)
      .limit(5);
  },
  // perform full-text search
  async findProductByKeyword(
    keyword: string | any,
    offset: number,
    limit: number
  ) {
    // still looking for match against in knex
    const sql = `select * from products where match(proName) against('${keyword}') limit ${limit} offset ${offset}`;
    const raw = await db.raw(sql);
    return raw[0];
  },
  async countProductByKeyword(keyword: string | any) {
    // still looking for match against in knex
    const sql = `select count(*) from products where match(proName) against('${keyword}')`;
    console.log(sql);
    const raw = await db.raw(sql);
    return raw[0];
  },
  async getAuctionHistory(proId: any) {
    return db('auctionhistory')
      .join('products AS pro', { 'auctionhistory.proId': 'pro.proId' })
      .where('pro.proId', proId);
  },
};
