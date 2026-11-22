
import mongoose from "mongoose";
import MenuItem from "../models/menuItem.model.js";
import type {
  CreateMenuItemInput,
  UpdateMenuItemInput,
} from "../validators/menu.validator.js";

class MenuServiceError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "MenuServiceError";
  }
}

interface VendorSubscription {
  subscriptionPlan?: string;
  subscriptionExpiresAt?: Date | string | null;
}

const hasPremiumAccess = (vendor: VendorSubscription): boolean => {
  if (vendor.subscriptionPlan !== "premium") {
    return false;
  }

  if (!vendor.subscriptionExpiresAt) {
    return false;
  }

  return new Date(vendor.subscriptionExpiresAt).getTime() > Date.now();
};

export const createMenuItem = async (
  vendorId: string,
  vendor: VendorSubscription,
  data: CreateMenuItemInput
) => {
  const isPremium = hasPremiumAccess(vendor);

  if (!isPremium) {
    const activeCount = await MenuItem.countDocuments({
      vendorId,
      isActive: true,
    });

    if (activeCount >= 3) {
      throw new MenuServiceError(
        403,
        "Free vendors can have a maximum of 3 active menu items. Upgrade to Premium for unlimited items."
      );
    }
  }

  const menuItem = await MenuItem.create({
    ...data,
    vendorId,
    isActive: true,
    status: "pending",
    isFeatured: false,
  });

  return menuItem;
};

export const getVendorMenuItems = async (vendorId: string) => {
  return MenuItem.find({ vendorId }).sort({ createdAt: -1 });
};

export const updateMenuItem = async (
  itemId: string,
  vendorId: string,
  data: UpdateMenuItemInput
) => {
  if (!mongoose.isValidObjectId(itemId)) {
    throw new MenuServiceError(400, "Invalid menu item ID.");
  }

  const menuItem = await MenuItem.findOne({
    _id: itemId,
    vendorId,
  });

  if (!menuItem) {
    throw new MenuServiceError(
      404,
      "Menu item not found or you do not own this item."
    );
  }

  Object.assign(menuItem, data);

  // Any edit requires admin re-approval.
  menuItem.status = "pending";
  menuItem.isFeatured = false;
  menuItem.rejectionReason = null;

  await menuItem.save();

  return menuItem;
};

export const deleteMenuItem = async (
  itemId: string,
  vendorId: string
) => {
  if (!mongoose.isValidObjectId(itemId)) {
    throw new MenuServiceError(400, "Invalid menu item ID.");
  }

  const result = await MenuItem.deleteOne({
    _id: itemId,
    vendorId,
  });

  if (result.deletedCount === 0) {
    throw new MenuServiceError(
      404,
      "Menu item not found or you do not own this item."
    );
  }

  return { deleted: true };
};


interface PublicMenuQuery {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort: "price_asc" | "price_desc" | "newest";
  page: number;
  limit: number;
}

export const getPublicMenuItems = async (
  query: PublicMenuQuery
) => {
  // Only approved and active items are visible publicly
  const filter: Record<string, any> = {
    status: "approved",
    isActive: true,
  };

  // Search by item name or description
  if (query.search) {
    const escapedSearch = query.search.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    filter.$or = [
      { name: { $regex: escapedSearch, $options: "i" } },
      { description: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  // Filter by category
  if (query.category) {
    filter.category = query.category;
  }

  // Filter by minimum and maximum price
  if (
    query.minPrice !== undefined ||
    query.maxPrice !== undefined
  ) {
    filter.price = {};

    if (query.minPrice !== undefined) {
      filter.price.$gte = query.minPrice;
    }

    if (query.maxPrice !== undefined) {
      filter.price.$lte = query.maxPrice;
    }
  }

  // Sorting
  let sortOption: Record<string, 1 | -1>;

  switch (query.sort) {
    case "price_asc":
      sortOption = { price: 1 };
      break;

    case "price_desc":
      sortOption = { price: -1 };
      break;

    default:
      sortOption = { createdAt: -1 };
  }

  const skip = (query.page - 1) * query.limit;

  const [menuItems, totalItems] = await Promise.all([
    MenuItem.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(query.limit),

    MenuItem.countDocuments(filter),
  ]);

  return {
    menuItems,
    pagination: {
      currentPage: query.page,
      totalPages: Math.ceil(totalItems / query.limit),
      totalItems,
      limit: query.limit,
    },
  };
};
