import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Send, MessageCircle, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  reelId?: string;
}

export default function ShareSheet({ isOpen, onClose, reelId }: ShareSheetProps) {
  const handleTelegramShare = () => {
    if (window.Telegram?.WebApp) {
      const shareUrl = `${window.location.origin}?reel=${reelId || 'shared'}`;
      const shareText = `Посмотри этот крутой ролик про вертикальные видео! 🔥`;
      
      window.Telegram.WebApp.openLink(
        `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
      );
    }
    onClose();
  };

  const handleTelegramContact = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink('https://t.me/+xxtfdN-63QNlNWFi');
    }
    onClose();
  };

  const contacts = [
    {
      icon: MessageCircle,
      label: 'Telegram чат',
      description: 'Присоединиться к сообществу',
      action: handleTelegramContact,
      testId: 'share-telegram-chat'
    },
    {
      icon: Send,
      label: 'Поделиться в Telegram',
      description: 'Отправить друзьям',
      action: handleTelegramShare,
      testId: 'share-telegram-send'
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="bottom" 
        className="bg-black/95 backdrop-blur-xl border-t border-white/10 rounded-t-3xl"
      >
        <SheetHeader className="pb-4">
          <SheetTitle className="text-white text-xl font-semibold text-center">
            Поделиться
          </SheetTitle>
        </SheetHeader>
        
        <div className="space-y-2 pb-safe pb-4">
          {contacts.map((contact) => (
            <Button
              key={contact.testId}
              onClick={contact.action}
              variant="ghost"
              className="w-full h-auto py-4 px-4 flex items-center gap-4 justify-start hover:bg-white/10 text-left"
              data-testid={contact.testId}
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                <contact.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-white font-medium text-base">
                  {contact.label}
                </div>
                <div className="text-white/60 text-sm">
                  {contact.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
