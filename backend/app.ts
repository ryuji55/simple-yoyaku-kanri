import express from "express";
import cors from "cors";
import { config } from "./src/config/env";
import routes from "./src/presentation/routes";
import { errorHandler } from "./src/presentation/middlewares/errorHandler";

const app = express();

app.use(cors({
  origin: config.frontend.url,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.use(errorHandler);

const port = config.port;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
