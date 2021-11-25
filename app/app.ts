import compression from "compression";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import path from "path";
import passport from "passport";

import logger from "./utils/logger";

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

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "handlebars");
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
app.use(express.static(path.join(__dirname, "public")));

export default app;
