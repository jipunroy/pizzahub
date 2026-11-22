import mongoose from "mongoose";

import Order from "../models/order.model.js";
import MenuItem from "../models/menuItem.model.js";

import type { CreateOrderInput } from "../validators/order.validator.js";

export const createOrder = async (
  customerId: string,
  input: CreateOrderInput
) => {
  const menuItemIds = input.items.map(
    (item) => item.menuItemId
  );

  // Duplicate menu item IDs are not allowed.
  if (new Set(menuItemIds).size !== menuItemIds.length) {
    throw Object.assign(
      new Error("Duplicate menu items are not allowed."),
      { statusCode: 400 }
    );
  }

  // Fetch approved and active menu items.
  const menuItems = await MenuItem.find({
    _id: {
      $in: menuItemIds.map(
        (id) => new mongoose.Types.ObjectId(id)
      ),
    },
    status: "approved",
    isActive: true,
  }).lean();

  if (menuItems.length !== input.items.length) {
    throw Object.assign(
      new Error("One or more menu items are unavailable."),
      { statusCode: 400 }
    );
  }

  // All items in one order must belong to the same vendor.
  const vendorIds = [
    ...new Set(menuItems.map((item) => item.vendorId)),
  ];

  if (vendorIds.length !== 1) {
    throw Object.assign(
      new Error("Please order from one restaurant at a time."),
      { statusCode: 400 }
    );
  }

  const orderItems = input.items.map((requestedItem) => {
    const menuItem = menuItems.find(
      (item) => item._id.toString() === requestedItem.menuItemId
    );

    if (!menuItem) {
      throw new Error("Menu item not found.");
    }

    return {
      menuItemId: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: requestedItem.quantity,
      imageUrl: menuItem.imageUrl || "",
    };
  });

  const totalAmount = orderItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const order = await Order.create({
    customerId,
    vendorId: vendorIds[0],
    items: orderItems,
    totalAmount,
    deliveryAddress: input.deliveryAddress,
    deliveryDate: new Date(input.deliveryDate),
    status: "pending",
  });

  return order;
};