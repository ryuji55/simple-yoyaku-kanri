import express from "express";
import cors from "cors";
import { config } from "./src/config/env";
import routes from "./src/presentation/routes";
import { errorHandler } from "./src/presentation/middlewares/errorHandler";

const app = express();

app.use(cors({
  origin: config.nodeEnv === 'development' 
    ? ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'] 
    : config.frontend.url,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", routes);

app.use(errorHandler);

const port = config.port;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
