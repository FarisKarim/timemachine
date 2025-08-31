# 🎯 TAMAGOTCHI PHASE 1: REMAINING TASKS
## What's Left To Complete

### 🏗️ CURRENT STATUS
✅ **COMPLETED:**
- Core pet state system (`usePetState.js`, `useGameLoop.js`, `usePetAudio.js`)  
- Status display with animated canvas bars (`StatusDisplay.jsx`)
- Care interface with pet sprite (`CareInterface.jsx`)
- Mini-game grid system (`MiniGameGrid.jsx`)
- Jump game implementation (`JumpGame.jsx`)
- Full integration in `TamagotchiMemoryCapsule.jsx`
- Performance optimizations and audio system

---

## 📁 MISSING COMPONENTS

### 🎮 Mini-Games (3 of 4 missing)

#### Create `src/components/ui/tamagotchi/games/DanceGame.jsx`
```javascript
import { useRef, useEffect, useState, useCallback } from 'react';

const DanceGame = ({ onComplete, petState }) => {
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const moves = ['⬆️', '⬇️', '⬅️', '➡️'];
  
  // Generate random dance sequence
  const generateSequence = useCallback(() => {
    const newSequence = Array.from({ length: 5 + Math.floor(score / 100) }, 
      () => moves[Math.floor(Math.random() * moves.length)]
    );
    setSequence(newSequence);
    setUserInput([]);
    setCurrentStep(0);
    setIsPlaying(true);
  }, [score]);

  const handleMove = useCallback((move) => {
    if (gameOver || !isPlaying) return;
    
    const newInput = [...userInput, move];
    setUserInput(newInput);

    if (move === sequence[currentStep]) {
      setCurrentStep(prev => prev + 1);
      
      if (currentStep + 1 === sequence.length) {
        // Sequence complete
        setScore(prev => prev + 50);
        setTimeout(() => generateSequence(), 1000);
      }
    } else {
      // Wrong move
      setGameOver(true);
      const rewards = {
        happiness: Math.min(30, Math.floor(score / 20)),
        energy: -15
      };
      setTimeout(() => onComplete(score, rewards), 1500);
    }
  }, [currentStep, sequence, userInput, gameOver, isPlaying, score, onComplete, generateSequence]);

  // Start first sequence
  useEffect(() => {
    generateSequence();
  }, [generateSequence]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* Game Display */}
      <div className="text-center mb-6">
        <h4 className="text-xl text-white mb-4">Follow the Dance!</h4>
        <div className="text-4xl mb-4 space-x-2">
          {sequence.map((move, index) => (
            <span 
              key={index}
              className={`inline-block p-2 ${
                index < currentStep ? 'opacity-50' : 
                index === currentStep ? 'bg-yellow-400/30 rounded' : ''
              }`}
            >
              {move}
            </span>
          ))}
        </div>
        <p className="text-white/70">Score: {score}</p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-3 w-48">
        <div></div>
        <button
          onClick={() => handleMove('⬆️')}
          className="w-12 h-12 bg-blue-500 hover:bg-blue-400 rounded text-2xl"
          disabled={gameOver}
        >
          ⬆️
        </button>
        <div></div>
        
        <button
          onClick={() => handleMove('⬅️')}
          className="w-12 h-12 bg-blue-500 hover:bg-blue-400 rounded text-2xl"
          disabled={gameOver}
        >
          ⬅️
        </button>
        <div></div>
        <button
          onClick={() => handleMove('➡️')}
          className="w-12 h-12 bg-blue-500 hover:bg-blue-400 rounded text-2xl"
          disabled={gameOver}
        >
          ➡️
        </button>
        
        <div></div>
        <button
          onClick={() => handleMove('⬇️')}
          className="w-12 h-12 bg-blue-500 hover:bg-blue-400 rounded text-2xl"
          disabled={gameOver}
        >
          ⬇️
        </button>
        <div></div>
      </div>

      {gameOver && (
        <div className="mt-4 text-center">
          <p className="text-red-400 font-bold">Dance Over!</p>
          <p className="text-white/70">Final Score: {score}</p>
        </div>
      )}
    </div>
  );
};

export default DanceGame;
```

#### Create `src/components/ui/tamagotchi/games/CookingGame.jsx`
```javascript
import { useState, useEffect, useCallback } from 'react';

const CookingGame = ({ onComplete, petState }) => {
  const [recipe, setRecipe] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  const availableIngredients = ['🍅', '🧄', '🧅', '🥕', '🍄', '🥩', '🧀', '🥛'];

  // Generate random recipe
  const generateRecipe = useCallback(() => {
    const recipeSize = 3 + Math.floor(Math.random() * 3);
    const newRecipe = Array.from({ length: recipeSize }, 
      () => availableIngredients[Math.floor(Math.random() * availableIngredients.length)]
    );
    setRecipe(newRecipe);
  }, []);

  // Add ingredient to dish
  const addIngredient = useCallback((ingredient) => {
    if (gameOver) return;
    setIngredients(prev => [...prev, ingredient]);
  }, [gameOver]);

  // Check recipe completion
  useEffect(() => {
    if (ingredients.length === recipe.length && recipe.length > 0) {
      const isCorrect = ingredients.every((ing, index) => ing === recipe[index]);
      if (isCorrect) {
        setScore(prev => prev + 100);
        setIngredients([]);
        generateRecipe();
        setTimeLeft(prev => Math.min(prev + 10, 60)); // Bonus time
      } else {
        // Wrong recipe
        setIngredients([]);
      }
    }
  }, [ingredients, recipe, generateRecipe]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
      const rewards = {
        happiness: Math.min(25, Math.floor(score / 40)),
        hunger: Math.min(20, Math.floor(score / 50)),
        energy: -12
      };
      setTimeout(() => onComplete(score, rewards), 1500);
    }
  }, [timeLeft, gameOver, score, onComplete]);

  // Start game
  useEffect(() => {
    generateRecipe();
  }, [generateRecipe]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-4">
        <h4 className="text-xl text-white mb-2">Cook the Recipe!</h4>
        <div className="flex justify-between text-white">
          <span>Score: {score}</span>
          <span className={`${timeLeft < 10 ? 'text-red-400 animate-pulse' : ''}`}>
            Time: {timeLeft}s
          </span>
        </div>
      </div>

      {/* Recipe Display */}
      <div className="text-center mb-4">
        <p className="text-white/80 text-sm mb-2">Recipe:</p>
        <div className="flex justify-center space-x-2 text-2xl">
          {recipe.map((ingredient, index) => (
            <span key={index} className="p-2 bg-yellow-400/20 rounded">
              {ingredient}
            </span>
          ))}
        </div>
      </div>

      {/* Current Dish */}
      <div className="text-center mb-4">
        <p className="text-white/80 text-sm mb-2">Your Dish:</p>
        <div className="flex justify-center space-x-2 text-2xl min-h-[3rem] items-center">
          {ingredients.map((ingredient, index) => (
            <span key={index} className="p-2 bg-green-400/20 rounded">
              {ingredient}
            </span>
          ))}
        </div>
      </div>

      {/* Ingredient Buttons */}
      <div className="grid grid-cols-4 gap-2 flex-1">
        {availableIngredients.map(ingredient => (
          <button
            key={ingredient}
            onClick={() => addIngredient(ingredient)}
            className="text-2xl p-3 bg-white/10 hover:bg-white/20 rounded transition-colors"
            disabled={gameOver}
          >
            {ingredient}
          </button>
        ))}
      </div>

      {gameOver && (
        <div className="text-center mt-4">
          <p className="text-red-400 font-bold">Time's Up!</p>
          <p className="text-white/70">Final Score: {score}</p>
        </div>
      )}
    </div>
  );
};

export default CookingGame;
```

#### Create `src/components/ui/tamagotchi/games/TreasureHunt.jsx`
```javascript
import { useState, useEffect, useCallback } from 'react';

const TreasureHunt = ({ onComplete, petState }) => {
  const [grid, setGrid] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [treasures, setTreasures] = useState([]);
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);

  const gridSize = 4;
  const treasureCount = 6;

  // Initialize game
  const initializeGame = useCallback(() => {
    const newGrid = Array(gridSize * gridSize).fill('💎');
    const newRevealed = Array(gridSize * gridSize).fill(false);
    
    // Place treasures randomly
    const treasurePositions = [];
    while (treasurePositions.length < treasureCount) {
      const pos = Math.floor(Math.random() * (gridSize * gridSize));
      if (!treasurePositions.includes(pos)) {
        treasurePositions.push(pos);
        newGrid[pos] = '💰';
      }
    }
    
    setGrid(newGrid);
    setRevealed(newRevealed);
    setTreasures(treasurePositions);
  }, []);

  // Reveal cell
  const revealCell = useCallback((index) => {
    if (gameOver || revealed[index] || movesLeft === 0) return;

    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);
    setMovesLeft(prev => prev - 1);

    if (grid[index] === '💰') {
      setScore(prev => prev + 50);
    }

    // Check win condition
    const foundTreasures = treasures.filter(pos => newRevealed[pos]).length;
    if (foundTreasures === treasureCount) {
      setGameOver(true);
      const bonusScore = movesLeft * 10;
      const finalScore = score + 50 + bonusScore; // +50 for current treasure
      
      const rewards = {
        happiness: Math.min(35, Math.floor(finalScore / 15)),
        energy: -18
      };
      setTimeout(() => onComplete(finalScore, rewards), 1500);
    } else if (movesLeft === 1) {
      setGameOver(true);
      const rewards = {
        happiness: Math.min(20, Math.floor(score / 25)),
        energy: -18
      };
      setTimeout(() => onComplete(score, rewards), 1500);
    }
  }, [gameOver, revealed, movesLeft, grid, treasures, score, onComplete]);

  // Start game
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-4">
        <h4 className="text-xl text-white mb-2">Find the Treasures!</h4>
        <div className="flex justify-between text-white text-sm">
          <span>Score: {score}</span>
          <span>Moves: {movesLeft}</span>
          <span>Found: {treasures.filter(pos => revealed[pos]).length}/{treasureCount}</span>
        </div>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
        {grid.map((cell, index) => (
          <button
            key={index}
            onClick={() => revealCell(index)}
            className={`
              w-16 h-16 text-2xl border-2 rounded transition-all
              ${revealed[index] 
                ? (cell === '💰' ? 'bg-yellow-400/30 border-yellow-400' : 'bg-gray-500/30 border-gray-500')
                : 'bg-blue-500/20 border-blue-400 hover:bg-blue-500/40'
              }
            `}
            disabled={gameOver || revealed[index]}
          >
            {revealed[index] ? cell : '❓'}
          </button>
        ))}
      </div>

      {/* Game Status */}
      <div className="text-center mt-4">
        {gameOver && (
          <div>
            <p className="text-yellow-400 font-bold mb-2">
              {treasures.filter(pos => revealed[pos]).length === treasureCount 
                ? '🎉 All Treasures Found!' 
                : '💔 No More Moves!'
              }
            </p>
            <p className="text-white/70">Final Score: {score}</p>
          </div>
        )}
        {!gameOver && (
          <p className="text-white/70 text-sm">
            Click tiles to search for treasures! 💰
          </p>
        )}
      </div>
    </div>
  );
};

export default TreasureHunt;
```

---

## 📊 Data Files (All Missing)

### Create `src/components/ui/tamagotchi/data/petSprites.js`
```javascript
export const petSprites = {
  idle: {
    frames: ['🐱', '😺', '🐱'],
    duration: 2000,
    loop: true
  },
  eating: {
    frames: ['😋', '😸', '😋', '😸'],
    duration: 1500,
    loop: false
  },
  playing: {
    frames: ['🤸', '😸', '🎾', '😺'],
    duration: 2000,
    loop: false
  },
  sleeping: {
    frames: ['😴', '💤', '😴'],
    duration: 3000,
    loop: true
  },
  happy: {
    frames: ['😸', '😻', '😸', '😺'],
    duration: 1500,
    loop: false
  },
  sad: {
    frames: ['😿', '😢', '😿'],
    duration: 2000,
    loop: true
  },
  hungry: {
    frames: ['😿', '🍽️', '😿'],
    duration: 1500,
    loop: true
  },
  sick: {
    frames: ['🤢', '💊', '🤢'],
    duration: 2000,
    loop: true
  }
};
```

### Create `src/components/ui/tamagotchi/data/gameData.js`
```javascript
export const gameConfigurations = {
  jump: {
    difficulty: 'Easy',
    maxScore: 500,
    timeLimit: null,
    rewards: {
      scoreMultiplier: 0.1,
      maxHappiness: 25,
      energyCost: 10
    }
  },
  dance: {
    difficulty: 'Medium',
    maxScore: 1000,
    timeLimit: null,
    rewards: {
      scoreMultiplier: 0.05,
      maxHappiness: 30,
      energyCost: 15
    }
  },
  cook: {
    difficulty: 'Medium',
    maxScore: 800,
    timeLimit: 60,
    rewards: {
      scoreMultiplier: 0.04,
      maxHappiness: 25,
      maxHunger: 20,
      energyCost: 12
    }
  },
  hunt: {
    difficulty: 'Hard',
    maxScore: 600,
    timeLimit: null,
    rewards: {
      scoreMultiplier: 0.06,
      maxHappiness: 35,
      energyCost: 18
    }
  }
};

export const globalGameSettings = {
  minEnergyToPlay: 20,
  cooldownBetweenGames: 60000, // 1 minute
  maxDailyGames: 10
};
```

### Create `src/components/ui/tamagotchi/data/petBehaviors.js`
```javascript
export const petBehaviorStates = {
  IDLE: 'idle',
  EATING: 'eating', 
  PLAYING: 'playing',
  SLEEPING: 'sleeping',
  HAPPY: 'happy',
  SAD: 'sad',
  HUNGRY: 'hungry',
  SICK: 'sick'
};

export const behaviorTransitions = {
  // From any state, can go to eating when fed
  '*': {
    feed: 'eating'
  },
  
  idle: {
    play: 'playing',
    sleep: 'sleeping',
    needsAttention: 'sad'
  },
  
  eating: {
    finish: 'happy',
    interrupt: 'idle'
  },
  
  playing: {
    finish: 'happy',
    tired: 'idle'
  },
  
  happy: {
    timeout: 'idle',
    decline: 'sad'
  },
  
  sad: {
    care: 'happy',
    neglect: 'hungry'
  },
  
  hungry: {
    feed: 'eating',
    starve: 'sick'
  },
  
  sick: {
    care: 'idle',
    worsen: 'critical'
  }
};

export const behaviorConditions = {
  needsAttention: (stats) => 
    stats.hunger < 30 || stats.happiness < 30,
    
  isTired: (stats) => 
    stats.energy < 20,
    
  isHungry: (stats) => 
    stats.hunger < 40,
    
  isHappy: (stats) => 
    stats.happiness > 70 && stats.hunger > 50,
    
  isSick: (stats) => 
    stats.health < 30 || (stats.hunger === 0 && stats.health < 70)
};
```

---

## 🎯 Completion Summary

**Total Remaining Work:**
- 3 Mini-game components (DanceGame, CookingGame, TreasureHunt)
- 3 Data files (petSprites, gameData, petBehaviors)

**Estimated Time:** ~6-8 hours total
**Priority Order:**
1. Mini-games (core gameplay)
2. Data files (polish and behavior)

Once these are implemented, Phase 1 will be 100% complete!