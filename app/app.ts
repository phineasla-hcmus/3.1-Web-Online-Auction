import compression from "compression";
import express from "express";
import path from "path";
import passport from "passport";
import winston from "winston";

const app = express();

app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "handlebars");
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, "public")));

export default app;
