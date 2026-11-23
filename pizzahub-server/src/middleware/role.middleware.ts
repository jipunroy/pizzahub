import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "../types/user.types.js";

export const allowRoles = (...allowedRoles: UserRole[]) => {
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

    // Temporary debugging
    console.log("AUTH ROLE DEBUG:", {
      userId: req.user.id,
      userRole: req.user.role,
      allowedRoles,
    });

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource.",
      });
      return;
    }

    next();
  };
};