import { query, Router } from 'express';
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

homeRouter.get('/category', async (req,res)=>{
  const catid = req.query.catId || 0;
  const list = await productModel.findProductbyCategory(catid);
  
  res.render('category/viewCategory',{
    cateName: list.length===0 ? 0 : list[0].catName,
    listProductByCategory : list,
    empty :list.length===0
  });
  
});
export default homeRouter;
