import { ReactNode, useEffect } from 'react';
import monetiaLogo from '@assets/monetia_1760652591315.webp';

interface PhoneFrameProps {
  children: ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      const isDesktop = window.innerWidth >= 1024;
      if (isDesktop) {
        // Calculate scale based on available screen space
        const screenHeight = window.innerHeight;
        const screenWidth = window.innerWidth;
        
        // Target phone dimensions (iPhone 17 Pro Max)
        const basePhoneWidth = 430;
        const basePhoneHeight = 932;
        const baseContentWidth = 402;
        const baseContentHeight = 904;
        
        // Calculate maximum scale that fits on screen (with some padding)
        const maxScaleY = (screenHeight * 0.92) / basePhoneHeight; // 92% of screen height
        const maxScaleX = (screenWidth * 0.9) / basePhoneWidth; // 90% of screen width
        const scale = Math.min(maxScaleY, maxScaleX, 1); // Never scale above 100%
        
        // Set scaled dimensions
        const scaledContentWidth = baseContentWidth * scale;
        const scaledContentHeight = baseContentHeight * scale;
        
        document.documentElement.style.setProperty('--viewport-height', `${scaledContentHeight}px`);
        document.documentElement.style.setProperty('--viewport-width', `${scaledContentWidth}px`);
        document.documentElement.style.setProperty('--phone-scale', scale.toString());
        
        // Calculate phone center position for desktop
        const phoneLeft = `calc(50vw - ${scaledContentWidth / 2}px)`;
        document.documentElement.style.setProperty('--phone-left', phoneLeft);
        
        // Calculate bottom position: (screen height - phone height) / 2
        const scaledPhoneHeight = basePhoneHeight * scale;
        const phoneBottom = `calc((100vh - ${scaledPhoneHeight}px) / 2)`;
        document.documentElement.style.setProperty('--phone-bottom', phoneBottom);
      } else {
        document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
        document.documentElement.style.setProperty('--viewport-width', `${window.innerWidth}px`);
        document.documentElement.style.setProperty('--phone-scale', '1');
        document.documentElement.style.setProperty('--phone-left', '0px');
        document.documentElement.style.setProperty('--phone-bottom', '0px');
      }
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    
    return () => window.removeEventListener('resize', setVH);
  }, []);

  return (
    <>
      {/* Mobile: render children directly */}
      <div className="lg:hidden w-full h-full">
        {children}
      </div>

      {/* Desktop: render children first, then frame on top */}
      <div className="hidden lg:block">
        {/* Background */}
        <div className="fixed inset-0 bg-black z-[1]"></div>
        
        {/* Monetia Logo - centered above phone */}
        <div 
          className="fixed left-1/2 -translate-x-1/2 z-[50] pointer-events-none"
          style={{
            top: 'calc(var(--phone-bottom, 0px) / 2 - 24px)',
          }}
        >
          <img 
            src={monetiaLogo} 
            alt="Monetia" 
            className="w-auto"
            style={{
              height: 'calc(48px * var(--phone-scale, 1))',
            }}
          />
        </div>
        
        {/* Content container - positioned in center */}
        <div className="fixed inset-0 flex items-center justify-center z-[2] pointer-events-none">
          <div 
            style={{ 
              width: 'var(--viewport-width, 402px)', 
              height: 'var(--viewport-height, 904px)',
              transform: 'scale(1)', // Ensures crisp rendering
            }} 
            className="pointer-events-auto origin-center"
          >
            {children}
          </div>
        </div>
        
        {/* iPhone Frame - rendered AFTER children, higher z-index */}
        <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none">
          <div 
            className="relative origin-center"
            style={{
              transform: `scale(var(--phone-scale, 1))`,
            }}
          >
            {/* iPhone Frame border */}
            <div 
              className="relative bg-transparent rounded-[3rem] border-[14px] border-slate-900 pointer-events-none"
              style={{
                width: '430px',
                height: '932px',
              }}
            >
              {/* Dynamic Island */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-36 h-7 bg-black rounded-full shadow-lg"></div>
            </div>
            
            {/* iPhone buttons */}
            <div className="absolute -right-1 top-32 w-1 h-12 bg-slate-900 rounded-l"></div>
            <div className="absolute -right-1 top-52 w-1 h-16 bg-slate-900 rounded-l"></div>
            <div className="absolute -right-1 top-72 w-1 h-16 bg-slate-900 rounded-l"></div>
            <div className="absolute -left-1 top-28 w-1 h-8 bg-slate-900 rounded-r"></div>
            <div className="absolute -left-1 top-40 w-1 h-20 bg-slate-900 rounded-r"></div>
            
            {/* Edge mask - hides corners that stick out during animation */}
            <div 
              className="absolute inset-0 rounded-[3rem] pointer-events-none"
              style={{
                boxShadow: '0 0 0 100px black',
                width: '430px',
                height: '932px',
              }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
