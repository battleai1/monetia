import { useQuery } from '@tanstack/react-query';
import { useTelegram } from './useTelegram';
import { useEffect } from 'react';

interface AuthResponse {
  success: boolean;
  user?: {
    telegramId: number;
    username: string | null;
    firstName: string | null;
    lastName: string | null;
  };
}

export function useAuth() {
  const { webApp } = useTelegram();

  useEffect(() => {
    console.log('[Auth] WebApp available:', !!webApp);
    console.log('[Auth] initData available:', !!webApp?.initData);
    console.log('[Auth] initData length:', webApp?.initData?.length || 0);
    
    if (!webApp?.initData) {
      console.warn('[Auth] ⚠️  No initData - приложение должно быть открыто через Telegram WebApp (бота), а не напрямую в браузере!');
    }
    
    if (webApp?.initDataUnsafe?.user) {
      console.log('[Auth] User from initDataUnsafe:', webApp.initDataUnsafe.user);
    }
  }, [webApp]);

  const { data, isLoading, error } = useQuery<AuthResponse>({
    queryKey: ['/api/auth/me'],
    enabled: !!webApp?.initData,
    retry: 1,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (error) {
      console.error('[Auth] Authentication error:', error);
    }
    if (data) {
      console.log('[Auth] User authenticated:', data.user?.telegramId);
    }
  }, [data, error]);

  return {
    user: data?.user,
    isAuthenticated: !!data?.user,
    isLoading,
    error,
  };
}
