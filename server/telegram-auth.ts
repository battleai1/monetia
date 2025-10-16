import crypto from 'crypto';

interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

interface ValidatedData {
  user: TelegramUser;
  auth_date: number;
  hash: string;
}

export function validateTelegramWebAppData(initData: string, botToken: string): ValidatedData | null {
  try {
    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');
    
    if (!hash) {
      console.error('[Telegram Auth] No hash in initData');
      return null;
    }

    urlParams.delete('hash');
    
    const dataCheckArray: string[] = [];
    for (const [key, value] of Array.from(urlParams.entries()).sort((a, b) => a[0].localeCompare(b[0]))) {
      dataCheckArray.push(`${key}=${value}`);
    }
    const dataCheckString = dataCheckArray.join('\n');

    const secretKey = crypto
      .createHmac('sha256', 'WebAppData')
      .update(botToken)
      .digest();

    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    if (calculatedHash !== hash) {
      console.error('[Telegram Auth] Hash mismatch');
      return null;
    }

    const authDateStr = urlParams.get('auth_date');
    if (!authDateStr) {
      console.error('[Telegram Auth] No auth_date in initData');
      return null;
    }

    const authDate = parseInt(authDateStr, 10);
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (currentTime - authDate > 86400) {
      console.error('[Telegram Auth] Data is too old (more than 24 hours)');
      return null;
    }

    const userStr = urlParams.get('user');
    if (!userStr) {
      console.error('[Telegram Auth] No user data in initData');
      return null;
    }

    const user: TelegramUser = JSON.parse(userStr);
    
    if (!user.id) {
      console.error('[Telegram Auth] No user ID in user data');
      return null;
    }

    return {
      user,
      auth_date: authDate,
      hash
    };
  } catch (error) {
    console.error('[Telegram Auth] Validation error:', error);
    return null;
  }
}

export function extractInitData(req: any): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('tma ')) {
    return authHeader.substring(4);
  }
  
  return null;
}
