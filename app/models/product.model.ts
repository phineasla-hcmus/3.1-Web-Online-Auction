import { UploadApiResponse } from 'cloudinary';
import db from '../config/database';
import moment from 'moment';

interface ProductInsert {
  proName: string;
  catId: number;
  sellerId: any;
  description: string;
  basePrice: number;
  stepPrice: number;
  expiredDate: Date;
  isAllowRating: boolean;
  thumbnailId: string;
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
   * Insert new product into `products` table, if `active`, insert into `activeProducts`
   * @param product
   * @returns product ID
   */
  async addProduct(
    product: ProductInsert,
    options = { active: true } || undefined
  ) {
    return db('products')
      .insert({ ...product, currentPrice: product.basePrice })
      .then(async (res) => {
        const proId = res[0];
        return options.active
          ? db('activeProducts')
              .insert({ proId })
              .then((_) => proId)
          : proId;
      });
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
    return db('productImages').insert(pending);
  },

  /**
   * @param productId can be one or multiple product IDs
   * @return array of `{ secureUrl }`
   */
  async findThumbnail(productId: any[]): Promise<{ secureUrl: string }[]> {
    return db('productImages')
      .select('secureUrl')
      .join('products', { imgId: 'thumbnailId' })
      .whereIn('productImages.proId', productId);
  },

  /**
   * @param productId
   * @returns array of `{ secureUrl }`
   */
  async findProductImage(
    productId: string | number
  ): Promise<{ secureUrl: string }[]> {
    return db('productImages')
      .select('secureUrl')
      .where('proId', '=', productId);
  },
  async findNearEndProducts() {
    return db('products')
      .where('expiredDate', '>=', new Date())
      .leftJoin('users', { 'products.bidderId': 'users.userId' })
      .leftJoin('productImages', { 'products.thumbnailId': 'imgId' })
      .orderBy('expiredDate', 'desc')
      .limit(5)
      .select('products.*', 'users.firstName', 'users.lastName', 'secureUrl')
      .where('isDisable', 1);
  },

  async findMostBidsProducts() {
    return db('products')
      .where('expiredDate', '>=', new Date())
      .leftJoin('users', { 'products.bidderId': 'users.userId' })
      .leftJoin('productImages', { 'products.thumbnailId': 'imgId' })
      .orderBy('numberOfBids', 'desc')
      .limit(5)
      .select('products.*', 'users.firstName', 'users.lastName', 'secureUrl')
      .where('isDisable', 1);
  },
  async findHighestPriceProducts() {
    return db('products')
      .where('expiredDate', '>=', new Date())
      .leftJoin('users', { 'products.bidderId': 'users.userId' })
      .leftJoin('productImages', { 'products.thumbnailId': 'imgId' })
      .orderBy('currentPrice', 'desc')
      .limit(5)
      .select('products.*', 'users.firstName', 'users.lastName', 'secureUrl')
      .where('isDisable', 1);
  },
  async getCurrentBidder(proId: number) {
    return db('products')
      .join('users', { 'products.bidderId': 'users.userId' })
      .where('products.proId', proId)
      .select('firstName');
  },
  async findProductbyCategory(catid: string | number | Readonly<any> | null) {
    return db('products')
      .join('categories AS cat', { 'products.catId': 'cat.catId' })
      .leftJoin('productImages', { 'products.thumbnailId': 'imgId' })
      .where('cat.catId', catid)
      .andWhere('products.expiredDate', '>=', new Date())
      .andWhere('products.isDisable', 1);
  },
  async countProductbyParentCategory(
    catid: string | number | Readonly<any> | null
  ) {
    const list = await db('products')
      .join('categories AS cat', { 'products.catId': 'cat.catId' })
      .where('cat.parentId', catid)
      .andWhere('products.expiredDate', '>=', new Date())
      .andWhere('products.isDisable', 1)
      .count({ amount: 'proId' });
    return list[0].amount;
  },
  async countProductbyCategory(catid: string | number | Readonly<any> | null) {
    const list = await db('products')
      .join('categories AS cat', { 'products.catId': 'cat.catId' })
      .where('cat.catId', catid)
      .andWhere('products.expiredDate', '>=', new Date())
      .andWhere('products.isDisable', 1)
      .count({ amount: 'proId' });
    return list[0].amount;
  },
  async findProductbyParentCategoryPaging(
    catid: string | number | Readonly<any> | null,
    offset: number,
    limit: number
  ): Promise<any[]> {
    return db('products')
      .join('categories AS cat', { 'products.catId': 'cat.catId' })
      .where('cat.parentId', catid)
      .andWhere('products.expiredDate', '>=', new Date())
      .andWhere('products.isDisable', 1)
      .leftJoin('productImages', { 'products.thumbnailId': 'imgId' })
      .limit(limit)
      .offset(offset);
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
      .andWhere('products.isDisable', 1)
      .leftJoin('productImages', { 'products.thumbnailId': 'imgId' })
      .limit(limit)
      .offset(offset);
  },
  async findProductbyId(proId: any) {
    return db('products')
      .leftJoin('users', { 'products.bidderId': 'users.userId' })
      .leftJoin('productImages', {
        'products.thumbnailId': 'productImages.imgId',
      })
      .where('products.proId', proId)
      .select('products.*', 'users.firstName', 'users.lastName', 'secureUrl');
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
      .andWhere('products.isDisable', 1)
      .leftJoin('users', { 'relatedProduct.bidderId': 'users.userId' })
      .leftJoin('productImages', {
        'relatedProduct.thumbnailId': 'productImages.imgId',
      })
      .limit(5)
      .select(
        'relatedProduct.*',
        'users.firstName',
        'users.lastName',
        'secureUrl'
      );
  },
  async findExpiredProductInTime() {
    return db('activeProducts')
      .join('products', { 'activeProducts.proId': 'products.proId' })
      .leftJoin('productImages', { 'products.thumbnailId': 'imgId' })
      .where('products.expiredDate', '<', new Date());
  },
  async removeActiveProduct(proId: any) {
    return db('activeProducts').where('proId', '=', proId).del().then();
  },
  // perform full-text search
  async findProductByKeyword(
    keyword: string | any,
    offset: number,
    limit: number
  ) {
    return db('products')
      .leftJoin('productImages', {
        'products.thumbnailId': 'productImages.imgId',
      })
      .join('categories', {
        'products.catId': 'categories.catId',
      })
      .where(function () {
        this.where(db.raw('match(catName) against(?)', [`${keyword}`])).orWhere(
          db.raw('match(proName) against(?)', [`${keyword}`])
        );
      })
      .andWhere('products.expiredDate', '>=', new Date())
      .leftJoin('users', { 'products.bidderId': 'users.userId' })
      .limit(limit)
      .offset(offset)
      .select(
        'products.*',
        'users.firstName',
        'users.lastName',
        'categories.catId',
        'secureUrl'
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
      .leftJoin('productImages', {
        'products.thumbnailId': 'productImages.imgId',
      })
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
      .leftJoin('productImages', {
        'products.thumbnailId': 'productImages.imgId',
      })
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
        'users.firstName',
        'users.lastName',
        'categories.catId',
        'secureUrl'
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
      .leftJoin('productImages', {
        'products.thumbnailId': 'productImages.imgId',
      })
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
      .leftJoin('productImages', {
        'products.thumbnailId': 'productImages.imgId',
      })
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
        'users.firstName',
        'users.lastName',
        'categories.catId',
        'secureUrl'
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
      .leftJoin('productImages', {
        'products.thumbnailId': 'productImages.imgId',
      })
      .orWhere(db.raw('match(proName) against(?)', [`${keyword}`]))
      .orderBy('currentPrice', 'asc')
      .limit(limit)
      .offset(offset);
  },
  async countProductByKeyword(keyword: string | any) {
    return db('products')
      .join('categories', {
        'products.catId': 'categories.catId',
      })
      .where(function () {
        this.where(db.raw('match(catName) against(?)', [`${keyword}`])).orWhere(
          db.raw('match(proName) against(?)', [`${keyword}`])
        );
      })
      .andWhere('products.expiredDate', '>=', new Date());
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
    return db('auctionHistory')
      .join('products AS pro', { 'auctionHistory.proId': 'pro.proId' })
      .join('users as u', { 'pro.bidderId': 'u.userId' })
      .where('pro.proId', proId)
      .select('auctionHistory.*', 'u.firstName', 'u.lastName');
  },
  async getListBidder(proId: any) {
    return db('auctionHistory')
      .where('proId', proId)
      .where('isDenied', 1)
      .join('users', { 'auctionHistory.bidderId': 'users.userId' })
      .distinct('bidderId', 'users.firstName', 'users.lastName');
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
    return db('deniedBidder').where({ proId: proId });
  },
};
