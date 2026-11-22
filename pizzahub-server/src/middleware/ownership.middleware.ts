import type { Request, Response, NextFunction } from "express";

export const authorizeOwnerOrAdmin = (paramName = "userId") => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const resourceUserId = req.params[paramName];

    if (
      req.user.role !== "admin" &&
      req.user.id !== resourceUserId
    ) {
      res.status(403).json({
        success: false,
        message: "You cannot access another user's resource.",
      });
      return;
    }

    next();
  };
};