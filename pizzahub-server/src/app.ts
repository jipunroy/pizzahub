
import express from "express";
import cors from "cors";
import helmet from "helmet";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./config/auth.js";

// Middleware
import { requireAuth } from "./middleware/auth.middleware.js";
import { allowRoles } from "./middleware/role.middleware.js";

// Routes
import publicMenuRoutes from "./routes/public-menu.routes.js";
import menuRoutes from "./routes/menu.routes.js";
import adminMenuRoutes from "./routes/admin-menu.routes.js";
import orderRoutes from "./routes/order.routes.js";
import vendorOrderRoutes from "./routes/vendor-order.routes.js";

const app = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Better Auth handler
app.all("/api/auth/{*any}", toNodeHandler(auth));

// Parse JSON
app.use(express.json());

// Health check
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "PizzaHub API is running!",
  });
});

// Public menu
app.use("/api/menu", publicMenuRoutes);

// Protected route
app.get("/api/protected", requireAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "You are authenticated!",
    user: {
      id: req.user?.id,
      name: req.user?.name,
      email: req.user?.email,
      role: req.user?.role,
    },
  });
});

// Vendor test
app.get(
  "/api/vendor-test",
  requireAuth,
  allowRoles("vendor"),
  (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Vendor access granted!",
    });
  }
);

// Vendor menu routes
app.use("/api/vendor/menu", menuRoutes);

// Vendor order routes
app.use("/api/vendor/orders", vendorOrderRoutes);

// Admin test
app.get(
  "/api/admin-test",
  requireAuth,
  allowRoles("admin"),
  (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Admin access granted!",
    });
  }
);

// Admin menu routes
app.use("/api/admin/menu", adminMenuRoutes);

// Customer order creation
app.use("/api/orders", orderRoutes);

// Global error handler
app.use(
  (
    error: Error & { statusCode?: number },
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(error);

    res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode
        ? error.message
        : "Internal server error",
    });
  }
);

export default app;
