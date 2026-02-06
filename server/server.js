import express from "express";
import cors from "cors";
import loadEnv from "./config/env.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import setupRoutes from "./routes/setup.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import enrollmentRoutes from "./routes/enrollment.routes.js";

loadEnv();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/setup", setupRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/enrollment", enrollmentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
