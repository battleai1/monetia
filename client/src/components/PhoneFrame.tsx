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
        document.documentElement.style.setProperty('--viewport-height', '904px');
        document.documentElement.style.setProperty('--viewport-width', '402px');
        // Calculate phone center position for desktop
        const phoneLeft = `calc(50vw - 201px)`; // center of screen - half of phone width
        document.documentElement.style.setProperty('--phone-left', phoneLeft);
        // Calculate bottom position: (screen height - phone height) / 2
        const phoneHeight = 932; // iPhone frame total height with border
        const phoneBottom = `calc((100vh - ${phoneHeight}px) / 2)`;
        document.documentElement.style.setProperty('--phone-bottom', phoneBottom);
      } else {
        document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
        document.documentElement.style.setProperty('--viewport-width', `${window.innerWidth}px`);
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
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[50] pointer-events-none">
          <img 
            src={monetiaLogo} 
            alt="Monetia" 
            className="h-12 w-auto"
          />
        </div>
        
        {/* Content container - positioned in center */}
        <div className="fixed inset-0 flex items-center justify-center z-[2] pointer-events-none">
          <div 
            style={{ width: '402px', height: '904px' }} 
            className="pointer-events-auto"
          >
            {children}
          </div>
        </div>
        
        {/* iPhone Frame - rendered AFTER children, higher z-index */}
        <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none">
          <div className="relative">
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
            
            {/* Bottom mask - covers the area below the phone */}
            <div 
              className="absolute left-0 right-0 bg-black"
              style={{ 
                top: '932px',
                height: 'calc(100vh - ((100vh - 932px) / 2) - 932px)',
              }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}
