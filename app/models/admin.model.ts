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
  async getUpgradeRequests() {
    return db('upgradeList')
      .join('users as u', { 'upgradeList.bidderId': 'u.userId' })
      .where('status', -1)
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
  async removeHighestBids(userId: number) {
    return db('products')
      .where('products.bidderId', userId)
      .join('auctionHistory', { 'products.proId': 'auctionHistory.proId' })
      .orderBy([{ column: 'auctionPrice', order: 'desc' }, 'auctionTime']);
  },
  // async updateHighestBidder(proId: number) {},
  async removeCurrentBids(userId: number) {
    return db('auctionHistory').where('bidderId', userId).del();
  },
  async endProducts(userId: number) {
    return db('products')
      .where('sellerId', userId)
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
