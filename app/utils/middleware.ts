import { NextFunction, Request, Response } from 'express';
import { RoleType } from '../models/role.model';

export const mustLoggedIn = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isUnauthenticated()) return res.redirect('/auth/login');
  next();
};

export const mustLoggedOut = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) return res.redirect(req.session.returnTo || '/');
  next();
};

export const mustbeSeller = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.roleId !== RoleType.Seller)
    return res.redirect(req.session.returnTo || '/');
  next();
};

export const mustbeAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.roleId !== RoleType.Admin)
    return res.redirect(req.session.returnTo || '/');
  next();
};
