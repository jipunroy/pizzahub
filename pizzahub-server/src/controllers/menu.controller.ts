
import type { Request, Response, NextFunction } from "express";

import {
  createMenuItem,
  getVendorMenuItems,
  updateMenuItem,
  deleteMenuItem,
} from "../services/menu.service.js";

import type {
  CreateMenuItemInput,
  UpdateMenuItemInput,
} from "../validators/menu.validator.js";

// Create a new menu item
export const createMenuItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user!;

   const menuItem = await createMenuItem(
  user.id,
  {
    subscriptionPlan: user.subscriptionPlan ?? "free",
    subscriptionExpiresAt: user.subscriptionExpiresAt,
  },
  req.body as CreateMenuItemInput
);

    res.status(201).json({
      success: true,
      message: "Menu item submitted for admin approval.",
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

// Get all menu items belonging to the logged-in vendor
export const getVendorMenuItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const menuItems = await getVendorMenuItems(req.user!.id);

    res.status(200).json({
      success: true,
      results: menuItems.length,
      data: menuItems,
    });
  } catch (error) {
    next(error);
  }
};

// Update an existing menu item
export const updateMenuItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const menuItem = await updateMenuItem(
      String(req.params.id),
      req.user!.id,
      req.body as UpdateMenuItemInput
    );

    res.status(200).json({
      success: true,
      message: "Menu item updated and sent for re-approval.",
      data: menuItem,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a menu item
export const deleteMenuItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await deleteMenuItem(
      String(req.params.id),
      req.user!.id
    );

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};
