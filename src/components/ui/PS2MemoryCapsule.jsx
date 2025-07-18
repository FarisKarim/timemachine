import { useState, useEffect } from 'react';
import { ps2Data, getRandomMemory, getMemoryCardByIndex } from '../../data/ps2Data';

const PS2MemoryCardBrowser = ({ memoryCards, selectedCard, onCardSelect }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
        <h4 className="text-xl font-bold text-blue-400 font-mono uppercase tracking-wider">
          Memory Card Browser
        </h4>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {memoryCards.map((card, index) => (
          <div
            key={card.id}
            onMouseEnter={() => setHoveredCard(card.id)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => onCardSelect(card)}
            className={`
              relative p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer
              ${selectedCard?.id === card.id 
                ? 'border-blue-400 bg-blue-400/10 shadow-lg shadow-blue-400/20' 
                : 'border-blue-600/30 bg-blue-950/20 hover:border-blue-500/50 hover:bg-blue-900/30'
              }
            `}
          >
            {/* Memory Card Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-sm flex items-center justify-center">
                  <span className="text-xs font-bold text-white">💾</span>
                </div>
                <div>
                  <h5 className="font-bold text-blue-300 text-sm font-mono">
                    {card.label}
                  </h5>
                  <p className="text-xs text-blue-400/70">
                    {card.used} / {card.capacity} used
                  </p>
                </div>
              </div>
              
              {/* Usage Bar */}
              <div className="w-16 h-2 bg-blue-950/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                  style={{ width: `${(parseFloat(card.used) / parseFloat(card.capacity)) * 100}%` }}
                />
              </div>
            </div>
            
            {/* Save Files Preview */}
            <div className="space-y-2">
              {card.saves.slice(0, 3).map((save, saveIndex) => (
                <div key={saveIndex} className="flex items-center gap-2 p-2 bg-black/20 rounded">
                  <span className="text-lg">{save.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {save.game}
                    </p>
                    <p className="text-xs text-blue-300/60">
                      {save.progress} • {save.playTime}
                    </p>
                  </div>
                  <div className="text-xs text-blue-400/50 font-mono">
                    {save.date}
                  </div>
                </div>
              ))}
              
              {card.saves.length > 3 && (
                <div className="text-center py-1">
                  <span className="text-xs text-blue-400/50">
                    +{card.saves.length - 3} more saves
                  </span>
                </div>
              )}
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

const PS2MemoryVault = ({ memories, currentMemory, onMemoryChange }) => {
  const [expandedMemories, setExpandedMemories] = useState(false);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
        <h4 className="text-xl font-bold text-blue-400 font-mono uppercase tracking-wider">
          Memory Vault
        </h4>
        <div className="text-xs text-blue-400/60 px-3 py-1 bg-blue-950/30 rounded-full">
          {memories.length} memories archived
        </div>
      </div>
      
      {/* Featured Memory */}
      <div className="bg-gradient-to-br from-blue-950/30 via-blue-900/20 to-black/40 p-6 rounded-xl border border-blue-500/30 shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{memories[currentMemory].icon}</span>
              <h5 className="font-bold text-xl text-blue-300 font-mono">
                {memories[currentMemory].title}
              </h5>
            </div>
            <div className="flex items-center gap-4 text-xs text-blue-400/70">
              <span>{memories[currentMemory].timestamp}</span>
              <span className="px-2 py-1 bg-blue-500/20 rounded">
                {memories[currentMemory].category}
              </span>
              <span className="px-2 py-1 bg-purple-500/20 rounded">
                {memories[currentMemory].emotion}
              </span>
            </div>
          </div>
          
          {/* Navigation Dots */}
          <div className="flex gap-1">
            {memories.slice(0, 5).map((_, index) => (
              <button
                key={index}
                onClick={() => onMemoryChange(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentMemory 
                    ? 'bg-blue-400 w-4' 
                    : 'bg-blue-600/30 hover:bg-blue-500/50'
                }`}
              />
            ))}
          </div>
        </div>
        
        <p className="text-white/90 text-sm leading-relaxed mb-4">
          {memories[currentMemory].content}
        </p>
        
        <button 
          onClick={() => setExpandedMemories(!expandedMemories)}
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-mono"
        >
          {expandedMemories ? '← BACK TO FEATURED' : 'BROWSE ALL MEMORIES →'}
        </button>
      </div>
      
      {/* All Memories Grid */}
      {expandedMemories && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-fade-in max-h-96 overflow-y-auto pr-2">
          {memories.map((memory, index) => (
            <div 
              key={index}
              onClick={() => {
                onMemoryChange(index);
                setExpandedMemories(false);
              }}
              className="p-3 bg-blue-950/20 hover:bg-blue-900/30 rounded-lg border border-blue-600/20 hover:border-blue-500/40 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">{memory.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h6 className="font-semibold text-sm text-blue-300 truncate">
                      {memory.title}
                    </h6>
                    <span className="text-xs text-blue-500/60 font-mono">
                      {memory.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-white/70 line-clamp-2">
                    {memory.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const PS2SystemInfo = ({ systemInfo }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
        <h4 className="text-xl font-bold text-blue-400 font-mono uppercase tracking-wider">
          System Configuration
        </h4>
      </div>
      
      <div className="bg-gradient-to-br from-blue-950/30 via-blue-900/20 to-black/40 p-4 rounded-xl border border-blue-500/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(systemInfo).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center p-2 bg-black/20 rounded">
              <span className="text-xs text-blue-400/70 font-mono uppercase">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <span className="text-xs text-white font-mono">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export const PS2MemoryCapsule = ({ onCardSelect }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentMemory, setCurrentMemory] = useState(0);
  
  // Auto-rotate memories
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMemory(prev => (prev + 1) % ps2Data.memories.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);
  
  const handleCardSelect = (card) => {
    setSelectedCard(card);
    onCardSelect?.(card);
  };
  
  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <h3 className="text-3xl font-bold text-blue-400 font-mono uppercase tracking-wider">
            PlayStation 2
          </h3>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        </div>
        
        <p className="text-blue-300/70 text-sm font-mono">
          MEMORY SYSTEM INITIALIZED
        </p>
      </div>
      
      {/* Memory Vault - Primary Section */}
      <PS2MemoryVault
        memories={ps2Data.memories}
        currentMemory={currentMemory}
        onMemoryChange={setCurrentMemory}
      />
      
      {/* Memory Card Browser */}
      <PS2MemoryCardBrowser
        memoryCards={ps2Data.memoryCards}
        selectedCard={selectedCard}
        onCardSelect={handleCardSelect}
      />
      
      {/* Selected Memory Card Details */}
      {selectedCard && (
        <div className="bg-gradient-to-br from-blue-950/30 via-blue-900/20 to-black/40 p-6 rounded-xl border border-blue-500/30 shadow-xl animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <h4 className="text-xl font-bold text-blue-400 font-mono uppercase tracking-wider">
              {selectedCard.label}
            </h4>
          </div>
          
          <div className="space-y-3">
            {selectedCard.saves.map((save, index) => (
              <div key={index} className="flex items-center gap-4 p-3 bg-black/30 rounded-lg">
                <span className="text-2xl">{save.icon}</span>
                <div className="flex-1">
                  <h5 className="font-bold text-blue-300 text-sm">
                    {save.game}
                  </h5>
                  <p className="text-xs text-blue-400/70">
                    {save.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-blue-300 font-mono">
                    {save.progress}
                  </p>
                  <p className="text-xs text-blue-400/60 font-mono">
                    {save.playTime}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* System Info - Collapsible */}
      <details className="bg-blue-950/10 p-4 rounded-xl border border-blue-600/20 cursor-pointer">
        <summary className="text-blue-400 font-mono text-sm hover:text-blue-300 transition-colors">
          ▼ SYSTEM CONFIGURATION
        </summary>
        <div className="mt-4">
          <PS2SystemInfo systemInfo={ps2Data.systemInfo} />
        </div>
      </details>
      
    </div>
  );
};