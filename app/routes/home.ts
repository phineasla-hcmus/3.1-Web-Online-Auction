import { Router } from 'express';
import productModel from '../models/product.model';
import categoryModel from '../models/category.model';

const homeRouter = Router();

homeRouter.get('/', async (req, res) => {
  const nearEndList = await productModel.findNearEndProducts();
  const mostBidsList = await productModel.findMostBidsProducts();
  const highestPriceList = await productModel.findHighestPriceProducts();
  res.render('home', {
    nearEndList,
    mostBidsList,
    highestPriceList,
  });
});

export default homeRouter;
