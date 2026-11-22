
import type { Request, Response, NextFunction } from "express";

import { getPublicMenuItems } from "../services/menu.service.js";
import { menuQuerySchema } from "../validators/menu.validator.js";

export const getPublicMenuItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validation = menuQuerySchema.safeParse(req.query);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid menu query parameters.",
        errors: validation.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
      return;
    }

    const result = await getPublicMenuItems(validation.data);

    res.status(200).json({
      success: true,
      results: result.menuItems.length,
      pagination: result.pagination,
      data: result.menuItems,
    });
  } catch (error) {
    next(error);
  }
};
