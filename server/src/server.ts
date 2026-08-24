import "dotenv/config";
import express from "express";
import cors from "cors";
import prisma from "./lib/prisma.js";
import {
  requireAuth,
  type AuthenticatedRequest,
} from "./middleware/auth.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Finance Tracker API",
  });
});

app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.get(
  "/api/me",
  requireAuth,
  (req: AuthenticatedRequest, res) => {
    res.json({
      userId: req.userId,
    });
  }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});