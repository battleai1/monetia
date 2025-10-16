import { ReactNode, useEffect } from 'react';

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
        document.documentElement.style.setProperty('--viewport-height', '880px');
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
      <div className="hidden lg:flex fixed inset-0 items-center justify-center bg-black z-10">
        <div className="relative z-20">
          {/* iPhone Frame with overflow hidden */}
          <div 
            className="relative bg-black rounded-[3rem] shadow-2xl overflow-hidden border-[14px] border-slate-900"
            style={{
              width: '430px',
              height: '932px',
              zIndex: 30,
            }}
          >
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-36 h-7 bg-black rounded-full shadow-lg" style={{ zIndex: 50 }}></div>
            
            <div 
              className="w-full h-full overflow-hidden bg-black flex justify-center"
            >
              <div style={{ width: '402px', height: '880px' }} className="overflow-visible bg-black">
                {children}
              </div>
            </div>
          </div>
          
          {/* iPhone buttons */}
          <div className="absolute -right-1 top-32 w-1 h-12 bg-slate-900 rounded-l" style={{ zIndex: 30 }}></div>
          <div className="absolute -right-1 top-52 w-1 h-16 bg-slate-900 rounded-l" style={{ zIndex: 30 }}></div>
          <div className="absolute -right-1 top-72 w-1 h-16 bg-slate-900 rounded-l" style={{ zIndex: 30 }}></div>
          <div className="absolute -left-1 top-28 w-1 h-8 bg-slate-900 rounded-r" style={{ zIndex: 30 }}></div>
          <div className="absolute -left-1 top-40 w-1 h-20 bg-slate-900 rounded-r" style={{ zIndex: 30 }}></div>
          
          {/* Bottom mask - covers the area below the phone to hide the comments sheet */}
          <div 
            className="absolute left-0 right-0 bg-black pointer-events-none"
            style={{ 
              top: '932px',
              height: 'calc(100vh - ((100vh - 932px) / 2) - 932px)',
              zIndex: 40 
            }}
          ></div>
        </div>
      </div>

      <div className="lg:hidden w-full h-full">
        {children}
      </div>
    </>
  );
}
