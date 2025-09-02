// iMac G3 color variants
export const imacColors = {
  bondiBlue: {
    id: 'bondi-blue',
    name: 'Bondi Blue',
    color: '#0095B6',
    bgGradient: 'linear-gradient(135deg, #0095B6, #00C9FF)',
    description: 'The original that started it all'
  },
  strawberry: {
    id: 'strawberry',
    name: 'Strawberry',
    color: '#FF6B9D',
    bgGradient: 'linear-gradient(135deg, #FF6B9D, #FFC0CB)',
    description: 'Sweet and bold'
  },
  lime: {
    id: 'lime',
    name: 'Lime',
    color: '#32CD32',
    bgGradient: 'linear-gradient(135deg, #32CD32, #90EE90)',
    description: 'Fresh and vibrant'
  },
  tangerine: {
    id: 'tangerine',
    name: 'Tangerine',
    color: '#FF8C00',
    bgGradient: 'linear-gradient(135deg, #FF8C00, #FFA500)',
    description: 'Warm and inviting'
  },
  grape: {
    id: 'grape',
    name: 'Grape',
    color: '#8B008B',
    bgGradient: 'linear-gradient(135deg, #8B008B, #DA70D6)',
    description: 'Royal and mysterious'
  }
};

// Classic applications
export const classicApps = [
  {
    id: 'kid-pix',
    name: 'Kid Pix Deluxe',
    icon: '🎨',
    memory: 'The "Oh no!" guy and explosive undo',
    description: 'Digital creativity unleashed with wacky stamps and sound effects'
  },
  {
    id: 'oregon-trail',
    name: 'The Oregon Trail',
    icon: '🐂',
    memory: 'You have died of dysentery',
    description: 'Teaching kids about American history and the fragility of life'
  },
  {
    id: 'typing-tutor',
    name: 'Mavis Beacon',
    icon: '⌨️',
    memory: 'Home row keys: ASDF JKL;',
    description: 'Learning to type while racing cars and popping balloons'
  },
  {
    id: 'encarta',
    name: 'Encarta 99',
    icon: '📚',
    memory: 'MindMaze trivia in a medieval castle',
    description: 'The entire encyclopedia on a shiny CD-ROM'
  },
  {
    id: 'itunes',
    name: 'iTunes 1.0',
    icon: '🎵',
    memory: 'Rip. Mix. Burn.',
    description: 'Your music library visualized in psychedelic colors'
  },
  {
    id: 'internet-explorer',
    name: 'Internet Explorer',
    icon: '🌐',
    memory: 'Welcome to the World Wide Web',
    description: 'Portal to GeoCities pages and dial-up adventures'
  }
];

// Desktop folders
export const desktopFolders = [
  {
    name: 'School Projects',
    contents: ['Book Report.doc', 'Science Fair.ppt', 'Math Homework.txt']
  },
  {
    name: 'My AIM Logs',
    contents: ['BuddyList.txt', 'Away Messages.doc', 'Chat with BFF.html']
  },
  {
    name: 'MP3 Downloads',
    contents: ['Totally_Not_Virus.exe', 'Backstreet_Boys.mp3', 'Limewire_Songs']
  }
];

// Nostalgic memories
export const imacMemories = [
  {
    title: 'Computer Lab Days',
    content: 'The excitement of computer class, typing on translucent keyboards while the teacher wasn\'t looking.',
    category: 'school',
    emotion: 'nostalgic'
  },
  {
    title: 'Flash Game Marathon',
    content: 'Waiting 20 minutes for a Flash game to load on Newgrounds, only for it to crash halfway through.',
    category: 'gaming',
    emotion: 'gaming'
  },
  {
    title: 'Encyclopedia on CD',
    content: 'The magic of having an entire encyclopedia on one CD-ROM, complete with grainy videos.',
    category: 'learning',
    emotion: 'learning'
  }
];

// Tech specifications
export const techSpecs = {
  processor: 'PowerPC G3 @ 233-700 MHz',
  ram: '32-512 MB SDRAM',
  storage: '4-40 GB HDD',
  display: '15" CRT (1024x768)',
  ports: 'USB, Ethernet, Modem',
  os: 'Mac OS 8.5 - OS X',
  special: 'Translucent colored plastic',
  year: '1998-2003'
};

// Fun facts
export const funFacts = [
  {
    title: 'Design Revolution',
    fact: 'The iMac G3 saved Apple from bankruptcy and made computers fashionable.',
    category: 'history'
  },
  {
    title: 'No Floppy Drive',
    fact: 'First mainstream computer to ditch the floppy drive, causing initial controversy.',
    category: 'innovation'
  },
  {
    title: 'Handle Purpose',
    fact: 'The handle wasn\'t just for carrying - it made the computer feel approachable.',
    category: 'design'
  },
  {
    title: 'Hockey Puck Mouse',
    fact: 'The round USB mouse was so unpopular that third-party mice became instant bestsellers.',
    category: 'quirks'
  },
  {
    title: 'Translucent Trend',
    fact: 'Started a late-90s trend of translucent electronics, from phones to game consoles.',
    category: 'influence'
  }
];

// Error messages and popups
export const classicErrors = [
  {
    title: 'System Error',
    message: 'The application "Netscape" has unexpectedly quit.',
    icon: '💣'
  },
  {
    title: 'Connection Failed',
    message: 'Could not connect to the internet. Please check your dial-up settings.',
    icon: '📞'
  },
  {
    title: 'Flash Required',
    message: 'This content requires Macromedia Flash Player 4.0 or higher.',
    icon: '⚡'
  }
];

// Memory prompts
export const memoryPrompts = [
  "What was the first website you ever visited?",
  "Remember waiting for images to load line by line?",
  "Did you have a favorite AIM buddy icon?",
  "What was your first email address?",
  "Which color iMac did your school have?"
];

// Helper functions
export const getRandomMemory = () => {
  return imacMemories[Math.floor(Math.random() * imacMemories.length)];
};

export const getRandomFunFact = () => {
  return funFacts[Math.floor(Math.random() * funFacts.length)];
};

export const getRandomError = () => {
  return classicErrors[Math.floor(Math.random() * classicErrors.length)];
};

export const getRandomPrompt = () => {
  return memoryPrompts[Math.floor(Math.random() * memoryPrompts.length)];
};