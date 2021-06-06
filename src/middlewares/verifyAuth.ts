import { Request, Response, NextFunction } from "express";

export const verifyAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.userId) return next(new Error("Not authenticated"));
  next();
}