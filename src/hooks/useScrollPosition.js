import { useState, useEffect } from 'react';

export const useScrollPosition = () => {
  const [scrollX, setScrollX] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollX = window.scrollX;
      const maxScrollX = document.documentElement.scrollWidth - window.innerWidth;
      const progress = maxScrollX > 0 ? currentScrollX / maxScrollX : 0;
      
      setScrollX(currentScrollX);
      setScrollProgress(Math.min(Math.max(progress, 0), 1));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrollX, scrollProgress };
};