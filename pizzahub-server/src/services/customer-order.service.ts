
import mongoose from "mongoose";

import Order from "../models/order.model.js";
import MenuItem from "../models/menuItem.model.js";

import type { CreateOrderInput } from "../validators/order.validator.js";

// 1. Create a new customer order
export const createCustomerOrder = async (
  customerId: string,
  input: CreateOrderInput
) => {
  // Reject duplicate menu item IDs
  const menuItemIds = input.items.map((item) => item.menuItemId);

  if (new Set(menuItemIds).size !== menuItemIds.length) {
    throw Object.assign(
      new Error("Duplicate menu items are not allowed."),
      { statusCode: 400 }
    );
  }

  // Fetch only approved and active menu items
  const menuItems = await MenuItem.find({
    _id: {
      $in: menuItemIds.map(
        (id) => new mongoose.Types.ObjectId(id)
      ),
    },
    status: "approved",
    isActive: true,
  }).lean();

  // Ensure every requested item exists and is available
  if (menuItems.length !== input.items.length) {
    throw Object.assign(
      new Error(
        "One or more menu items are unavailable. Please refresh your cart."
      ),
      { statusCode: 400 }
    );
  }

  // All items must belong to the same vendor
  const vendorIds = new Set(
    menuItems.map((item) => item.vendorId)
  );

  if (vendorIds.size !== 1) {
    throw Object.assign(
      new Error("You can only order from one vendor at a time."),
      { statusCode: 400 }
    );
  }

  const vendorId = menuItems[0].vendorId;

  // Calculate order items using database prices
  const orderItems = input.items.map((requestedItem) => {
    const menuItem = menuItems.find(
      (item) =>
        item._id.toString() === requestedItem.menuItemId
    );

    if (!menuItem) {
      throw Object.assign(
        new Error("Menu item not found."),
        { statusCode: 400 }
      );
    }

    return {
      menuItemId: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: requestedItem.quantity,
      imageUrl: menuItem.imageUrl || "",
    };
  });

  // Calculate total using trusted database prices
  const totalAmount = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Create the order
  const order = await Order.create({
    customerId,
    vendorId,
    items: orderItems,
    totalAmount,
    deliveryAddress: input.deliveryAddress,
    deliveryDate: new Date(input.deliveryDate),
    status: "pending",
  });

  return order;
};

// 2. Get all orders of a customer
export const getCustomerOrders = async (
  customerId: string,
  page = 1,
  limit = 12
) => {
  const skip = (page - 1) * limit;

  const [orders, totalItems] = await Promise.all([
    Order.find({ customerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Order.countDocuments({ customerId }),
  ]);

  return {
    orders,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      limit,
    },
  };
};

// 3. Get a single customer's order
export const getCustomerOrderById = async (
  customerId: string,
  orderId: string
) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw Object.assign(
      new Error("Invalid order ID."),
      { statusCode: 400 }
    );
  }

  const order = await Order.findOne({
    _id: orderId,
    customerId,
  });

  if (!order) {
    throw Object.assign(
      new Error("Order not found."),
      { statusCode: 404 }
    );
  }

  return order;
};

// 4. Cancel a pending customer order
export const cancelCustomerOrder = async (
  customerId: string,
  orderId: string,
  cancellationReason: string
) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw Object.assign(
      new Error("Invalid order ID."),
      { statusCode: 400 }
    );
  }

  const order = await Order.findOne({
    _id: orderId,
    customerId,
  });

  if (!order) {
    throw Object.assign(
      new Error("Order not found."),
      { statusCode: 404 }
    );
  }

  if (order.status !== "pending") {
    throw Object.assign(
      new Error("Only pending orders can be cancelled."),
      { statusCode: 400 }
    );
  }

  order.status = "cancelled";
  order.cancellationReason = cancellationReason;

  await order.save();

  return order;
};
