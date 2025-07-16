// iPod Classic Memory Capsule Data
export const ipodData = {
  albums: [
    {
      id: 'hybrid-theory',
      title: 'Hybrid Theory',
      artist: 'Linkin Park',
      year: 2000,
      genre: 'Nu Metal',
      color: '#FF0000',
      tracks: ['One Step Closer', 'Crawling', 'In the End', 'A Place for My Head']
    },
    {
      id: 'fallen',
      title: 'Fallen',
      artist: 'Evanescence',
      year: 2003,
      genre: 'Alternative',
      color: '#8B0000',
      tracks: ['Going Under', 'Bring Me to Life', 'Everybody\'s Fool', 'My Immortal']
    },
    {
      id: 'meteora',
      title: 'Meteora',
      artist: 'Linkin Park',
      year: 2003,
      genre: 'Nu Metal',
      color: '#FF4500',
      tracks: ['Don\'t Stay', 'Somewhere I Belong', 'Lying From You', 'Hit the Floor']
    },
    {
      id: 'american-idiot',
      title: 'American Idiot',
      artist: 'Green Day',
      year: 2004,
      genre: 'Punk Rock',
      color: '#32CD32',
      tracks: ['American Idiot', 'Jesus of Suburbia', 'Holiday', 'Boulevard of Broken Dreams']
    }
  ],

  playlists: [
    {
      name: 'Late Night Vibes',
      description: 'For those 2am moments when the world felt infinite',
      trackCount: 47,
      color: '#4169E1',
      genres: ['Alternative', 'Indie', 'Electronic']
    },
    {
      name: 'Workout Mix 2005',
      description: 'Pump up the volume and pretend you\'re in a Nike commercial',
      trackCount: 23,
      color: '#FF6347',
      genres: ['Rock', 'Nu Metal', 'Electronic']
    },
    {
      name: 'Road Trip Essentials',
      description: 'Windows down, volume up, destination unknown',
      trackCount: 62,
      color: '#FFD700',
      genres: ['Rock', 'Pop', 'Alternative']
    },
    {
      name: 'Study Sessions',
      description: 'Background music for all-nighters and cramming',
      trackCount: 34,
      color: '#9370DB',
      genres: ['Instrumental', 'Ambient', 'Post-Rock']
    }
  ],

  memories: [
    {
      title: 'First Download',
      content: 'The moment iTunes changed everything. 99¢ for a song seemed expensive, but having instant access to any track you wanted? Revolutionary. No more waiting for the radio to play your favorite song.',
      category: 'iTunes Store',
      icon: '💿',
      year: 2003
    },
    {
      title: 'Untangled Earbuds',
      content: 'The daily ritual of untangling those white earbuds. They came out of your pocket looking like they\'d been through a blender, but once untangled, they were your portal to another world.',
      category: 'Hardware',
      icon: '🎧',
      year: 2001
    },
    {
      title: 'Sync Your Life',
      content: 'Your iTunes library was your digital identity. 10,000 songs that defined who you were, what you loved, and where you\'d been. Syncing was sacred - it was backing up your soul.',
      category: 'iTunes',
      icon: '🔄',
      year: 2004
    },
    {
      title: 'Battery Red',
      content: 'That moment when the battery icon turned red and you had maybe 20 minutes left. Every song became precious. Every skip was a calculated risk. The anxiety was real.',
      category: 'Hardware',
      icon: '🔋',
      year: 2002
    },
    {
      title: 'Shuffle Serendipity',
      content: 'Hitting shuffle and getting the PERFECT song for the moment. It felt like magic, like your iPod understood your soul. Those random moments of musical perfection were everything.',
      category: 'Features',
      icon: '🔀',
      year: 2005
    },
    {
      title: 'New Music Tuesday',
      content: 'Every Tuesday, new releases hit the iTunes Store. It was Christmas morning every week. Discovering new artists, pre-ordering albums, building wish lists - digital music had arrived.',
      category: 'iTunes Store',
      icon: '🆕',
      year: 2004
    }
  ],

  funFacts: [
    {
      category: 'Storage',
      fact: '1,000 songs in your pocket was revolutionary',
      detail: 'The original iPod\'s 5GB could hold about 1,000 songs. For context, that was like carrying 80 CDs everywhere you went.'
    },
    {
      category: 'Battery',
      fact: 'That battery anxiety was real',
      detail: 'First-gen iPods lasted about 10 hours. By 2005, we were getting 14 hours, but it never felt like enough for those cross-country flights.'
    },
    {
      category: 'Click Wheel',
      fact: 'The click wheel was pure genius',
      detail: 'Introduced in 2004, the click wheel let you scroll through thousands of songs with just your thumb. It was faster than any touchscreen of its time.'
    },
    {
      category: 'Cultural Impact',
      fact: 'White earbuds became a status symbol',
      detail: 'Those distinctive white earbuds were instantly recognizable. They screamed "I have an iPod" and became as iconic as the device itself.'
    },
    {
      category: 'iTunes',
      fact: 'iTunes saved the music industry',
      detail: 'When Napster was killing CD sales, iTunes offered a legal alternative. 99¢ per song seemed fair, and it worked.'
    }
  ],

  nowPlayingStates: [
    {
      title: 'Late Night Conversations',
      artist: 'Memory Lane Sessions',
      album: 'Dorm Room Chronicles',
      duration: '∞',
      elapsed: '2:47AM',
      isPlaying: true,
      albumArt: '🌙'
    },
    {
      title: 'First Heartbreak Blues',
      artist: 'Teenage Emotions',
      album: 'Growing Up Too Fast',
      duration: '4:03',
      elapsed: '2004',
      isPlaying: false,
      albumArt: '💔'
    }
  ],

  menuStructure: {
    main: [
      { id: 'memories', title: 'Memory Bank', icon: '💭' },
      { id: 'now-playing', title: 'Now Playing', icon: '▶️' },
      { id: 'music', title: 'Soundtrack', icon: '♫' },
      { id: 'extras', title: 'Time Capsule', icon: '⚙️' }
    ],
    music: [
      { id: 'playlists', title: 'Life Playlists', icon: '📋' },
      { id: 'moments', title: 'Moments', icon: '📸' },
      { id: 'feelings', title: 'Feelings', icon: '❤️' },
      { id: 'years', title: 'Years', icon: '📅' },
      { id: 'places', title: 'Places', icon: '🌍' }
    ],
    memories: [
      { id: 'stories', title: 'Memory Stories', icon: '📖' },
      { id: 'fun-facts', title: 'iPod Era Facts', icon: '💡' },
      { id: 'timeline', title: '2000s Timeline', icon: '📅' },
      { id: 'nostalgia', title: 'Pure Nostalgia', icon: '✨' }
    ]
  }
};

// Helper function to get random fun fact
export const getRandomFunFact = () => {
  const facts = ipodData.funFacts;
  return facts[Math.floor(Math.random() * facts.length)];
};

// Helper function to get random memory
export const getRandomMemory = () => {
  const memories = ipodData.memories;
  return memories[Math.floor(Math.random() * memories.length)];
};

// Helper function to format time
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};