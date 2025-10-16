import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authenticateTelegramUser } from "./middleware";
import { extractInitData } from "./telegram-auth";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/auth/telegram", authenticateTelegramUser, async (req, res) => {
    try {
      if (!req.telegramUser) {
        return res.status(401).json({ error: "Authentication failed" });
      }

      const user = await storage.getUserByTelegramId(req.telegramUser.id);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({
        success: true,
        user: {
          telegramId: user.telegramId,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
        }
      });
    } catch (error) {
      console.error("[Auth Route] Error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/auth/me", authenticateTelegramUser, async (req, res) => {
    try {
      if (!req.telegramUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const user = await storage.getUserByTelegramId(req.telegramUser.id);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      });
    } catch (error) {
      console.error("[Auth Route] Error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/debug/auth-status", async (req, res) => {
    try {
      const botToken = process.env.TELEGRAM_BOT_TOKEN;
      const initData = extractInitData(req);
      
      const debugInfo = {
        hasBotToken: !!botToken,
        hasInitData: !!initData,
        initDataPreview: initData ? initData.substring(0, 50) + '...' : null,
        timestamp: new Date().toISOString(),
      };

      return res.json(debugInfo);
    } catch (error) {
      console.error("[Debug Route] Error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
