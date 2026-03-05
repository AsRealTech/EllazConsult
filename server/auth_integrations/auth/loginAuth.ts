import type { Express, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { storage } from "../../storage";
import bcrypt from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production";
const JWT_EXPIRY = "7d"; // 7 days

export interface AuthSession {
  id: number;
  email: string;
  username: string;
}

export async function setupAuth(app: Express): Promise<void> {
  // Auth setup is minimal for JWT approach
  // No passport or express-session needed
}

export const isAuthenticated: RequestHandler = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // Extract token from "Bearer <token>"

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthSession;
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

export function getSession() {
  // No session needed for JWT approach, but kept for compatibility
  return (req: any, res: any, next: any) => next();
}
