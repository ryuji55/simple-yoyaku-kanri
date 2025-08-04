import express from "express";
import cors from "cors";
import helmet from "helmet";
import { PrismaClient } from "@prisma/client";
import { config } from "./src/config/env";
import { errorHandler } from "./src/middleware/errorHandler";
import adminRoutes from "./src/routes/admin";
import authRoutes from "./src/routes/auth";

const app = express();
const prisma = new PrismaClient();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.isDevelopment ? true : process.env.FRONTEND_URL,
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/", (req, res) => {
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

const port = config.port;
app.listen(port, () => {
  console.log(`Server running on port ${port} in ${config.nodeEnv} mode`);
});
