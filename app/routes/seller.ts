import { Router } from 'express';
import sellerModel from '../models/admin.model';

const sellerRouter = Router();

//TODO
sellerRouter.get('/viewPostedProduct', async function (req,res){
    res.render('seller/viewPostedProduct', {
        layout: 'bidder',
        postedProduct: true,
      });
});

//TODO 
sellerRouter.get('/uploadProduct', async function (req,res){
  res.render('seller/uploadProduct', {
      layout: 'bidder',
      uploadProduct: true,
    });
});
export default sellerRouter;
