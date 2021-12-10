import { Router } from 'express';
const bidderRouter = Router();

bidderRouter.get('/info', function (req, res) {
  res.render('bidder/info');
});

export default bidderRouter;
