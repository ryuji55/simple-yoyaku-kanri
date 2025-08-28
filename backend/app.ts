import express from "express";
import cors from "cors";
import helmet from "helmet";
import { env } from "./src/config/env.validation";
import { errorHandler } from "./src/middleware/errorHandler";
import adminRoutes from "./src/routes/admin";
import authRoutes from "./src/routes/auth";
import healthRoutes from "./src/routes/health";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: env.isDevelopment ? 'http://localhost:3000' : env.FRONTEND_URL,
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check and monitoring
app.use(healthRoutes);

// Root endpoint
app.get("/", (_req, res) => {
  res.json({ 
    status: "ok",
    service: "Simple Yoyaku Kanri API",
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

const port = env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port} in ${env.NODE_ENV} mode`);
});
