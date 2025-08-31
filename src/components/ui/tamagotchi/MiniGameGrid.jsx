import { useState } from 'react';
import JumpGame from './games/JumpGame';

const MINI_GAMES = [
  { id: 'jump', icon: '🦘', name: 'Jump Game', difficulty: 'Easy', component: JumpGame },
  { id: 'dance', icon: '💃', name: 'Dance Game', difficulty: 'Medium', component: null },
  { id: 'cook', icon: '🍳', name: 'Cook Game', difficulty: 'Medium', component: null },
  { id: 'hunt', icon: '🔍', name: 'Treasure Hunt', difficulty: 'Hard', component: null }
];

export const MiniGameGrid = ({ onGameComplete, petState }) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [hoveredGame, setHoveredGame] = useState(null);

  const handleGameComplete = (gameId, score, rewards) => {
    onGameComplete(gameId, score, rewards);
    setSelectedGame(null);
  };

  const handleGameSelect = (game) => {
    if (!game.component) {
      // Placeholder for unimplemented games
      alert(`${game.name} coming soon!`);
      return;
    }
    setSelectedGame(game);
  };

  if (selectedGame && selectedGame.component) {
    const GameComponent = selectedGame.component;
    return (
      <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
        <div className="w-full max-w-4xl h-[450px] bg-gradient-to-br from-purple-900 to-pink-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white tamagotchi-font-header">{selectedGame.name}</h3>
            <button 
              onClick={() => setSelectedGame(null)}
              className="text-white/70 hover:text-white text-2xl transition-colors"
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
      <h4 className="text-lg font-bold text-green-300 flex items-center gap-2 tamagotchi-font-header">
        <span className="text-2xl">🎮</span> Play Time!
      </h4>
      
      {/* 2x2 Game Grid (GameBoy style) */}
      <div className="grid grid-cols-2 gap-3 p-2">
        {MINI_GAMES.map((game) => (
          <div
            key={game.id}
            onMouseEnter={() => setHoveredGame(game.id)}
            onMouseLeave={() => setHoveredGame(null)}
            onClick={() => handleGameSelect(game)}
            className={`
              relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-300
              ${hoveredGame === game.id 
                ? 'border-green-400 bg-green-400/20 transform scale-105 shadow-lg shadow-green-400/25' 
                : 'border-white/20 bg-white/5 hover:border-green-300/50'
              }
              ${!game.component ? 'opacity-60' : ''}
            `}
          >
            {/* Game Icon */}
            <div className="text-3xl text-center mb-2">
              <span className={hoveredGame === game.id ? 'animate-bounce' : ''}>
                {game.icon}
              </span>
            </div>
            
            {/* Game Info */}
            <div className="text-center">
              <h5 className="font-semibold text-white text-sm mb-1 tamagotchi-font-header">
                {game.name}
              </h5>
              <div className="flex items-center justify-center gap-2">
                <span className={`
                  text-xs px-2 py-1 rounded-full tamagotchi-font-body
                  ${game.difficulty === 'Easy' ? 'bg-green-400/20 text-green-300' :
                    game.difficulty === 'Medium' ? 'bg-yellow-400/20 text-yellow-300' :
                    'bg-red-400/20 text-red-300'}
                `}>
                  {game.difficulty}
                </span>
                {!game.component && (
                  <span className="text-xs text-white/50 tamagotchi-font-body">Soon</span>
                )}
              </div>
            </div>

            {/* Hover Effect */}
            {hoveredGame === game.id && (
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-transparent rounded-lg pointer-events-none" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniGameGrid;