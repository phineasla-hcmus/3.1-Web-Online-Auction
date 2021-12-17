import { Router } from 'express';
import bidderModel from '../models/bidder.model';
import productModel from '../models/product.model';

const bidderRouter = Router();

bidderRouter.get('/info', function (req, res) {
  res.render('bidder/info', {
    layout: 'bidder',
  });
});

bidderRouter.get('/favorite', async function (req, res) {
  // 1 để render tạm thời, có login sửa sau
  const favoriteList = await bidderModel.getFavoriteList(1);
  res.render('bidder/favorite', { layout: 'bidder', favoriteList });
});

bidderRouter.get('/currentbids', async function (req, res) {
  // 1 để render tạm thời, có login sửa sau
  const currentBidsList = await bidderModel.getCurrentBids(1);
  console.log(currentBidsList);
  res.render('bidder/currentBid', { layout: 'bidder', currentBidsList });
});

bidderRouter.get('/rating', async function (req, res) {
  // 1 để render tạm thời, có login sửa sau
  res.render('bidder/rating', {
    layout: 'bidder',
  });
});

bidderRouter.get('/win', async function (req, res) {
  // 1 để render tạm thời, có login sửa sau
  const winningList = await bidderModel.getWinningList(1);
  res.render('bidder/win', { layout: 'bidder', winningList });
});

export default bidderRouter;
