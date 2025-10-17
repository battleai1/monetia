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
  if (!BOT_TOKEN || !CHANNEL_ID) {
    console.log('[Telegram Bot] Skipping bot initialization - missing required environment variables');
    return null;
  }

  try {
    bot = new Telegraf(BOT_TOKEN);

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

        // Получаем информацию о боте для создания правильной ссылки
        const botInfo = await bot!.telegram.getMe();
        const webAppUrl = `https://t.me/${botInfo.username}?start=welcome`;

        // Отправляем приветственное сообщение с inline кнопкой
        await bot!.telegram.sendMessage(userId, '+10 руб. - продолжи просмотр', {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '🚀 Открыть приложение',
                  url: webAppUrl,
                },
              ],
            ],
          },
        });

        console.log('[Telegram Bot] Welcome message sent to user:', userId);
      } catch (error) {
        console.error('[Telegram Bot] Error handling join request:', error);
      }
    });

    // Запускаем бота
    bot.launch({
      dropPendingUpdates: true,
    }).then(() => {
      console.log('[Telegram Bot] Bot started successfully');
    }).catch((error) => {
      console.error('[Telegram Bot] Failed to start bot:', error);
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
