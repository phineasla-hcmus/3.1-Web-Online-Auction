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
  findProductbyCategory(catid: string | number | Readonly<any> | null) {
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
  findProductbyCategoryPaging(
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
  findProductbyId(proId: any) {
    return db('products').where('proId', proId);
  },
  findRelatedProduct(proID: any) {
    return db('products')
      .join('products AS relatedProduct', {
        'products.catId': 'relatedProduct.catId',
      })
      .where('relatedProduct.proId', '<>', proID)
      .limit(5);
  },
};
