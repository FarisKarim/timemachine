import { useEffect, useState, useCallback } from 'react';
import soundManager from '../utils/soundManager';

export const useAudioManager = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [audioStarted, setAudioStarted] = useState(false);

  useEffect(() => {
    // Initialize audio on first interaction (no ambient music)
    const initAudio = () => {
      console.log('🎵 Audio system initialized');
      soundManager.startBgMusic();
      setAudioStarted(true);
      
      // Remove all listeners after first interaction
      window.removeEventListener('click', initAudio);
      window.removeEventListener('touchstart', initAudio);
      window.removeEventListener('keydown', initAudio);
      window.removeEventListener('scroll', initAudio);
    };

    // Listen for any user interaction
    window.addEventListener('click', initAudio, { once: true });
    window.addEventListener('touchstart', initAudio, { once: true });
    window.addEventListener('keydown', initAudio, { once: true });
    window.addEventListener('scroll', initAudio, { once: true });

    return () => {
      window.removeEventListener('click', initAudio);
      window.removeEventListener('touchstart', initAudio);
      window.removeEventListener('keydown', initAudio);
      window.removeEventListener('scroll', initAudio);
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
      case 'object':
        if (objectId) {
          soundManager.playObjectSound(objectId);
        }
        break;
    }
  }, []); // No dependencies - soundManager is stable

  const setBgVolume = useCallback((volume) => {
    soundManager.setBgMusicVolume(volume);
  }, []);

  const pauseBgMusic = useCallback(() => {
    soundManager.pauseBgMusic();
  }, []);

  const resumeBgMusic = useCallback(() => {
    soundManager.resumeBgMusic();
  }, []);

  return {
    isMuted,
    volume,
    audioStarted,
    toggleMute,
    changeVolume,
    playSound,
    setBgVolume,
    pauseBgMusic,
    resumeBgMusic
  };
};