import { useRef, useState, useCallback } from 'react';

export const usePetState = () => {
  // Core pet stats (ref for performance - no re-renders)
  const petStateRef = useRef({
    hunger: 75,
    happiness: 80, 
    health: 90,
    energy: 100,
    
    // Timestamps for decay calculation
    lastFed: Date.now(),
    lastPlayed: Date.now(),
    lastCleaned: Date.now(),
    lastSleep: Date.now(),
    lastDecay: Date.now(),
    
    // Evolution tracking
    evolutionProgress: 0,
    currentStage: 'baby',
    totalCareTime: 0,
    
    // Current animation state
    currentAnimation: 'idle',
    animationStartTime: Date.now(),
    
    // Care action cooldowns (prevent spam)
    feedCooldown: 0,
    playCooldown: 0,
    cleanCooldown: 0,
    
    // Sleep system
    isSleeping: false,
    sleepEndTime: 0
  });

  // UI state (triggers React re-renders)
  const [uiState, setUIState] = useState({
    displayHunger: 75,
    displayHappiness: 80,
    displayHealth: 90,
    displayEnergy: 100,
    currentAnimation: 'idle',
    needsAttention: false,
    evolutionStage: 'baby',
    isSleeping: false,
    sleepTimeRemaining: 0
  });

  // Get current pet state
  const getPetState = useCallback(() => petStateRef.current, []);

  // Update pet stats (optimized)
  const updatePetStats = useCallback((updates) => {
    const now = Date.now();
    const state = petStateRef.current;
    
    // Add rewards to current stats instead of overwriting
    const adjustedUpdates = {};
    Object.keys(updates).forEach(key => {
      if (key === 'hunger' || key === 'happiness' || key === 'health' || key === 'energy') {
        adjustedUpdates[key] = Math.max(0, Math.min(100, (state[key] || 0) + updates[key]));
      } else {
        adjustedUpdates[key] = updates[key];
      }
    });
    
    Object.assign(petStateRef.current, adjustedUpdates, { lastUpdate: now });
  }, []);

  // Stat decay calculation (called by game loop)
  const applyStatDecay = useCallback(() => {
    const now = Date.now();
    const state = petStateRef.current;
    const secondsPassed = (now - (state.lastDecay || now)) / 1000;
    
    // Check if sleep period ended
    let sleepUpdate = {};
    if (state.isSleeping && now >= state.sleepEndTime) {
      sleepUpdate = {
        isSleeping: false,
        sleepEndTime: 0,
        currentAnimation: 'idle'
      };
    }
    
    if (secondsPassed >= 45) { // Decay every 45 seconds
      const decay = {
        hunger: -5,
        happiness: -3,
        energy: -4,
        starvationCycle: (state.starvationCycle || 0) + 1,
        lastDecay: now,
        ...sleepUpdate
      };
      
      // Starvation: every 3rd cycle (30s) when hunger ≤ 0
      if (state.hunger <= 0 && decay.starvationCycle % 3 === 0) {
        decay.health = -5;
      }
      
      updatePetStats(decay);
      return true; // Signal UI update needed
    } else if (Object.keys(sleepUpdate).length > 0) {
      updatePetStats(sleepUpdate);
      return true;
    }
    return false;
  }, [updatePetStats]);

  // Care actions with cooldown management
  const careActions = {
    feed: useCallback(() => {
      const now = Date.now();
      const state = petStateRef.current;
      
      if (now - state.feedCooldown < 30000 || state.isSleeping) return false; // 30s cooldown or sleeping
      
      updatePetStats({
        hunger: 25,
        happiness: 5,
        currentAnimation: 'eating',
        animationStartTime: now,
        feedCooldown: now,
        lastFed: now
      });
      return true;
    }, [updatePetStats]),

    play: useCallback(() => {
      const now = Date.now();
      const state = petStateRef.current;
      
      if (now - state.playCooldown < 45000 || state.energy < 20 || state.isSleeping) return false;
      
      updatePetStats({
        happiness: 20,
        energy: -15,
        hunger: -5,
        currentAnimation: 'playing',
        animationStartTime: now,
        playCooldown: now,
        lastPlayed: now
      });
      return true;
    }, [updatePetStats]),

    clean: useCallback(() => {
      const now = Date.now();
      const state = petStateRef.current;
      
      if (now - state.cleanCooldown < 60000 || state.isSleeping) return false; // 1min cooldown or sleeping
      
      updatePetStats({
        health: 15,
        happiness: 10,
        currentAnimation: 'cleaning',
        animationStartTime: now,
        cleanCooldown: now,
        lastCleaned: now
      });
      return true;
    }, [updatePetStats]),

    sleep: useCallback(() => {
      const now = Date.now();
      const state = petStateRef.current;
      
      if (state.isSleeping) return false; // Already sleeping
      
      updatePetStats({
        energy: 40,
        happiness: 5,
        isSleeping: true,
        sleepEndTime: now + 30000, // 30 seconds
        currentAnimation: 'sleeping',
        animationStartTime: now
      });
      return true;
    }, [updatePetStats])
  };

  return {
    getPetState,
    updatePetStats,
    applyStatDecay,
    careActions,
    uiState,
    setUIState
  };
};