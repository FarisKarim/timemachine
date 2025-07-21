import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { imacColors, classicApps, imacMemories, funFacts, techSpecs, getRandomFunFact, getRandomMemory, classicErrors, getRandomError, memoryPrompts, getRandomPrompt } from '../../data/imacG3Data';

const ColorPicker = ({ selectedColor, onColorChange }) => {
  return (
    <div className="space-y-2">
      <h4 className="text-sm imac-header">Choose Your Flavor</h4>
      <div className="flex gap-2 flex-wrap">
        {Object.values(imacColors).map(color => (
          <button
            key={color.id}
            className="w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110"
            style={{
              backgroundColor: color.color,
              borderColor: selectedColor.id === color.id ? '#fff' : 'transparent',
              boxShadow: selectedColor.id === color.id ? `0 0 0 2px ${color.color}` : 'none'
            }}
            onClick={() => onColorChange(color)}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
};

const BootSequence = ({ isBooting, onBootComplete }) => {
  const [progress, setProgress] = useState(0);
  const [bootStage, setBootStage] = useState('welcome');
  const [showApple, setShowApple] = useState(false);

  useEffect(() => {
    if (!isBooting) return;
    
    // Stage 1: Show Apple logo
    setTimeout(() => setShowApple(true), 200);
    
    // Stage 3: Progress bar
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1.5;
        
        // Update boot stage based on progress
        if (newProgress < 25) {
          setBootStage('welcome');
        } else if (newProgress < 50) {
          setBootStage('extensions');
        } else if (newProgress < 75) {
          setBootStage('starting');
        } else if (newProgress < 95) {
          setBootStage('ready');
        }
        
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(onBootComplete, 800);
          return 100;
        }
        return newProgress;
      });
    }, 60);

    return () => {
      clearInterval(timer);
    };
  }, [isBooting, onBootComplete]);

  const getBootMessage = () => {
    switch (bootStage) {
      case 'welcome': return 'Welcome to Macintosh';
      case 'extensions': return 'Loading extensions...';
      case 'starting': return 'Starting Mac OS...';
      case 'ready': return 'Ready';
      default: return 'Welcome to Macintosh';
    }
  };

  if (!isBooting) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center imac-boot-bg">
      <div className="text-center space-y-8 max-w-sm">
        {/* Apple Logo */}
        <div className={`transition-all duration-1000 ${showApple ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
          <div className="apple-logo-container">
            <div className="text-8xl apple-rainbow-logo">🍎</div>
          </div>
        </div>

        {/* Mac OS Text */}
        {showApple && (
          <div className="space-y-4">
            <div className="chicago-font text-2xl text-black font-bold">
              Mac OS 9.2
            </div>
            
            {/* Barber Pole Progress Bar */}
            <div className="w-64 mx-auto">
              <div className="mac-progress-container">
                <div 
                  className="mac-progress-bar"
                  style={{ width: `${progress}%` }}
                >
                  <div className="barber-pole-animation"></div>
                </div>
              </div>
            </div>
            
            {/* Boot Message */}
            <div className="chicago-font text-sm text-gray-700 min-h-[1.25rem]">
              {getBootMessage()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ApplicationWindow = ({ app, onClose }) => {
  const renderAppContent = () => {
    switch (app.id) {
      case 'kid-pix':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {['🎨', '✏️', '🖌️', '🌟', '💥', '🎭', '🎪', '🎨'].map((stamp, i) => (
                <button key={i} className="text-2xl p-2 hover:bg-gray-200 rounded">
                  {stamp}
                </button>
              ))}
            </div>
            <div className="h-32 bg-white border-2 border-gray-300 rounded p-2">
              <div className="chicago-font text-xs text-gray-500">Click stamps above to draw!</div>
            </div>
            <div className="text-center">
              <button className="chicago-font bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                💣 UNDO (OH NO!)
              </button>
            </div>
          </div>
        );
      case 'typing-tutor':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <div className="chicago-font text-lg font-bold text-gray-800">Home Row Keys</div>
              <div className="chicago-font text-2xl mt-2 p-4 bg-gray-100 rounded text-gray-800">
                A S D F &nbsp;&nbsp;&nbsp; J K L ;
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="chicago-font text-sm text-gray-700">Type: "the quick brown fox"</div>
              <input 
                type="text" 
                className="chicago-font w-full mt-2 p-2 border rounded"
                placeholder="Start typing..."
              />
            </div>
          </div>
        );
      case 'encarta':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded">
              <h3 className="chicago-font font-bold text-blue-800">Internet, The</h3>
              <p className="chicago-font text-sm mt-2 text-gray-700">
                A global network of interconnected computers that allows users to share information...
              </p>
            </div>
            <button className="chicago-font bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
              🏰 Play MindMaze
            </button>
          </div>
        );
      default:
        return <div className="chicago-font text-center text-gray-500">Application loading...</div>;
    }
  };

  return (
    <div className="fixed inset-4 bg-white border-2 border-gray-300 rounded-lg shadow-2xl z-40 flex flex-col">
      <div className="bg-gray-100 border-b border-gray-300 p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{app.icon}</span>
          <span className="mac-window-title text-gray-800">{app.name}</span>
        </div>
        <button 
          onClick={onClose}
          className="w-4 h-4 bg-red-500 rounded-full hover:bg-red-600"
        />
      </div>
      <div className="p-4 flex-1 overflow-auto text-gray-800 chicago-font">
        {renderAppContent()}
      </div>
    </div>
  );
};

const MemoryPrompt = ({ prompt, onDismiss }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-30 flex items-center justify-center">
      <div className="bg-gray-100 border-2 border-gray-400 rounded p-6 max-w-md mx-4">
        <div className="text-center space-y-4">
          <div className="text-2xl">💭</div>
          <div className="mac-window-title text-gray-800">Memory Trigger</div>
          <div className="chicago-font text-sm text-gray-700">{prompt}</div>
          <button 
            onClick={onDismiss}
            className="chicago-font bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Remember
          </button>
        </div>
      </div>
    </div>
  );
};

export default function IMacG3MemoryCapsule({ onSelect, onColorChange }) {
  const [selectedColor, setSelectedColor] = useState(imacColors.bondiBlue);
  const [currentMemory, setCurrentMemory] = useState(getRandomMemory());
  const [currentFact, setCurrentFact] = useState(getRandomFunFact());
  const [currentError, setCurrentError] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [activeApp, setActiveApp] = useState(null);
  const [isBooting, setIsBooting] = useState(true);
  const [showDesktop, setShowDesktop] = useState(false);

  useEffect(() => {
    const memoryTimer = setInterval(() => {
      setCurrentMemory(getRandomMemory());
    }, 8000);

    const factTimer = setInterval(() => {
      setCurrentFact(getRandomFunFact());
    }, 12000);

    const errorTimer = setInterval(() => {
      if (Math.random() < 0.3) {
        setCurrentError(getRandomError());
        setTimeout(() => setCurrentError(null), 4000);
      }
    }, 20000);

    const promptTimer = setInterval(() => {
      if (Math.random() < 0.2) {
        setCurrentPrompt(getRandomPrompt());
      }
    }, 25000);

    return () => {
      clearInterval(memoryTimer);
      clearInterval(factTimer);
      clearInterval(errorTimer);
      clearInterval(promptTimer);
    };
  }, []);

  const handleBootComplete = () => {
    setIsBooting(false);
    setShowDesktop(true);
  };

  return (
    <div 
      className="relative h-full bg-gray-900 rounded-xl border border-gray-700 p-6 text-white overflow-auto"
    >
      <BootSequence isBooting={isBooting} onBootComplete={handleBootComplete} />
      
      {currentError && (
        <div className="fixed top-4 right-4 bg-white text-black border-2 border-red-500 rounded p-4 shadow-lg z-20">
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentError.icon}</span>
            <div>
              <div className="chicago-font text-sm text-black">{currentError.title}</div>
              <div className="chicago-font text-xs">{currentError.message}</div>
            </div>
            <button 
              onClick={() => setCurrentError(null)}
              className="chicago-font ml-4 bg-gray-300 px-2 py-1 rounded text-xs"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {currentPrompt && (
        <MemoryPrompt 
          prompt={currentPrompt} 
          onDismiss={() => setCurrentPrompt(null)} 
        />
      )}

      {activeApp && (
        <ApplicationWindow 
          app={activeApp} 
          onClose={() => setActiveApp(null)} 
        />
      )}

      {showDesktop && (
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold imac-header">iMac G3</h2>
            <p className="text-lg opacity-90 chicago-font">Think Different</p>
          </div>

          {/* Color Picker */}
          <ColorPicker 
            selectedColor={selectedColor} 
            onColorChange={(color) => {
              setSelectedColor(color);
              onColorChange?.(color.color);
            }} 
          />

          {/* Applications Grid */}
          <div className="space-y-4">
            <h4 className="text-lg imac-header">
              {'>'} APPLICATIONS.EXE
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {classicApps.map(app => (
                <div
                  key={app.id}
                  className="bg-white bg-opacity-20 backdrop-blur rounded-lg p-4 cursor-pointer hover:bg-opacity-30 transition-all duration-300 hover:scale-105 aspect-square flex flex-col justify-center items-center h-32 w-full"
                  onClick={() => setActiveApp(app)}
                >
                  <div className="text-center space-y-2 flex flex-col items-center justify-center h-full w-full">
                    <div className="text-4xl">{app.icon}</div>
                    <div className="chicago-font font-bold text-xs leading-tight text-gray-800 text-center">{app.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Memory Section */}
          <div className="space-y-4">
            <h4 className="text-lg imac-header">
              {'>'} MEMORY_LANE.LOG
            </h4>
            <div className="bg-black bg-opacity-30 rounded-lg p-4 animate-fade-in">
              <h5 className="chicago-font font-bold text-yellow-300">{currentMemory.title}</h5>
              <p className="chicago-font text-sm mt-2 opacity-90">{currentMemory.content}</p>
              <div className="chicago-font mt-2 text-xs text-blue-300">
                {currentMemory.category} | {currentMemory.emotion}
              </div>
            </div>
          </div>

          {/* Tech Specs */}
          <div className="space-y-4">
            <h4 className="text-lg imac-header">
              {'>'} SYSTEM_INFO.TXT
            </h4>
            <div className="bg-black bg-opacity-30 rounded-lg p-4 text-sm space-y-2">
              {Object.entries(techSpecs).map(([key, value]) => (
                <div key={key} className="flex justify-between text-gray-100">
                  <span className="chicago-font capitalize opacity-90 text-cyan-200">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="chicago-font text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fun Fact */}
          <div className="space-y-4">
            <h4 className="text-lg imac-header">
              {'>'} FUN_FACTS.EXE
            </h4>
            <div className="bg-yellow-400 bg-opacity-20 rounded-lg p-4 animate-fade-in">
              <h5 className="chicago-font font-bold text-yellow-200">{currentFact.title}</h5>
              <p className="chicago-font text-sm mt-2">{currentFact.fact}</p>
              <div className="chicago-font mt-2 text-xs text-yellow-300">
                {currentFact.category}
              </div>
            </div>
          </div>

          {/* Easter Eggs */}
          <div className="text-center space-y-2">
            <button 
              className="chicago-font bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition-colors"
              onClick={() => setCurrentError(getRandomError())}
            >
              💿 Eject CD
            </button>
            <div className="chicago-font text-xs opacity-60">
              © 1998-2003 Apple Computer, Inc.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}