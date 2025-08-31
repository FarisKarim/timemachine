import { useRef, useEffect, useState } from 'react';

// Pure JavaScript Game Engine (60fps guaranteed)
class JumpGameEngine {
  constructor(canvas, onScoreUpdate, onComplete) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onScoreUpdate = onScoreUpdate;
    this.onComplete = onComplete;
    
    // Game state (stable - never resets)
    this.player = { x: 50, y: 200, width: 30, height: 30, jumping: false, jumpVelocity: 0 };
    this.obstacles = [];
    this.score = 0;
    this.gameOver = false;
    this.lastObstacle = 0;
    this.startTime = Date.now();
    this.running = true;
    
    // Object pool (bounded for memory safety)
    this.obstaclePool = [];
    this.maxPoolSize = 10;
    
    // Pre-calculate graphics (performance optimization)
    this.backgroundGradient = this.ctx.createLinearGradient(0, 0, 0, 320);
    this.backgroundGradient.addColorStop(0, '#87CEEB');
    this.backgroundGradient.addColorStop(1, '#98FB98');
    
    // Bind methods once
    this.gameLoop = this.gameLoop.bind(this);
    this.jump = this.jump.bind(this);
    
    // Start game loop immediately
    requestAnimationFrame(this.gameLoop);
  }
  
  getObstacle() {
    if (this.obstaclePool.length > 0) {
      return this.obstaclePool.pop();
    }
    return { x: 480, y: 200, width: 20, height: 40, active: true };
  }
  
  returnObstacle(obstacle) {
    obstacle.active = false;
    if (this.obstaclePool.length < this.maxPoolSize) {
      this.obstaclePool.push(obstacle);
    }
  }
  
  gameLoop() {
    if (!this.running || !this.canvas) return;
    
    // Clear with pre-calculated gradient
    this.ctx.fillStyle = this.backgroundGradient;
    this.ctx.fillRect(0, 0, 480, 320);
    
    if (this.gameOver) return;
    
    // Update player physics
    if (this.player.jumping) {
      this.player.jumpVelocity += 0.8; // Gravity
      this.player.y += this.player.jumpVelocity;
      
      if (this.player.y >= 200) {
        this.player.y = 200;
        this.player.jumping = false;
        this.player.jumpVelocity = 0;
      }
    }

    // Spawn obstacles with increasing difficulty
    const now = Date.now();
    const gameTime = (now - this.startTime) / 1000;
    const spawnRate = Math.max(1000, 2000 - (gameTime * 50));
    
    if (now - this.lastObstacle > spawnRate) {
      const obstacle = this.getObstacle();
      obstacle.x = 480;
      obstacle.y = 200;
      obstacle.active = true;
      this.obstacles.push(obstacle);
      this.lastObstacle = now;
    }

    // Update obstacles
    const speed = 3 + Math.floor(gameTime / 10);
    this.obstacles = this.obstacles.filter(obstacle => {
      obstacle.x -= speed;
      
      if (obstacle.x < -obstacle.width) {
        this.returnObstacle(obstacle);
        this.score += 10;
        this.onScoreUpdate(this.score); // Update React state
        return false;
      }
      
      // Collision detection (AABB)
      if (obstacle.x < this.player.x + this.player.width &&
          obstacle.x + obstacle.width > this.player.x &&
          obstacle.y < this.player.y + this.player.height &&
          obstacle.y + obstacle.height > this.player.y) {
        
        this.gameOver = true;
        
        // Calculate rewards based on score
        const rewards = {
          happiness: Math.min(25, Math.floor(this.score / 20)),
          energy: -30
        };
        
        setTimeout(() => this.onComplete(this.score, rewards), 1000);
        return false;
      }
      
      return true;
    });

    // Render ground
    this.ctx.fillStyle = '#8B4513';
    this.ctx.fillRect(0, 230, 480, 90);

    // Render player (kawaii pet)
    this.ctx.fillStyle = '#FF69B4';
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
    
    // Pet face
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(this.player.x + 8, this.player.y + 8, 4, 4); // Eyes
    this.ctx.fillRect(this.player.x + 18, this.player.y + 8, 4, 4);
    this.ctx.fillRect(this.player.x + 12, this.player.y + 18, 6, 4); // Mouth

    // Render obstacles
    this.ctx.fillStyle = '#DC2626';
    this.obstacles.forEach(obstacle => {
      this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });

    // Continue game loop
    requestAnimationFrame(this.gameLoop);
  }
  
  jump() {
    if (!this.player.jumping && !this.gameOver) {
      this.player.jumping = true;
      this.player.jumpVelocity = -15;
    }
  }
  
  destroy() {
    this.running = false;
    this.obstaclePool = [];
  }
}

const JumpGame = ({ onComplete, petState }) => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Create engine once - no React interference
    engineRef.current = new JumpGameEngine(
      canvas,
      (newScore) => setScore(newScore),
      (finalScore, rewards) => {
        setGameOver(true);
        onComplete(finalScore, rewards);
      }
    );
    
    // Setup controls
    const handleClick = () => engineRef.current?.jump();
    const handleKeyPress = (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        engineRef.current?.jump();
      }
    };
    
    canvas.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      // Clean shutdown
      engineRef.current?.destroy();
      canvas.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []); // Empty deps - create once, destroy on unmount

  return (
    <div className="w-full h-full flex flex-col">
      {/* Game Instructions */}
      <div className="text-center mb-2">
        <p className="text-white/80 text-sm tamagotchi-font-body">
          Help your pet jump over obstacles! 🌟
        </p>
      </div>

      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        width={480}
        height={320}
        className="border-2 border-green-400 rounded-lg cursor-pointer mx-auto"
        style={{ imageRendering: 'pixelated', maxWidth: '100%', height: 'auto' }}
      />
      
      {/* Game UI */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-white tamagotchi-font-body">
          <span className="text-sm">Score: </span>
          <span className="font-bold text-lg text-green-300">{score}</span>
        </div>
        <div className="text-white/80 text-sm tamagotchi-font-body">
          {gameOver ? '💔 Game Over!' : '🎮 SPACE or Click to Jump'}
        </div>
      </div>

      {/* Pet Status Impact */}
      <div className="mt-2 text-center">
        <p className="text-xs text-white/60 tamagotchi-font-body">
          Success boosts happiness! Playing uses energy.
        </p>
      </div>
    </div>
  );
};

export default JumpGame;