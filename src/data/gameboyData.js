export const gameboyData = {
  // Enhanced memory content
  memories: [
    {
      title: 'The Clamshell Revolution',
      content: 'The satisfying snap of closing the SP, knowing your screen was finally protected from scratches.',
      emotion: 'nostalgia'
    },
    {
      title: 'Backlit Dreams', 
      content: 'Finally, a Game Boy you could play in the dark! No more craning toward streetlights on car trips.',
      emotion: 'wonder'
    },
    {
      title: 'Rechargeable Freedom',
      content: 'Built-in battery that lasted 10+ hours - no more AA battery panic during boss fights.',
      emotion: 'relief'
    }
  ],

  // Popular games with rich metadata
  popularGames: [
    {
      id: 'pokemon-fire-red',
      title: 'Pokémon Fire Red',
      year: 2004,
      genre: 'RPG',
      icon: '🔥',
      color: '#EF4444',
      description: 'Classic Kanto adventure reborn',
      funFact: 'First Pokémon game with wireless trading via GBA Wireless Adapter',
      cartridgeColor: '#DC2626',
      model: {
        path: '/models/fire_red.glb',
        scale: [18.0, 18.0, 18.0],
        rotation: [0, 0, 0],
        position: [0, -0.6, 0]
      }
    },
    {
      id: 'pokemon-emerald',
      title: 'Pokémon Emerald',
      year: 2005,
      genre: 'RPG',
      icon: '💎',
      color: '#10B981', 
      description: 'The definitive Hoenn experience',
      funFact: 'Introduced the Battle Frontier with 7 different facilities',
      cartridgeColor: '#059669',
      model: {
        path: '/models/emerald.glb',
        scale: [0.4, 0.4, 0.4],
        rotation: [0, 0, 0],
        position: [0, 0.01, 0]
      }
    },
    {
      id: 'zelda-links-awakening',
      title: 'Zelda: Link\'s Awakening',
      year: 1993,
      genre: 'Adventure',
      icon: '🗡️',
      color: '#F59E0B',
      description: 'Classic portable Zelda adventure',
      funFact: 'Originally developed as a side project by Nintendo staff in their spare time',
      cartridgeColor: '#D97706',
      model: {
        path: '/models/zelda.glb',
        scale: [0.004, 0.004, 0.004],
        rotation: [-Math.PI/2, Math.PI/2, 0],
        position: [0, 0.1, 0]
      }
    },
    {
      id: 'mario-kart',
      title: 'Mario Kart: Super Circuit',
      year: 2001,
      genre: 'Racing', 
      icon: '🏎️',
      color: '#3B82F6',
      description: 'Portable kart racing perfection',
      funFact: 'Included all 20 tracks from Super Mario Kart as unlockables',
      cartridgeColor: '#2563EB',
      model: {
        path: '/models/mario.glb',
        scale: [1.2, 1.2, 1.2],
        rotation: [0, 0, 0]
      }
    }
  ],

  // Technical specifications
  techSpecs: {
    releaseDate: 'February 14, 2003',
    cpu: '32-bit ARM7TDMI (16.78 MHz)',
    display: '240×160 pixels, 32,768 colors',
    battery: 'Rechargeable Lithium Ion (~10 hours)',
    weight: '143g (0.32 lbs)',
    dimensions: '82 × 84.6 × 24.3 mm (folded)',
    unitsSold: '43.57 million',
    price: '$99.99 USD (2003)'
  },

  // Fun facts and trivia
  funFacts: [
    {
      title: 'Clamshell Protection',
      fact: 'First portable Nintendo console with a flip design to protect the screen',
      category: 'design'
    },
    {
      title: 'Backlight Revolution',
      fact: 'AGS-101 model introduced a bright backlit screen that made colors pop',
      category: 'technology'
    },
    {
      title: 'Backward Compatible', 
      fact: 'Could play original Game Boy and Game Boy Color games perfectly',
      category: 'compatibility'
    },
    {
      title: 'Wireless Pioneer',
      fact: 'First Nintendo handheld with wireless multiplayer via the Wireless Adapter',
      category: 'innovation'
    },
    {
      title: 'GBA Power',
      fact: 'More powerful than the original NES and SNES combined',
      category: 'performance'
    }
  ],

  // Audio cues for different interactions
  audioCues: {
    powerOn: {
      type: 'sequence',
      sounds: [
        { frequency: 523, duration: 0.1, type: 'square', delay: 0 },    // C5
        { frequency: 784, duration: 0.15, type: 'square', delay: 100 }  // G5  
      ]
    },
    'pokemon-fire-red': {
      type: 'sequence', 
      sounds: [
        { frequency: 659, duration: 0.1, type: 'square', delay: 0 },
        { frequency: 784, duration: 0.1, type: 'square', delay: 100 },
        { frequency: 880, duration: 0.2, type: 'square', delay: 200 }
      ]
    },
    'pokemon-emerald': {
      type: 'sequence',
      sounds: [
        { frequency: 440, duration: 0.15, type: 'square', delay: 0 },
        { frequency: 523, duration: 0.15, type: 'square', delay: 150 },
        { frequency: 659, duration: 0.2, type: 'square', delay: 300 }
      ]
    },
    'zelda-links-awakening': {
      type: 'sequence',
      sounds: [
        { frequency: 523, duration: 0.2, type: 'square', delay: 0 },   // C
        { frequency: 659, duration: 0.2, type: 'square', delay: 200 }, // E
        { frequency: 784, duration: 0.3, type: 'square', delay: 400 }  // G
      ]
    },
    'mario-kart': {
      type: 'sequence',
      sounds: [
        { frequency: 659, duration: 0.125, type: 'square', delay: 0 },   // E
        { frequency: 659, duration: 0.125, type: 'square', delay: 125 }, // E
        { frequency: 659, duration: 0.125, type: 'square', delay: 375 }, // E
        { frequency: 523, duration: 0.125, type: 'square', delay: 500 }, // C
        { frequency: 659, duration: 0.125, type: 'square', delay: 625 }  // E
      ]
    }
  }
};

// Helper function to get random fun fact
export const getRandomFunFact = () => {
  const facts = gameboyData.funFacts;
  return facts[Math.floor(Math.random() * facts.length)];
};

// Helper function to get game by ID
export const getGameById = (gameId) => {
  return gameboyData.popularGames.find(game => game.id === gameId);
};