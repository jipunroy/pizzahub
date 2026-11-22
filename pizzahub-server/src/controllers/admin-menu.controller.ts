
import type { Request, Response, NextFunction } from "express";

import {
  getPendingMenuItems,
  approveMenuItem,
  rejectMenuItem,
  setMenuItemFeatured,
} from "../services/admin-menu.service.js";

// Get pending menu items
export const getPendingMenuItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number(req.query.limit) || 12)
    );

    const result = await getPendingMenuItems(page, limit);

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

// Approve menu item
export const approveMenuItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const menuItem = await approveMenuItem(
      String(req.params.id)
    );

    res.status(200).json({
      success: true,
      message: "Menu item approved successfully.",
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

// Reject menu item
export const rejectMenuItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reason = req.body.reason;

    if (
      typeof reason !== "string" ||
      reason.trim().length < 3 ||
      reason.trim().length > 500
    ) {
      res.status(400).json({
        success: false,
        message: "Rejection reason must be between 3 and 500 characters.",
      });
      return;
    }

    const menuItem = await rejectMenuItem(
      String(req.params.id),
      reason.trim()
    );

    res.status(200).json({
      success: true,
      message: "Menu item rejected successfully.",
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

// Feature or unfeature a menu item
export const setMenuItemFeaturedController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { isFeatured } = req.body;

    if (typeof isFeatured !== "boolean") {
      res.status(400).json({
        success: false,
        message: "isFeatured must be true or false.",
      });
      return;
    }

    const menuItem = await setMenuItemFeatured(
      String(req.params.id),
      isFeatured
    );

    res.status(200).json({
      success: true,
      message: isFeatured
        ? "Menu item featured successfully."
        : "Menu item removed from featured list.",
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};
