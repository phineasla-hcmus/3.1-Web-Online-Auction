import { UploadApiResponse } from 'cloudinary';
import db from '../config/database';

interface ProductInsert {
  proName: string;
  catId: number;
  sellerId: any;
  description: string;
  basePrice: number;
  stepPrice: number;
  expiredDate: Date;
  isAllowRating: boolean;
  isExtendLimit?: boolean;
  buyNowPrice?: number;
}

/**
 * Return object ready to be inserted into `productimage`
 * @param res
 */
function unpackCloudinaryResponse(productId: any, res: UploadApiResponse) {
  const { public_id, secure_url, ...extra } = res;
  return {
    proId: productId,
    imgId: public_id,
    secureUrl: secure_url,
    extra: JSON.stringify(extra),
  };
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

  async addProductImage(
    productId: any,
    cloudinaryRespond: UploadApiResponse | UploadApiResponse[]
  ) {
    let pending;
    if (Array.isArray(cloudinaryRespond)) {
      pending = cloudinaryRespond.map((res) =>
        unpackCloudinaryResponse(productId, res)
      );
    } else {
      pending = unpackCloudinaryResponse(productId, cloudinaryRespond);
    }
    return db('productimages').insert(pending);
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
    return db('products')
      .where('products.expiredDate', '>=', new Date())
      .join('categories', {
        'products.catId': 'categories.catId',
      })
      .where(db.raw('match(catName) against(?)', [`${keyword}`]))
      .orWhere(db.raw('match(proName) against(?)', [`${keyword}`]))
      .leftJoin('users', { 'products.bidderId': 'users.userId' })
      .limit(limit)
      .offset(offset)
      .select(
        'products.*',
        'users.firstname',
        'users.lastname',
        'categories.catId'
      );
  },
  async findProductByKeywordAndParentCat(
    keyword: string | any,
    catId: number,
    offset: number,
    limit: number
  ) {
    return db('categories')
      .where('categories.parentId', catId)
      .leftJoin('products', {
        'categories.catId': 'products.catId',
      })
      .where('products.expiredDate', '>=', new Date())
      .orWhere(db.raw('match(proName) against(?)', [`${keyword}`]))
      .limit(limit)
      .offset(offset);
  },
  async findProductByExpiredDate(
    keyword: string | any,
    offset: number,
    limit: number
  ) {
    return db('products')
      .where('products.expiredDate', '>=', new Date())
      .join('categories', {
        'products.catId': 'categories.catId',
      })
      .where(db.raw('match(catName) against(?)', [`${keyword}`]))
      .orWhere(db.raw('match(proName) against(?)', [`${keyword}`]))
      .leftJoin('users', { 'products.bidderId': 'users.userId' })
      .orderBy('expiredDate', 'desc')
      .limit(limit)
      .offset(offset)
      .select(
        'products.*',
        'users.firstname',
        'users.lastname',
        'categories.catId'
      );
  },
  async findProductByExpiredDateAndParentCat(
    keyword: string | any,
    offset: number,
    limit: number,
    catId: number
  ) {
    return db('categories')
      .where('categories.parentId', catId)
      .leftJoin('products', {
        'categories.catId': 'products.catId',
      })
      .where('products.expiredDate', '>=', new Date())
      .orWhere(db.raw('match(proName) against(?)', [`${keyword}`]))
      .orderBy('expiredDate', 'desc')
      .limit(limit)
      .offset(offset);
  },
  async findProductByPrice(
    keyword: string | any,
    offset: number,
    limit: number
  ) {
    return db('products')
      .where('products.expiredDate', '>=', new Date())
      .join('categories', {
        'products.catId': 'categories.catId',
      })
      .where(db.raw('match(catName) against(?)', [`${keyword}`]))
      .orWhere(db.raw('match(proName) against(?)', [`${keyword}`]))
      .leftJoin('users', { 'products.bidderId': 'users.userId' })
      .orderBy('currentPrice', 'asc')
      .limit(limit)
      .offset(offset)
      .select(
        'products.*',
        'users.firstname',
        'users.lastname',
        'categories.catId'
      );
  },
  async findProductByPriceAndParentCat(
    keyword: string | any,
    offset: number,
    limit: number,
    catId: number
  ) {
    return db('categories')
      .where('categories.parentId', catId)
      .leftJoin('products', {
        'categories.catId': 'products.catId',
      })
      .where('products.expiredDate', '>=', new Date())
      .orWhere(db.raw('match(proName) against(?)', [`${keyword}`]))
      .orderBy('currentPrice', 'asc')
      .limit(limit)
      .offset(offset);
  },
  async countProductByKeyword(keyword: string | any) {
    return db('products')
      .where('products.expiredDate', '>=', new Date())
      .join('categories', {
        'products.catId': 'categories.catId',
      })
      .where(db.raw('match(catName) against(?)', [`${keyword}`]))
      .orWhere(db.raw('match(proName) against(?)', [`${keyword}`]))
      .leftJoin('users', { 'products.bidderId': 'users.userId' })
      .select(
        'products.*',
        'users.firstname',
        'users.lastname',
        'categories.catId'
      );
  },
  async countProductByKeywordAndParentCat(
    keyword: string | any,
    catId: number
  ) {
    return db('categories')
      .where('categories.parentId', catId)
      .leftJoin('products', {
        'categories.catId': 'products.catId',
      })
      .where('products.expiredDate', '>=', new Date())
      .orWhere(db.raw('match(proName) against(?)', [`${keyword}`]));
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
