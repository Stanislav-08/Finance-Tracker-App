import { Router } from "express";
import {
  getTotalBalance,
  getTotalSavings,
  getTransactions,
} from "../services/account/accountService.js";

const router = Router();

router.get("/balance/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const totalBalance = await getTotalBalance(userId);

    res.json({
      totalBalance,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to get total balance",
    });
  }
});

router.get("/savings/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const totalSavings = await getTotalSavings(userId);

    res.json({
      totalSavings,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to get total savings",
    });
  }
});

router.get("/transactions/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await getTransactions(userId);

    res.json({
      transactions,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to get transactions",
    });
  }
});

export default router;