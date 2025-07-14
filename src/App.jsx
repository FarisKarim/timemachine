import { useState, useEffect, useRef } from 'react';
import { Scene } from './components/3d/Scene';
import { GameBoyMemoryCapsule } from './components/ui/GameBoyMemoryCapsule';
import { useAudioManager } from './hooks/useAudioManager';
import { useMobileDetection } from './hooks/useMobileDetection';
import { useTouchControls } from './hooks/useTouchControls';
import './App.css';

function App() {
  const [selectedObject, setSelectedObject] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const scrollProgressRef = useRef(0);
  const { isMuted, volume, audioStarted, toggleMute, changeVolume, playSound } = useAudioManager();
  const { isMobile, isTablet, isDesktop, orientation } = useMobileDetection();

  // Touch controls for mobile
  const handleTouchScroll = (delta) => {
    setScrollProgress(prev => Math.max(0, Math.min(1, prev + delta)));
  };

  const { isDragging } = useTouchControls({
    onScroll: handleTouchScroll,
    isEnabled: isMobile && !isZoomedIn
  });

  const handleObjectClick = (object) => {
    setSelectedObject(object);
    setIsZoomedIn(true);
    playSound('click');
    setTimeout(() => playSound('object', object.id), 300);
    console.log('Clicked object:', object.name);
  };

  const handleGameSelect = (game) => {
    console.log('Selected game:', game.title);
    // Future: Could trigger additional animations or effects
  };

  const handleGameAudio = (gameId) => {
    // Play game-specific audio using the existing sound system
    playSound('object', gameId);
  };

  const closeModal = () => {
    setIsZoomedIn(false);
    // Delay clearing selected object to allow zoom-out animation
    setTimeout(() => {
      setSelectedObject(null);
    }, 800);
  };


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
      const newProgress = Math.max(0, Math.min(1, currentProgress + deltaPosition));
      setScrollProgress(newProgress);
      scrollProgressRef.current = newProgress;
    };

    const handleKeyDown = (e) => {
      switch(e.key) {
        case 'ArrowLeft':
          if (!isZoomedIn) {
            e.preventDefault();
            setScrollProgress(prev => Math.max(0, prev - 0.1));
          }
          break;
        case 'ArrowRight':
          if (!isZoomedIn) {
            e.preventDefault();
            setScrollProgress(prev => Math.min(1, prev + 0.1));
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
  }, [isZoomedIn]);

  return (
    <div className="relative overflow-hidden">
      {/* 3D Scene */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Scene 
          onObjectClick={handleObjectClick} 
          scrollProgress={scrollProgress}
          scrollProgressRef={scrollProgressRef}
          selectedObject={selectedObject}
          isZoomedIn={isZoomedIn}
          isMobile={isMobile}
        />
      </div>
      
      {/* UI Overlay - responsive positioning */}
      <div className={`fixed top-4 md:top-8 z-20 text-white pointer-events-none transition-all duration-700 ${
        selectedObject && isZoomedIn 
          ? (isMobile ? 'left-4' : 'left-[28rem]')
          : 'left-4 md:left-8'
      }`}>
        <h1 className={`font-bold mb-2 text-shadow-lg ${isMobile ? 'text-2xl' : 'text-4xl'}`}>
          TM2000s
        </h1>
        <p className={`opacity-80 ${isMobile ? 'text-sm' : 'text-lg'}`}>
          {isZoomedIn 
            ? 'Exploring memories...' 
            : (isMobile ? 'Swipe to explore' : 'Scroll or use arrow keys to explore')
          }
        </p>
      </div>

      {/* Audio Permission Prompt - only show if audio not yet started */}
      {!audioStarted && !isZoomedIn && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-20 pointer-events-auto">
          <button 
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-orange-500 hover:from-purple-600 hover:to-orange-600 text-white rounded-full backdrop-blur-md transition-all duration-300 border border-white/20 text-sm animate-pulse shadow-lg"
            onClick={() => {
              playSound('click');
            }}
          >
            🎵 Enable Audio Experience
          </button>
        </div>
      )}
      
      {/* Navigation Controls - responsive */}
      <div className={`fixed top-4 md:top-8 right-4 md:right-8 z-20 flex gap-1 md:gap-2 ${
        isMobile ? 'flex-col' : 'flex-row'
      }`}>
        <button 
          className={`bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors ${
            isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'
          }`}
          onClick={() => {
            setScrollProgress(prev => Math.max(0, prev - 0.2));
            playSound('click');
          }}
        >
          {isMobile ? '←' : '← Prev'}
        </button>
        <button 
          className={`bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors ${
            isMobile ? 'px-3 py-2 text-sm' : 'px-4 py-2'
          }`}
          onClick={() => {
            setScrollProgress(prev => Math.min(1, prev + 0.2));
            playSound('click');
          }}
        >
          {isMobile ? '→' : 'Next →'}
        </button>
        
        {/* Audio Controls */}
        <button 
          className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm transition-colors text-sm"
          onClick={toggleMute}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>
      
      {/* Scroll progress indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
        <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
          <div 
            className="h-full bg-gradient-to-r from-purple-400 to-orange-400 transition-all duration-300 ease-out"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
        <div className="text-center text-white text-sm mt-2 opacity-70">
          {Math.round(scrollProgress * 100)}% explored
        </div>
      </div>
        
      {/* Memory Sidebar - responsive */}
      <div 
        className={`fixed left-0 top-0 h-full bg-black/40 backdrop-blur-md border-r border-white/10 text-white z-20 transform transition-transform duration-700 ease-out ${
          isMobile ? 'w-full' : 'w-96'
        } ${
          selectedObject && isZoomedIn ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {selectedObject && (
          <div className={`h-full flex flex-col ${isMobile ? 'p-4' : 'p-8'}`}>
            {/* Header */}
            <div className={isMobile ? 'mb-6' : 'mb-8'}>
              <button 
                onClick={() => {
                  closeModal();
                  playSound('click');
                }}
                className="mb-4 md:mb-6 text-white/60 hover:text-white transition-colors"
              >
                ← Back to Timeline
              </button>
              <div className="flex items-center gap-4">
                <div 
                  className="w-4 h-4 rounded-full animate-pulse"
                  style={{ backgroundColor: selectedObject.color }}
                />
                <h3 className={`font-bold ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
                  {selectedObject.name}
                </h3>
              </div>
            </div>
            
            {/* Memory Content - Enhanced for Game Boy */}
            <div className="flex-1 overflow-y-auto pr-4">
              {selectedObject.type === 'gameboy' ? (
                <GameBoyMemoryCapsule 
                  onGameSelect={handleGameSelect}
                  onAudioPlay={handleGameAudio}
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
        )}
      </div>
    </div>
  );
}

export default App
