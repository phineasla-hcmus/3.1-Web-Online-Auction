import db from '../config/database';

interface ProductInsert {
  proId: number;
  proName: string;
  catId: number;
  sellerId: any;
  description: string;
  basePrice: number;
  stepPrice: number;
  expiredDate: Date;
  isAllowRating: boolean;
  buyNowPrice?: number;
}

export default {
  /**
   * Insert new user into `products` table
   * @param product
   * @returns product ID
   */
  async addProduct(product: ProductInsert) {
    return db('products')
      .insert({ ...product, currentPrice: product.basePrice })
      .then((value) => value[0]);
  },
  async findNearEndProducts() {
    return db('products')
      .where('expiredDate', '>=', new Date())
      .leftJoin('users', { 'products.bidderId': 'users.userId' })
      .orderBy('expiredDate', 'asc')
      .limit(5)
      .select('products.*', 'users.firstname', 'users.lastname')
      .where('isDisable', 1);
  },
  async findMostBidsProducts() {
    return db('products')
      .where('expiredDate', '>=', new Date())
      .leftJoin('users', { 'products.bidderId': 'users.userId' })
      .orderBy('numberOfBids', 'desc')
      .limit(5)
      .select('products.*', 'users.firstname', 'users.lastname')
      .where('isDisable', 1);
  },
  async findHighestPriceProducts() {
    return db('products')
      .where('expiredDate', '>=', new Date())
      .leftJoin('users', { 'products.bidderId': 'users.userId' })
      .orderBy('currentPrice', 'desc')
      .limit(5)
      .select('products.*', 'users.firstname', 'users.lastname')
      .where('isDisable', 1);
  },
  async getCurrentBidder(proId: number) {
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
    return db('products')
      .leftJoin('users', { 'products.bidderId': 'users.userId' })
      .where('proId', proId)
      .select('products.*', 'users.firstname', 'users.lastname');
  },
  async getSellerName(sellerId: any) {
    return db('users').where('userId', sellerId);
  },
  async findRelatedProduct(proID: any) {
    return db('products')
      .where('products.proid', proID)
      .where('products.isDisable', 1)
      .join('products AS relatedProduct', {
        'products.catId': 'relatedProduct.catId',
      })
      .where('relatedProduct.proId', '<>', proID)
      .andWhere('relatedProduct.expiredDate', '>=', new Date())
      .leftJoin('users', { 'relatedProduct.bidderId': 'users.userId' })
      .limit(5)
      .select('relatedProduct.*', 'users.firstname', 'users.lastname');
  },
  // perform full-text search
  async findProductByKeyword(
    keyword: string | any,
    offset: number,
    limit: number
  ) {
    // still looking for match against in knex
    const sql = `select p.*, users.firstname, users.lastname, c.catId from products p join categories c on p.catId = c.catId left join users on p.bidderId = users.userId where p.expiredDate >= sysdate() and (match(p.proName) against('${keyword}') or match(c.catName) against('${keyword}')) limit ${limit} offset ${offset}`;
    const raw = await db.raw(sql);
    return raw[0];
  },
  async findProductByKeywordAndParentCat(
    keyword: string | any,
    catId: number,
    offset: number,
    limit: number
  ) {
    // still looking for match against in knex
    const sql = `select * from categories left join products p on categories.catId = p.catId where parentId = ${catId} and p.expiredDate >= sysdate() or match(p.proName) against('${keyword}') limit ${limit} offset ${offset}`;
    const raw = await db.raw(sql);
    return raw[0];
  },
  // perform full-text search
  async findProductByExpiredDate(
    keyword: string | any,
    offset: number,
    limit: number
  ) {
    // still looking for match against in knex
    const sql = `select p.*, users.firstname, users.lastname from products p join categories c on p.catId = c.catId left join users on p.bidderId = users.userId where p.expiredDate >= sysdate() and (match(p.proName) against('${keyword}') or match(c.catName) against('${keyword}')) order by expiredDate DESC limit ${limit} offset ${offset}`;
    const raw = await db.raw(sql);
    return raw[0];
  },
  async findProductByExpiredDateAndParentCat(
    keyword: string | any,
    offset: number,
    limit: number,
    catId: number
  ) {
    // still looking for match against in knex
    const sql = `select * from categories left join products p on categories.catId = p.catId where parentId = ${catId} and p.expiredDate >= sysdate() or match(p.proName) against('${keyword}') order by expiredDate DESC limit ${limit} offset ${offset}`;
    const raw = await db.raw(sql);
    return raw[0];
  },
  // perform full-text search
  async findProductByPrice(
    keyword: string | any,
    offset: number,
    limit: number
  ) {
    // still looking for match against in knex
    const sql = `select p.*, users.firstname, users.lastname from products p join categories c on p.catId = c.catId left join users on p.bidderId = users.userId where p.expiredDate >= sysdate() and (match(p.proName) against('${keyword}') or match(c.catName) against('${keyword}')) order by currentPrice ASC limit ${limit} offset ${offset}`;
    const raw = await db.raw(sql);
    return raw[0];
  },
  async findProductByPriceAndParentCat(
    keyword: string | any,
    offset: number,
    limit: number,
    catId: number
  ) {
    // still looking for match against in knex
    const sql = `select * from categories left join products p on categories.catId = p.catId where parentId = ${catId} and p.expiredDate >= sysdate() or match(p.proName) against('${keyword}') order by currentPrice ASC limit ${limit} offset ${offset}`;
    const raw = await db.raw(sql);
    return raw[0];
  },
  async countProductByKeyword(keyword: string | any) {
    // still looking for match against in knex
    const sql = `select count(*) as amount from products p join categories c on p.catId = c.catId where p.expiredDate >= sysdate() and (match(p.proName) against('${keyword}') or match(c.catName) against('${keyword}'))`;
    const raw = await db.raw(sql);
    return raw[0][0].amount;
  },
  async countProductByKeywordAndParentCat(
    keyword: string | any,
    catId: number
  ) {
    // still looking for match against in knex
    const sql = `select count(*) as amount from categories left join products p on categories.catId = p.catId where parentId = ${catId} and p.expiredDate >= sysdate() or match(p.proName) against('${keyword}')`;
    const raw = await db.raw(sql);
    return raw[0][0].amount;
  },
  async getAuctionHistory(proId: any) {
    return db('auctionhistory')
      .join('products AS pro', { 'auctionhistory.proId': 'pro.proId' })
      .join('users as u', { 'pro.bidderId': 'u.userId' })
      .where('pro.proId', proId)
      .select('auctionhistory.*', 'u.firstname', 'u.lastname');
  },
  async getListBidder(proId: any) {
    return db('auctionhistory')
      .where('proId', proId)
      .where('isDenied', 1)
      .join('users', { 'auctionhistory.bidderId': 'users.userId' })
      .distinct('bidderId', 'users.firstname', 'users.lastname');
  },
  async checkIfLike_or_Unlike(bidderId: number, proId: any) {
    const list = await db('watchlist')
      .where('bidderId', bidderId)
      .where('proId', proId);
    return list;
  },
  async addFavoriteList(bidder: number, pro: number) {
    return db('watchlist').insert({ bidderId: `${bidder}`, proId: `${pro}` });
  },
  async removeFavoriteList(bidder: number, pro: number) {
    return db('watchlist').where('bidderId', bidder).where('proId', pro).del();
  },
  async getFavoriteList(bidderId: number) {
    return db('watchlist').where('bidderId', bidderId);
  },
  async getDeniedBidder(proId: number) {
    return db('deniedbidder').where({ proId: proId });
  },
};
