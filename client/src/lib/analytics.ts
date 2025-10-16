export const logEvent = (eventName: string, data?: Record<string, any>) => {
  console.log(`[Analytics] ${eventName}`, data);
};

export const logReelView = (id: string, mode: 'sales' | 'training') => {
  logEvent('reel_view', { id, mode });
};

export const logCTAShown = (id: string, text: string) => {
  logEvent('cta_shown', { id, text });
};

export const logCTAClick = (id: string, text: string) => {
  logEvent('cta_click', { id, text });
};

export const logLessonExpand = (id: string) => {
  logEvent('lesson_expand', { id });
};

export const logPurchaseClick = (location: string) => {
  logEvent('purchase_click', { location });
};
