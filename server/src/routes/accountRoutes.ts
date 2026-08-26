import { Router } from "express";
import { getTotalBalance } from "../services/account/accountService.js";

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

export default router;