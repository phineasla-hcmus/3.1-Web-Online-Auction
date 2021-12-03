import { Request, Response, NextFunction } from "express";

export function getSignIn(req: Request, res: Response) {
  if (req.user) return res.redirect("/");
  res.render("account/signin", {
    title: "Sign In",
  });
}
