
import express from "express";
import cors from "cors";
import helmet from "helmet";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./config/auth.js";

import orderRoutes from "./routes/order.routes.js";
import { requireAuth } from "./middleware/auth.middleware.js";
import { allowRoles } from "./middleware/role.middleware.js";

import publicMenuRoutes from "./routes/public-menu.routes.js";
import menuRoutes from "./routes/menu.routes.js";
import adminMenuRoutes from "./routes/admin-menu.routes.js";

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

// Better Auth handler must come before express.json()
app.all("/api/auth/{*any}", toNodeHandler(auth));

// Parse JSON request bodies
app.use(express.json());

// Public health-check route
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "PizzaHub API is running!",
  });
});

// Public menu routes
app.use("/api/menu", publicMenuRoutes);

// Protected route: any authenticated user
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

// Vendor-only test route
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

// Vendor menu management routes
app.use("/api/vendor/menu", menuRoutes);

// Admin-only test route
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

// Admin menu approval routes
app.use("/api/admin/menu", adminMenuRoutes);

app.use("/api/orders", orderRoutes);
// Global error handler (must be last)
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
