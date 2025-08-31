import { useRef, useCallback } from 'react';

export const usePetAudio = () => {
  const audioContextRef = useRef(null);
  const gainNodeRef = useRef(null);
  const isEnabledRef = useRef(true);

  // Initialize Web Audio Context
  const initAudio = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = 0.3; // Default volume
    }
  }, []);

  // Pet sound definitions
  const petSounds = {
    happy: { frequency: 800, type: 'triangle', duration: 200 },
    hungry: { frequency: 400, type: 'sawtooth', duration: 500 },
    sick: { frequency: 200, type: 'square', duration: 300 },
    eating: { 
      sequence: [
        { frequency: 500, duration: 100 },
        { frequency: 600, duration: 100 },
        { frequency: 550, duration: 100 }
      ]
    },
    playing: { frequency: 1000, type: 'triangle', duration: 300 },
    cleaning: { frequency: 700, type: 'sine', duration: 250 },
    evolution: { 
      sequence: [
        { frequency: 523, duration: 200 }, // C
        { frequency: 659, duration: 200 }, // E  
        { frequency: 784, duration: 400 }  // G
      ]
    }
  };

  // Play single tone
  const playTone = useCallback((frequency, type = 'sine', duration = 200) => {
    if (!isEnabledRef.current) return;
    
    initAudio();
    const ctx = audioContextRef.current;
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const envelope = ctx.createGain();
    
    oscillator.connect(envelope);
    envelope.connect(gainNodeRef.current);
    
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    oscillator.type = type;
    
    // Envelope for smooth sound
    envelope.gain.setValueAtTime(0, ctx.currentTime);
    envelope.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.01);
    envelope.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration / 1000);
  }, [initAudio]);

  // Play sequence of tones
  const playSequence = useCallback((sequence) => {
    if (!isEnabledRef.current) return;
    
    sequence.forEach((sound, index) => {
      setTimeout(() => {
        playTone(sound.frequency, sound.type || 'sine', sound.duration);
      }, index * (sound.delay || 150));
    });
  }, [playTone]);

  // Play pet sound by name
  const playPetSound = useCallback((soundName) => {
    const sound = petSounds[soundName];
    if (!sound) return;

    if (sound.sequence) {
      playSequence(sound.sequence);
    } else {
      playTone(sound.frequency, sound.type, sound.duration);
    }
  }, [playTone, playSequence]);

  // Game sound effects
  const gameAudio = {
    jump: () => playTone(600, 'square', 100),
    score: () => playTone(800, 'triangle', 150),
    gameOver: () => playSequence([
      { frequency: 400, duration: 200 },
      { frequency: 350, duration: 200 },
      { frequency: 300, duration: 400 }
    ]),
    success: () => playSequence([
      { frequency: 659, duration: 100 },
      { frequency: 784, duration: 100 },
      { frequency: 988, duration: 200 }
    ])
  };

  // Volume control
  const setVolume = useCallback((volume) => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = Math.max(0, Math.min(1, volume));
    }
  }, []);

  const toggleAudio = useCallback(() => {
    isEnabledRef.current = !isEnabledRef.current;
    return isEnabledRef.current;
  }, []);

  return {
    playPetSound,
    gameAudio,
    setVolume,
    toggleAudio,
    isEnabled: () => isEnabledRef.current
  };
};