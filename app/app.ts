import compression from 'compression';
import express from 'express';
import mySqlSessionStore from 'express-mysql-session';
import session from 'express-session';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import './config/nodemailer';
import './config/passport';
import { COOKIE_MAX_AGE, DB_CONFIG, SESSION_SECRET } from './config/secret';
import { getCategoryList, getSubcategoryList } from './models/category.model';
import productModel from './models/product.model';
import { RoleType } from './models/role.model';
import {
  downgradeSellerAuto,
  findUserById,
  getExpiredSeller,
} from './models/user.model';
import adminRouter from './routes/admin';
import loginRouter from './routes/auth/login';
import { recoveryRouter, verifyRouter } from './routes/auth/otp';
import signUpRouter from './routes/auth/signup';
import bidderRouter from './routes/bidder';
import homeRouter from './routes/home';
import sellerRouter from './routes/seller';
import {
  sendSellerAuctionEnded,
  sendSellerNoSale,
  sendWinner,
} from './utils/email';
import hbs from './utils/hbs';
import {
  mustbeAdmin,
  mustbeSeller,
  mustLoggedIn,
  mustLoggedOut,
} from './utils/middleware';

const DELAY = 10000; //10 second

const app = express();
const MySqlSession = mySqlSessionStore(session as any);

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('trust proxy', 1);
app.set('views', path.resolve(__dirname, '../views'));
// NOTE: Express middleware order is important
if (process.env.NODE_ENV !== 'production') {
  app.use(
    morgan('dev', { skip: (req, res) => req.originalUrl.startsWith('/public') })
  );
}
app.use(compression());
app.use(
  session({
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: new MySqlSession({ ...DB_CONFIG, expiration: COOKIE_MAX_AGE }),
  })
);
// Replace bodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use(
  '/public/tinymce',
  express.static(path.join(__dirname, '../node_modules', 'tinymce'))
);
app.use(passport.initialize());
app.use(passport.session());

// After successful login, redirect back to the intended page
app.use((req, res, next) => {
  if (!req.path.match(/^\/auth/)) {
    req.session.returnTo = req.originalUrl;
  }
  next();
});

// Pass req.user to res.locals.user to use in handlebars
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.post('/logout', (req, res) => {
  // Use `req.session.destroy` instead of `req.logout` to use remember me
  // `req.logout` only clears Passport property inside session object
  // While `req.session.destroy` delete the whole session on the database
  req.session.destroy((err) => res.redirect(req.headers.referer || '/'));
});

// If user if not verified (roleId == 1), force redirect to verify
// NOTE: comment this out if you want unverified user to access normally
app.use((req, res, next) => {
  if (
    req.user?.roleId === RoleType.Unverified &&
    !req.path.match(/^\/auth\/verify/)
  ) {
    res.redirect('/auth/verify');
  } else {
    next();
  }
});

app.use(async function (req, res, next) {
  res.locals.parentCategories = await getCategoryList();
  res.locals.childCategories = await getSubcategoryList();
  next();
});

app.use('/', homeRouter);

// https://developers.google.com/identity/protocols/oauth2/scopes#oauth2
app.get(
  '/auth/google',
  mustLoggedOut,
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/signup' }),
  (req, res) => {
    res.redirect(req.session.returnTo || '/');
  }
);

app.use('/auth/login', mustLoggedOut, loginRouter);
app.use('/auth/signup', mustLoggedOut, signUpRouter);
app.use('/auth/verify', mustLoggedIn, verifyRouter);
app.use('/auth/recovery', recoveryRouter);

app.use('/bidder', mustLoggedIn, bidderRouter);

app.use('/admin', mustLoggedIn, mustbeAdmin, adminRouter);
app.use('/seller', mustLoggedIn, mustbeSeller, sellerRouter);

setTimeout(async function run() {
  const listExpireProduct = await productModel.findExpiredProductInTime();

  for (let i = 0; i < listExpireProduct.length; i++) {
    console.log(listExpireProduct[i].proName);
    const product = listExpireProduct[i];
    const sellerId = product.sellerId;
    const winId = product.bidderId;
    const proPrice = product.currentPrice;
    const proName = product.proName;
    const proId = product.proId;
    const thumbnailUrl = product.secureUrl;

    const productEmail = {
      id: proId,
      name: proName,
      price: proPrice,
      thumbnailUrl,
    };

    // sellerId and bidderId must be valid
    const seller = await findUserById(sellerId, ['email']);
    const sellerEmail = seller!.email;

    if (product.bidderId) {
      // Winner
      const winner = await findUserById(winId, ['email']);
      const winnerEmail = winner!.email;
      sendSellerAuctionEnded(sellerEmail, productEmail);
      sendWinner(winnerEmail, productEmail);
    } else {
      // You sucks and no one buys your product
      sendSellerNoSale(sellerEmail, productEmail);
    }
    productModel.removeActiveProduct(listExpireProduct[i].proId);
  }

  const listExpiredSeller = await getExpiredSeller();

  for (let i = 0; i < listExpiredSeller.length; i++) {
    const sellerId = listExpiredSeller[i].bidderId;
    // KHÔNG CẦN GỬI MAIL
    downgradeSellerAuto(listExpiredSeller[i].bidderId);
  }
  setTimeout(run, DELAY);
}, DELAY);

// Let server.ts handle 404 and 500
export default app;
