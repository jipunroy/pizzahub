
import { Router } from "express";

import { requireAuth } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

import {
  getVendorOrdersController,
  updateVendorOrderStatusController,
  rejectVendorOrderController,
} from "../controllers/vendor-order.controller.js";

const router = Router();

// Authentication and vendor role protection
router.use(requireAuth, allowRoles("vendor"));

// Get all vendor orders
router.get("/", getVendorOrdersController);

// Update order status
router.patch("/:id/status", updateVendorOrderStatusController);

// Reject pending order
router.patch("/:id/reject", rejectVendorOrderController);

// IMPORTANT: Default export
export default router;
