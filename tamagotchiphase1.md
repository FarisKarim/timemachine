# 🎯 TAMAGOTCHI PHASE 1: REAL-TIME PET CARE + MINI-GAMES
## High-Performance Implementation Guide

### 🏗️ ARCHITECTURE OVERVIEW

The goal is to transform the static Tamagotchi capsule into an interactive 60fps pet simulation without compromising performance. Key strategy: **Separate game logic from React renders**.

---

## 📁 FILE STRUCTURE

```
src/components/ui/tamagotchi/
├── TamagotchiMemoryCapsule.jsx    # Main container (existing)
├── PetSimulator.jsx               # NEW: Core pet logic + animations
├── MiniGameGrid.jsx               # NEW: 2x2 game selection
├── CareInterface.jsx              # NEW: Feed/play/clean buttons
├── StatusDisplay.jsx              # NEW: Health bars with canvas
├── games/
│   ├── JumpGame.jsx              # NEW: Physics-based dodging
│   ├── DanceGame.jsx             # NEW: Rhythm matching
│   ├── CookingGame.jsx           # NEW: Recipe crafting
│   └── TreasureHunt.jsx          # NEW: Memory patterns
├── hooks/
│   ├── usePetState.js            # NEW: Core pet state management
│   ├── useGameLoop.js            # NEW: RAF-based updates
│   └── usePetAudio.js            # NEW: Procedural sounds
└── data/
    ├── petSprites.js             # NEW: Animation data
    ├── gameData.js               # NEW: Mini-game configurations
    └── petBehaviors.js           # NEW: State machine logic
```

---

## 🔧 STEP 1: CORE PET STATE SYSTEM

### Create `src/hooks/usePetState.js`

```javascript
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
    cleanCooldown: 0
  });

  // UI state (triggers React re-renders)
  const [uiState, setUIState] = useState({
    displayHunger: 75,
    displayHappiness: 80,
    displayHealth: 90,
    displayEnergy: 100,
    currentAnimation: 'idle',
    needsAttention: false,
    evolutionStage: 'baby'
  });

  // Get current pet state
  const getPetState = useCallback(() => petStateRef.current, []);

  // Update pet stats (optimized)
  const updatePetStats = useCallback((updates) => {
    const now = Date.now();
    Object.assign(petStateRef.current, updates, { lastUpdate: now });
  }, []);

  // Stat decay calculation (called by game loop)
  const applyStatDecay = useCallback(() => {
    const now = Date.now();
    const state = petStateRef.current;
    const hoursPassed = (now - (state.lastDecay || now)) / (1000 * 60 * 60);
    
    if (hoursPassed >= 0.1) { // Decay every 6 minutes
      const decay = {
        hunger: Math.max(0, state.hunger - (hoursPassed * 5)),
        happiness: Math.max(0, state.happiness - (hoursPassed * 3)),
        energy: Math.max(0, state.energy - (hoursPassed * 4)),
        lastDecay: now
      };
      
      updatePetStats(decay);
      return true; // Signal UI update needed
    }
    return false;
  }, [updatePetStats]);

  // Care actions with cooldown management
  const careActions = {
    feed: useCallback(() => {
      const now = Date.now();
      const state = petStateRef.current;
      
      if (now - state.feedCooldown < 30000) return false; // 30s cooldown
      
      updatePetStats({
        hunger: Math.min(100, state.hunger + 25),
        happiness: Math.min(100, state.happiness + 5),
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
      
      if (now - state.playCooldown < 45000 || state.energy < 20) return false;
      
      updatePetStats({
        happiness: Math.min(100, state.happiness + 20),
        energy: Math.max(0, state.energy - 15),
        hunger: Math.max(0, state.hunger - 5),
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
      
      if (now - state.cleanCooldown < 60000) return false; // 1min cooldown
      
      updatePetStats({
        health: Math.min(100, state.health + 15),
        happiness: Math.min(100, state.happiness + 10),
        currentAnimation: 'cleaning',
        animationStartTime: now,
        cleanCooldown: now,
        lastCleaned: now
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
```

### Create `src/hooks/useGameLoop.js`

```javascript
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
        needsAttention: currentState.hunger < 30 || currentState.happiness < 30
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
```

---

## 🎮 STEP 2: MINI-GAME ARCHITECTURE

### Create `src/components/ui/tamagotchi/MiniGameGrid.jsx`

```javascript
import { useState } from 'react';
import JumpGame from './games/JumpGame';
import DanceGame from './games/DanceGame';
import CookingGame from './games/CookingGame';
import TreasureHunt from './games/TreasureHunt';

const MINI_GAMES = [
  { id: 'jump', icon: '🦘', name: 'Jump Game', difficulty: 'Easy', component: JumpGame },
  { id: 'dance', icon: '💃', name: 'Dance Game', difficulty: 'Medium', component: DanceGame },
  { id: 'cook', icon: '🍳', name: 'Cook Game', difficulty: 'Medium', component: CookingGame },
  { id: 'hunt', icon: '🔍', name: 'Treasure Hunt', difficulty: 'Hard', component: TreasureHunt }
];

export const MiniGameGrid = ({ onGameComplete, petState }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [hoveredGame, setHoveredGame] = useState(null);

  const handleGameComplete = (gameId, score, rewards) => {
    onGameComplete(gameId, score, rewards);
    setSelectedGame(null);
  };

  if (selectedGame) {
    const GameComponent = selectedGame.component;
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
        <div className="w-full max-w-2xl h-96 bg-gradient-to-br from-purple-900 to-pink-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">{selectedGame.name}</h3>
            <button 
              onClick={() => setSelectedGame(null)}
              className="text-white/70 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>
          <GameComponent 
            onComplete={(score, rewards) => handleGameComplete(selectedGame.id, score, rewards)}
            petState={petState}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-green-300 flex items-center gap-2">
        <span className="text-2xl">🎮</span> Play Time!
      </h4>
      
      {/* 2x2 Game Grid (GameBoy style) */}
      <div className="grid grid-cols-2 gap-3">
        {MINI_GAMES.map((game) => (
          <div
            key={game.id}
            onMouseEnter={() => setHoveredGame(game.id)}
            onMouseLeave={() => setHoveredGame(null)}
            onClick={() => setSelectedGame(game)}
            className={`
              relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300
              ${hoveredGame === game.id 
                ? 'border-green-400 bg-green-400/20 transform scale-105 shadow-lg' 
                : 'border-white/20 bg-white/5 hover:border-green-300/50'
              }
            `}
          >
            {/* Game Icon */}
            <div className="text-3xl text-center mb-2 animate-pulse">
              {game.icon}
            </div>
            
            {/* Game Info */}
            <div className="text-center">
              <h5 className="font-semibold text-white text-sm mb-1">
                {game.name}
              </h5>
              <span className={`
                text-xs px-2 py-1 rounded-full
                ${game.difficulty === 'Easy' ? 'bg-green-400/20 text-green-300' :
                  game.difficulty === 'Medium' ? 'bg-yellow-400/20 text-yellow-300' :
                  'bg-red-400/20 text-red-300'}
              `}>
                {game.difficulty}
              </span>
            </div>

            {/* Hover Effect */}
            {hoveredGame === game.id && (
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-transparent rounded-lg pointer-events-none animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniGameGrid;
```

### Create `src/components/ui/tamagotchi/games/JumpGame.jsx`

```javascript
import { useRef, useEffect, useState, useCallback } from 'react';

const JumpGame = ({ onComplete, petState }) => {
  const canvasRef = useRef(null);
  const gameStateRef = useRef({
    player: { x: 50, y: 200, width: 30, height: 30, jumping: false, jumpVelocity: 0 },
    obstacles: [],
    score: 0,
    gameOver: false,
    lastObstacle: 0
  });
  
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const animationRef = useRef();

  // Object pool for obstacles (performance optimization)
  const obstaclePool = useRef([]);
  const getObstacle = useCallback(() => {
    if (obstaclePool.current.length > 0) {
      return obstaclePool.current.pop();
    }
    return { x: 480, y: 200, width: 20, height: 40, active: true };
  }, []);

  const returnObstacle = useCallback((obstacle) => {
    obstacle.active = false;
    obstaclePool.current.push(obstacle);
  }, []);

  // Game loop (60fps)
  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const state = gameStateRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, 480, 320);
    
    if (state.gameOver) return;

    // Update player physics
    const player = state.player;
    if (player.jumping) {
      player.jumpVelocity += 0.8; // Gravity
      player.y += player.jumpVelocity;
      
      if (player.y >= 200) {
        player.y = 200;
        player.jumping = false;
        player.jumpVelocity = 0;
      }
    }

    // Spawn obstacles
    const now = Date.now();
    if (now - state.lastObstacle > 2000) { // Every 2 seconds
      const obstacle = getObstacle();
      obstacle.x = 480;
      obstacle.y = 200;
      obstacle.active = true;
      state.obstacles.push(obstacle);
      state.lastObstacle = now;
    }

    // Update obstacles
    state.obstacles = state.obstacles.filter(obstacle => {
      obstacle.x -= 5; // Move left
      
      if (obstacle.x < -obstacle.width) {
        returnObstacle(obstacle);
        state.score += 10;
        return false;
      }
      
      // Collision detection (AABB)
      if (obstacle.x < player.x + player.width &&
          obstacle.x + obstacle.width > player.x &&
          obstacle.y < player.y + player.height &&
          obstacle.y + obstacle.height > player.y) {
        state.gameOver = true;
        setGameOver(true);
        
        // Calculate rewards based on score
        const rewards = {
          happiness: Math.min(25, Math.floor(state.score / 10)),
          energy: -10 // Playing costs energy
        };
        
        setTimeout(() => onComplete(state.score, rewards), 1000);
        return false;
      }
      
      return true;
    });

    // Render player
    ctx.fillStyle = '#10B981';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Render obstacles
    ctx.fillStyle = '#EF4444';
    state.obstacles.forEach(obstacle => {
      ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Update score display
    setScore(state.score);

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [onComplete, getObstacle, returnObstacle]);

  // Jump control
  const jump = useCallback(() => {
    const player = gameStateRef.current.player;
    if (!player.jumping && !gameStateRef.current.gameOver) {
      player.jumping = true;
      player.jumpVelocity = -15; // Jump velocity
    }
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  // Start game loop
  useEffect(() => {
    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        width={480}
        height={320}
        className="border-2 border-green-400 rounded-lg bg-gradient-to-b from-blue-200 to-green-200 cursor-pointer"
        onClick={jump}
        style={{ imageRendering: 'pixelated' }}
      />
      
      {/* Game UI */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-white">
          <span className="text-sm">Score: </span>
          <span className="font-bold text-lg">{score}</span>
        </div>
        <div className="text-white text-sm">
          {gameOver ? 'Game Over!' : 'SPACE or Click to Jump'}
        </div>
      </div>
    </div>
  );
};

export default JumpGame;
```

---

## 🔊 STEP 3: AUDIO SYSTEM

### Create `src/hooks/usePetAudio.js`

```javascript
import { useRef, useCallback } from 'react';

export const usePetAudio = () => {
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);
  const isEnabledRef = useRef(true);

  // Initialize Web Audio Context
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = 0.3; // Default volume
    }
  }, []);

  // Pet sound definitions
  const petSounds = {
    happy: { frequency: 800, type: 'triangle', duration: 200 },
    hungry: { frequency: 400, type: 'sawtooth', duration: 500 },
    sick: { frequency: 200, type: 'square', duration: 300 },
    eating: { 
      sequence: [
        { frequency: 500, duration: 100 },
        { frequency: 600, duration: 100 },
        { frequency: 550, duration: 100 }
      ]
    },
    playing: { frequency: 1000, type: 'triangle', duration: 300 },
    evolution: { 
      sequence: [
        { frequency: 523, duration: 200 }, // C
        { frequency: 659, duration: 200 }, // E  
        { frequency: 784, duration: 400 }  // G
      ]
    }
  };

  // Play single tone
  const playTone = useCallback((frequency, type = 'sine', duration = 200) => {
    if (!isEnabledRef.current) return;
    
    initAudio();
    const ctx = audioContextRef.current;
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const envelope = ctx.createGain();
    
    oscillator.connect(envelope);
    envelope.connect(gainNodeRef.current);
    
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    oscillator.type = type;
    
    // Envelope for smooth sound
    envelope.gain.setValueAtTime(0, ctx.currentTime);
    envelope.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
    envelope.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration / 1000);
  }, [initAudio]);

  // Play sequence of tones
  const playSequence = useCallback((sequence) => {
    if (!isEnabledRef.current) return;
    
    sequence.forEach((sound, index) => {
      setTimeout(() => {
        playTone(sound.frequency, sound.type || 'sine', sound.duration);
      }, index * (sound.delay || 150));
    });
  }, [playTone]);

  // Play pet sound by name
  const playPetSound = useCallback((soundName) => {
    const sound = petSounds[soundName];
    if (!sound) return;

    if (sound.sequence) {
      playSequence(sound.sequence);
    } else {
      playTone(sound.frequency, sound.type, sound.duration);
    }
  }, [playTone, playSequence]);

  // Game sound effects
  const gameAudio = {
    jump: () => playTone(600, 'square', 100),
    score: () => playTone(800, 'triangle', 150),
    gameOver: () => playSequence([
      { frequency: 400, duration: 200 },
      { frequency: 350, duration: 200 },
      { frequency: 300, duration: 400 }
    ]),
    success: () => playSequence([
      { frequency: 659, duration: 100 },
      { frequency: 784, duration: 100 },
      { frequency: 988, duration: 200 }
    ])
  };

  // Volume control
  const setVolume = useCallback((volume) => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = Math.max(0, Math.min(1, volume));
    }
  }, []);

  const toggleAudio = useCallback(() => {
    isEnabledRef.current = !isEnabledRef.current;
    return isEnabledRef.current;
  }, []);

  return {
    playPetSound,
    gameAudio,
    setVolume,
    toggleAudio,
    isEnabled: () => isEnabledRef.current
  };
};
```

---

## 📊 STEP 4: INTEGRATION

### Update `TamagotchiMemoryCapsule.jsx`

```javascript
import { usePetState } from './hooks/usePetState';
import { useGameLoop } from './hooks/useGameLoop';
import { usePetAudio } from './hooks/usePetAudio';
import MiniGameGrid from './MiniGameGrid';
import CareInterface from './CareInterface';
import StatusDisplay from './StatusDisplay';

export const TamagotchiMemoryCapsule = ({ onCharacterSelect, isZoomedIn }) => {
  const petStateHook = usePetState();
  const { playPetSound, gameAudio } = usePetAudio();
  
  // Start game loop when component is active
  useGameLoop(petStateHook, isZoomedIn);

  const handleCareAction = (action) => {
    const success = petStateHook.careActions[action]();
    if (success) {
      playPetSound(action === 'feed' ? 'eating' : action === 'play' ? 'playing' : 'happy');
    }
  };

  const handleGameComplete = (gameId, score, rewards) => {
    // Apply game rewards to pet
    petStateHook.updatePetStats(rewards);
    
    // Play success sound
    if (score > 50) {
      gameAudio.success();
    }
    
    // Save high score
    localStorage.setItem(`tamagotchi_${gameId}_highscore`, Math.max(
      score, 
      parseInt(localStorage.getItem(`tamagotchi_${gameId}_highscore`) || '0')
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent">
          ✨ Tamagotchi Memory Capsule ✨
        </h3>
      </div>

      {/* Live Status Display */}
      <StatusDisplay petState={petStateHook.uiState} />

      {/* Care Interface */}
      <CareInterface onCareAction={handleCareAction} petState={petStateHook.uiState} />

      {/* Mini Games */}
      <MiniGameGrid 
        onGameComplete={handleGameComplete}
        petState={petStateHook.uiState}
      />

      {/* Existing memory components... */}
    </div>
  );
};
```

---

## ⚡ PERFORMANCE CHECKLIST

### Essential Optimizations
- ✅ **RAF Game Loop**: Separates pet logic from React renders
- ✅ **Object Pooling**: Reuse game objects to prevent garbage collection
- ✅ **Canvas Rendering**: Smooth animations without DOM manipulation  
- ✅ **Ref-Based State**: Pet stats update without triggering re-renders
- ✅ **Batched UI Updates**: UI syncs with pet state every 100ms max
- ✅ **Audio Optimization**: Web Audio API with shared context
- ✅ **Mobile Fallbacks**: Reduced effects and 30fps targets for weak devices

### Testing Performance
```javascript
// Add to game loop for monitoring
const perfStart = performance.now();
// ... game logic ...
const frameTime = performance.now() - perfStart;
if (frameTime > 16.67) {
  console.warn(`Frame took ${frameTime.toFixed(2)}ms (target: 16.67ms)`);
}
```

### Memory Management
```javascript
// Cleanup on unmount
useEffect(() => {
  return () => {
    // Clear all timers
    clearInterval(decayTimer);
    cancelAnimationFrame(gameLoop);
    
    // Close audio context
    if (audioContext) {
      audioContext.close();
    }
    
    // Clear object pools
    obstaclePool.current = [];
  };
}, []);
```

---

## 🎯 SUCCESS METRICS

### Performance Targets
- **60fps** during all interactions
- **< 50ms** response time for care actions  
- **< 2MB** total memory usage
- **< 16.67ms** average frame time

### Implementation Order
1. **Week 1**: Pet state system + basic care actions
2. **Week 2**: Game loop + first mini-game (Jump)
3. **Week 3**: Remaining mini-games + audio integration
4. **Week 4**: Performance optimization + mobile polish

This implementation prioritizes performance while creating engaging gameplay that matches the GameBoy's interactivity level.