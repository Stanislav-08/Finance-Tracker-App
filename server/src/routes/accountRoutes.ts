import { Router } from "express";

import {
  getTotalBalance,
  getTotalSavings,
  getMonthlyContribution,
  getTransactions,
  getSavingsGoals,
  createSavingsGoal,
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

router.get("/monthly-contribution/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const monthlyContribution = await getMonthlyContribution(userId);

    res.json({
      monthlyContribution,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to get monthly contribution",
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

router.get("/savings-goals/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const savingsGoals = await getSavingsGoals(userId);

    res.json({
      savingsGoals,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to get savings goals",
    });
  }
});

router.post("/savings-goals/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const {
      name,
      categoryId,
      target,
      deadline,
    } = req.body;

    if (!name || !categoryId || !target || !deadline) {
      return res.status(400).json({
        error: "Name, categoryId, target, and deadline are required",
      });
    }

    const savingsGoal = await createSavingsGoal(
      userId,
      name,
      categoryId,
      Number(target),
      new Date(deadline)
    );

    res.status(201).json({
      savingsGoal,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create savings goal",
    });
  }
});

export default router;