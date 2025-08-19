import { useEffect, useState, useCallback } from 'react';
import soundManager from '../utils/soundManager';

export const useAudioManager = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [audioStarted, setAudioStarted] = useState(false);

  useEffect(() => {
    // Start ambient music after any user interaction
    const startAmbient = () => {
      console.log('🎵 Starting ambient music...');
      soundManager.playAmbient();
      setAudioStarted(true);
      
      // Remove all listeners after first interaction
      window.removeEventListener('click', startAmbient);
      window.removeEventListener('touchstart', startAmbient);
      window.removeEventListener('keydown', startAmbient);
      window.removeEventListener('scroll', startAmbient);
    };

    // Listen for any user interaction
    window.addEventListener('click', startAmbient, { once: true });
    window.addEventListener('touchstart', startAmbient, { once: true });
    window.addEventListener('keydown', startAmbient, { once: true });
    window.addEventListener('scroll', startAmbient, { once: true });

    return () => {
      window.removeEventListener('click', startAmbient);
      window.removeEventListener('touchstart', startAmbient);
      window.removeEventListener('keydown', startAmbient);
      window.removeEventListener('scroll', startAmbient);
      soundManager.cleanup();
    };
  }, []);

  const toggleMute = () => {
    const newMuteState = soundManager.toggleMute();
    setIsMuted(!newMuteState);
  };

  const changeVolume = (newVolume) => {
    soundManager.setVolume(newVolume);
    setVolume(newVolume);
  };

  const playSound = useCallback((soundType, objectId = null) => {
    switch(soundType) {
      case 'hover':
        soundManager.playHover();
        break;
      case 'click':
        soundManager.playClick();
        break;
      case 'whoosh':
        soundManager.playWhoosh();
        break;
      case 'object':
        if (objectId) {
          soundManager.playObjectSound(objectId);
        }
        break;
    }
  }, []); // No dependencies - soundManager is stable

  return {
    isMuted,
    volume,
    audioStarted,
    toggleMute,
    changeVolume,
    playSound
  };
};