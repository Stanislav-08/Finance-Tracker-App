import { Router } from "express";
import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth.middleware.js";

import {
  getTotalBalance,
  getTotalSavings,
  getMonthlyContribution,
  getTransactions,
  getSavingsGoals,
  createSavingsGoal,
  getAccounts,
  getCategories,
  createTransaction,
  updateMonthlyContribution,
  getBudgets,
  upsertBudget,
  depositToGoal,
  createAccount,
  deleteTransaction,
  getSubscriptions,
  createSubscription,
  deleteSubscription,
} from "../services/account/accountService.js";

const router = Router();

// Every route requires a valid Supabase JWT, and :userId must be the caller.
router.use(requireAuth);

router.param("userId", (req, res, next, value) => {
  if ((req as AuthenticatedRequest).userId !== value) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
});

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

router.get("/accounts/:userId", async (req, res) => {
  try {
    const accounts = await getAccounts(req.params.userId);
    res.json({ accounts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get accounts" });
  }
});

router.get("/categories/:userId", async (_req, res) => {
  try {
    const categories = await getCategories();
    res.json({ categories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get categories" });
  }
});

router.post("/transactions/:userId", async (req, res) => {
  try {
    const { accountId, categoryId, amount, type, merchant, description, date } =
      req.body;

    const parsedAmount = Number(amount);

    if (
      !accountId ||
      !date ||
      !Number.isFinite(parsedAmount) ||
      parsedAmount <= 0 ||
      (type !== "income" && type !== "expense")
    ) {
      return res.status(400).json({
        error: "accountId, positive amount, type (income|expense) and date are required",
      });
    }

    const transaction = await createTransaction(req.params.userId, {
      accountId,
      categoryId,
      amount: parsedAmount,
      type,
      merchant,
      description,
      date: new Date(date),
    });

    res.status(201).json({ transaction });
  } catch (error) {
    if (error instanceof Error && error.message === "ACCOUNT_NOT_FOUND") {
      return res.status(404).json({ error: "Account not found" });
    }
    console.error(error);
    res.status(500).json({ error: "Failed to create transaction" });
  }
});

router.put("/monthly-contribution/:userId", async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount < 0) {
      return res.status(400).json({ error: "amount must be a number >= 0" });
    }

    const monthlyContribution = await updateMonthlyContribution(
      req.params.userId,
      amount
    );
    res.json({ monthlyContribution });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update monthly contribution" });
  }
});

router.get("/budgets/:userId", async (req, res) => {
  try {
    const month = Number(req.query.month), year = Number(req.query.year);
    res.json({ budgets: await getBudgets(req.params.userId, month, year) });
  } catch (e) { console.error(e); res.status(500).json({ error: "Failed to get budgets" }); }
});

router.put("/budgets/:userId", async (req, res) => {
  try {
    const { categoryId, month, year } = req.body, amount = Number(req.body.amount);
    if (!categoryId || !month || !year || !Number.isFinite(amount) || amount < 0)
      return res.status(400).json({ error: "categoryId, month, year, amount required" });
    res.json({ budget: await upsertBudget(req.params.userId, categoryId, Number(month), Number(year), amount) });
  } catch (e) { console.error(e); res.status(500).json({ error: "Failed to save budget" }); }
});

router.post("/savings-goals/:userId/:goalId/deposit", async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ error: "Positive amount required" });
    const ok = await depositToGoal(req.params.userId, req.params.goalId, amount);
    if (!ok) return res.status(404).json({ error: "Goal not found" });
    res.json({ success: true });
  } catch (e) { console.error(e); res.status(500).json({ error: "Failed to deposit" }); }
});

router.post("/accounts/:userId", async (req, res) => {
  try {
    const { name, currency } = req.body;
    if (!name) return res.status(400).json({ error: "name required" });
    res.status(201).json({ account: await createAccount(req.params.userId, name, currency || "EUR") });
  } catch (e) { console.error(e); res.status(500).json({ error: "Failed to create account" }); }
});

router.delete("/transactions/:userId/:id", async (req, res) => {
  try {
    const ok = await deleteTransaction(req.params.userId, req.params.id);
    ok ? res.json({ success: true }) : res.status(404).json({ error: "Not found" });
  } catch (e) { console.error(e); res.status(500).json({ error: "Failed to delete transaction" }); }
});

router.get("/subscriptions/:userId", async (req, res) => {
  try { res.json({ subscriptions: await getSubscriptions(req.params.userId) }); }
  catch (e) { console.error(e); res.status(500).json({ error: "Failed to get subscriptions" }); }
});

router.post("/subscriptions/:userId", async (req, res) => {
  try {
    const { name, billingCycle, nextPaymentDate } = req.body, amount = Number(req.body.amount);
    if (!name || !(amount > 0) || !["monthly", "yearly"].includes(billingCycle) || !nextPaymentDate)
      return res.status(400).json({ error: "name, amount, billingCycle, nextPaymentDate required" });
    const subscription = await createSubscription(req.params.userId, {
      name, amount, currency: req.body.currency || "EUR", billingCycle, nextPaymentDate: new Date(nextPaymentDate),
    });
    res.status(201).json({ subscription });
  } catch (e) { console.error(e); res.status(500).json({ error: "Failed to create subscription" }); }
});

router.delete("/subscriptions/:userId/:id", async (req, res) => {
  try {
    const ok = await deleteSubscription(req.params.userId, req.params.id);
    ok ? res.json({ success: true }) : res.status(404).json({ error: "Not found" });
  } catch (e) { console.error(e); res.status(500).json({ error: "Failed to delete subscription" }); }
});

export default router;