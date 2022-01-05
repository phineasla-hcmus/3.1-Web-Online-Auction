import { Router } from 'express';
import sellerModel from '../models/seller.model';

const sellerRouter = Router();

//TODO PhineasLa
sellerRouter.get('/viewPostedProduct', async function (req,res){
    res.render('seller/viewPostedProduct', {
        layout: 'bidder',
        postedProduct: true,
      });
});

//TODO PhineasLa
sellerRouter.get('/uploadProduct', async function (req,res){
  res.render('seller/uploadProduct', {
      layout: 'bidder',
      uploadProduct: true,
    });
});

sellerRouter.post('/denyBidder',async function(req,res){
  const proId = req.body.proId;
  const bidderId=req.body.bidderId;

  
})
export default sellerRouter;
