import { useState, useEffect } from 'react';
import { tamagotchiData, getRandomFunFact } from '../../data/tamagotchiData';
import { usePetState } from '../../hooks/usePetState';
import { useGameLoop } from '../../hooks/useGameLoop';
import { usePetAudio } from '../../hooks/usePetAudio';
import MiniGameGrid from './tamagotchi/MiniGameGrid';
import CareInterface from './tamagotchi/CareInterface';
import StatusDisplay from './tamagotchi/StatusDisplay';

const CharacterGuide = ({ characters, selectedCharacter, onCharacterSelect }) => {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-pink-400 flex items-center gap-2">
        <span className="text-xl">🌟</span> Pet Collection ♥
      </h4>
      
      {/* Evolution Path Layout */}
      <div className="relative bg-gradient-to-br from-pink-50/10 to-purple-50/5 p-4 rounded-xl border border-pink-300/20 shadow-lg">
        <div className="text-center mb-4">
          <span className="text-xs text-pink-300">Choose Your Pet ♥</span>
        </div>
        
        <div className="space-y-3">
          {characters.map((character, index) => (
            <div key={character.id} className="relative">
              {/* Connection line to next character */}
              {index < characters.length - 1 && (
                <div className="absolute left-8 top-16 w-0.5 h-8 bg-gradient-to-b from-pink-400/50 to-transparent" />
              )}
              
              <button
                onClick={() => onCharacterSelect(character)}
                className={`
                  w-full flex items-center gap-2 p-2.5 rounded-lg border transition-all duration-300 overflow-hidden
                  ${selectedCharacter?.id === character.id 
                    ? 'border-pink-400 shadow-lg shadow-pink-400/20 transform scale-105' 
                    : 'border-white/20 hover:border-pink-300/50 hover:scale-102'
                  }
                `}
                style={{
                  background: selectedCharacter?.id === character.id
                    ? `linear-gradient(90deg, ${character.color}20, transparent)`
                    : `linear-gradient(90deg, ${character.color}10, transparent)`
                }}
              >
                {/* Character Icon */}
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-xl border-2 animate-pulse flex-shrink-0"
                  style={{ borderColor: character.color }}
                >
                  {character.icon}
                </div>
                
                {/* Character Info */}
                <div className="flex-1 text-left min-w-0">
                  <h5 className="font-semibold text-sm text-white tamagotchi-font-header">{character.name}</h5>
                  <p className="text-xs text-white/70 tamagotchi-font-body">{character.type}</p>
                </div>
                
                {/* Care Level Indicator */}
                <div className="flex items-center justify-center flex-shrink-0 w-10">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          level <= (4 - index) 
                            ? 'bg-pink-300' 
                            : 'bg-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CareStats = ({ stats }) => {
  const [animatedStats, setAnimatedStats] = useState({});

  useEffect(() => {
    stats.forEach((stat, index) => {
      setTimeout(() => {
        setAnimatedStats(prev => ({
          ...prev,
          [stat.name]: Math.floor(Math.random() * 100)
        }));
      }, index * 200);
    });
  }, [stats]);

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-cyan-300 flex items-center gap-2">
        <span className="text-2xl">📔</span> Care Diary
      </h4>
      <div className="space-y-3 bg-gradient-to-br from-cyan-50/10 to-pink-50/5 p-4 rounded-xl border border-cyan-300/20 shadow-md">
        {stats.map((stat) => (
          <div key={stat.name} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-white flex items-center gap-2 tamagotchi-font-body">
                <span>{stat.icon}</span> {stat.name}
              </span>
              <span className="text-xs text-white/60 tamagotchi-font-body">{animatedStats[stat.name] || 0}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full transition-all duration-1000 ease-out rounded-full"
                style={{
                  width: `${animatedStats[stat.name] || 0}%`,
                  backgroundColor: stat.color
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MiniGames = ({ games }) => {
  const [hoveredGame, setHoveredGame] = useState(null);

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-green-300 flex items-center gap-2">
        <span className="text-2xl">🎮</span> Play Time!
      </h4>
      <div className="space-y-2">
        {games.map((game) => (
          <div
            key={game.name}
            onMouseEnter={() => setHoveredGame(game.name)}
            onMouseLeave={() => setHoveredGame(null)}
            className={`
              p-3 rounded-lg border transition-all duration-300 cursor-pointer
              ${hoveredGame === game.name 
                ? 'border-green-300 bg-green-300/15 transform scale-105' 
                : 'border-white/20 bg-white/5'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{game.icon}</span>
                <div>
                  <h5 className="font-semibold text-white tamagotchi-font-header">{game.name}</h5>
                  <p className="text-xs text-white/60 tamagotchi-font-body">{game.description}</p>
                </div>
              </div>
              <span className={`
                text-xs px-2 py-1 rounded-full
                ${game.difficulty === 'Easy' ? 'bg-green-400/20 text-green-300' :
                  game.difficulty === 'Medium' ? 'bg-yellow-400/20 text-yellow-300' :
                  'bg-red-400/20 text-red-300'}
              `}>
                {game.difficulty}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EvolutionTimeline = ({ stages }) => {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-yellow-300 flex items-center gap-2">
        <span className="text-2xl">⭐</span> Growth Journey
      </h4>
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-300 via-pink-300 to-purple-300" />
        <div className="space-y-4">
          {stages.map((stage, index) => (
            <div key={stage.stage} className="flex items-center gap-4 relative">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl animate-pulse border-2"
                style={{
                  backgroundColor: `${stage.color}20`,
                  borderColor: stage.color,
                  animationDelay: `${index * 200}ms`
                }}
              >
                {stage.icon}
              </div>
              <div className="flex-1">
                <h5 className="font-semibold text-white tamagotchi-font-header">{stage.stage}</h5>
                <p className="text-xs text-white/60 tamagotchi-font-body">{stage.age}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MemoryLog = ({ memories, currentMemory, onMemoryChange }) => {
  const [expandedMemory, setExpandedMemory] = useState(null);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xl font-bold text-pink-400 flex items-center gap-2">
          <span className="text-2xl">💝</span> Memory Diary
        </h4>
        <span className="text-xs text-pink-300 px-3 py-1 bg-pink-400/10 rounded-full">
          {memories.length} memories
        </span>
      </div>
      
      {/* Featured Memory */}
      <div className="bg-gradient-to-br from-pink-100/20 via-purple-100/10 to-cyan-100/10 p-5 rounded-2xl border border-pink-300/30 shadow-lg">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h5 className="font-bold text-lg text-white mb-1">
              {memories[currentMemory].title}
            </h5>
            <span className="text-xs text-pink-300/80">
              {memories[currentMemory].timestamp}
            </span>
          </div>
          <div className="flex gap-1">
            {memories.slice(0, 5).map((_, index) => (
              <button
                key={index}
                onClick={() => onMemoryChange(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentMemory 
                    ? 'bg-pink-400 w-4' 
                    : 'bg-white/30 hover:bg-pink-300/50'
                }`}
              />
            ))}
          </div>
        </div>
        <p className="text-white/90 text-sm leading-relaxed mb-3">
          {memories[currentMemory].content}
        </p>
        <button 
          onClick={() => setExpandedMemory(expandedMemory ? null : 'all')}
          className="text-xs text-pink-300 hover:text-pink-400 transition-colors"
        >
          {expandedMemory ? '← Back to featured' : 'View all memories →'}
        </button>
      </div>
      
      {/* All Memories List */}
      {expandedMemory && (
        <div className="space-y-3 animate-fade-in max-h-96 overflow-y-auto pr-2">
          {memories.map((memory, index) => (
            <div 
              key={index}
              onClick={() => {
                onMemoryChange(index);
                setExpandedMemory(null);
              }}
              className="p-3 bg-white/5 hover:bg-pink-500/10 rounded-lg border border-white/10 hover:border-pink-400/30 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between mb-1">
                <h6 className="font-semibold text-sm text-white">{memory.title}</h6>
                <span className="text-xs text-pink-300/60">{memory.timestamp}</span>
              </div>
              <p className="text-xs text-white/70 line-clamp-2">{memory.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FunFactDisplay = ({ fact }) => {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-purple-300 flex items-center gap-2">
        <span className="text-2xl">💡</span> Fun Facts!
      </h4>
      <div className="bg-gradient-to-r from-purple-100/20 to-cyan-100/15 p-4 rounded-xl border border-purple-300/20 shadow-md">
        <h5 className="font-bold text-purple-300 mb-2 tamagotchi-font-header">{fact.title}</h5>
        <p className="text-sm text-white/80 leading-relaxed tamagotchi-font-body">{fact.fact}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="px-3 py-1 bg-purple-400/20 text-purple-300 text-xs rounded-full uppercase">
            #{fact.category}
          </span>
          <span className="text-xs text-white/50 tamagotchi-font-body">Press SPACE for more facts!</span>
        </div>
      </div>
    </div>
  );
};

export const TamagotchiMemoryCapsule = ({ onCharacterSelect, isZoomedIn }) => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [currentMemory, setCurrentMemory] = useState(0);
  const [currentFact, setCurrentFact] = useState(getRandomFunFact());

  // Initialize pet simulation system
  const petStateHook = usePetState();
  const { playPetSound, gameAudio } = usePetAudio();
  
  // Start game loop when component is active
  useGameLoop(petStateHook, isZoomedIn);

  // Auto-rotate memories
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMemory(prev => (prev + 1) % tamagotchiData.memories.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Rotate fun facts
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFact(getRandomFunFact());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut for new fact
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setCurrentFact(getRandomFunFact());
      }
    };
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, []);

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
    onCharacterSelect?.(character);
    playPetSound('happy');
  };

  const handleCareAction = (action) => {
    const success = petStateHook.careActions[action]();
    if (success) {
      const soundMap = {
        feed: 'eating',
        play: 'playing', 
        clean: 'happy',
        sleep: 'happy'
      };
      playPetSound(soundMap[action] || 'happy');
    }
  };

  const handleGameComplete = (gameId, score, rewards) => {
    // Apply game rewards to pet
    petStateHook.updatePetStats(rewards);
    
    // Play success sound
    if (score > 50) {
      gameAudio.success();
    } else {
      gameAudio.gameOver();
    }
    
    // Save high score
    localStorage.setItem(`tamagotchi_${gameId}_highscore`, Math.max(
      score, 
      parseInt(localStorage.getItem(`tamagotchi_${gameId}_highscore`) || '0')
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header with softer gradient */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-transparent tamagotchi-font-header" style={{ textShadow: 'none' }}>
          ✨ Tamagotchi Memory Capsule ✨
        </h3>
      </div>

      {/* NEW: Live Pet Status Display */}
      <StatusDisplay petState={petStateHook.uiState} />

      {/* NEW: Live Pet Care System */}
      <CareInterface 
        onCareAction={handleCareAction} 
        petState={petStateHook.uiState} 
      />

      {/* NEW: Interactive Mini-Games */}
      <MiniGameGrid 
        onGameComplete={handleGameComplete}
        petState={petStateHook.uiState}
      />

      {/* Memory Log - Now secondary */}
      <MemoryLog 
        memories={tamagotchiData.memories}
        currentMemory={currentMemory}
        onMemoryChange={setCurrentMemory}
      />

      {/* Character Guide */}
      <div className="bg-white/5 p-5 rounded-2xl backdrop-blur-sm">
        <CharacterGuide 
          characters={tamagotchiData.characters}
          selectedCharacter={selectedCharacter}
          onCharacterSelect={handleCharacterSelect}
        />

        {/* Selected Character Detail */}
        {selectedCharacter && (
          <div className="animate-fade-in mt-4">
            <div 
              className="p-4 rounded-xl border-2 transition-all"
              style={{
                borderColor: selectedCharacter.color,
                background: `linear-gradient(135deg, ${selectedCharacter.color}20, ${selectedCharacter.color}10)`
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{selectedCharacter.icon}</span>
                <div>
                  <h5 className="font-bold text-lg text-white">{selectedCharacter.name}</h5>
                  <p className="text-sm text-white/70">{selectedCharacter.type}</p>
                </div>
              </div>
              <p className="text-white/80 mb-2">{selectedCharacter.description}</p>
              <div className="text-xs text-white/60 space-y-1">
                <p><span className="text-pink-400">Requirements:</span> {selectedCharacter.requirements}</p>
                <p><span className="text-cyan-400">Personality:</span> {selectedCharacter.personality}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Secondary Information - Collapsible */}
      <details className="bg-white/5 p-5 rounded-2xl backdrop-blur-sm cursor-pointer group">
        <summary className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-white hover:text-pink-300 transition-colors">
          <span className="text-lg font-semibold flex items-center gap-2">
            <span>📊</span> Care & Activities
          </span>
          <span className="text-xs text-white/40 group-hover:text-pink-300/60 transition-colors">
            ▼ Click to expand
          </span>
        </summary>
        <div className="mt-4 space-y-6">
          {/* Care Stats */}
          <CareStats stats={tamagotchiData.careStats} />

          {/* Mini Games */}
          <MiniGames games={tamagotchiData.miniGames} />

          {/* Evolution Timeline */}
          <EvolutionTimeline stages={tamagotchiData.evolutionStages} />
        </div>
      </details>

      {/* Fun Fact */}
      <FunFactDisplay fact={currentFact} />

      {/* Death Reasons (Easter Egg) */}
      <details className="cursor-pointer">
        <summary className="text-xs text-white/40 hover:text-white/60 transition-colors">
          💔 Digital Pet Cemetery
        </summary>
        <div className="mt-2 p-3 bg-purple-900/20 rounded-xl border border-purple-500/30 text-xs text-purple-300 space-y-1">
          <p className="text-center mb-2 text-white/60">~ In loving memory ~</p>
          {tamagotchiData.deathReasons.map((reason, index) => (
            <p key={index}>• {reason}</p>
          ))}
          <p className="text-center mt-3 text-white/50 italic">They lived, they beeped, they were loved.</p>
        </div>
      </details>
    </div>
  );
};