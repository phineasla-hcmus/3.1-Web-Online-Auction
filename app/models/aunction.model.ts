import db from '../config/database';
export default{
    findMaxPrice(proId : any) {
        return db('aunctionauto')
          .where('proId', '=', proId)
          .max('maxPrice');
      },
};
