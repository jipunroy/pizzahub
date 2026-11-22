import type { Request, Response, NextFunction } from "express";

import { createOrder } from "../services/order.service.js";
import { createOrderSchema } from "../validators/order.validator.js";

export const createOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Authenticated customer ID
    const customerId = req.user?.id;

    if (!customerId) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    // Validate request body
    const validation = createOrderSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid order information.",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    // Create order
    const order = await createOrder(
      customerId,
      validation.data
    );

    res.status(201).json({
      success: true,
      message: "Your order has been placed successfully!",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};