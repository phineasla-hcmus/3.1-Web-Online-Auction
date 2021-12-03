import { Request, Response, NextFunction } from "express";

export function getLogin(req: Request, res: Response) {
  if (req.user) return res.redirect("/");
  res.render("auth/login", {
    title: "Sign In",
    layout: false,
  });
}

export async function postLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {}
