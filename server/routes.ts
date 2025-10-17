import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authenticateTelegramUser } from "./middleware";
import { extractInitData } from "./telegram-auth";
import { getCached, setCache, invalidateCache } from "./redis";

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

  // Debug endpoint для очистки localStorage флагов
  app.post("/api/debug/clear-storage/:username", async (req, res) => {
    const { username } = req.params;
    
    return res.json({
      success: true,
      username,
      message: `Инструкция для очистки localStorage для пользователя ${username}`,
      jsCode: `localStorage.removeItem('introCountdownSeen_v1'); console.log('Флаг очищен!');`
    });
  });

  // Video routes with Redis caching
  app.get("/api/videos", async (req, res) => {
    try {
      const cacheKey = "videos:all";
      
      // Проверка кеша
      const cached = await getCached(cacheKey);
      if (cached) {
        console.log("[Videos Route] Cache hit for all videos");
        return res.json(cached);
      }

      // Загрузка из БД
      console.log("[Videos Route] Cache miss, fetching from database");
      const videos = await storage.getAllVideos();
      
      // Сохранение в кеш на 5 минут
      await setCache(cacheKey, videos, 300);
      
      return res.json(videos);
    } catch (error) {
      console.error("[Videos Route] Error:", error);
      return res.status(500).json({ error: "Failed to fetch videos" });
    }
  });

  app.get("/api/videos/:type", async (req, res) => {
    try {
      const { type } = req.params;
      const cacheKey = `videos:type:${type}`;
      
      // Проверка кеша
      const cached = await getCached(cacheKey);
      if (cached) {
        console.log(`[Videos Route] Cache hit for type: ${type}`);
        return res.json(cached);
      }

      // Загрузка из БД
      console.log(`[Videos Route] Cache miss for type: ${type}, fetching from database`);
      const videos = await storage.getVideosByType(type);
      
      // Сохранение в кеш на 5 минут
      await setCache(cacheKey, videos, 300);
      
      return res.json(videos);
    } catch (error) {
      console.error("[Videos Route] Error:", error);
      return res.status(500).json({ error: "Failed to fetch videos" });
    }
  });

  // Cache management endpoint
  app.post("/api/cache/clear", async (req, res) => {
    try {
      const { pattern } = req.body;
      
      if (!pattern) {
        return res.status(400).json({ error: "Pattern is required" });
      }

      await invalidateCache(pattern);
      
      return res.json({ 
        success: true, 
        message: `Cache invalidated for pattern: ${pattern}` 
      });
    } catch (error) {
      console.error("[Cache Route] Error:", error);
      return res.status(500).json({ error: "Failed to clear cache" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
