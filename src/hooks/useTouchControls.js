import { useState, useEffect, useCallback } from 'react';

export const useTouchControls = ({ onScroll, isEnabled = true }) => {
  const [touchStart, setTouchStart] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleTouchStart = useCallback((e) => {
    if (!isEnabled) return;
    
    const touch = e.touches[0];
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    });
    setIsDragging(false);
  }, [isEnabled]);

  const handleTouchMove = useCallback((e) => {
    if (!isEnabled || !touchStart) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    // Check if horizontal movement is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
      e.preventDefault();
      setIsDragging(true);
      
      // Convert touch movement to scroll progress
      const sensitivity = 0.003;
      const scrollDelta = -deltaX * sensitivity;
      onScroll?.(scrollDelta);
    }
  }, [isEnabled, touchStart, onScroll]);

  const handleTouchEnd = useCallback((e) => {
    if (!isEnabled || !touchStart) return;
    
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    const deltaTime = Date.now() - touchStart.time;
    
    // Detect swipe gestures
    const isSwipe = Math.abs(deltaX) > 50 && deltaTime < 300;
    
    if (isSwipe && Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault();
      const swipeDirection = deltaX > 0 ? 'right' : 'left';
      const swipeDistance = swipeDirection === 'right' ? -0.2 : 0.2;
      onScroll?.(swipeDistance);
    }
    
    setTouchStart(null);
    setIsDragging(false);
  }, [isEnabled, touchStart, onScroll]);

  useEffect(() => {
    if (!isEnabled) return;

    const options = { passive: false };
    
    document.addEventListener('touchstart', handleTouchStart, options);
    document.addEventListener('touchmove', handleTouchMove, options);
    document.addEventListener('touchend', handleTouchEnd, options);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isEnabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    isDragging
  };
};