import compression from 'compression';
import knexSessionStore from 'connect-session-knex';
import cookieParser from 'cookie-parser';
import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import knex from './config/database';
// Need import for passport to work
import './config/passport';
import { SESSION_SECRET } from './config/secret';
import categoryModel from './models/category.model';
import { RoleType } from './models/role.model';
import loginRouter from './routes/auth/login';
import logoutRouter from './routes/auth/logout';
import signUpRouter from './routes/auth/signup';
import verifyRouter from './routes/auth/verify';
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
app.use(compression());
// Replacement of bodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: new knexSession({ knex: knex }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/public', express.static(path.join('public')));

// After successful login, redirect back to the intended page
app.use((req, res, next) => {
  if (
    !req.user &&
    req.path !== '/login' &&
    req.path !== '/signup' &&
    !req.path.match(/^\/auth/)
  ) {
    req.session.returnTo = req.path;
  } else if (req.user && req.path == '/account') {
    req.session.returnTo = req.path;
  }
  next();
});

// app.use((req, res, next) => {
//   if (
//     !req.user &&
//     req.path !== '/login' &&
//     req.path !== '/signup' &&
//     !req.path.match(/^\/auth/) &&
//     !req.path.match(/\./)
//   ) {
//     req.session.returnTo = req.path;
//   } else if (req.user && req.path == '/account') {
//     req.session.returnTo = req.path;
//   }
//   next();
// });

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

// If user if not verified (i.e roleId == 1), force redirect to verify
// NOTE: comment this out if you want unverified user to access normally
app.use((req, res, next) => {
  if (
    !req.path.match(/^\/verify/) &&
    req.user &&
    req.user.roleId == RoleType.Unverified
  ) {
    res.redirect('/verify/' + req.user.userId);
  } else {
    next();
  }
});

app.use('/', homeRouter);
app.use('/login', loginRouter);
app.use('/signup', signUpRouter);
app.use('/logout', logoutRouter);
app.use('/verify', verifyRouter);
app.use('/bidder', bidderRouter);

app.use((req, res, next) => {
  res.sendFile('views/error.html', { root: '.' });
  next;
});

export default app;
