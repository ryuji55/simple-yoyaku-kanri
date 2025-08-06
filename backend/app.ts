import express from "express";
import cors from "cors";
import helmet from "helmet";
import { PrismaClient } from "@prisma/client";
import { config } from "./src/config/env";
import { errorHandler } from "./src/middleware/errorHandler";
import { SeedService } from "./src/services/seedService";
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

// Initialize seed service
const seedService = new SeedService();

const startServer = async () => {
  try {
    // Seed initial admin if needed
    await seedService.seedInitialAdminIfNeeded();
    
    // Start server
    const port = config.port;
    app.listen(port, () => {
      console.log(`Server running on port ${port} in ${config.nodeEnv} mode`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
