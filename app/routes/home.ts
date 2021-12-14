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

homeRouter.get('/category', async (req, res) => {
  const catid = req.query.catId || 0;

  const amountPro: any = await productModel.countProductbyCategory(catid);
  const limitpage = 3;

  let numPage = Math.floor(amountPro / limitpage);
  if (amountPro % limitpage != 0) numPage++;

  const page: any = req.query.page || 1;
  const offset = (page - 1) * limitpage;
  const list = await productModel.findProductbyCategoryPaging(
    catid,
    offset,
    limitpage
  );

  const listofPage = [];
  for (let i = 1; i <= numPage; i++) {
    listofPage.push({
      value: i,
      cateId: list.length === 0 ? 0 : list[0].catId,
      isCurrent: +page === i,
    });
  }

  res.render('category/viewCategory', {
    pages: listofPage,
    cateName: list.length === 0 ? 0 : list[0].catName,
    listProductByCategory: list,
    empty: list.length === 0,
  });
});

homeRouter.get('/product', async (req, res) => {
  const productID = req.query.proId || 0;

  const detailedProduct = await productModel.findProductbyId(productID);

  const listRelatedProduct = await productModel.findRelatedProduct(productID);

  res.render('product/viewDetailProduct', {
    product: detailedProduct,
    listProduct: listRelatedProduct,
  });
});

homeRouter.get('/search', async (req, res) => {
  const keyword = req.query.keyword;
  if (keyword) {
    const amountPro: any = await productModel.countProductByKeyword(keyword);
    const limitpage = 3;

    let numPage = Math.floor(amountPro / limitpage);
    if (amountPro % limitpage != 0) numPage++;

    const page: any = req.query.page || 1;
    const offset = (page - 1) * limitpage;
    const listofPage = [];

    const list = await productModel.findProductByKeyword(
      keyword,
      offset,
      limitpage
    );
    for (let i = 1; i <= numPage; i++) {
      listofPage.push({
        value: i,
        cateId: list.length === 0 ? 0 : list[0].catId,
        isCurrent: +page === i,
      });
    }
    res.render('search', {
      pages: listofPage,
      catName: list.length === 0 ? 0 : list[0].catName,
      listProductByKeyword: list,
      empty: list.length === 0,
    });
  }
});

export default homeRouter;
