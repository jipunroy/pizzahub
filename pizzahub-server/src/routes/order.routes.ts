import { Router } from "express";

import { requireAuth } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

import { createOrderController } from "../controllers/order.controller.js";

const router = Router();

// Customer authentication and role protection
router.use(requireAuth, allowRoles("customer"));

// Create a new order
router.post("/", createOrderController);

export default router;