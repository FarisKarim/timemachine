import { useRef, useEffect, useState, useMemo } from 'react';

// Color palette for each stat
const statColors = {
  hunger: { 
    primary: '#10B981',   // Emerald green
    glow: '#34D399',
    critical: '#EF4444',
    bg: 'rgba(16, 185, 129, 0.1)'
  },
  happiness: {
    primary: '#3B82F6',   // Blue
    glow: '#60A5FA',
    critical: '#F59E0B',
    bg: 'rgba(59, 130, 246, 0.1)'
  },
  health: {
    primary: '#8B5CF6',   // Purple
    glow: '#A78BFA',
    critical: '#DC2626',
    bg: 'rgba(139, 92, 246, 0.1)'
  },
  energy: {
    primary: '#F59E0B',   // Amber
    glow: '#FCD34D',
    critical: '#7C3AED',
    bg: 'rgba(245, 158, 11, 0.1)'
  }
};

// Easing function for smooth animations
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

// Individual animated stat bar component
const AnimatedStatBar = ({ stat, value, icon, label, prevValue = null }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const currentValueRef = useRef(value);
  const targetValueRef = useRef(value);
  const animationStartRef = useRef(null);
  const [displayValue, setDisplayValue] = useState(value);
  const [delta, setDelta] = useState(null);
  const [deltaFading, setDeltaFading] = useState(false);
  
  const colors = statColors[stat];
  const isCritical = value < 30;
  const isHigh = value > 70;
  
  // Smooth value interpolation
  useEffect(() => {
    targetValueRef.current = value;
    animationStartRef.current = performance.now();
    
    // Show delta indicator
    if (prevValue !== null && prevValue !== value) {
      const diff = value - prevValue;
      setDelta(diff > 0 ? `+${diff}` : `${diff}`);
      setDeltaFading(false);
      setTimeout(() => setDeltaFading(true), 2000);
      setTimeout(() => { setDelta(null); setDeltaFading(false); }, 3000);
    }
    
    const animate = (timestamp) => {
      if (!animationStartRef.current) animationStartRef.current = timestamp;
      const elapsed = timestamp - animationStartRef.current;
      const progress = Math.min(elapsed / 500, 1); // 500ms animation
      
      const easedProgress = easeOutCubic(progress);
      const newValue = currentValueRef.current + 
        (targetValueRef.current - currentValueRef.current) * easedProgress;
      
      setDisplayValue(Math.round(newValue));
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        currentValueRef.current = targetValueRef.current;
      }
    };
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, prevValue]);
  
  // Canvas bar rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    let animationId;
    let currentWidth = (currentValueRef.current / 100) * width;
    
    const drawBar = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, width, height);
      
      // Calculate target width
      const targetWidth = (displayValue / 100) * width;
      currentWidth += (targetWidth - currentWidth) * 0.1; // Smooth transition
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, currentWidth, 0);
      if (isCritical) {
        gradient.addColorStop(0, colors.critical);
        gradient.addColorStop(1, colors.critical);
      } else {
        gradient.addColorStop(0, colors.primary);
        gradient.addColorStop(0.7, colors.primary);
        gradient.addColorStop(1, isHigh ? colors.glow : colors.primary);
      }
      
      // Draw main bar
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, currentWidth, height);
      
      // Add glow effect for high values
      if (isHigh) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = colors.glow;
        ctx.fillRect(0, 0, currentWidth, height);
        ctx.shadowBlur = 0;
      }
      
      // Add shimmer effect
      if (displayValue > 50) {
        const shimmerX = (Date.now() / 10) % (width * 2) - width;
        const shimmerGradient = ctx.createLinearGradient(shimmerX, 0, shimmerX + 40, 0);
        shimmerGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        shimmerGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
        shimmerGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = shimmerGradient;
        ctx.fillRect(Math.max(0, shimmerX), 0, 40, height);
      }
      
      animationId = requestAnimationFrame(drawBar);
    };
    
    drawBar();
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [displayValue, colors, isCritical, isHigh]);
  
  return (
    <div className="space-y-2 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span 
            className={`text-lg transition-transform ${
              isCritical ? 'animate-pulse scale-125' : ''
            }`}
          >
            {icon}
          </span>
          <span className="text-sm font-medium text-white tamagotchi-font-body">
            {label}
          </span>
          {(delta || deltaFading) && (
            <span className={`text-sm font-bold transition-opacity duration-1000 tamagotchi-font-header ${
              delta.startsWith('+') ? 'text-green-400' : 'text-red-400'
            } ${deltaFading ? 'opacity-0' : 'opacity-100'}`}>
              {delta}
            </span>
          )}
        </div>
        <span className={`text-xs font-bold ${
          isCritical ? 'text-red-400 animate-pulse' : 'text-white/70'
        } tamagotchi-font-body`}>
          {displayValue}%
        </span>
      </div>
      
      <div className="relative h-3 rounded-full overflow-hidden" style={{ backgroundColor: colors.bg }}>
        <canvas 
          ref={canvasRef}
          width={300}
          height={12}
          className="w-full h-full"
          style={{ imageRendering: 'pixelated' }}
        />
        {isCritical && (
          <div className="absolute inset-0 border-2 border-red-400 rounded-full animate-pulse" />
        )}
      </div>
    </div>
  );
};


// Evolution progress component
const EvolutionProgress = () => {
  const stages = ['Egg', 'Baby', 'Child', 'Teen', 'Adult'];
  const currentIndex = Math.floor((Date.now() / 2000) % 5); // Cycle every 2 seconds
  
  return (
    <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-400/20">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-purple-300 tamagotchi-font-header">
          Evolution Progress
        </span>
      </div>
      <div className="flex gap-1">
        {stages.map((s, index) => (
          <div 
            key={s}
            className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
              index <= currentIndex 
                ? 'bg-gradient-to-r from-purple-400 to-pink-400' 
                : 'bg-white/10'
            }`}
          />
        ))}
      </div>
      <div className="mt-2 text-center">
        <span className="text-xs text-purple-300/60">
          {Math.round((Date.now() / 100) % 100)}% to next stage
        </span>
      </div>
    </div>
  );
};

// Main StatusDisplay component
export const StatusDisplay = ({ petState }) => {
  const prevStateRef = useRef({});
  const [showCriticalAlert, setShowCriticalAlert] = useState(false);
  
  // Check for critical states
  useEffect(() => {
    const hasCritical = 
      petState.displayHunger < 30 ||
      petState.displayHappiness < 30 ||
      petState.displayHealth < 30 ||
      petState.displayEnergy < 30;
    
    setShowCriticalAlert(hasCritical);
  }, [petState]);
  
  // Track previous values for delta animations
  const prevValues = useMemo(() => {
    const prev = { ...prevStateRef.current };
    prevStateRef.current = {
      hunger: petState.displayHunger,
      happiness: petState.displayHappiness,
      health: petState.displayHealth,
      energy: petState.displayEnergy
    };
    return prev;
  }, [petState]);
  
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold text-cyan-300 flex items-center gap-2 tamagotchi-font-header">
          <span className="text-2xl animate-pulse">📊</span> 
          Pet Status
        </h4>
        {petState.isSleeping && (
          <span className="text-xs text-indigo-300 px-2 py-1 bg-indigo-400/20 rounded-full animate-pulse">
            💤 Sleeping
          </span>
        )}
      </div>
      
      {/* Status Container */}
      <div className="bg-gradient-to-br from-cyan-50/10 to-purple-50/5 p-4 rounded-xl border border-cyan-300/20 backdrop-blur-sm">
        {/* Critical Alert */}
        {showCriticalAlert && (
          <div className="mb-4 p-2 bg-red-400/20 border border-red-400/40 rounded-lg animate-pulse">
            <p className="text-xs text-red-300 text-center font-semibold tamagotchi-font-header">
              ⚠️ Critical Status - Your pet needs immediate attention!
            </p>
          </div>
        )}
        
        {/* Stat Bars */}
        <div className="space-y-3">
          <AnimatedStatBar 
            stat="hunger"
            value={petState.displayHunger}
            prevValue={prevValues.hunger}
            icon="🍎"
            label="Hunger"
          />
          <AnimatedStatBar 
            stat="happiness"
            value={petState.displayHappiness}
            prevValue={prevValues.happiness}
            icon="😊"
            label="Happiness"
          />
          <AnimatedStatBar 
            stat="health"
            value={petState.displayHealth}
            prevValue={prevValues.health}
            icon="💚"
            label="Health"
          />
          <AnimatedStatBar 
            stat="energy"
            value={petState.displayEnergy}
            prevValue={prevValues.energy}
            icon="⚡"
            label="Energy"
          />
        </div>
        
        {/* Evolution Progress */}
        <EvolutionProgress 
          progress={petState.evolutionProgress || 0}
          stage={petState.evolutionStage || 'Baby'}
        />
        
        {/* Pet Mood Indicator */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full">
            <span className="text-2xl">
              {petState.needsAttention ? '😟' : 
               petState.displayHappiness > 80 ? '😄' :
               petState.displayHappiness > 50 ? '😊' : '😔'}
            </span>
            <span className="text-xs text-white/70 tamagotchi-font-body">
              {petState.needsAttention ? 'Needs Care!' :
               petState.displayHappiness > 80 ? 'Very Happy!' :
               petState.displayHappiness > 50 ? 'Content' : 'Unhappy'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusDisplay;