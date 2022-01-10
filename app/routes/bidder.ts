import { compare, hash } from 'bcrypt';
import { Router } from 'express';
import { validationResult } from 'express-validator';
import bidderModel from '../models/bidder.model';
import { findUserById, updateUser } from '../models/user.model';
import {
  confirmPasswordValidator,
  dobValidator,
  firstNameValidator,
  lastNameValidator,
  newEmailValidator,
  passwordValidator
} from '../validators/user.validator';

const bidderRouter = Router();

bidderRouter.get('/info', async function (req, res) {
  const userId = res.locals.user.userId;
  let status = await bidderModel.getBidderStatus(userId);
  const currentuser = await findUserById(userId);

  let request = -2;
  if (status.length !== 0) {
    request = status[0].status;
  }

  res.render('bidder/info', {
    layout: 'bidder',
    info: true,
    request,
    currentuser,
  });
});

bidderRouter.post(
  '/change-email',
  newEmailValidator,
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json(errors.array());
    } else {
      const userId = res.locals.user.userId;
      const newEmail: any = req.body.email;
      await updateUser(userId, { email: newEmail });
      const url = req.headers.referer || '/';
      res.redirect(url);
    }
  }
);

bidderRouter.post(
  '/change-name',
  firstNameValidator,
  lastNameValidator,
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json(errors.array());
    } else {
      const userId = req.user!.userId;
      const firstName = req.body.firstname;
      const lastName = req.body.lastname;
      await updateUser(userId, { firstName, lastName });
      const url = req.headers.referer || '/';
      res.redirect(url);
    }
  }
);

bidderRouter.post('/change-dob', dobValidator, async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(errors.array());
  }
  const dob = req.body.dob;
  console.log(dob);
  const formatDob = new Date(dob);
  const userId = res.locals.user.userId;
  await updateUser(userId, { dob: formatDob });

  const url = req.headers.referer || '/';
  res.redirect(url);
});

bidderRouter.post(
  '/change-password',
  passwordValidator,
  confirmPasswordValidator,
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json(errors.array());
    }
    const userId = req.user!.userId;
    const user = await findUserById(userId, ['password']);
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.password;
    if (!oldPassword || !newPassword || !user?.password) {
      const msg =
        'You are using 3rd party authentication, please set your password by using Forgot password';
      // If user?.password is null/undefined, user must be using social authentication
      return res.json([{ msg }]);
    }
    const isMatch = await compare(oldPassword, user.password);
    if (!isMatch) {
      return res.json([{ msg: 'Invalid password' }]);
    }
    const hashedPassword = await hash(newPassword, 10);
    await updateUser(userId, { password: hashedPassword });
    const url = req.headers.referer || '/';
    res.redirect(url);
  }
);

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
  const userId = res.locals.user.userId;
  const ratingList = await bidderModel.getRatingList(userId);
  ratingList.forEach((element, index) => {
    element.rateName = element.firstname + ' ' + element.lastname;
    if (index === ratingList.length - 1) {
      element.last = true;
    }
  });
  const rateNums = ratingList.length;
  const user = await findUserById(userId);
  const ratingPoint = user?.rating;

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
  const bidderId = res.locals.user.userId;
  const winningList = await bidderModel.getWinningList(bidderId);
  winningList.forEach(async function (element) {
    const rated = await bidderModel.isAlreadyRated(bidderId, element.proId);
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

  // update rating point for seller
  const ratingList = await bidderModel.getRatingList(req.body.sellerid);
  const rateNums = ratingList.length;
  const satisfiedList = ratingList.filter((item) => item.satisfied === 1);
  const ratingPoint = Math.round((satisfiedList.length / rateNums) * 100) / 10;
  await updateUser(req.body.sellerid, { rating: ratingPoint });

  const url = req.headers.referer || '/';
  res.redirect(url);
});

export default bidderRouter;
