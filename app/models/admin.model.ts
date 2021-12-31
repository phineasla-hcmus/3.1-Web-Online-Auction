import db from '../config/database';

export default {
  async getListUsers() {
    return db('users');
  },
};
