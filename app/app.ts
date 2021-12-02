import compression from "compression";
import knexSession from "connect-session-knex";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import passport from "passport";
import { engine } from "express-handlebars";

import knex from "./config/database";
import { SESSION_SECRET } from "./config/secret";
import categoryModel from "./models/category.model";

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
app.use(
  session({
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    // --noImplicitAny enabled
    // Fix: https://stackoverflow.com/q/43623461/12405558
    store: new (knexSession as any)(knex),
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/public", express.static("public"));

app.use(async function (req, res, next) {
  res.locals.parentCategories = await categoryModel.findParentCategory();
  res.locals.childCategories = await categoryModel.findChildCategory();
  next();
});

app.get("/", async function (req, res) {
  res.render("home");
});

export default app;
