
import { Router } from "express";

import { requireAuth } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  createMenuItemSchema,
  updateMenuItemSchema,
} from "../validators/menu.validator.js";

import {
  createMenuItemController,
  getVendorMenuItemsController,
  updateMenuItemController,
  deleteMenuItemController,
} from "../controllers/menu.controller.js";

const router = Router();

// All routes below require an authenticated vendor.
router.use(requireAuth, allowRoles("vendor"));

// Create a menu item
router.post(
  "/",
  validate(createMenuItemSchema),
  createMenuItemController
);

// Get this vendor's own menu items
router.get(
  "/",
  getVendorMenuItemsController
);

// Update an owned menu item
router.patch(
  "/:id",
  validate(updateMenuItemSchema),
  updateMenuItemController
);

// Delete an owned menu item
router.delete(
  "/:id",
  deleteMenuItemController
);

export default router;
