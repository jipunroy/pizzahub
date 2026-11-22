
import { Router } from "express";
import { getPublicMenuItemsController } from "../controllers/public-menu.controller.js";

const router = Router();

// Public route: no login required
router.get("/", getPublicMenuItemsController);

export default router;
