import { useState, useEffect } from 'react';
import { tamagotchiData, getRandomFunFact } from '../../data/tamagotchiData';

const CharacterGuide = ({ characters, selectedCharacter, onCharacterSelect }) => {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-pink-500 font-mono flex items-center gap-2 tamagotchi-font-tech">
        CHARACTER_GUIDE.EXE
      </h4>
      
      {/* Evolution Path Layout */}
      <div className="relative bg-black/20 p-4 rounded-xl border border-pink-400/30">
        <div className="text-center mb-4">
          <span className="text-xs text-pink-300 font-mono tamagotchi-font-tech">EVOLUTION PATHS</span>
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
                    ? 'border-pink-500 shadow-lg shadow-pink-500/20 transform scale-105' 
                    : 'border-white/20 hover:border-pink-400/50 hover:scale-102'
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
                        className={`w-2 h-2 rounded-full ${
                          level <= (4 - index) 
                            ? 'bg-pink-400' 
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
      <h4 className="text-lg font-bold text-cyan-400 font-mono flex items-center gap-2 tamagotchi-font-tech">
        <span className="text-2xl">📊</span> CARE_STATS.DAT
      </h4>
      <div className="space-y-3 bg-black/20 p-4 rounded-xl border border-cyan-400/30">
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
      <h4 className="text-lg font-bold text-green-400 font-mono flex items-center gap-2 tamagotchi-font-tech">
        <span className="text-2xl">🎮</span> MINI_GAMES.ROM
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
                ? 'border-green-400 bg-green-400/20 transform scale-105' 
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
                ${game.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                  game.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'}
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
      <h4 className="text-lg font-bold text-yellow-400 font-mono flex items-center gap-2 tamagotchi-font-tech">
        <span className="text-2xl">📈</span> EVOLUTION.LOG
      </h4>
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-yellow-400 to-pink-400" />
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

const MemoryCarousel = ({ memories, currentMemory, onMemoryChange }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold text-pink-400 font-mono flex items-center gap-2 tamagotchi-font-tech">
          <span className="text-2xl">💭</span> MEMORIES.TXT
        </h4>
        <div className="flex gap-1">
          {memories.map((_, index) => (
            <button
              key={index}
              onClick={() => onMemoryChange(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentMemory 
                  ? 'bg-pink-400 w-4' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 p-4 rounded-xl border border-pink-400/30">
        <h5 className="font-bold text-white mb-2 tamagotchi-font-header">
          {memories[currentMemory].title}
        </h5>
        <p className="text-white/80 text-sm leading-relaxed tamagotchi-font-body">
          {memories[currentMemory].content}
        </p>
      </div>
    </div>
  );
};

const FunFactDisplay = ({ fact }) => {
  return (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-purple-400 font-mono flex items-center gap-2 tamagotchi-font-tech">
        <span className="text-2xl">💡</span> DID_YOU_KNOW.NFO
      </h4>
      <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 p-4 rounded-xl border border-purple-400/30">
        <h5 className="font-bold text-purple-300 mb-2 tamagotchi-font-header">{fact.title}</h5>
        <p className="text-sm text-white/80 leading-relaxed tamagotchi-font-body">{fact.fact}</p>
        <div className="mt-3 flex items-center gap-2">
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full font-mono uppercase tamagotchi-font-tech">
            #{fact.category}
          </span>
          <span className="text-xs text-white/50 tamagotchi-font-body">Press SPACE for more facts!</span>
        </div>
      </div>
    </div>
  );
};

export const TamagotchiMemoryCapsule = ({ onCharacterSelect }) => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [currentMemory, setCurrentMemory] = useState(0);
  const [currentFact, setCurrentFact] = useState(getRandomFunFact());

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
  };

  return (
    <div className="space-y-6">
      {/* Header with animated gradient */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-gradient tamagotchi-font-header">
          Tamagotchi Memory Capsule
        </h3>
      </div>

      {/* Character Guide */}
      <CharacterGuide 
        characters={tamagotchiData.characters}
        selectedCharacter={selectedCharacter}
        onCharacterSelect={handleCharacterSelect}
      />

      {/* Selected Character Detail */}
      {selectedCharacter && (
        <div className="animate-fade-in space-y-4">
          <div 
            className="p-4 rounded-xl border-2 transition-all"
            style={{
              borderColor: selectedCharacter.color,
              background: `linear-gradient(135deg, ${selectedCharacter.color}20, ${selectedCharacter.color}10)`
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl animate-bounce">{selectedCharacter.icon}</span>
              <div>
                <h5 className="font-bold text-lg text-white tamagotchi-font-header">{selectedCharacter.name}</h5>
                <p className="text-sm text-white/70 tamagotchi-font-body">{selectedCharacter.type}</p>
              </div>
            </div>
            <p className="text-white/80 mb-2 tamagotchi-font-body">{selectedCharacter.description}</p>
            <div className="text-xs text-white/60 space-y-1 tamagotchi-font-body">
              <p><span className="text-pink-400">Requirements:</span> {selectedCharacter.requirements}</p>
              <p><span className="text-cyan-400">Personality:</span> {selectedCharacter.personality}</p>
            </div>
          </div>
        </div>
      )}

      {/* Care Stats */}
      <CareStats stats={tamagotchiData.careStats} />

      {/* Mini Games */}
      <MiniGames games={tamagotchiData.miniGames} />

      {/* Evolution Timeline */}
      <EvolutionTimeline stages={tamagotchiData.evolutionStages} />

      {/* Memory Carousel */}
      <MemoryCarousel 
        memories={tamagotchiData.memories}
        currentMemory={currentMemory}
        onMemoryChange={setCurrentMemory}
      />

      {/* Fun Fact */}
      <FunFactDisplay fact={currentFact} />

      {/* Death Reasons (Easter Egg) */}
      <details className="cursor-pointer">
        <summary className="text-xs text-white/40 hover:text-white/60 transition-colors font-mono">
          ⚠️ MORTALITY.LOG
        </summary>
        <div className="mt-2 p-3 bg-red-900/20 rounded border border-red-500/30 text-xs text-red-300 space-y-1">
          {tamagotchiData.deathReasons.map((reason, index) => (
            <p key={index}>• {reason}</p>
          ))}
        </div>
      </details>
    </div>
  );
};