import { Router } from 'express';
import productModel from '../models/product.model';

const bidderRouter = Router();

bidderRouter.get('/info', function (req, res) {
  res.render('bidder/info');
});

bidderRouter.get('/favorite', async function (req, res) {
  // render tạm thời
  const favoriteList = await productModel.findNearEndProducts();

  res.render('bidder/favorite', { favoriteList });
});

export default bidderRouter;
