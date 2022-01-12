import db from '../config/database';
import moment from 'moment';

export default {
  async getListUsers() {
    return db('users').whereIn('roleId', [2, 3]).andWhere('banned', false);
  },
  async getListUsersByPaging(offset: number, limit: number) {
    return db('users')
      .whereIn('roleId', [2, 3])
      .andWhere('banned', false)
      .limit(limit)
      .offset(offset);
  },
  async getListProductsByPaging(offset: number, limit: number) {
    return db('products')
      .where('expiredDate', '>=', new Date())
      .andWhere('isDisable', 1)
      .limit(limit)
      .offset(offset)
      .leftJoin('productImages', { 'products.thumbnailId': 'imgId' });
  },
  async getListDisableByPaging(offset: number, limit: number) {
    return db('products')
      .where('expiredDate', '>=', new Date())
      .andWhere('isDisable', 0)
      .limit(limit)
      .offset(offset)
      .leftJoin('productImages', { 'products.thumbnailId': 'imgId' });
  },
  async getUpgradeRequests() {
    return db('upgradeList')
      .join('users as u', { 'upgradeList.bidderId': 'u.userId' })
      .where('status', -1)
      .where('banned',false)
      .select(
        'u.userId',
        'u.email',
        'u.roleId',
        'u.firstName',
        'u.lastName',
        'u.rating',
        'upgradeList.registerTime'
      );
  },
  async getUpgradeRequestsByPaging(offset: number, limit: number) {
    return db('upgradeList')
      .join('users as u', { 'upgradeList.bidderId': 'u.userId' })
      .where('status', -1)
      .where('banned',false)
      .select(
        'u.userId',
        'u.email',
        'u.roleId',
        'u.firstName',
        'u.lastName',
        'u.rating',
        'upgradeList.registerTime'
      )
      .limit(limit)
      .offset(offset);
  },
  async approveRequest(bidderId: number) {
    return db('upgradeList')
      .where('bidderId', bidderId)
      .andWhere('status', -1)
      .update({
        status: 1,
        expiredDate: moment().add(7, 'd').toDate(),
      });
  },
  async declineRequest(bidderId: number) {
    return db('upgradeList')
      .where('bidderId', bidderId)
      .andWhere('status', -1)
      .update({
        status: 0,
      });
  },
  async downgradeSeller(sellerId: number) {
    return db('users').where('userId', sellerId).update({
      roleId: 2,
    });
  },
  async deleteUser(userId: number) {
    return db('users').where('userId', userId).update({ banned: 1 });
  },
  async removeCurrentBids(userId: number) {
    return db('auctionHistory')
      .join('products', { 'auctionHistory.proId': 'products.proId' })
      .where('auctionHistory.bidderId', userId)
      .andWhere('products.expiredDate', '>=', new Date())
      .update({isDenied : 0}).then();
  },
  async removeAuctionAuto(userId: number) {
    return db('auctionAuto')
      .join('products', { 'auctionAuto.proId': 'products.proId' })
      .where('auctionAuto.userId', userId)
      .andWhere('products.expiredDate', '>=', new Date())
      .del();
  },
  async getHighestBid(proId: number) {
    return db('auctionAuto')
      .where('auctionAuto.proId', proId)
      .orderBy([{ column: 'maxPrice', order: 'desc' }, 'time'])
      .limit(1);
  },
  async getCurrentPrice(proId: number) {
    return db('auctionHistory')
      .where('auctionHistory.proId', proId)
      .where('isDenied','=',1)
      .orderBy([{ column: 'auctionPrice', order: 'desc' }, 'auctionTime'])
      .limit(1);
  },
  async getNumberOfBids(proId: number) {
    const result = await db('auctionHistory')
      .where('proId', proId)
      .count('*', { as: 'bids' });
    return result[0].bids;
  },
  async updateProduct(
    proId: number,
    currentPrice: number,
    numberOfBids: number,
    bidderId: number
  ) {
    return db('products')
      .where('proId', proId)
      .update({ currentPrice, numberOfBids, bidderId });
  },
  async endProducts(userId: number) {
    return db('products')
      .where('sellerId', userId)
      .andWhere('expiredDate', '>=', new Date())
      .update({ expiredDate: new Date() });
  },
  async removeActiveProducts(userId: number) {
    return db('activeProducts')
      .join('products', { 'activeProducts.proId': 'products.proId' })
      .where('sellerId', userId)
      .del();
  },
  async addRootCategory(cateName: any) {
    return db('categories')
      .insert({ catName: cateName, parentId: null })
      .then();
  },
  async checkRootCategoryHaveChildren(cateId: any) {
    return db('categories').where('parentId', cateId);
  },
  async deleteCategory(cateId: any) {
    return db('categories').where('catId', cateId).del();
  },
  async addChildCategory(cateName: any, parentCatId: any) {
    return db('categories')
      .insert({ catName: cateName, parentId: parentCatId })
      .then();
  },
  async editCategory(cateName: any, cateId: any) {
    return db('categories')
      .where('catId', cateId)
      .update({ catName: cateName })
      .then();
  },
  async checkCategoryHaveProduct(cateId: any) {
    return db('categories')
      .join('products', { 'categories.catId': 'products.catId' })
      .where('categories.catId', cateId);
  },
  async disableProduct(proId: any) {
    return db('products').where('proId', proId).update({ isDisable: 0 });
  },
  async getDisableProduct() {
    return db('products')
      .where('isDisable', 0)
      .leftJoin('productImages', { 'products.thumbnailId': 'imgId' })
      .select('products.*', 'secureUrl');
  },
  async getListProduct() {
    return db('products')
      .where('expiredDate', '>=', new Date())
      .andWhere('isDisable', 1)
      .leftJoin('productImages', { 'products.thumbnailId': 'imgId' });
  },
  async recoveryProduct(proId: any) {
    return db('products').where('proId', proId).update({ isDisable: 1 });
  },
  async deleteProduct(proId: any) {
    db('products')
      .where('proId', proId)
      .del()
      .then(function (result) {
        return db('productImages').where('proId', proId).del();
      });
  },
};
