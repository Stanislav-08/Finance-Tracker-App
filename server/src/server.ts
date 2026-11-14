import "dotenv/config";
import express from "express";
import cors from "cors";
import accountRoutes from "./routes/accountRoutes.js";
import bankingRouter from "./routes/banking.js";

const app = express();

const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: (process.env.CLIENT_ORIGIN ?? "http://localhost:5173").split(","),
  }),
);

app.use(express.json());
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

app.use("/api/banking", bankingRouter);

app.use("/api/accounts", accountRoutes);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
