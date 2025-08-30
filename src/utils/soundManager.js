import { Howl, Howler } from 'howler';
import { gameboyData } from '../data/gameboyData';

class SoundManager {
  constructor() {
    this.sounds = {};
    this.isEnabled = true;
    this.audioContext = null;
    this.volume = 0.7;
    this.initialized = false;
    this.currentObjectSound = null;
    
    // Set global volume
    Howler.volume(this.volume);
    
    // Load external Game Boy Advance sound
    this.gameboySound = new Howl({
      src: ['/sounds/gba.mp3'],
      volume: 0.6,
      preload: true
    });
    
    // Load external iMac G3 sound
    this.imacSound = new Howl({
      src: ['/sounds/imacg3.mp3'],
      volume: 0.6,
      preload: true
    });
    
    // Load external PS2 sound
    this.ps2Sound = new Howl({
      src: ['/sounds/ps2.mp3'],
      volume: 0.6,
      preload: true
    });
    
    // Load external Tamagotchi sound
    this.tamagotchiSound = new Howl({
      src: ['/sounds/tamagotchi.mp3'],
      volume: 0.6,
      preload: true
    });
    
    // Load external iPod sound
    this.ipodSound = new Howl({
      src: ['/sounds/ipod.mp3'],
      volume: 0.6,
      preload: true
    });
    
    // Load external Pokémon Emerald sound
    this.emeraldSound = new Howl({
      src: ['/sounds/emeraldstart.mp3'],
      volume: 0.6,
      preload: true
    });
    
    // Load external Pokémon Fire Red sound
    this.fireRedSound = new Howl({
      src: ['/sounds/firered.mp3'],
      volume: 0.6,
      preload: true
    });
    
    // Load external Mario Kart sound
    this.marioKartSound = new Howl({
      src: ['/sounds/mariokart.mp3'],
      volume: 0.6,
      preload: true
    });
    
    // Load external Link's Awakening sound
    this.linkSound = new Howl({
      src: ['/sounds/link.mp3'],
      volume: 0.6,
      preload: true
    });
    
    // Load background music
    this.bgMusic = new Howl({
      src: ['/sounds/bgsong.mp3'],
      volume: 0.3,
      loop: true,
      preload: true
    });
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

  startBgMusic() {
    if (this.bgMusic && this.isEnabled) {
      this.bgMusic.play();
    }
  }

  setBgMusicVolume(volume) {
    if (this.bgMusic) {
      this.bgMusic.volume(volume);
    }
  }

  stopCurrentObjectSound() {
    if (this.currentObjectSound && this.currentObjectSound.playing()) {
      this.currentObjectSound.stop();
    }
  }

  pauseBgMusic() {
    if (this.bgMusic && this.bgMusic.playing()) {
      this.bgMusic.pause();
    }
  }

  resumeBgMusic() {
    if (this.bgMusic && this.isEnabled && !this.bgMusic.playing()) {
      this.bgMusic.play();
    }
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


  // Play Game Boy game-specific audio
  playGameAudio(gameId) {
    if (!this.isEnabled) return;
    this.initializeSounds();
    
    // Pause background music before playing game sound
    this.pauseBgMusic();
    
    // Only play external sound files
    if (gameId === 'pokemon-emerald' && this.emeraldSound) {
      this.currentObjectSound = this.emeraldSound;
      this.emeraldSound.play();
      this.emeraldSound.once('end', () => this.resumeBgMusic());
      return;
    }
    
    if (gameId === 'pokemon-fire-red' && this.fireRedSound) {
      this.currentObjectSound = this.fireRedSound;
      this.fireRedSound.play();
      this.fireRedSound.once('end', () => this.resumeBgMusic());
      return;
    }
    
    if (gameId === 'mario-kart' && this.marioKartSound) {
      this.currentObjectSound = this.marioKartSound;
      this.marioKartSound.play();
      this.marioKartSound.once('end', () => this.resumeBgMusic());
      return;
    }
    
    if (gameId === 'zelda-links-awakening' && this.linkSound) {
      this.currentObjectSound = this.linkSound;
      this.linkSound.play();
      this.linkSound.once('end', () => this.resumeBgMusic());
      return;
    }
    
    // No fallback - games without MP3 files will be silent
  }

  playObjectSound(objectId) {
    if (!this.isEnabled) return;
    this.initializeSounds();
    
    // Stop any currently playing object sound
    this.stopCurrentObjectSound();
    
    // Check if it's a Game Boy game-specific sound
    if (gameboyData.audioCues[objectId]) {
      this.playGameAudio(objectId);
      return;
    }
    
    // Map object IDs to specific generated sounds
    switch(objectId) {
      case 'gameboy':
        // Play external Game Boy Advance sound
        if (this.gameboySound && this.isEnabled) {
          this.currentObjectSound = this.gameboySound;
          this.gameboySound.play();
        }
        break;
      case 'ps2':
        // Play external PS2 sound
        if (this.ps2Sound && this.isEnabled) {
          this.currentObjectSound = this.ps2Sound;
          this.ps2Sound.play();
        }
        break;
      case 'imac-g3':
        // Play external iMac G3 sound
        if (this.imacSound && this.isEnabled) {
          this.currentObjectSound = this.imacSound;
          this.imacSound.play();
        }
        break;
      case 'tamagotchi':
        // Play external Tamagotchi sound
        if (this.tamagotchiSound && this.isEnabled) {
          this.currentObjectSound = this.tamagotchiSound;
          this.tamagotchiSound.play();
        }
        break;
      case 'ipod':
        // Play external iPod sound
        if (this.ipodSound && this.isEnabled) {
          this.currentObjectSound = this.ipodSound;
          this.ipodSound.play();
        }
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