import db from '../config/database';
export default {
  findNearEndProducts() {
    return db('products')
      .where('expiredDate', '>=', new Date())
      .orderBy('expiredDate', 'asc')
      .limit(5);
  },
  findMostBidsProducts() {
    return db('products')
      .where('expiredDate', '>=', new Date())
      .orderBy('numberOfBids', 'desc')
      .limit(5);
  },
  findHighestPriceProducts() {
    return db('products')
      .where('expiredDate', '>=', new Date())
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
      .where('cat.catId', catid)
      .andWhere('products.expiredDate', '>=', new Date());
  },
  async countProductbyCategory(catid: string | number | Readonly<any> | null) {
    const list = await db('products')
      .join('categories AS cat', { 'products.catId': 'cat.catId' })
      .where('cat.catId', catid)
      .andWhere('products.expiredDate', '>=', new Date())
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
      .andWhere('products.expiredDate', '>=', new Date())
      .limit(limit)
      .offset(offset);
  },
  async findProductbyId(proId: any) {
    return db('products').where('proId', proId);
  },
  async findRelatedProduct(proID: any) {
    return db('products')
      .where('products.proid', proID)
      .join('products AS relatedProduct', {
        'products.catId': 'relatedProduct.catId',
      })
      .where('relatedProduct.proId', '<>', proID)
      .andWhere('relatedProduct.expiredDate', '>=', new Date())
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
      .where('pro.proId', proId)
      .select('auctionhistory.*');
  },
  async checkIfLike_or_Unlike(bidderId:number,proId:any){
    return db('watchlist')
    .where('bidderId',bidderId).where('proId',proId);
  },
  async addFavoriteList(bidder: number, pro: number)
  {
    return db('watchlist').insert({bidderId: `${bidder}` ,proId: `${pro}`});

  },
  async removeFavoriteList(bidder: number, pro: number)
  {
    return db('watchlist').where("bidderId",bidder).where("proId",pro).del();
  }
};
