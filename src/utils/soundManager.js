import { Howl, Howler } from 'howler';
import { gameboyData } from '../data/gameboyData';

class SoundManager {
  constructor() {
    this.sounds = {};
    this.isEnabled = true;
    this.audioContext = null;
    this.volume = 0.7;
    this.initialized = false;
    
    // Set global volume
    Howler.volume(this.volume);
  }

  // Generate audio using Web Audio API for better compatibility
  generateTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  generateChord(frequencies, duration, volume = 0.2) {
    frequencies.forEach(freq => {
      this.generateTone(freq, duration, 'sine', volume / frequencies.length);
    });
  }

  initializeSounds() {
    if (this.initialized) return;
    
    try {
      // Create audio context if not exists
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }

      // Resume audio context if suspended
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      this.initialized = true;
      console.log('✅ Audio system initialized successfully');
    } catch (error) {
      console.warn('❌ Audio initialization failed:', error);
      this.isEnabled = false;
    }
  }

  playAmbient() {
    if (!this.isEnabled) return;
    
    this.initializeSounds();
    
    // Generate a gentle ambient chord progression
    const ambientChords = [
      [220, 277, 330], // A minor
      [196, 247, 294], // G major
      [165, 208, 247], // E minor
      [175, 220, 262]  // F major
    ];
    
    let chordIndex = 0;
    const playChord = () => {
      if (this.isEnabled) {
        this.generateChord(ambientChords[chordIndex], 3, 0.1);
        chordIndex = (chordIndex + 1) % ambientChords.length;
        setTimeout(playChord, 4000); // Play next chord after 4 seconds
      }
    };
    
    playChord();
    console.log('🎵 Ambient music started');
  }

  stopAmbient() {
    // Ambient tones will naturally fade out
    console.log('🔇 Ambient music stopped');
  }

  playHover() {
    if (!this.isEnabled) return;
    this.initializeSounds();
    
    // Gentle hover sound - rising tone
    this.generateTone(800, 0.1, 'sine', 0.2);
    setTimeout(() => this.generateTone(1000, 0.05, 'sine', 0.1), 50);
  }

  playClick() {
    if (!this.isEnabled) return;
    this.initializeSounds();
    
    // Click sound - short percussive tone
    this.generateTone(1200, 0.08, 'square', 0.3);
    setTimeout(() => this.generateTone(800, 0.04, 'sine', 0.2), 40);
  }

  playWhoosh() {
    if (!this.isEnabled) return;
    this.initializeSounds();
    
    // Whoosh sound - frequency sweep
    if (this.audioContext) {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(80, this.audioContext.currentTime + 0.5);
      
      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.5);
    }
  }

  // Play enhanced Game Boy game-specific audio
  playGameAudio(gameId) {
    if (!this.isEnabled) return;
    this.initializeSounds();
    
    const audioCue = gameboyData.audioCues[gameId];
    if (!audioCue) return;
    
    if (audioCue.type === 'sequence') {
      // Play sequence of tones
      audioCue.sounds.forEach(sound => {
        setTimeout(() => {
          this.generateTone(
            sound.frequency, 
            sound.duration, 
            sound.type || 'square', 
            0.3
          );
        }, sound.delay);
      });
    } else if (audioCue.type === 'melody') {
      // Play simple melody
      audioCue.notes.forEach((frequency, index) => {
        setTimeout(() => {
          this.generateTone(frequency, 0.15, 'square', 0.25);
        }, index * 150);
      });
    }
  }

  playObjectSound(objectId) {
    if (!this.isEnabled) return;
    this.initializeSounds();
    
    // Check if it's a Game Boy game-specific sound
    if (gameboyData.audioCues[objectId]) {
      this.playGameAudio(objectId);
      return;
    }
    
    // Map object IDs to specific generated sounds
    switch(objectId) {
      case 'gameboy':
        // Enhanced Game Boy power-on sound
        this.playGameAudio('powerOn');
        break;
      case 'lego-brick':
        // Plastic click sounds
        this.generateTone(2000, 0.02, 'square', 0.5);
        setTimeout(() => this.generateTone(1500, 0.02, 'square', 0.3), 20);
        break;
      case 'hot-wheels':
        // Car engine rev
        if (this.audioContext) {
          const oscillator = this.audioContext.createOscillator();
          const gainNode = this.audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(this.audioContext.destination);
          
          oscillator.type = 'sawtooth';
          oscillator.frequency.setValueAtTime(80, this.audioContext.currentTime);
          oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);
          
          gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
          
          oscillator.start(this.audioContext.currentTime);
          oscillator.stop(this.audioContext.currentTime + 0.3);
        }
        break;
      case 'rubiks-cube':
        // Plastic twist sounds
        this.generateTone(1000, 0.05, 'square', 0.3);
        setTimeout(() => this.generateTone(1200, 0.03, 'square', 0.2), 30);
        setTimeout(() => this.generateTone(800, 0.04, 'square', 0.2), 60);
        break;
      case 'tamagotchi':
        // Digital pet beep
        this.generateTone(1047, 0.08, 'square', 0.4); // C6
        setTimeout(() => this.generateTone(1319, 0.06, 'square', 0.3), 100); // E6
        setTimeout(() => this.generateTone(1047, 0.04, 'square', 0.2), 180); // C6
        break;
      case 'gameboy':
        // Classic GameBoy power-on chime (iconic startup sound)
        this.generateTone(659, 0.2, 'square', 0.4); // E5
        setTimeout(() => this.generateTone(523, 0.2, 'square', 0.4), 200); // C5
        setTimeout(() => this.generateTone(587, 0.4, 'square', 0.4), 400); // D5
        break;
      default:
        this.playClick();
    }
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    Howler.volume(this.volume);
  }

  toggleMute() {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled) {
      Howler.mute(true);
    } else {
      Howler.mute(false);
    }
    return this.isEnabled;
  }

  cleanup() {
    // Stop all sounds and unload
    Object.values(this.sounds).forEach(sound => {
      sound.stop();
      sound.unload();
    });
  }
}

// Create singleton instance
const soundManager = new SoundManager();
export default soundManager;