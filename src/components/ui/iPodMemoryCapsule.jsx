import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ipodData, getRandomFunFact, getRandomMemory } from '../../data/ipodData';

const IPodShell = ({ children, className = "", onMenuClick, onSelectClick }) => {
  return (
    <div className={`relative mx-auto ${className}`} style={{ width: '240px', height: '400px' }}>
      {/* iPod Classic Body - White front with rounded rectangle shape */}
      <div className="relative w-full h-full bg-gradient-to-b from-gray-50 to-gray-200 shadow-2xl" 
           style={{ 
             borderRadius: '25px',
             border: '2px solid #ddd',
             boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8)'
           }}>
        
        {/* Top section with screen */}
        <div className="pt-6 px-6">
          {/* iPod branding */}
          <div className="text-center mb-4">
            <div className="text-gray-600 text-xs font-light tracking-[0.2em] mb-1">iPod</div>
            <div className="w-8 h-0.5 bg-gray-400 mx-auto"></div>
          </div>
          
          {/* LCD Screen */}
          <div className="mx-auto" style={{ width: '180px', height: '135px' }}>
            {children}
          </div>
        </div>
        
        {/* Click Wheel Section */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <ClickWheel onMenuClick={onMenuClick} onSelectClick={onSelectClick} />
        </div>
        
        {/* Chrome back reflection effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: '25px' }}>
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/20 to-transparent"></div>
          <div className="absolute top-1/4 left-0 w-1/3 h-full bg-gradient-to-r from-white/10 to-transparent"></div>
        </div>
      </div>
      
    </div>
  );
};

const ClickWheel = ({ onMenuClick, onSelectClick }) => {
  return (
    <div className="relative" style={{ width: '140px', height: '140px' }}>
      {/* Click Wheel Outer Ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white via-gray-100 to-gray-200 shadow-lg"
           style={{ 
             boxShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.1)' 
           }}>
        
        {/* Touch-sensitive ring area */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 shadow-inner"></div>
        
        {/* Menu Labels */}
        <div 
          className="absolute top-3 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 font-light cursor-pointer hover:text-gray-800"
          onClick={onMenuClick}
        >
          MENU
        </div>
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 font-light">
          <div className="flex items-center space-x-1">
            <span>▶</span>
            <span>⏸</span>
          </div>
        </div>
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-600 font-light">⏮</div>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-600 font-light">⏭</div>
      </div>
      
      {/* Center Select Button */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-gray-50 to-gray-200 shadow-md hover:shadow-lg transition-all duration-150 cursor-pointer"
        style={{ 
          boxShadow: '0 2px 6px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.8)' 
        }}
        onClick={onSelectClick}
      >
        <div className="w-full h-full rounded-full bg-gradient-to-br from-white/50 to-transparent"></div>
      </div>
      
      {/* Subtle highlight on wheel edge */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
    </div>
  );
};

const LCDDisplay = ({ currentMenu, selectedItem, children }) => {
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-gray-200 to-gray-300 shadow-inner overflow-hidden"
         style={{ 
           borderRadius: '8px',
           border: '1px solid #999',
           boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)'
         }}>
      
      {/* iPod LCD Background - Blue tinted like real iPod */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-blue-100"></div>
      
      {/* LCD Content Area */}
      <div className="relative z-10 p-3 text-black font-mono text-sm leading-tight h-full">
        {/* Status Bar - iPod style */}
        <div className="flex justify-between items-center text-xs mb-2 pb-1 border-b border-gray-400">
          <div className="flex items-center space-x-1">
            <span>♫</span>
            <span className="font-bold">iPod</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🔋</span>
            <span className="text-xs">100%</span>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="text-black">
          {children}
        </div>
      </div>
      
      {/* Screen reflection effect */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none"
           style={{ borderRadius: '8px 8px 0 0' }}></div>
    </div>
  );
};

const MenuDisplay = ({ menu, onSelect, selectedIndex = 0 }) => {
  return (
    <div className="space-y-1">
      {menu.map((item, index) => (
        <div
          key={item.id}
          className={`flex items-center justify-between px-2 py-1 cursor-pointer text-sm ${
            index === selectedIndex 
              ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white font-bold' 
              : 'text-black hover:bg-gray-100'
          }`}
          onClick={() => onSelect(item)}
        >
          <div className="flex items-center space-x-2">
            <span className="text-base">{item.icon}</span>
            <span className="font-medium">{item.title}</span>
          </div>
          {index === selectedIndex && (
            <span className="text-white">▶</span>
          )}
        </div>
      ))}
    </div>
  );
};

const NowPlayingDisplay = ({ track }) => {
  return (
    <div className="space-y-3 text-black">
      <div className="text-center">
        {/* Album Art Square - iPod style */}
        <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-sm border border-gray-400">
          <div className="text-2xl">{track.albumArt}</div>
        </div>
        <div className="text-sm font-bold">{track.title}</div>
        <div className="text-xs text-gray-600">{track.artist}</div>
        <div className="text-xs text-gray-500">{track.album}</div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span>{track.elapsed}</span>
          <span>{track.duration}</span>
        </div>
        <div className="w-full bg-gray-300 h-1 shadow-inner border border-gray-400">
          <div 
            className="bg-gradient-to-r from-gray-600 to-gray-700 h-1 transition-all duration-300"
            style={{ width: '40%' }}
          />
        </div>
      </div>
      
      <div className="text-center text-xs text-gray-600">
        <span>{track.isPlaying ? '⏸️ Playing' : '▶️ Paused'}</span>
      </div>
    </div>
  );
};

const FloatingMemoryBlurb = ({ memory, position, index }) => {
  return (
    <div className={`fixed ${position} max-w-xs z-10 pointer-events-none`}>
      <div className="ipod-chunky-border bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-sm p-4 shadow-xl">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xl">{memory.icon}</span>
          <span className="text-white font-mono font-bold text-xs tracking-wide uppercase">{memory.title}</span>
        </div>
        <p className="text-gray-200 text-xs leading-relaxed mb-2 font-mono">{memory.content.substring(0, 70)}...</p>
        <div className="flex justify-between items-center">
          <span className="text-green-400 text-xs font-mono font-bold tracking-wider uppercase">{memory.category}</span>
          <span className="text-green-300 text-xs font-mono bg-black/50 px-2 py-1">{memory.year}</span>
        </div>
        {/* Y2K corner accent */}
        <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 opacity-50"></div>
      </div>
    </div>
  );
};

const FloatingFunFact = ({ fact, position, index }) => {
  return (
    <div className={`fixed ${position} max-w-xs z-10 pointer-events-none`}>
      <div className="ipod-chunky-border bg-gradient-to-br from-black/95 to-gray-800/95 backdrop-blur-sm p-4 shadow-xl">
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-lg">💡</span>
          <span className="text-orange-300 font-mono font-bold text-xs tracking-wide uppercase">{fact.category}</span>
        </div>
        <p className="text-orange-200 text-xs leading-relaxed mb-2 font-mono font-bold">{fact.fact}</p>
        <p className="text-orange-400 text-xs font-mono">{fact.detail}</p>
        {/* Y2K corner accent */}
        <div className="absolute top-1 right-1 w-2 h-2 bg-orange-400 opacity-50"></div>
      </div>
    </div>
  );
};


export const IPodMemoryCapsule = ({ onTrackSelect, isZoomedIn }) => {
  const [currentMenu, setCurrentMenu] = useState('main');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showFloatingElements, setShowFloatingElements] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(ipodData.nowPlayingStates[0]);

  useEffect(() => {
    // Start showing floating elements after component mounts, but only if zoomed in
    if (isZoomedIn) {
      const timer = setTimeout(() => setShowFloatingElements(true), 500);
      return () => clearTimeout(timer);
    } else {
      setShowFloatingElements(false);
    }
  }, [isZoomedIn]);

  const handleMenuSelect = (item) => {
    setCurrentMenu(item.id);
    setSelectedIndex(0);
    onTrackSelect?.(item);
  };

  const handleMenuClick = () => {
    // Go back to previous menu level like real iPod
    if (currentMenu === 'main') {
      // Already at main menu, do nothing
      return;
    } else if (currentMenu === 'music' || currentMenu === 'memories') {
      // Go back to main menu
      setCurrentMenu('main');
      setSelectedIndex(0);
    } else if (currentMenu === 'now-playing') {
      // Go back to main menu from now playing
      setCurrentMenu('main');
      setSelectedIndex(0);
    }
  };

  const handleSelectClick = () => {
    // Center button selects current menu item
    const currentMenuItems = getCurrentMenuItems();
    if (currentMenuItems[selectedIndex]) {
      handleMenuSelect(currentMenuItems[selectedIndex]);
    }
  };

  const getCurrentMenuItems = () => {
    switch (currentMenu) {
      case 'main':
        return ipodData.menuStructure.main;
      case 'music':
        return ipodData.menuStructure.music;
      case 'memories':
        return ipodData.menuStructure.memories;
      default:
        return ipodData.menuStructure.main;
    }
  };

  const floatingPositions = [
    'top-24 right-8',
    'top-80 right-8',
    'top-144 right-8',
    'bottom-12 right-8'
  ];

  const floatingElements = showFloatingElements && isZoomedIn && (
    <>
      {/* Floating Memory Blurbs - reduced to 2 */}
      {ipodData.memories.slice(0, 2).map((memory, index) => (
        <FloatingMemoryBlurb
          key={memory.title}
          memory={memory}
          position={floatingPositions[index]}
          index={index}
        />
      ))}

      {/* Floating Fun Facts - reduced to 1 */}
      {ipodData.funFacts.slice(0, 1).map((fact, index) => (
        <FloatingFunFact
          key={fact.category}
          fact={fact}
          position={floatingPositions[index + 2]}
          index={index}
        />
      ))}


    </>
  );

  return (
    <>
      {/* Main iPod Interface - stays in sidebar */}
      <div className="relative">
        {/* iPod Classic Header */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2 font-mono tracking-wider text-white">
            iPOD MEMORY CAPSULE
          </h3>
          <p className="text-gray-300 text-sm font-mono tracking-wide bg-black/30 inline-block px-3 py-1 ipod-chunky-border">
            "1,000 MEMORIES IN YOUR POCKET"
          </p>
          <div className="mt-2 text-xs text-gray-400 font-mono">
            ◆ EST. 2001 ◆ DIGITAL NOSTALGIA ◆
          </div>
        </div>

        {/* iPod Shell */}
        <IPodShell 
          className="mx-auto mb-7"
          onMenuClick={handleMenuClick}
          onSelectClick={handleSelectClick}
        >
          <LCDDisplay currentMenu={currentMenu}>
            {currentMenu === 'now-playing' ? (
              <NowPlayingDisplay track={currentTrack} />
            ) : (
              <MenuDisplay
                menu={getCurrentMenuItems()}
                onSelect={handleMenuSelect}
                selectedIndex={selectedIndex}
              />
            )}
          </LCDDisplay>
        </IPodShell>
      </div>

      {/* Floating elements rendered outside sidebar using portal */}
      {createPortal(floatingElements, document.body)}
    </>
  );
};