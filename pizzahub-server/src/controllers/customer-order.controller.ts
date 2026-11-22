
import type { Request, Response, NextFunction } from "express";

import {
  getCustomerOrders,
  getCustomerOrderById,
  cancelCustomerOrder,
} from "../services/customer-order.service.js";

import { cancelOrderSchema } from "../validators/order.validator.js";

// 1. Get all orders of the logged-in customer
export const getCustomerOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customerId = req.user?.id;

    if (!customerId) {
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

    const result = await getCustomerOrders(
      customerId,
      page,
      limit
    );

    res.status(200).json({
      success: true,
      message: "Customer orders retrieved successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// 2. Get a single order by ID
export const getCustomerOrderByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customerId = req.user?.id;

    if (!customerId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
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

    const order = await getCustomerOrderById(
      customerId,
      orderId
    );

    res.status(200).json({
      success: true,
      message: "Order retrieved successfully.",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// 3. Cancel a pending order
export const cancelCustomerOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const customerId = req.user?.id;

    if (!customerId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
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

    const validation = cancelOrderSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed.",
        errors: validation.error.flatten(),
      });
      return;
    }

    const order = await cancelCustomerOrder(
      customerId,
      orderId,
      validation.data.cancellationReason
    );

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully.",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
