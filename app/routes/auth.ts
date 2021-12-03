import { Router } from "express";

export const loginRouter = Router();

loginRouter.get("/", (req, res) => {
  if (req.user) return res.redirect("/");
  res.render("auth/login", {
    css: ["auth/login.css"],
  });
});
