import mongoose from "mongoose";
import Order from "../models/order.model.js";

// Get vendor orders
export const getVendorOrders = async (
  vendorId: string,
  page = 1,
  limit = 12
) => {
  const skip = (page - 1) * limit;

  const [orders, totalItems] = await Promise.all([
    Order.find({ vendorId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Order.countDocuments({ vendorId }),
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

// Update vendor order status
export const updateVendorOrderStatus = async (
  vendorId: string,
  orderId: string,
  status:
    | "confirmed"
    | "preparing"
    | "out_for_delivery"
    | "delivered"
) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw Object.assign(
      new Error("Invalid order ID."),
      { statusCode: 400 }
    );
  }

  const order = await Order.findOne({
    _id: orderId,
    vendorId,
  });

  if (!order) {
    throw Object.assign(
      new Error("Order not found."),
      { statusCode: 404 }
    );
  }

  const allowedTransitions: Record<string, string[]> = {
    pending: ["confirmed"],
    confirmed: ["preparing"],
    preparing: ["out_for_delivery"],
    out_for_delivery: ["delivered"],
  };

  if (!allowedTransitions[order.status]?.includes(status)) {
    throw Object.assign(
      new Error("Invalid order status transition."),
      { statusCode: 400 }
    );
  }

  order.status = status;
  await order.save();

  return order;
};

// Reject vendor order
export const rejectVendorOrder = async (
  vendorId: string,
  orderId: string,
  rejectionReason: string
) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw Object.assign(
      new Error("Invalid order ID."),
      { statusCode: 400 }
    );
  }

  const order = await Order.findOne({
    _id: orderId,
    vendorId,
  });

  if (!order) {
    throw Object.assign(
      new Error("Order not found."),
      { statusCode: 404 }
    );
  }

  if (order.status !== "pending") {
    throw Object.assign(
      new Error("Only pending orders can be rejected."),
      { statusCode: 400 }
    );
  }

  order.status = "rejected";
  order.cancellationReason = rejectionReason;

  await order.save();

  return order;
};