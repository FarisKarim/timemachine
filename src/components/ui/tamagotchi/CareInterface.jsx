import { useState, useEffect } from 'react';

export const CareInterface = ({ onCareAction, petState }) => {
  const [actionFeedback, setActionFeedback] = useState(null);
  const [sleepCountdown, setSleepCountdown] = useState(0);

  // Update sleep countdown - just use the live sleepTimeRemaining value
  useEffect(() => {
    if (petState.isSleeping && petState.sleepTimeRemaining) {
      const seconds = Math.max(0, Math.ceil(petState.sleepTimeRemaining / 1000));
      setSleepCountdown(seconds);
    } else {
      setSleepCountdown(0);
    }
  }, [petState.isSleeping, petState.sleepTimeRemaining]);

  const careActions = [
    { 
      id: 'feed', 
      icon: '🍎', 
      label: 'Feed', 
      color: '#10B981',
      cooldown: 30000,
      description: 'Hunger +25, Happiness +5'
    },
    { 
      id: 'play', 
      icon: '🎾', 
      label: 'Play', 
      color: '#3B82F6',
      cooldown: 45000,
      description: 'Happiness +20, Energy -15'
    },
    { 
      id: 'clean', 
      icon: '🧼', 
      label: 'Clean', 
      color: '#8B5CF6',
      cooldown: 60000,
      description: 'Health +15, Happiness +10'
    },
    { 
      id: 'sleep', 
      icon: '🛌', 
      label: 'Sleep', 
      color: '#6366F1',
      cooldown: 30000,
      description: 'Energy +40, Rest for 30s'
    }
  ];

  const handleCareAction = (actionId) => {
    const success = onCareAction(actionId);
    if (success) {
      setActionFeedback(actionId);
      setTimeout(() => setActionFeedback(null), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-bold text-pink-400 flex items-center gap-2 tamagotchi-font-header">
        <span className="text-2xl">💕</span> Pet Care
      </h4>

      {/* Pet Animation Display */}
      <div className="bg-gradient-to-br from-pink-50/10 to-purple-50/5 p-4 rounded-xl border border-pink-300/20">
        <div className="text-center py-4">
          <div className="text-6xl mb-2">
            <PetSprite animation={petState.currentAnimation} />
          </div>
          <p className="text-sm text-white/70 tamagotchi-font-body">
            {getAnimationText(petState.currentAnimation)}
          </p>
        </div>
      </div>

      {/* Sleep Status Display */}
      {petState.isSleeping && (
        <div className="text-center p-3 bg-indigo-400/20 border border-indigo-400/40 rounded-lg">
          <span className="text-indigo-300 font-semibold tamagotchi-font-header flex items-center justify-center gap-2">
            😴 Pet is sleeping... 
            <span className="text-sm">({sleepCountdown}s remaining)</span>
          </span>
          <div className="mt-2 text-xs text-white/70 tamagotchi-font-body">
            All actions disabled until pet wakes up
          </div>
        </div>
      )}

      {/* Care Action Buttons - Now 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3 p-2">
        {careActions.map((action) => {
          const isDisabled = petState.isSleeping || (action.id !== 'sleep' && petState.currentAnimation === action.id);
          
          return (
            <button
              key={action.id}
              onClick={() => handleCareAction(action.id)}
              disabled={isDisabled}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-300 group
                ${actionFeedback === action.id 
                  ? 'border-green-400 bg-green-400/20 animate-pulse' 
                  : isDisabled
                  ? 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                  : 'border-white/20 bg-white/5 hover:border-pink-400/50 hover:bg-pink-400/10 hover:scale-105'
                }
              `}
              title={isDisabled ? (petState.isSleeping ? 'Pet is sleeping' : 'Action in progress') : action.description}
            >
            {/* Action Icon */}
            <div className="text-2xl text-center mb-1 group-hover:animate-bounce">
              {action.icon}
            </div>
            
            {/* Action Label */}
            <div className="text-center">
              <span className="text-sm font-semibold text-white tamagotchi-font-header">
                {action.label}
              </span>
            </div>

            {/* Success Feedback */}
            {actionFeedback === action.id && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-400/20 rounded-lg">
                <span className="text-green-300 font-bold">+</span>
              </div>
            )}

            {/* Sleep Overlay */}
            {action.id === 'sleep' && petState.isSleeping && (
              <div className="absolute inset-0 flex items-center justify-center bg-indigo-400/30 rounded-lg">
                <div className="text-center">
                  <div className="text-white font-bold text-sm">😴</div>
                  <div className="text-xs text-white/80">{sleepCountdown}s</div>
                </div>
              </div>
            )}
          </button>
          );
        })}
      </div>

      {/* Attention Indicator */}
      {petState.needsAttention && (
        <div className="text-center p-3 bg-red-400/20 border border-red-400/40 rounded-lg animate-pulse">
          <span className="text-red-300 font-semibold tamagotchi-font-header">
            🚨 Your pet needs attention!
          </span>
        </div>
      )}
    </div>
  );
};


// Pet sprite component with animations
const PetSprite = ({ animation }) => {
  const sprites = {
    idle: '🐱',
    eating: '😋',
    playing: '🤸',
    cleaning: '✨',
    sleeping: '😴',
    hungry: '😿',
    sad: '😢',
    tired: '😴',
    happy: '😸'
  };

  return (
    <span className={`inline-block ${getAnimationClass(animation)}`}>
      {sprites[animation] || sprites.idle}
    </span>
  );
};

// Animation classes
const getAnimationClass = (animation) => {
  switch (animation) {
    case 'eating': return 'animate-pulse';
    case 'playing': return 'animate-bounce';
    case 'cleaning': return 'animate-spin';
    case 'sleeping': return 'animate-pulse';
    case 'happy': return 'animate-bounce';
    default: return '';
  }
};

// Animation descriptions
const getAnimationText = (animation) => {
  switch (animation) {
    case 'eating': return 'Nom nom nom! 🍎';
    case 'playing': return 'Having fun! 🎾';
    case 'cleaning': return 'Getting clean! ✨';
    case 'sleeping': return 'Zzz... Sweet dreams! 😴';
    case 'hungry': return 'Feed me please! 🥺';
    case 'sad': return 'I need attention! 💔';
    case 'tired': return 'So sleepy... 😴';
    case 'happy': return 'Feeling great! 💖';
    default: return 'Just chilling! 😊';
  }
};

export default CareInterface;