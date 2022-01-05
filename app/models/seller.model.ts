import db from '../config/database';
import moment from 'moment';

export default{
    async denyBidder(proId: any , bidderId: any){
        return db('deniedbidder').insert({proId: proId,bidderId: bidderId}).then();
    }
};