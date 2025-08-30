import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Canvas } from '@react-three/fiber';
import { gameboyData, getRandomFunFact, gameThemes } from '../../data/gameboyData';
import ROM3DModel from '../3d/ROM3DModel';

const PopularGamesGrid = ({ games, onGameSelect, selectedGame }) => {
  const [hoveredGame, setHoveredGame] = useState(null);
  
  return (
    <div className="space-y-4">
      <h4 className="text-lg gameboy-header">
        {'>'} POPULAR_GAMES.EXE
      </h4>
      <div className="grid grid-cols-2 gap-4 h-80">
        {games.map((game, index) => {
          const positions = [
            [-1.5, 0.5, 0],  // Top left
            [1.5, 0.5, 0],   // Top right
            [-1.5, -0.5, 0], // Bottom left
            [1.5, -0.5, 0]   // Bottom right
          ];
          
          const gameTheme = gameThemes[game.id];
          
          return (
            <div
              key={game.id}
              className="relative rounded-lg border transition-all duration-300 overflow-hidden cursor-pointer transform"
              style={{
                background: selectedGame?.id === game.id 
                  ? gameTheme?.bgGradient || 'linear-gradient(135deg, #f3f4f6, #e5e7eb)'
                  : hoveredGame === game.id 
                  ? gameTheme?.bgGradient || 'linear-gradient(135deg, #f9fafb, #f3f4f6)'
                  : 'rgba(255, 255, 255, 0.1)',
                borderColor: selectedGame?.id === game.id 
                  ? gameTheme ? '#3b82f6' : '#10b981'
                  : hoveredGame === game.id 
                  ? gameTheme ? '#60a5fa' : '#34d399'
                  : 'rgba(255, 255, 255, 0.2)',
                transform: hoveredGame === game.id ? 'translateY(-2px)' : 'translateY(0)',
                boxShadow: hoveredGame === game.id 
                  ? '0 8px 25px rgba(0, 0, 0, 0.15)' 
                  : selectedGame?.id === game.id 
                  ? '0 4px 15px rgba(0, 0, 0, 0.1)'
                  : 'none'
              }}
              onMouseEnter={() => setHoveredGame(game.id)}
              onMouseLeave={() => setHoveredGame(null)}
              onClick={() => onGameSelect(game)}
            >
              <Canvas
                camera={{ position: [0, 0, 1], fov: 90 }}
                className="w-full h-full pointer-events-none"
              >
                <ambientLight intensity={0.8} />
                <directionalLight position={[1, 1, 1]} intensity={1.5} />
                <ROM3DModel
                  game={game}
                  position={[0, 0, 0]}
                  isHovered={hoveredGame === game.id}
                  isSelected={selectedGame?.id === game.id}
                  onClick={() => onGameSelect(game)}
                />
              </Canvas>
              
              {/* Text overlay on hover */}
              {hoveredGame === game.id && (
                <div className="absolute top-1 left-2 right-2 text-center animate-fade-in pointer-events-none">
                  <div className="font-semibold text-xs text-black leading-none">{game.title} - {game.year} • {game.genre}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TechSpecs = ({ specs }) => {
  return (
    <div className="space-y-4">
      <h4 className="text-lg gameboy-header">
        {'>'} SYSTEM_INFO.DAT
      </h4>
      <div className="bg-black/40 p-4 rounded-lg border border-green-400/30 font-mono text-sm">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-blue-500">RELEASE:</span>
            <span className="text-white">{specs.releaseDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-500">CPU:</span>
            <span className="text-white text-xs">{specs.cpu}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-500">DISPLAY:</span>
            <span className="text-white text-xs">{specs.display}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-500">BATTERY:</span>
            <span className="text-white">{specs.battery}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-500">SOLD:</span>
            <span className="text-white">{specs.unitsSold}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-500">PRICE:</span>
            <span className="text-white">{specs.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const FunFactPanel = ({ fact }) => {
  return (
    <div className="space-y-4">
      <h4 className="text-lg gameboy-header">
        {'>'} TRIVIA.TXT
      </h4>
      <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 p-4 rounded-lg border border-green-400/20">
        <h5 className="font-semibold text-blue-500 mb-2">{fact.title}</h5>
        <p className="text-sm text-white/80 leading-relaxed">{fact.fact}</p>
        <div className="mt-2">
          <span className="inline-block px-2 py-1 bg-green-400/10 text-blue-600 text-xs rounded font-mono uppercase">
            {fact.category}
          </span>
        </div>
      </div>
    </div>
  );
};

const MemoryCarousel = ({ memories, currentMemory, onMemoryChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg gameboy-header">
          {'>'} MEMORIES.LOG
        </h4>
        <div className="flex gap-1">
          {memories.map((_, index) => (
            <button
              key={index}
              onClick={() => onMemoryChange(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentMemory ? 'bg-green-400' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="bg-black/20 p-4 rounded-lg border border-white/10 min-h-[100px]">
        <h5 className="font-semibold text-white mb-2">
          {memories[currentMemory].title}
        </h5>
        <p className="text-white/80 leading-relaxed text-sm">
          {memories[currentMemory].content}
        </p>
      </div>
      <div className="flex justify-between">
        <button
          onClick={() => onMemoryChange((currentMemory - 1 + memories.length) % memories.length)}
          className="text-blue-600 hover:text-blue-500 font-mono text-sm"
        >
          ← PREV
        </button>
        <button
          onClick={() => onMemoryChange((currentMemory + 1) % memories.length)}
          className="text-blue-600 hover:text-blue-500 font-mono text-sm"
        >
          NEXT →
        </button>
      </div>
    </div>
  );
};

const SelectedGameDetail = ({ game, onClose }) => {
  if (!game) return null;
  
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h4 className="text-lg gameboy-header">
          {'>'} {game.title.toUpperCase()}.ROM
        </h4>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white text-sm"
        >
          ✕
        </button>
      </div>
      <div 
        className="p-4 rounded-lg border-2 transition-colors"
        style={{ 
          borderColor: game.color,
          backgroundColor: `${game.color}15`
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{game.icon}</span>
          <div>
            <h5 className="font-bold text-lg">{game.title}</h5>
            <p className="text-sm text-white/70">{game.year} • {game.genre}</p>
          </div>
        </div>
        <p className="text-white/80 mb-3">{game.description}</p>
        <div className="bg-black/40 p-3 rounded border border-white/20">
          <p className="text-xs text-blue-500 mb-1 font-mono">FUN_FACT:</p>
          <p className="text-sm text-white/90">{game.funFact}</p>
        </div>
      </div>
    </div>
  );
};

const FloatingMemoryBlurb = ({ memory, position, selectedGame }) => {
  return (
    <div className={`fixed ${position} z-10 pointer-events-none`} style={{ width: '400px', height: '240px' }}>
      <div className="ipod-chunky-border bg-gradient-to-br from-green-800/95 to-green-900/95 backdrop-blur-sm shadow-xl h-full crt-scanlines">
        {(selectedGame?.id === 'pokemon-emerald' || selectedGame?.id === 'pokemon-fire-red') && (
          <video 
            key={selectedGame.id}
            autoPlay 
            loop 
            muted 
            className="w-full h-full object-cover"
          >
            <source src={`/videos/${selectedGame.id === 'pokemon-emerald' ? 'emerald' : 'firered'}.mp4`} type="video/mp4" />
          </video>
        )}
      </div>
    </div>
  );
};

export const GameBoyMemoryCapsule = ({ onGameSelect, onAudioPlay, isZoomedIn }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [currentMemory, setCurrentMemory] = useState(0);
  const [currentFact, setCurrentFact] = useState(getRandomFunFact());

  // Rotate through memories automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMemory(prev => (prev + 1) % gameboyData.memories.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Rotate through fun facts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact(getRandomFunFact());
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    onGameSelect?.(game);
    
    // Play game-specific audio
    if (onAudioPlay && gameboyData.audioCues[game.id]) {
      onAudioPlay(game.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl gameboy-header mb-2">Game Boy Advance SP Memory Capsule</h3>
        <div className="flex items-center justify-center gap-2 gameboy-body text-sm">
          <span className="gameboy-power-led"></span>
          <span>BOOTING NOSTALGIA_OS v2.003</span>
          <span className="gameboy-power-led"></span>
        </div>
      </div>

      {/* Selected Game Detail */}
      {selectedGame && (
        <SelectedGameDetail 
          game={selectedGame} 
          onClose={() => setSelectedGame(null)} 
        />
      )}

      {/* Popular Games Grid */}
      <PopularGamesGrid 
        games={gameboyData.popularGames}
        onGameSelect={handleGameSelect}
        selectedGame={selectedGame}
      />

      {/* Memory Carousel */}
      <MemoryCarousel 
        memories={gameboyData.memories}
        currentMemory={currentMemory}
        onMemoryChange={setCurrentMemory}
      />

      {/* Tech Specs */}
      <TechSpecs specs={gameboyData.techSpecs} />

      {/* Fun Fact */}
      <FunFactPanel fact={currentFact} />

      {/* Floating Memory - Rendered via Portal */}
      {isZoomedIn && createPortal(
        <FloatingMemoryBlurb 
          memory={gameboyData.memories[1]} 
          position="top-96 right-8"
          selectedGame={selectedGame}
        />,
        document.body
      )}
    </div>
  );
};