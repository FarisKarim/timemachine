import { useRef, useEffect, useCallback } from 'react';

export const useGameLoop = (petStateHook, isActive = true) => {
  const frameRef = useRef();
  const lastFrameTime = useRef(Date.now());

  const gameLoop = useCallback(() => {
    if (!isActive) return;

    const now = Date.now();
    const deltaTime = now - lastFrameTime.current;
    
    // Target 60fps, skip frame if too soon
    if (deltaTime < 16.67) {
      frameRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    
    lastFrameTime.current = now;
    
    // Apply stat decay (every ~6 minutes)
    const needsUIUpdate = petStateHook.applyStatDecay();
    
    // Update UI state if needed (batched)
    if (needsUIUpdate || now % 100 < deltaTime) { // Every 100ms
      const currentState = petStateHook.getPetState();
      
      petStateHook.setUIState(prev => ({
        ...prev,
        displayHunger: currentState.hunger,
        displayHappiness: currentState.happiness,
        displayHealth: currentState.health,
        displayEnergy: currentState.energy,
        currentAnimation: getActiveAnimation(currentState),
        needsAttention: currentState.hunger < 30 || currentState.happiness < 30,
        isSleeping: currentState.isSleeping,
        sleepTimeRemaining: currentState.isSleeping ? Math.max(0, currentState.sleepEndTime - now) : 0
      }));
    }
    
    frameRef.current = requestAnimationFrame(gameLoop);
  }, [petStateHook, isActive]);

  // Start/stop game loop
  useEffect(() => {
    if (isActive) {
      frameRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [gameLoop, isActive]);

  // Stop loop on unmount
  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);
};

// Animation state logic
const getActiveAnimation = (state) => {
  const now = Date.now();
  const animationDuration = 2000; // 2 seconds
  
  // Check if current animation is still playing
  if (now - state.animationStartTime < animationDuration) {
    return state.currentAnimation;
  }
  
  // Return to idle or need-based animation
  if (state.hunger < 30) return 'hungry';
  if (state.happiness < 30) return 'sad';
  if (state.energy < 20) return 'tired';
  
  return 'idle';
};