import { Request, Response, NextFunction } from 'express';
import { validateTelegramWebAppData, extractInitData } from './telegram-auth';
import { storage } from './storage';

declare global {
  namespace Express {
    interface Request {
      telegramUser?: {
        id: number;
        first_name?: string;
        last_name?: string;
        username?: string;
      };
    }
  }
}

export async function authenticateTelegramUser(req: Request, res: Response, next: NextFunction) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (!botToken) {
      console.error('[Auth Middleware] TELEGRAM_BOT_TOKEN not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const initData = extractInitData(req);
    
    if (!initData) {
      return res.status(401).json({ error: 'No authentication data provided' });
    }

    const validatedData = validateTelegramWebAppData(initData, botToken);
    
    if (!validatedData) {
      return res.status(401).json({ error: 'Invalid authentication data' });
    }

    req.telegramUser = validatedData.user;

    let user = await storage.getUserByTelegramId(validatedData.user.id);
    
    if (!user) {
      user = await storage.createUser({
        telegramId: validatedData.user.id,
        username: validatedData.user.username || null,
        firstName: validatedData.user.first_name || null,
        lastName: validatedData.user.last_name || null,
      });
      console.log('[Auth Middleware] Created new user:', user.telegramId);
    } else {
      await storage.updateUser(validatedData.user.id, {
        telegramId: validatedData.user.id,
        username: validatedData.user.username || null,
        firstName: validatedData.user.first_name || null,
        lastName: validatedData.user.last_name || null,
      });
      console.log('[Auth Middleware] Updated existing user:', user.telegramId);
    }

    next();
  } catch (error) {
    console.error('[Auth Middleware] Error:', error);
    return res.status(500).json({ error: 'Authentication error' });
  }
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  authenticateTelegramUser(req, res, (err?: any) => {
    if (err) {
      return next();
    }
    next();
  });
}
