import { Router } from 'express';
import bidderModel from '../models/bidder.model';
import { updateUser, updateUserName } from '../models/user.model';

const bidderRouter = Router();

bidderRouter.get('/info', async function (req, res) {
  let status = await bidderModel.getBidderStatus(res.locals.user.userId);

  let request = -2;
  if (status.length !== 0) {
    request = status[0].status;
  }

  res.render('bidder/info', {
    layout: 'bidder',
    info: true,
    request,
  });
});

bidderRouter.get('/changeEmail', async function (req, res) {
  const newEmail: any = req.query.email;
  const userId = res.locals.user.userId;
  const alreadyUsed = await bidderModel.isAlreadyUsed(newEmail, userId);
  if (alreadyUsed) res.json(alreadyUsed);
  else {
    await updateUser(userId, { email: newEmail });
    const url = req.headers.referer || '/';
    res.redirect(url);
  }
});

bidderRouter.post('/changeName', async function (req, res) {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const userId = res.locals.user.userId;
  await updateUserName(userId, firstname, lastname);
  const url = req.headers.referer || '/';
  res.redirect(url);
});

bidderRouter.post('/upgrade', async function (req, res) {
  const userId = req.body.userId;
  await bidderModel.upgradeToSeller(userId);
  const url = req.headers.referer || '/';
  res.redirect(url);
});

bidderRouter.get('/favorite', async function (req, res) {
  const userId = res.locals.user ? res.locals.user.userId : 0;
  const favoriteList = await bidderModel.getFavoriteList(
    res.locals.user.userId
  );

  favoriteList.forEach((element) => {
    if (element.firstname != null && element.lastname != null) {
      element.bidderName = element.firstname + ' ' + element.lastname;
    } else element.bidderName = '';
  });

  if (userId != 0) {
    const listFavorite = await bidderModel.getFavoriteList(userId);

    const FavoriteProduct = [];
    for (let i = 0; i < listFavorite.length; i++) {
      FavoriteProduct.push({
        proId: listFavorite[i].proId,
      });

      for (let i = 0; i < favoriteList.length; i++) {
        favoriteList[i].FavoriteProduct = FavoriteProduct;
      }
    }
  }
  res.render('bidder/favorite', {
    layout: 'bidder',
    favoriteList,
    favorite: true,
    empty: favoriteList.length === 0,
  });
});

bidderRouter.get('/currentbids', async function (req, res) {
  const currentBidsList = await bidderModel.getCurrentBids(
    res.locals.user.userId
  );

  const userId = res.locals.user ? res.locals.user.userId : 0;
  if (userId != 0) {
    const listFavorite = await bidderModel.getFavoriteList(userId);

    const FavoriteProduct = [];
    for (let i = 0; i < listFavorite.length; i++) {
      FavoriteProduct.push({
        proId: listFavorite[i].proId,
      });
    }

    for (let i = 0; i < currentBidsList.length; i++) {
      currentBidsList[i].FavoriteProduct = FavoriteProduct;
    }
  }
  res.render('bidder/currentBid', {
    layout: 'bidder',
    currentBidsList,
    currentBids: true,
    empty: currentBidsList.length === 0,
  });
});

bidderRouter.get('/rating', async function (req, res) {
  const ratingList = await bidderModel.getRatingList(res.locals.user.userId);
  ratingList.forEach((element, index) => {
    element.rateName = element.firstname + ' ' + element.lastname;
    if (index === ratingList.length - 1) {
      element.last = true;
    }
  });
  const rateNums = ratingList.length;
  const satisfiedList = ratingList.filter((item) => item.satisfied === 1);
  const ratingPoint = (satisfiedList.length / rateNums) * 10;

  res.render('bidder/rating', {
    layout: 'bidder',
    ratingList,
    rating: true,
    empty: ratingList.length === 0,
    rateNums,
    ratingPoint,
  });
});

bidderRouter.get('/win', async function (req, res) {
  const winningList = await bidderModel.getWinningList(res.locals.user.userId);
  winningList.forEach(async function (element) {
    const rated = await bidderModel.isAlreadyRated(element.proId);
    if (rated) {
      element.rated = true;
    } else element.rated = false;
    element.sellerName = element.firstname + ' ' + element.lastname;
  });
  res.render('bidder/win', {
    layout: 'bidder',
    winningList,
    win: true,
    empty: winningList.length === 0,
  });
});

bidderRouter.post('/rateSeller', async function (req, res) {
  const opinion = req.body.opinion;
  let satisfied = false;
  if (opinion === 'satisfied') {
    satisfied = true;
  }
  const comment = req.body.commentBox;
  const seller = +req.body.sellerid;
  const product = +req.body.proid;

  const rating = {
    userId: res.locals.user.userId,
    rateId: seller,
    proId: product,
    ratingTime: new Date(),
    satisfied,
    comment,
  };

  await bidderModel.rate(rating);
  const url = req.headers.referer || '/';
  res.redirect(url);
});

export default bidderRouter;
