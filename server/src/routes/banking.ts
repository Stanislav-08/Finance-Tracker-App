import { Router } from "express";

import {
  createAuthUrl,
  exchangeCodeForToken,
  getAccounts,
  getBalance,
  getTransactions,
} from "../services/banking/truelayer.js";

const router = Router();

router.get("/connect", (_req, res) => {
  try {
    const url = createAuthUrl();

    res.json({
      url,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create TrueLayer authorization URL",
    });
  }
});

router.get("/callback", async (req, res) => {
  try {
    const code = req.query.code;

    if (typeof code !== "string") {
      return res.status(400).json({
        error: "Missing authorization code",
      });
    }

    const tokenData =
      await exchangeCodeForToken(code);

    console.log("TrueLayer authentication successful");

    console.log({
      accessToken:
        Boolean(tokenData.access_token),

      refreshToken:
        Boolean(tokenData.refresh_token),

      expiresIn:
        tokenData.expires_in,
    });

    res.json({
      success: true,
      message:
        "TrueLayer bank connection successful",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to complete bank connection",
    });
  }
});

router.get(
  "/test/accounts",
  async (req, res) => {
    try {
      const accessToken =
        req.headers.authorization?.replace(
          "Bearer ",
          ""
        );

      if (!accessToken) {
        return res.status(401).json({
          error: "Missing access token",
        });
      }

      const accounts =
        await getAccounts(accessToken);

      res.json(accounts);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Failed to retrieve accounts",
      });
    }
  }
);

router.get(
  "/test/accounts/:accountId/balance",
  async (req, res) => {
    try {
      const accessToken =
        req.headers.authorization?.replace(
          "Bearer ",
          ""
        );

      if (!accessToken) {
        return res.status(401).json({
          error: "Missing access token",
        });
      }

      const balance =
        await getBalance(
          accessToken,
          req.params.accountId
        );

      res.json(balance);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Failed to retrieve balance",
      });
    }
  }
);

router.get(
  "/test/accounts/:accountId/transactions",
  async (req, res) => {
    try {
      const accessToken =
        req.headers.authorization?.replace(
          "Bearer ",
          ""
        );

      if (!accessToken) {
        return res.status(401).json({
          error: "Missing access token",
        });
      }

      const transactions =
        await getTransactions(
          accessToken,
          req.params.accountId
        );

      res.json(transactions);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Failed to retrieve transactions",
      });
    }
  }
);

export default router;