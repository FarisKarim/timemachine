export const ps2Data = {
  // Authentic PS2 gaming memories from the Y2K era
  memories: [
    {
      title: "The Growing Towers",
      content: "Those mysterious floating towers on the boot screen weren't random - they grew based on your save data. The more games you played, the more towers appeared.",
      timestamp: "2000-2005", 
      category: "boot",
      emotion: "discovery",
      icon: "🏗️"
    },
    {
      title: "The 8MB Decision",
      content: "Delete your Jak and Daxter save to make room for Ratchet: Deadlocked?",
      timestamp: "2002-2004",
      category: "saves",
      emotion: "sacrifice",
      icon: "⚖️"
    },
    {
      title: "Disc Read Error Hell",
      content: "The red screen of death. Eject. Wipe with shirt. Blow on it. Repeat.",
      timestamp: "2001-2008",
      category: "hardware",
      emotion: "frustration",
      icon: "💿"
    },
    {
      title: "DVD Player Revelation",
      content: "Wait, this thing plays movies too? Suddenly the PS2 became the living room centerpiece. Spider-Man 2 on repeat.",
      timestamp: "2001",
      category: "movies",
      emotion: "amazement",
      icon: "🎬"
    },
    {
      title: "The Backwards Compatibility Miracle",
      content: "Your PS1 games still worked! Suddenly your library doubled overnight. The PS2 was basically a time machine.",
      timestamp: "2000",
      category: "features",
      emotion: "nostalgia",
      icon: "⏰"
    },
    {
      title: "Memory Card Full Panic",
      content: "Delete old saves to make room for new ones.",
      timestamp: "2002-2003",
      category: "saves",
      emotion: "decision",
      icon: "🗑️"
    },
    {
      title: "The Blue Bottom Mystery",
      content: "Never understood why they made the bottom blue. But it looked cool next to the TV, like a piece of the future.",
      timestamp: "2000-2004",
      category: "design",
      emotion: "curiosity",
      icon: "🔷"
    },
    {
      title: "Component Cable Upgrade",
      content: "Finally got those red, blue, and green cables. Graphics suddenly looked 'HD' on your old CRT TV. Mind blown.",
      timestamp: "2003",
      category: "hardware",
      emotion: "upgrade",
      icon: "🔌"
    },
    {
      title: "The Purple Cube Rivalry",
      content: "GameCube had better graphics, but PS2 had Grand Theft Auto. The console war was decided by crime simulators.",
      timestamp: "2001-2002",
      category: "console-wars",
      emotion: "loyalty",
      icon: "⚔️"
    },
    {
      title: "The EyeToy Experiment",
      content: "Waving at the camera like an idiot. The PS2 had motion controls before the Wii, but nobody talks about it.",
      timestamp: "2003",
      category: "accessories",
      emotion: "embarrassment",
      icon: "👁️"
    },
    {
      title: "Memory Card Trading",
      content: "Borrowed your friend's card to play their save file. Like test driving someone else's life in a video game.",
      timestamp: "2001-2005",
      category: "social",
      emotion: "curiosity",
      icon: "🤝"
    },
    {
      title: "The Silver Slim Revolution",
      content: "When the PS2 Slim came out, it felt like alien technology. How did they make it so thin? The future was here.",
      timestamp: "2004",
      category: "hardware",
      emotion: "amazement",
      icon: "✨"
    },
    {
      title: "Guitar Hero Preparation",
      content: "The PS2 taught us that controllers could be anything. Plastic guitars, dance pads, steering wheels - gaming got physical.",
      timestamp: "2005",
      category: "accessories",
      emotion: "innovation",
      icon: "🎸"
    },
    {
      title: "The Red Screen of Death",
      content: "When the PS2 couldn't read discs anymore. RIP to the console that defined a generation. 155 million units couldn't be wrong.",
      timestamp: "2006-2008",
      category: "hardware",
      emotion: "mourning",
      icon: "💀"
    },
    {
      title: "Blockbuster Game Rentals",
      content: "5 games for 5 days for $20. The PS2 library was so huge, you could rent different games every week for years.",
      timestamp: "2001-2006",
      category: "culture",
      emotion: "abundance",
      icon: "🏪"
    },
    {
      title: "The Madden Curse",
      content: "Every year brought a new Madden with slightly better graphics. The PS2 era was when annual sports games became a religion.",
      timestamp: "2000-2008",
      category: "sports",
      emotion: "tradition",
      icon: "🏈"
    },
    {
      title: "LAN Party Setup",
      content: "Carrying your PS2 to a friend's house for System Link multiplayer. The portable gaming setup before portable gaming.",
      timestamp: "2002-2005",
      category: "multiplayer",
      emotion: "adventure",
      icon: "🎒"
    },
    {
      title: "The Demo Disc Collection",
      content: "PlayStation Magazine demos were treasures. You'd play the same 10-minute demo 50 times before buying the full game.",
      timestamp: "2000-2005",
      category: "demos",
      emotion: "anticipation",
      icon: "💿"
    }
  ],

  // Iconic PS2 memory card saves
  memoryCards: [
    {
      id: 'card-1',
      label: 'MEMORY CARD (8MB)',
      capacity: '8MB',
      used: '7.2MB',
      saves: [
        {
          game: 'Grand Theft Auto: Vice City',
          icon: '🌴',
          progress: '87%',
          playTime: '156h 23m',
          date: '2002.10.27',
          description: 'Tommy Vercetti empire complete'
        },
        {
          game: 'Final Fantasy X',
          icon: '⚔️',
          progress: '67%',
          playTime: '89h 12m',
          date: '2001.12.17',
          description: 'Tidus at the Calm Lands'
        },
        {
          game: 'Metal Gear Solid 2',
          icon: '🤖',
          progress: '45%',
          playTime: '23h 45m',
          date: '2001.11.13',
          description: 'Raiden at Big Shell'
        },
        {
          game: 'Tony Hawk Pro Skater 3',
          icon: '🛹',
          progress: '78%',
          playTime: '67h 34m',
          date: '2001.10.30',
          description: 'All gaps found'
        }
      ]
    }
  ],

  // PS2 system information
  systemInfo: {
    model: 'Sony PlayStation 2',
    releaseDate: 'March 4, 2000',
    cpu: 'Emotion Engine (294.912 MHz)',
    gpu: 'Graphics Processing Unit (147.456 MHz)',
    memory: '32MB main RAM + 4MB video RAM',
    storage: 'Memory Card (8MB)',
    media: 'DVD-ROM, CD-ROM, PlayStation discs',
    unitsSold: '160 million worldwide',
    generation: 'Sixth generation'
  },

  // Boot sequence data
  bootSequence: {
    phases: [
      {
        name: 'System Check',
        duration: '2.1s',
        description: 'Hardware initialization',
        color: '#0066FF'
      },
      {
        name: 'Particle Assembly',
        duration: '3.4s',
        description: 'Floating particles gather',
        color: '#FFFFFF'
      },
      {
        name: 'Tower Formation',
        duration: '2.8s',
        description: 'Towers rise from void',
        color: '#00AAFF'
      },
      {
        name: 'Logo Reveal',
        duration: '1.2s',
        description: 'PlayStation 2 logo appears',
        color: '#FFFFFF'
      }
    ]
  },

  // Iconic PS2 games categorized by memory towers
  gameTowers: [
    {
      id: 'rpg-tower',
      name: 'RPG Tower',
      height: 8,
      color: '#FF6600',
      games: ['Final Fantasy X', 'Final Fantasy XII', 'Kingdom Hearts', 'Persona 3', 'Dragon Quest VIII'],
      description: '100+ hour adventures'
    },
    {
      id: 'action-tower',
      name: 'Action Tower',
      height: 6,
      color: '#FF0066',
      games: ['GTA Vice City', 'GTA San Andreas', 'God of War', 'Metal Gear Solid 2', 'Devil May Cry'],
      description: 'Adrenaline-fueled chaos'
    },
    {
      id: 'racing-tower',
      name: 'Racing Tower',
      height: 4,
      color: '#00FF66',
      games: ['Gran Turismo 3', 'Need for Speed Underground', 'Burnout 3', 'Tokyo Xtreme Racer'],
      description: 'Speed demons'
    },
    {
      id: 'platform-tower',
      name: 'Platform Tower',
      height: 5,
      color: '#6600FF',
      games: ['Jak & Daxter', 'Ratchet & Clank', 'Sly Cooper', 'Crash Bandicoot'],
      description: 'Jump and collect'
    },
    {
      id: 'sports-tower',
      name: 'Sports Tower',
      height: 3,
      color: '#FFAA00',
      games: ['Madden NFL 2004', 'Tony Hawk Pro Skater 3', 'FIFA 2003', 'NBA Street'],
      description: 'Athletic excellence'
    }
  ],

  // Y2K color palette
  colors: {
    primary: '#0066FF',      // Electric blue
    secondary: '#00AAFF',    // Cyan blue
    accent: '#FFFFFF',       // Pure white
    background: '#000011',   // Deep space
    void: '#000033',         // Lighter void
    glow: '#66CCFF',         // Soft glow
    warning: '#FF6600',      // Orange warning
    error: '#FF0066'         // Pink error
  }
};

// Helper functions
export const getRandomMemory = () => {
  const randomIndex = Math.floor(Math.random() * ps2Data.memories.length);
  return ps2Data.memories[randomIndex];
};

export const getMemoryCardByIndex = (index) => {
  return ps2Data.memoryCards[index] || ps2Data.memoryCards[0];
};

export const getGameTowerByHeight = (height) => {
  return ps2Data.gameTowers.find(tower => tower.height === height);
};

export const getMemoriesByCategory = (category) => {
  return ps2Data.memories.filter(memory => memory.category === category);
};