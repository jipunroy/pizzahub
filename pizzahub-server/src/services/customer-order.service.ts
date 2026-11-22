
import mongoose from "mongoose";
import Order from "../models/order.model.js";

// 1. Get all orders of a customer
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

// 2. Get a single customer's order
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

// 3. Cancel a pending customer order
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
