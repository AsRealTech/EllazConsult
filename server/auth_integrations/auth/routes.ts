import type { Express } from "express";
import { storage } from "../../storage";
import { isAuthenticated } from "./loginAuth";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this-in-production";
const JWT_EXPIRY = "7d";

// Register auth-specific routes
export function registerAuthRoutes(app: Express): void {
  // Login endpoint
  app.post("/api/auth/login", async (req: any, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }

      // Get admin from database by email
      const admin = await storage.getAdminByEmail(email);
      if (!admin) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: admin.id,
          email: admin.email,
          username: admin.username,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
      );

      res.status(200).json({
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  });

  // Get current authenticated user
  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const admin = await storage.getAdmin(req.user.id);
      if (!admin) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({
        id: admin.id,
        email: admin.email,
        username: admin.username,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({
        message: "Failed to fetch user",
      });
    }
  });

  // Logout endpoint (client-side will remove token)
  app.post("/api/auth/logout", isAuthenticated, (req, res) => {
    res.json({
      message: "Logged out successfully",
    });
  });
}
