import { Router } from "express";
import { body, validationResult } from "express-validator";

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
  body("email", "Email is not valid").isEmail(),
  body("password", "Password must be at least 5 characters long").isLength({
    min: 5,
  }),
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.redirect("/signup");
    }
  }
);
