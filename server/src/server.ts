import "dotenv/config";

import express from "express";
import cors from "cors";

import bankingRouter from "./routes/banking.js";

const app = express();

const PORT =
  Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.use(
  "/api/banking",
  bankingRouter
);

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});