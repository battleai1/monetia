import { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <>
      <div className="hidden lg:flex fixed inset-0 items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="relative">
          <div 
            className="relative bg-black rounded-[3rem] shadow-2xl overflow-hidden border-[14px] border-slate-900"
            style={{
              width: '430px',
              height: '932px',
            }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-50"></div>
            
            <div className="w-full h-full overflow-hidden bg-black">
              {children}
            </div>
          </div>
          
          <div className="absolute -right-1 top-32 w-1 h-12 bg-slate-900 rounded-l"></div>
          <div className="absolute -right-1 top-52 w-1 h-16 bg-slate-900 rounded-l"></div>
          <div className="absolute -right-1 top-72 w-1 h-16 bg-slate-900 rounded-l"></div>
          <div className="absolute -left-1 top-28 w-1 h-8 bg-slate-900 rounded-r"></div>
          <div className="absolute -left-1 top-40 w-1 h-20 bg-slate-900 rounded-r"></div>
        </div>
      </div>

      <div className="lg:hidden w-full h-full">
        {children}
      </div>
    </>
  );
}
