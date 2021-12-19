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
  });
});

bidderRouter.post('/upgrade', async function (req, res) {
  const userId = req.body.userId;
  await bidderModel.upgradeToSeller(userId);
  const url = req.headers.referer || '/';
  res.redirect(url);
  // res.render('bidder/info', {
  //   layout: 'bidder',
  // });
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
