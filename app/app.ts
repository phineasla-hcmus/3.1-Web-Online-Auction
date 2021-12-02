import compression from "compression";
import express from "express";
import session from "express-session";
import morgan from "morgan";
// import path from "path";
import passport from "passport";
import { engine } from "express-handlebars";

import logger from "./utils/logger";

import categoryModel from "./models/category.model";

const getEnv = (key: string, defaultVal?: any) => {
  const env = process.env[key] || defaultVal;
  if (!env) {
    logger.error(`Missing ${key} environment variable`);
    process.exit(1);
  }
  return String(env);
};

const DB_CONFIG = {
  host: getEnv("DB_HOST"),
  port: getEnv("DB_PORT"),
  user: getEnv("DB_USER"),
  password: getEnv("DB_PASSWORD"),
  database: getEnv("DB_DATABASE"),
};
const SESSION_SECRET = getEnv("SESSION_SECRET");

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
