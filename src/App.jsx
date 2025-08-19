import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Scene } from './components/3d/Scene';

const MemoScene = memo(Scene, (prevProps, nextProps) => {
  // Custom comparison - log what changed
  const changed = {};
  Object.keys(nextProps).forEach(key => {
    if (prevProps[key] !== nextProps[key]) {
      changed[key] = { prev: prevProps[key], next: nextProps[key] };
    }
  });
  
  if (Object.keys(changed).length > 0) {
    console.log('🔍 MemoScene props changed:', changed);
    return false; // Re-render
  }
  
  console.log('✋ MemoScene blocked re-render - no prop changes');
  return true; // Block re-render
});
import { GameBoyMemoryCapsule } from './components/ui/GameBoyMemoryCapsule';
import { TamagotchiMemoryCapsule } from './components/ui/TamagotchiMemoryCapsule';
import { IPodMemoryCapsule } from './components/ui/iPodMemoryCapsule';
import { PS2MemoryCapsule } from './components/ui/PS2MemoryCapsule';
import IMacG3MemoryCapsule from './components/ui/IMacG3MemoryCapsule';
import { useAudioManager } from './hooks/useAudioManager';
import { useMobileDetection } from './hooks/useMobileDetection';
import { useTouchControls } from './hooks/useTouchControls';
import { nostalgicObjects } from './data/objects';
import './App.css';

function App() {
  console.log('📱 App RE-RENDER - checking if Scene should re-render too...');
  
  const [selectedObject, setSelectedObject] = useState(null);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [selectedIMacColor, setSelectedIMacColor] = useState('#0369a1'); // Default Bondi Blue
  const scrollProgressRef = useRef(0);
  const { isMuted, volume, audioStarted, toggleMute, changeVolume, playSound } = useAudioManager();
  const { isMobile, isTablet, isDesktop, orientation } = useMobileDetection();

  // Touch controls for mobile
  const handleTouchScroll = (delta) => {
    scrollProgressRef.current = Math.max(0, Math.min(1, scrollProgressRef.current + delta));
  };

  const { isDragging } = useTouchControls({
    onScroll: handleTouchScroll,
    isEnabled: isMobile && !isZoomedIn
  });

  const handleObjectClick = useCallback((object) => {
    setSelectedObject(object);
    setIsZoomedIn(true);
    playSound('click');
    setTimeout(() => playSound('object', object.id), 300);
    console.log('Clicked object:', object.name);
  }, [playSound]);

  const handleGameSelect = (game) => {
    console.log('Selected game:', game.title);
    // Future: Could trigger additional animations or effects
  };

  const handleGameAudio = (gameId) => {
    // Play game-specific audio using the existing sound system
    playSound('object', gameId);
  };

  const handleCharacterSelect = (character) => {
    console.log('Selected Tamagotchi character:', character.name);
    // Could trigger character-specific sounds or animations
  };

  const closeModal = () => {
    setIsZoomedIn(false);
    // Delay clearing selected object to allow zoom-out animation
    setTimeout(() => {
      setSelectedObject(null);
    }, 800);
  };

  const navigateToAdjacentObject = useCallback((direction) => {
    if (!selectedObject || !isZoomedIn) return;
    
    const currentIndex = nostalgicObjects.findIndex(obj => obj.id === selectedObject.id);
    if (currentIndex === -1) return;
    
    let nextIndex;
    if (direction === 'right') {
      nextIndex = (currentIndex + 1) % nostalgicObjects.length;
    } else {
      nextIndex = (currentIndex - 1 + nostalgicObjects.length) % nostalgicObjects.length;
    }
    
    const nextObject = nostalgicObjects[nextIndex];
    setSelectedObject(nextObject);
    playSound('click');
    setTimeout(() => playSound('object', nextObject.id), 300);
  }, [selectedObject, isZoomedIn, playSound]);


  useEffect(() => {
    const handleWheel = (e) => {
      // Only handle timeline scroll when NOT zoomed in
      if (isZoomedIn) return;
      
      // Prevent default scroll behavior for timeline
      e.preventDefault();
      
      // Simple direct scroll with balanced sensitivity
      const rawDelta = e.deltaX !== 0 ? e.deltaX : e.deltaY;
      const normalizedDelta = Math.sign(rawDelta) * Math.min(Math.abs(rawDelta), 100);
      const sensitivity = 0.001; // Much lower - was 0.005
      const deltaPosition = normalizedDelta * sensitivity;
      
      // Update position directly using ref to avoid stale closure
      const currentProgress = scrollProgressRef.current;
      scrollProgressRef.current = Math.max(0, Math.min(1, currentProgress + deltaPosition));
    };

    const handleKeyDown = (e) => {
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (isZoomedIn) {
            navigateToAdjacentObject('left');
          } else {
            scrollProgressRef.current = Math.max(0, scrollProgressRef.current - 0.1);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (isZoomedIn) {
            navigateToAdjacentObject('right');
          } else {
            scrollProgressRef.current = Math.min(1, scrollProgressRef.current + 0.1);
          }
          break;
        case 'Escape':
          e.preventDefault();
          if (isZoomedIn) {
            closeModal();
          }
          break;
      }
    };

    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isZoomedIn, navigateToAdjacentObject]);

  return (
    <div className="relative overflow-hidden">
      {/* 3D Scene */}
      <div className="fixed inset-0 w-full h-full z-0">
        <MemoScene 
          onObjectClick={handleObjectClick} 
          scrollProgressRef={scrollProgressRef}
          selectedObjectId={selectedObject?.id}
          isZoomedIn={isZoomedIn}
          isMobile={isMobile}
          selectedIMacColor={selectedIMacColor}
        />
      </div>

      {/* GameBoy Background Texture Overlay */}
      {selectedObject?.type === 'gameboy' && isZoomedIn && (
        <>
          <div className="gameboy-scene-texture" />
          <div className="gameboy-sparkles" />
        </>
      )}
      
      {/* UI Overlay - responsive positioning */}
      <div className={`fixed top-4 md:top-8 z-20 text-white pointer-events-none transition-all duration-700 ${
        selectedObject && isZoomedIn 
          ? (isMobile ? 'left-4' : 'left-[28rem]')
          : 'left-4 md:left-8'
      }`}>
        <h1 className={`tm2000s-logo mb-2 ${isMobile ? 'text-2xl' : 'text-4xl'} ${
          selectedObject?.type === 'gameboy' && isZoomedIn 
            ? 'gameboy-theme'
            : selectedObject?.type === 'imacG3' && isZoomedIn 
            ? 'imac-theme'
            : selectedObject?.type === 'tamagotchi' && isZoomedIn 
            ? 'tamagotchi-theme'
            : ''
        }`}>
          TM2000s
        </h1>
        <p className={`opacity-80 ${isMobile ? 'text-sm' : 'text-lg'}`}>
          {isZoomedIn 
            ? 'Exploring memories...' 
            : ''
          }
        </p>
      </div>

      
      {/* Navigation Controls - responsive */}
      <div className={`fixed top-4 md:top-8 right-4 md:right-8 z-20 flex gap-1 md:gap-2 ${
        isMobile ? 'flex-col' : 'flex-row'
      }`}>
        <button 
          className="y2k-start-button"
          onClick={() => {
            const gameboy = nostalgicObjects[0]; // First object is Game Boy
            handleObjectClick(gameboy);
          }}
        >
          <span className="y2k-play-icon"></span>
          Start Journey
        </button>
        
        {/* Audio Controls */}
        <button 
          className={`y2k-sound-button ${isMuted ? 'muted' : 'unmuted'}`}
          onClick={toggleMute}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          <div className={`equalizer-container ${isMuted ? 'muted' : 'animated'}`}>
            <div className="eq-bar eq-bar-1"></div>
            <div className="eq-bar eq-bar-2"></div>
            <div className="eq-bar eq-bar-3"></div>
            <div className="eq-bar eq-bar-4"></div>
            <div className="eq-bar eq-bar-5"></div>
          </div>
        </button>
      </div>
      
        
      {/* Memory Sidebar - responsive with dynamic styling */}
      <div 
        className={`fixed left-0 top-0 h-full border-r z-20 transform transition-transform duration-700 ease-out ${
          isMobile ? 'w-full' : 'lg:w-96 w-80'
        } ${
          selectedObject && isZoomedIn ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: selectedObject?.type === 'gameboy'
            ? 'linear-gradient(135deg, rgba(226, 232, 240, 0.95), rgba(148, 163, 184, 0.9))'
            : selectedObject?.type === 'tamagotchi' 
            ? 'linear-gradient(45deg, #FF1493, #FF69B4, #00BFFF, #32CD32, #FFD700)'
            : selectedObject?.type === 'ipod'
            ? 'linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(241, 245, 249, 0.9) 50%, rgba(226, 232, 240, 0.95) 100%)'
            : selectedObject?.type === 'imacG3'
            ? 'linear-gradient(135deg, rgba(0, 149, 182, 0.95) 0%, rgba(0, 201, 255, 0.9) 50%, rgba(0, 149, 182, 0.95) 100%)'
            : 'rgba(0, 0, 0, 0.4)',
          backdropFilter: selectedObject?.type === 'gameboy'
            ? 'blur(12px)'
            : selectedObject?.type === 'tamagotchi' 
            ? 'blur(8px)' 
            : selectedObject?.type === 'ipod'
            ? 'blur(24px) saturate(180%)'
            : selectedObject?.type === 'imacG3'
            ? 'blur(16px) saturate(150%)'
            : 'blur(12px)',
          borderColor: selectedObject?.type === 'gameboy'
            ? 'rgba(59, 130, 246, 0.3)'
            : selectedObject?.type === 'tamagotchi' 
            ? '#FF1493' 
            : selectedObject?.type === 'ipod'
            ? 'rgba(255, 255, 255, 0.4)'
            : selectedObject?.type === 'imacG3'
            ? 'rgba(0, 149, 182, 0.6)'
            : 'rgba(255, 255, 255, 0.1)',
          borderWidth: selectedObject?.type === 'gameboy'
            ? '2px'
            : selectedObject?.type === 'tamagotchi' 
            ? '3px' 
            : selectedObject?.type === 'ipod'
            ? '2px'
            : selectedObject?.type === 'imacG3'
            ? '2px'
            : '1px',
          borderStyle: selectedObject?.type === 'tamagotchi' ? 'dashed' : 'solid',
          color: selectedObject?.type === 'gameboy'
            ? '#1e293b'
            : selectedObject?.type === 'tamagotchi' 
            ? 'white' 
            : selectedObject?.type === 'ipod'
            ? '#1e293b'
            : selectedObject?.type === 'imacG3'
            ? 'white'
            : 'white',
          animation: selectedObject?.type === 'tamagotchi' ? 'rainbow-pulse 3s infinite' : 'none',
          boxShadow: selectedObject?.type === 'gameboy'
            ? '0 8px 32px rgba(59, 130, 246, 0.1)'
            : selectedObject?.type === 'ipod' 
            ? 'inset 0 1px 0 rgba(255, 255, 255, 0.6), 0 10px 30px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05)'
            : selectedObject?.type === 'tamagotchi'
            ? '0 0 20px #FF1493, 0 0 40px #FF69B4, 0 0 60px #00BFFF'
            : selectedObject?.type === 'imacG3'
            ? 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 10px 30px rgba(0, 149, 182, 0.2), 0 4px 12px rgba(0, 201, 255, 0.1)'
            : 'none'
        }}
      >
        {selectedObject && (
          <div className={`h-full flex flex-col relative ${
            selectedObject.type === 'ipod' ? 'glass-reflection' : ''
          }`}>
            {/* iPod Chrome Header Bar */}
            {selectedObject.type === 'ipod' && (
              <div className="ipod-chrome-header px-8 py-4 mb-6">
                <div className="text-center">
                  <div className="text-slate-600 text-xs font-light tracking-[0.2em] mb-1">iPod Memory Capsule</div>
                  <div className="w-16 h-0.5 bg-slate-400 mx-auto opacity-60"></div>
                </div>
              </div>
            )}
            
            <div className={`flex-1 overflow-hidden flex flex-col ${isMobile ? 'px-4 pb-4' : 'px-8 pb-8'} ${selectedObject.type === 'ipod' ? '' : 'pt-8'}`}>
              {/* 2000s Sparkle Overlay for Tamagotchi */}
              {selectedObject.type === 'tamagotchi' && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                </div>
              )}
              {/* Header */}
              <div className={isMobile ? 'mb-2' : 'mb-3'}>
                <button 
                  onClick={() => {
                    closeModal();
                    playSound('click');
                  }}
                  className={`mb-2 transition-all duration-300 ${
                    selectedObject.type === 'tamagotchi' 
                      ? 'text-white y2k-glow hover:animate-y2k-bounce' 
                      : selectedObject.type === 'ipod'
                      ? 'chrome-button text-slate-600 hover:text-slate-800 font-medium px-4 py-2 rounded-full'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  ← Back to Timeline
                </button>
              <div className="flex items-center gap-4">
                {selectedObject.type === 'tamagotchi' && (
                  <div className="flex gap-1">
                    <span className="text-2xl animate-y2k-bounce" style={{ animationDelay: '0.6s' }}>⭐</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Memory Content - Enhanced for all nostalgic objects */}
            <div className="flex-1 overflow-y-auto pr-4">
              {selectedObject.type === 'gameboy' ? (
                <GameBoyMemoryCapsule 
                  onGameSelect={handleGameSelect}
                  onAudioPlay={handleGameAudio}
                />
              ) : selectedObject.type === 'tamagotchi' ? (
                <TamagotchiMemoryCapsule 
                  onCharacterSelect={handleCharacterSelect}
                />
              ) : selectedObject.type === 'ps2' ? (
                <PS2MemoryCapsule 
                  onCardSelect={(card) => console.log('Selected memory card:', card)}
                />
              ) : selectedObject.type === 'ipod' ? (
                <div className="iPod-sidebar-content">
                  <IPodMemoryCapsule 
                    onTrackSelect={(track) => console.log('Selected track:', track)}
                    isZoomedIn={isZoomedIn}
                  />
                </div>
              ) : selectedObject.type === 'imacG3' ? (
                <IMacG3MemoryCapsule 
                  onSelect={(item) => console.log('Selected iMac G3 item:', item)}
                  onColorChange={(color) => setSelectedIMacColor(color)}
                />
              ) : (
                <div>
                  <h4 className={`font-semibold mb-4 text-white/90 ${
                    isMobile ? 'text-lg' : 'text-xl'
                  }`}>
                    {selectedObject.memory.title}
                  </h4>
                  <p className={`opacity-80 leading-relaxed ${
                    isMobile ? 'text-base' : 'text-lg'
                  }`}>
                    {selectedObject.memory.description}
                  </p>
                </div>
              )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App
