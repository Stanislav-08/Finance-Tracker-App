import type { NextFunction, Request, Response } from "express";
import {
  createRemoteJWKSet,
  jwtVerify,
} from "jose";

const supabaseUrl = process.env.SUPABASE_URL;

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL is not defined");
}

const JWKS = createRemoteJWKSet(
  new URL(
    `${supabaseUrl}/auth/v1/.well-known/jwks.json`
  )
);

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authorization =
      req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const [scheme, token] =
      authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Invalid authorization header",
      });
    }

    const { payload } = await jwtVerify(
      token,
      JWKS
    );

    if (!payload.sub) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    req.userId = payload.sub;

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
}