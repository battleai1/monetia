import { useState, useEffect } from 'react';

export const useViewportHeight = () => {
  const [height, setHeight] = useState(() => {
    const isDesktop = window.innerWidth >= 1024;
    return isDesktop ? 932 : window.innerHeight;
  });

  useEffect(() => {
    const updateHeight = () => {
      const isDesktop = window.innerWidth >= 1024;
      setHeight(isDesktop ? 932 : window.innerHeight);
    };

    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return height;
};
