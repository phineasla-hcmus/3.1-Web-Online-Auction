import { Router } from 'express';
import bidderModel from '../models/bidder.model';

const bidderRouter = Router();

bidderRouter.get('/info', function (req, res) {
  res.render('bidder/info');
});

bidderRouter.get('/favorite', async function (req, res) {
  // 1 để render tạm thời, có login sửa sau
  const favoriteList = await bidderModel.getFavoriteList(1);
  res.render('bidder/favorite', { favoriteList });
});

export default bidderRouter;
