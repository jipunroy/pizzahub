
import { Router } from "express";

import { requireAuth } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

import {
  createCustomerOrderController,
  getCustomerOrdersController,
  getCustomerOrderByIdController,
  cancelCustomerOrderController,
} from "../controllers/customer-order.controller.js";

const router = Router();

// Require authentication and customer role
router.use(requireAuth);
router.use(allowRoles("customer"));

// Create a new order
router.post("/", createCustomerOrderController);

// Get all orders of the logged-in customer
router.get("/", getCustomerOrdersController);

// Get a single order by ID
router.get("/:id", getCustomerOrderByIdController);

// Cancel a pending order
router.patch("/:id/cancel", cancelCustomerOrderController);

export default router;
