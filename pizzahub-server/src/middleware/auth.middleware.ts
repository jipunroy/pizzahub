import type { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../config/auth.js";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in.",
      });
      return;
    }

    if (session.user.isBlocked) {
      res.status(403).json({
        success: false,
        message: "Your account has been blocked.",
      });
      return;
    }

    req.user = session.user;
    req.session = session.session;

    next();
  } catch (error) {
    next(error);
  }
};