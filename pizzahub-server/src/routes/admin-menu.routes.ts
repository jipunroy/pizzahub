
import { Router } from "express";

import { requireAuth } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

import {
  getPendingMenuItemsController,
  approveMenuItemController,
  rejectMenuItemController,
  setMenuItemFeaturedController,
} from "../controllers/admin-menu.controller.js";

const router = Router();

// Only authenticated admins can access these routes
router.use(requireAuth, allowRoles("admin"));

// Get pending menu items
router.get("/pending", getPendingMenuItemsController);

// Approve a menu item
router.patch("/:id/approve", approveMenuItemController);

// Reject a menu item
router.patch("/:id/reject", rejectMenuItemController);

// Feature or unfeature a menu item
router.patch("/:id/featured", setMenuItemFeaturedController);

export default router;
