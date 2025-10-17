import { Telegraf } from 'telegraf';
import type { ChatJoinRequest } from 'telegraf/types';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

if (!BOT_TOKEN) {
  console.error('[Telegram Bot] TELEGRAM_BOT_TOKEN not found in environment variables');
}

if (!CHANNEL_ID) {
  console.error('[Telegram Bot] TELEGRAM_CHANNEL_ID not found in environment variables');
}

let bot: Telegraf | null = null;

export function initTelegramBot() {
  console.log('[Telegram Bot] Initializing...');
  console.log('[Telegram Bot] BOT_TOKEN available:', !!BOT_TOKEN);
  console.log('[Telegram Bot] CHANNEL_ID available:', !!CHANNEL_ID);
  
  if (!BOT_TOKEN || !CHANNEL_ID) {
    console.log('[Telegram Bot] Skipping bot initialization - missing required environment variables');
    return null;
  }

  try {
    bot = new Telegraf(BOT_TOKEN);

    // Проверяем валидность токена
    bot.telegram.getMe().then((botInfo) => {
      console.log('[Telegram Bot] ✅ Bot authenticated:', botInfo.username);
    }).catch((error) => {
      console.error('[Telegram Bot] ❌ Authentication failed:', error.message);
    });

    // Обработчик заявок на вступление в канал
    bot.on('chat_join_request', async (ctx) => {
      try {
        const joinRequest = ctx.chatJoinRequest as ChatJoinRequest;
        const userId = joinRequest.from.id;
        const chatId = joinRequest.chat.id;
        const userName = joinRequest.from.first_name || 'Пользователь';

        console.log('[Telegram Bot] New join request:', {
          userId,
          userName,
          chatId,
          channelId: CHANNEL_ID,
        });

        // Проверяем что это наш канал
        if (chatId.toString() !== CHANNEL_ID) {
          console.log('[Telegram Bot] Join request for different channel, skipping');
          return;
        }

        // Принимаем заявку
        await ctx.approveChatJoinRequest(userId);
        console.log('[Telegram Bot] Join request approved for user:', userId);

        // Создаем валидированный WebApp URL с deep link
        const domain = process.env.REPLIT_DEV_DOMAIN || 'https://neurotrraffic.replit.app';
        const webAppUrl = `${domain.startsWith('http') ? domain : `https://${domain}`}?startapp=s1`;

        const welcomeMessage = `Привет, ${userName}!\n\n+10 руб. - продолжи просмотр`;
        
        // Пытаемся отправить сообщение в личку пользователю
        try {
          await bot!.telegram.sendMessage(userId, welcomeMessage, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: 'Открыть приложение',
                    web_app: { url: webAppUrl },
                  },
                ],
              ],
            },
          });
          console.log('[Telegram Bot] ✅ Welcome message sent to user DM:', userName);
        } catch (dmError) {
          // Если не получилось отправить в личку - отправляем в канал
          const dmErrorMessage = dmError instanceof Error ? dmError.message : String(dmError);
          console.log('[Telegram Bot] ⚠️ Cannot send DM to user (user must start chat first):', dmErrorMessage);
          console.log('[Telegram Bot] Sending welcome message to channel instead...');
          
          await bot!.telegram.sendMessage(chatId, welcomeMessage, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: 'Открыть приложение',
                    web_app: { url: webAppUrl },
                  },
                ],
              ],
            },
          });
          console.log('[Telegram Bot] ✅ Welcome message sent to channel for user:', userName);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        // Специальная обработка 403 Forbidden (бот не может отправлять DM)
        if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
          console.error('[Telegram Bot] ❌ 403 Forbidden - Bot lacks permission. Ensure bot is admin in channel.');
        } else {
          console.error('[Telegram Bot] ❌ Error handling join request:', errorMessage);
        }
      }
    });

    // Запускаем бота
    console.log('[Telegram Bot] Launching bot...');
    bot.launch({
      dropPendingUpdates: true,
    }).then(() => {
      console.log('[Telegram Bot] ✅ Bot started successfully');
    }).catch((error) => {
      console.error('[Telegram Bot] ❌ Failed to start bot:', error);
    });

    // Graceful stop
    process.once('SIGINT', () => {
      console.log('[Telegram Bot] Stopping bot (SIGINT)...');
      bot?.stop('SIGINT');
    });

    process.once('SIGTERM', () => {
      console.log('[Telegram Bot] Stopping bot (SIGTERM)...');
      bot?.stop('SIGTERM');
    });

    return bot;
  } catch (error) {
    console.error('[Telegram Bot] Error initializing bot:', error);
    return null;
  }
}

export function getTelegramBot() {
  return bot;
}
