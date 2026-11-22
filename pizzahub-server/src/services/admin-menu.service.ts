
import mongoose from "mongoose";
import MenuItem from "../models/menuItem.model.js";

class AdminMenuServiceError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "AdminMenuServiceError";
  }
}

// Get all pending menu items
export const getPendingMenuItems = async (
  page = 1,
  limit = 12
) => {
  const skip = (page - 1) * limit;

  const [menuItems, totalItems] = await Promise.all([
    MenuItem.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    MenuItem.countDocuments({ status: "pending" }),
  ]);

  return {
    menuItems,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      limit,
    },
  };
};

// Approve a menu item
export const approveMenuItem = async (itemId: string) => {
  if (!mongoose.isValidObjectId(itemId)) {
    throw new AdminMenuServiceError(400, "Invalid menu item ID.");
  }

  const menuItem = await MenuItem.findById(itemId);

  if (!menuItem) {
    throw new AdminMenuServiceError(404, "Menu item not found.");
  }

  if (menuItem.status !== "pending") {
    throw new AdminMenuServiceError(
      400,
      "Only pending menu items can be approved."
    );
  }

  menuItem.status = "approved";
  menuItem.rejectionReason = null;

  await menuItem.save();

  return menuItem;
};

// Reject a menu item
export const rejectMenuItem = async (
  itemId: string,
  reason: string
) => {
  if (!mongoose.isValidObjectId(itemId)) {
    throw new AdminMenuServiceError(400, "Invalid menu item ID.");
  }

  const menuItem = await MenuItem.findById(itemId);

  if (!menuItem) {
    throw new AdminMenuServiceError(404, "Menu item not found.");
  }

  if (menuItem.status !== "pending") {
    throw new AdminMenuServiceError(
      400,
      "Only pending menu items can be rejected."
    );
  }

  menuItem.status = "rejected";
  menuItem.rejectionReason = reason;
  menuItem.isFeatured = false;

  await menuItem.save();

  return menuItem;
};

// Toggle featured status
export const setMenuItemFeatured = async (
  itemId: string,
  isFeatured: boolean
) => {
  if (!mongoose.isValidObjectId(itemId)) {
    throw new AdminMenuServiceError(400, "Invalid menu item ID.");
  }

  const menuItem = await MenuItem.findById(itemId);

  if (!menuItem) {
    throw new AdminMenuServiceError(404, "Menu item not found.");
  }

  if (menuItem.status !== "approved" || !menuItem.isActive) {
    throw new AdminMenuServiceError(
      400,
      "Only approved and active menu items can be featured."
    );
  }

  menuItem.isFeatured = isFeatured;

  await menuItem.save();

  return menuItem;
};
