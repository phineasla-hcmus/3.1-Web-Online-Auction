import express from "express";
import compression from "compression";
import knexSessionStore from "connect-session-knex";
import session from "express-session";
import passport from "passport";
import morgan from "morgan";
import { engine } from "express-handlebars";

import knex from "./config/database";
import { SESSION_SECRET } from "./config/secret";

import homeRouter from "./routes/home";

const app = express();

app.engine(
  "hbs",
  engine({
    defaultLayout: "layout.hbs",
    helpers: {
      isChildOf(parentId: string, catId: string) {
        if (parentId === catId) return true;
        return false;
      },
    },
  })
);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

const knexSession = knexSessionStore(session);
app.use(
  session({
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    store: new knexSession({ knex: knex }),
  })
);

app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (
    !req.user &&
    req.path !== "/login" &&
    req.path !== "/signup" &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)
  ) {
    req.session.returnTo = req.path;
  } else if (req.user && req.path == "/account") {
    req.session.returnTo = req.path;
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());
app.use("/public", express.static("public"));

// app.use(async function (req, res, next) {
//   res.locals.parentCategories = await categoryModel.findParentCategory();
//   res.locals.childCategories = await categoryModel.findChildCategory();
//   next();
// });

// app.get("/", async function (req, res) {
//   res.render("home");
// });

app.use("/", homeRouter);

export default app;
