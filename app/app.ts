import compression from 'compression';
import knexSessionStore from 'connect-session-knex';
import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import knex from './config/database';
import './config/nodemailer';
import './config/passport';
import { SESSION_SECRET } from './config/secret';
import categoryModel from './models/category.model';
import { RoleType } from './models/role.model';
import adminRouter from './routes/admin';
import loginRouter from './routes/auth/login';
import logoutRouter from './routes/auth/logout';
import { recoveryRouter, verifyRouter } from './routes/auth/otp';
import signUpRouter from './routes/auth/signup';
import bidderRouter from './routes/bidder';
import homeRouter from './routes/home';
import hbs from './utils/hbs';

const app = express();
const knexSession = knexSessionStore(session);

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, '../views'));
// NOTE: Express middleware order is important
app.use(morgan('dev'));
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use(
  session({
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: new knexSession({ knex: knex }),
    // 1 day cookie
    cookie: { secure: false, maxAge: 8.64e7 },
  })
);
app.use(compression());
// Replacement of bodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// After successful login, redirect back to the intended page
app.use((req, res, next) => {
  if (
    !req.user &&
    // req.path !== '/login' &&
    // req.path !== '/signup' &&
    // req.path !== '/favicon.ico' &&
    // !req.path.match(/^\public/) &&P
    !req.path.match(/^\/auth/)
  ) {
    req.session.returnTo = req.originalUrl;
  }
  // Don't know what the purpose of this
  // else if (req.user && req.path == '/account') {
  //   req.session.returnTo = req.path;
  // }
  next();
});

// Pass req.user to res.locals.user to use in handlebars
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use(async function (req, res, next) {
  res.locals.parentCategories = await categoryModel.findParentCategory();
  res.locals.childCategories = await categoryModel.findChildCategory();
  next();
});

// If user if not verified (roleId == 1), force redirect to verify
// NOTE: comment this out if you want unverified user to access normally
app.use((req, res, next) => {
  if (
    req.user?.roleId === RoleType.Unverified &&
    !req.path.match(/^\/verify/)
  ) {
    res.redirect('/verify');
  } else {
    next();
  }
});

const mustLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.isUnauthenticated()) return res.redirect('/auth/login');
  next();
};

const mustLoggedOut = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) return res.redirect(req.session.returnTo || '/');
  next();
};

app.use('/', homeRouter);

app.use('/auth/login', mustLoggedOut, loginRouter);
app.use('/auth/signup', mustLoggedOut, signUpRouter);

app.use('/recovery', recoveryRouter);

app.use('/verify', mustLoggedIn, verifyRouter);
app.use('/logout', mustLoggedIn, logoutRouter);

app.use('/bidder', bidderRouter);
app.use('/admin', adminRouter);

async function test() {
  // updateUser(2, { address: 'Earth', roleId: 2 }).then((v) => console.log(v));
}
test();

// Let server.ts handle 404 and 500
export default app;
