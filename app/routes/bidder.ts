import { Router } from 'express';
import bidderModel from '../models/bidder.model';
import { updateUserEmail, updateUserName } from '../models/user.model';

const bidderRouter = Router();

bidderRouter.get('/info', async function (req, res) {
  const status = await bidderModel.getBidderStatus(res.locals.user.userId);
  let registered = false;
  if (status[0].status != null) {
    registered = true;
  }
  res.render('bidder/info', {
    layout: 'bidder',
    registered,
    info: true,
  });
});

bidderRouter.post('/info', async function (req, res) {
  const userId = res.locals.user.userId;
  const newEmail = req.body.email;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const newName = firstname + ' ' + lastname;
  const oldpass = req.body.oldpass;
  const newpass = req.body.newpass;
  if (newEmail) {
    res.locals.user.email = newEmail;
    await updateUserEmail(userId, newEmail);
  } else if (newName) {
    res.locals.user.firstName = firstname;
    res.locals.user.lastName = lastname;
    await updateUserName(userId, firstname, lastname);
  }
  res.render('bidder/info', {
    layout: 'bidder',
    info: true,
  });
});

bidderRouter.post('/upgrade', async function (req, res) {
  const userId = req.body.userId;
  await bidderModel.upgradeToSeller(userId);
  const url = req.headers.referer || '/';
  res.redirect(url);
});


bidderRouter.get('/favorite', async function (req, res) {
  const favoriteList = await bidderModel.getFavoriteList(
    res.locals.user.userId
  );
  res.render('bidder/favorite', {
    layout: 'bidder',
    favoriteList,
    favorite: true,
  });
});

bidderRouter.get('/currentbids', async function (req, res) {
  const currentBidsList = await bidderModel.getCurrentBids(
    res.locals.user.userId
  );
  res.render('bidder/currentBid', {
    layout: 'bidder',
    currentBidsList,
    currentBids: true,
  });
});

bidderRouter.get('/rating', async function (req, res) {
  const ratingList = await bidderModel.getRatingList(res.locals.user.userId);
  res.render('bidder/rating', {
    layout: 'bidder',
    ratingList,
    rating: true,
  });
});

bidderRouter.get('/win', async function (req, res) {
  const winningList = await bidderModel.getWinningList(res.locals.user.userId);
  res.render('bidder/win', { layout: 'bidder', winningList, win: true });
});

export default bidderRouter;
