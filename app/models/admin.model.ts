import db from '../config/database';
import moment from 'moment';

export default {
  async getListUsers() {
    return db('users').where('roleId', 2).orWhere('roleId', 3);
  },
  async getListUsersByPaging(offset: number, limit: number) {
    return db('users')
      .where('roleId', 2)
      .orWhere('roleId', 3)
      .limit(limit)
      .offset(offset);
  },
  async getUpgradeRequests() {
    return db('upgradelist')
      .join('users as u', { 'upgradelist.bidderId': 'u.userId' })
      .where('status', -1)
      .select(
        'u.userId',
        'u.email',
        'u.roleId',
        'u.firstname',
        'u.lastname',
        'u.rating',
        'upgradelist.registerTime'
      );
  },
  async getUpgradeRequestsByPaging(offset: number, limit: number) {
    return db('upgradelist')
      .join('users as u', { 'upgradelist.bidderId': 'u.userId' })
      .where('status', -1)
      .select(
        'u.userId',
        'u.email',
        'u.roleId',
        'u.firstname',
        'u.lastname',
        'u.rating',
        'upgradelist.registerTime'
      )
      .limit(limit)
      .offset(offset);
  },
  async approveRequest(bidderId: number) {
    return db('upgradelist')
      .where('bidderId', bidderId)
      .andWhere('status', -1)
      .update({
        status: 1,
        expiredDate: moment().add(7, 'd').toDate(),
      });
  },
  async declineRequest(bidderId: number) {
    return db('upgradelist')
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
  async addRootCategory(cateName: any){
    return db('categories').insert({catName: cateName,parentId: null}).then();
  },
  async checkRootCategoryHaveChildren(cateId: any){
    return db('categories').where('parentId',cateId);
  },
  async deleteRootCategory(cateId: any){
    return db('categories').where("catId",cateId).del();
  },
  async addChildCategory(cateName: any, parentCatId: any){
    return db('categories').insert({catName: cateName,parentId: parentCatId}).then();
  },
  async editCategory(cateName: any, cateId: any){
    return db('categories').where("catId",cateId).update({catName: cateName}).then();
  }
};
