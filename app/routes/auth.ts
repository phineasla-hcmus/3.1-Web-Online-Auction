import { Router } from "express";
import { getLogin } from "../controllers/auth";

export const loginRouter = Router();

loginRouter.get("/", getLogin);