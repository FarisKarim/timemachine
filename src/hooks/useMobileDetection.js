import { useState, useEffect } from 'react';

export const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Mobile detection
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileDevice = mobileRegex.test(userAgent) || width < 768;
      
      // Tablet detection
      const isTabletDevice = (width >= 768 && width < 1024) || 
                           /iPad|Android/i.test(userAgent);
      
      // Orientation
      const currentOrientation = width > height ? 'landscape' : 'portrait';
      
      setIsMobile(isMobileDevice);
      setIsTablet(isTabletDevice);
      setOrientation(currentOrientation);
    };

    checkDevice();
    
    const handleResize = () => checkDevice();
    const handleOrientationChange = () => {
      setTimeout(checkDevice, 100); // Delay for orientation change
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    orientation,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait'
  };
};