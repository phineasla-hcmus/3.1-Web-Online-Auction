import { Router } from 'express';
import sellerModel from '../models/seller.model';

const sellerRouter = Router();

//TODO PhineasLa
sellerRouter.get('/my-product', async function (req, res) {
  res.render('seller/myProduct', {
    layout: 'bidder',
    postedProduct: true,
  });
});

//TODO PhineasLa
sellerRouter.get('/add-product', async function (req, res) {
  res.render('seller/addProduct', {
    layout: 'bidder',
    uploadProduct: true,
  });
});

sellerRouter.post('/denyBidder', async function (req, res) {
  const proId = req.body.proId;
  const bidderId = req.body.bidderId;
});
export default sellerRouter;
