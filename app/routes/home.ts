import { Router } from 'express';
import productModel from '../models/product.model';
import path from 'path';
import fs from 'fs';

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
  const limitpage = 5;

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
  const userId = res.locals.user ? res.locals.user.userId : 0;

  const detailedProduct = await productModel.findProductbyId(productID);

  const listRelatedProduct = await productModel.findRelatedProduct(productID);

  const auctionHistory = await productModel.getAuctionHistory(productID);

  const listFavorite = await productModel.checkIfLike_or_Unlike(
    userId,
    productID
  );

  //get favorite list
  const FavoriteProduct = [];
  for (let i = 0; i < listFavorite.length; i++) {
    FavoriteProduct.push({
      proId: listFavorite[i].proId,
    });
  }

  //get path to root
  let rootProject = path.join(__dirname, '../../');

  //count number of file in folder
  const filelength = fs.readdirSync(
    rootProject + `/public/images/product/${productID}/`
  ).length;

  //create a temp array to pass into hbs
  const numberofPic = [];
  for (let i = 1; i < filelength + 1; i++) {
    numberofPic.push({
      value: i,
    });
  }

  res.render('product/viewDetailProduct', {
    product: detailedProduct,
    listProduct: listRelatedProduct,
    auctionHistory,
    empty: auctionHistory.length === 0,
    amountPic: numberofPic,
    FavoriteProduct: FavoriteProduct,
  });
});

homeRouter.post('/product', async (req, res) => {
  const userId = res.locals.user ? res.locals.user.userId : 0;
  if (userId == 0) {
    res.render('auth/requireLogin');
  }
  const content = req.body.content;
  if (userId != null) {
    if (content === 'like') {
      productModel.addFavoriteList(userId, req.body.proId);
    }
    if (content === 'unlike') {
      productModel.removeFavoriteList(userId, req.body.proId);
    }
  }
});

homeRouter.get('/search', async (req, res) => {
  const keyword = req.query.keyword;
  if (keyword) {
    const amountPro: any = await productModel.countProductByKeyword(keyword);
    const limitpage = 6;

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
        isCurrent: +page === i,
      });
    }
    res.render('search', {
      pages: listofPage,
      listProductByKeyword: list,
      empty: list.length === 0,
      keyword: keyword,
      numberOfProducts: amountPro,
    });
  }
});

homeRouter.get(
  '/search/get-list-products-by-expired-date',
  async (req, res) => {
    const keyword = req.query.keyword;
    if (keyword) {
      const amountPro: any = await productModel.countProductByKeyword(keyword);
      const limitpage = 5;

      let numPage = Math.floor(amountPro / limitpage);
      if (amountPro % limitpage != 0) numPage++;

      const page: any = req.query.page || 1;
      const offset = (page - 1) * limitpage;
      const listofPage = [];

      const list = await productModel.findProductByExpiredDate(
        keyword,
        offset,
        limitpage
      );

      for (let i = 1; i <= numPage; i++) {
        listofPage.push({
          value: i,
          isCurrent: +page === i,
        });
      }

      const data = {
        list,
        user: res.locals.user,
        pages: listofPage,
      };
      res.json(data);
    }
  }
);

homeRouter.get('/search/get-list-products-by-price', async (req, res) => {
  const keyword = req.query.keyword;
  if (keyword) {
    const amountPro: any = await productModel.countProductByKeyword(keyword);
    const limitpage = 5;
    let numPage = Math.floor(amountPro / limitpage);
    if (amountPro % limitpage != 0) numPage++;
    const page: any = req.query.page || 1;
    const offset = (page - 1) * limitpage;
    const listofPage = [];
    const list = await productModel.findProductByPrice(
      keyword,
      offset,
      limitpage
    );

    for (let i = 1; i <= numPage; i++) {
      listofPage.push({
        value: i,
        isCurrent: +page === i,
      });
    }
    const data = {
      list,
      user: res.locals.user,
    };
    res.json(data);
  }
});
export default homeRouter;
