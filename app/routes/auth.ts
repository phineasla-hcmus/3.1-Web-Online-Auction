import { Router } from "express";
import { body, validationResult } from "express-validator";
import { findUserByEmail } from "../models/user.model";

export const loginRouter = Router();
export const signUpRouter = Router();

loginRouter.get("/", (req, res) => {
  if (req.user) return res.redirect("/");
  res.render("auth/login", {
    layout: "auth",
  });
});

loginRouter.post("/", (req, res) => {
  // Authentication stuff here
});

signUpRouter.get("/", (req, res) => {
  if (req.user) return res.redirect("/");
  res.render("auth/signup", {
    layout: "auth",
  });
});

/**
 * Create a new local account.
 * @route POST /signup
 */
signUpRouter.post(
  "/",
  body("email", "Email is not valid")
    .isEmail()
    .custom((email) => {
      return findUserByEmail(email).then((user) => {
        if (user) {
          return Promise.reject("E-mail already in use");
        }
      });
    }),
  body("password", "Password must be at least 5 characters long").isLength({
    min: 5,
  }),
  body("username", "Username must be at least 3 characters long").isLength({
    min: 5,
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.json(errors.array());
    }
    // Insert user to DB
  }
);
