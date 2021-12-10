import { Router } from 'express';
import productModel from '../models/product.model';
import categoryModel from '../models/category.model';

const homeRouter = Router();

homeRouter.get('/', async (req, res) => {
  const nearEndList = await productModel.findNearEndProducts();
  const mostBidsList = await productModel.findMostBidsProducts();
  const highestPriceList = await productModel.findHighestPriceProducts();
  // load categories
  res.locals.parentCategories = await categoryModel.findParentCategory();
  res.locals.childCategories = await categoryModel.findChildCategory();
  res.render('home', {
    nearEndList,
    mostBidsList,
    highestPriceList,
  });
});

export default homeRouter;
