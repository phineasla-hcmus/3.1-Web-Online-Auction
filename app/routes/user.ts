import { compare, hash } from 'bcrypt';
import { Router } from 'express';
import { validationResult } from 'express-validator';
import bidderModel from '../models/bidder.model';
import { addOtp, findOtp, OtpType } from '../models/otp.model';
import productModel from '../models/product.model';
import {
  addPendingEmail,
  deletePendingEmail,
  deleteSocial,
  findPendingEmailByUserId,
  findUserById,
  updateUser,
} from '../models/user.model';
import { sendVerify } from '../utils/email';
import {
  confirmPasswordValidator,
  dobValidator,
  firstNameValidator,
  lastNameValidator,
  newEmailValidator,
  passwordValidator,
} from '../validators/user.validator';

const userRouter = Router();

userRouter.get('/info', async function (req, res) {
  const userId = res.locals.user.userId;
  let status = await bidderModel.getBidderStatus(userId);
  let currentuser = await findUserById(userId);

  if (currentuser !== undefined) {
    if (currentuser.dob === null) currentuser.dob = new Date('1/1/1970');
  }

  let request = -2;
  if (status.length !== 0) {
    request = status[0].status;
  }

  res.render('user/info', {
    layout: 'bidder',
    info: true,
    request,
    currentuser,
  });
});

userRouter.post('/change-email', newEmailValidator, async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(errors.array());
  }
  const userId = req.user!.userId;
  const newEmail: string = req.body.email;
  const result = await Promise.all([
    addPendingEmail(userId, newEmail),
    addOtp(userId, OtpType.Verify),
  ]);

  const token = result[1];
  sendVerify(newEmail, token);

  // Send 204 to notify client to show verify input field
  res.status(204).send();
});

userRouter.post('/verify-change-email', async function (req, res) {
  const { userId } = req.user!;
  const { token } = req.body;
  const otp = await findOtp(userId, OtpType.Verify);
  if (!token || otp?.token !== token) {
    return res.json([{ msg: 'Invalid token' }]);
  }
  const email = await findPendingEmailByUserId(userId);
  updateUser(userId, { email });
  deletePendingEmail(userId);
  deleteSocial(userId);

  const url = req.headers.referer || '/';
  res.redirect(url);
});

userRouter.post(
  '/change-name',
  firstNameValidator,
  lastNameValidator,
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json(errors.array());
    } else {
      const userId = req.user!.userId;
      const firstName = req.body.firstName;
      const lastName = req.body.lastName;
      await updateUser(userId, { firstName, lastName });
      const url = req.headers.referer || '/';
      res.redirect(url);
    }
  }
);

userRouter.post('/change-dob', dobValidator, async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json(errors.array());
  }
  const dob = req.body.dob;
  const formatDob = new Date(dob);
  const userId = res.locals.user.userId;
  await updateUser(userId, { dob: formatDob });

  const url = req.headers.referer || '/';
  res.redirect(url);
});

userRouter.post(
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

userRouter.post('/upgrade', async function (req, res) {
  const userId = req.body.currentuserId;
  await bidderModel.upgradeToSeller(userId);

  const url = req.headers.referer || '/';
  res.redirect(url);
});

userRouter.get('/favorite', async function (req, res) {
  const userId = res.locals.user ? res.locals.user.userId : 0;
  const favoriteList = await bidderModel.getFavoriteList(
    res.locals.user.userId
  );

  favoriteList.forEach((element) => {
    if (element.firstName != null && element.lastName != null) {
      element.bidderName = element.firstName + ' ' + element.lastName;
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
  res.render('user/favorite', {
    layout: 'bidder',
    favoriteList,
    favorite: true,
    empty: favoriteList.length === 0,
  });
});

userRouter.get('/currentbids', async function (req, res) {
  const userId = res.locals.user ? res.locals.user.userId : 0;
  const currentBidsList = await bidderModel.getCurrentBids(userId);
  let productList: any = [];

  for (let i = 0; i < currentBidsList.length; i++) {
    const product = await productModel.findProductbyId(
      currentBidsList[i].proId
    );
    productList.push(product[0]);
  }

  productList.forEach((element: any) => {
    if (element.bidderId === userId) {
      element.win = true;
    }
    element.bidderName = element.firstName + ' ' + element.lastName;
  });

  if (userId != 0) {
    const listFavorite = await bidderModel.getFavoriteList(userId);

    const FavoriteProduct = [];
    for (let i = 0; i < listFavorite.length; i++) {
      FavoriteProduct.push({
        proId: listFavorite[i].proId,
      });
    }

    for (let i = 0; i < productList.length; i++) {
      productList[i].FavoriteProduct = FavoriteProduct;
    }
  }
  res.render('user/currentBid', {
    layout: 'bidder',
    productList,
    currentBids: true,
    empty: productList.length === 0,
  });
});

userRouter.get('/rating', async function (req, res) {
  const userId = res.locals.user.userId;
  const ratingList = await bidderModel.getRatingList(userId);
  ratingList.forEach((element, index) => {
    element.rateName = element.firstName + ' ' + element.lastName;
    if (index === ratingList.length - 1) {
      element.last = true;
    }
  });
  const rateNums = ratingList.length;
  const user = await findUserById(userId);
  const ratingPoint = user?.rating;

  res.render('user/rating', {
    layout: 'bidder',
    ratingList,
    rating: true,
    empty: ratingList.length === 0,
    rateNums,
    ratingPoint,
  });
});

userRouter.get('/win', async function (req, res) {
  const bidderId = res.locals.user.userId;
  const winningList = await bidderModel.getWinningList(bidderId);
  winningList.forEach(async function (element) {
    const rated = await bidderModel.isAlreadyRated(bidderId, element.proId);
    if (rated) {
      element.rated = true;
    } else {
      element.rated = false;
    }
    element.sellerName = element.firstName + ' ' + element.lastName;
  });
  res.render('user/win', {
    layout: 'bidder',
    winningList,
    win: true,
    empty: winningList.length === 0,
  });
});

userRouter.post('/rateSeller', async function (req, res) {
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

export default userRouter;
