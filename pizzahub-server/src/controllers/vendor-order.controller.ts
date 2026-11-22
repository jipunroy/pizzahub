
import type { Request, Response, NextFunction } from "express";

import {
  getVendorOrders,
  updateVendorOrderStatus,
  rejectVendorOrder,
} from "../services/vendor-order.service.js";

import { rejectOrderSchema } from "../validators/order.validator.js";

// 1. Get vendor orders
export const getVendorOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const vendorId = req.user?.id;

    if (!vendorId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number(req.query.limit) || 12)
    );

    const result = await getVendorOrders(
      vendorId,
      page,
      limit
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// 2. Update vendor order status
export const updateVendorOrderStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const vendorId = req.user?.id;

    if (!vendorId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const allowedStatuses = [
      "confirmed",
      "preparing",
      "out_for_delivery",
      "delivered",
    ] as const;

    const status: unknown = req.body.status;

    if (
      typeof status !== "string" ||
      !allowedStatuses.some((item) => item === status)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
      return;
    }

    const orderId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!orderId) {
      res.status(400).json({
        success: false,
        message: "Order ID is required.",
      });
      return;
    }

    const order = await updateVendorOrderStatus(
      vendorId,
      orderId,
      status as (typeof allowedStatuses)[number]
    );

    res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// 3. Reject vendor order
export const rejectVendorOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const vendorId = req.user?.id;

    if (!vendorId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    const validation = rejectOrderSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid rejection reason.",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const orderId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!orderId) {
      res.status(400).json({
        success: false,
        message: "Order ID is required.",
      });
      return;
    }

    const order = await rejectVendorOrder(
      vendorId,
      orderId,
      validation.data.rejectionReason
    );

    res.status(200).json({
      success: true,
      message: "Order rejected successfully.",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
