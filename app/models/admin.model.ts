import db from '../config/database';
import moment from 'moment';

export default {
  async getListUsers() {
    return db('users');
  },
  async getUpgradeRequests() {
    return db('upgradelist')
      .join('users as u', { 'upgradelist.bidderId': 'u.userId' })
      .where('status', -1)
      .select(
        'u.userId',
        'u.email',
        'u.firstname',
        'u.lastname',
        'u.rating',
        'upgradelist.registerTime'
      );
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
};
