export const tamagotchiData = {
  characters: [
    {
      id: 'mametchi',
      name: 'Mametchi',
      icon: '👾',
      type: 'Perfect Care',
      color: '#FFD700',
      description: 'Pale-yellow mascot character with dark blue ears. Loyal and diligent!',
      requirements: 'Perfect care, no mistakes',
      personality: 'Intelligent, polite, loves learning'
    },
    {
      id: 'kuchipatchi',
      name: 'Kuchipatchi',
      icon: '🟢',
      type: 'Good Care',
      color: '#32CD32',
      description: 'Round, green, jelly bean-like body with large lips. Loves food and naps!',
      requirements: 'Good care, occasional mistakes OK',
      personality: 'Carefree, gentle, romantic daydreamer'
    },
    {
      id: 'ginjirotchi',
      name: 'Ginjirotchi',
      icon: '🔵',
      type: 'Average Care',
      color: '#00BFFF',
      description: 'One of the "good" set adult characters from the original 1996 release.',
      requirements: 'Average care, some neglect',
      personality: 'Cool, independent, reliable'
    },
    {
      id: 'maskutchi',
      name: 'Maskutchi',
      icon: '👺',
      type: 'Poor Care',
      color: '#FF1493',
      description: 'Round white body with violet ears and mask. Intelligent but mysterious!',
      requirements: 'Poor care, many care mistakes',
      personality: 'Quiet, intelligent, likes to spy on others'
    }
  ],
  
  careStats: [
    { name: 'Hunger', icon: '🍔', color: '#FF6B6B', description: 'Feed meals and snacks' },
    { name: 'Happiness', icon: '😊', color: '#4ECDC4', description: 'Play games together' },
    { name: 'Discipline', icon: '📚', color: '#845EC2', description: 'Scold when misbehaving' },
    { name: 'Health', icon: '💊', color: '#2ECC71', description: 'Give medicine when sick' }
  ],
  
  miniGames: [
    {
      name: 'Left or Right',
      icon: '👈👉',
      description: 'Guess which direction your Tamagotchi will look!',
      difficulty: 'Easy'
    },
    {
      name: 'Number Game',
      icon: '🔢',
      description: 'Guess the number your Tamagotchi is thinking of!',
      difficulty: 'Medium'
    },
    {
      name: 'Shapes',
      icon: '🔺',
      description: 'Match the shape that appears on screen!',
      difficulty: 'Hard'
    }
  ],
  
  evolutionStages: [
    { stage: 'Egg', age: '0 days', icon: '🥚', color: '#F8F8F8' },
    { stage: 'Baby', age: '1 hour', icon: '👶', color: '#FFE4E1' },
    { stage: 'Child', age: '1 day', icon: '🧒', color: '#FFB6C1' },
    { stage: 'Teen', age: '3 days', icon: '🧑', color: '#FF69B4' },
    { stage: 'Adult', age: '7 days', icon: '👤', color: '#FF1493' },
    { stage: 'Secret', age: 'Perfect care', icon: '⭐', color: '#FFD700' }
  ],
  
  memories: [
    {
      title: "The Beeping Terror",
      content: "That moment of panic when your Tamagotchi started beeping in the middle of class, and you had to secretly feed it under your desk.",
      timestamp: "September 1997"
    },
    {
      title: "Keychain Companion",
      content: "Clipped to every backpack, jingling with every step. Some kids had five or six dangling like trophies of virtual parenthood.",
      timestamp: "Holiday Season 1997"
    },
    {
      title: "The Great Reset",
      content: "The heartbreak of coming home to find your beloved digital pet had 'passed away' because you forgot to pause it during school.",
      timestamp: "October 1997"
    },
    {
      title: "Trading Secrets",
      content: "Playground intel on how to get the secret characters. 'You have to win 10 games in a row!' (Nobody knew if it was true.)",
      timestamp: "Spring 1998"
    },
    {
      title: "Battery Life Anxiety",
      content: "Watching that battery icon like a hawk, begging mom for new batteries because your Tamagotchi's life depended on it.",
      timestamp: "Winter 1997"
    },
    {
      title: "The Dinner Table Ban",
      content: "Got grounded for a week after bringing it to grandma's birthday dinner. 'But it'll DIE!' wasn't a valid excuse.",
      timestamp: "November 1997"
    },
    {
      title: "Digital Pet Cemetery",
      content: "Drew little tombstones in my diary for every Tamagotchi that passed. RIP Blob, age 14 days. You were loved.",
      timestamp: "December 1997"
    },
    {
      title: "Secret Sound Settings",
      content: "Became a master at feeding with the sound off, fingers memorizing every button combo. Silent caretaking level: Expert.",
      timestamp: "January 1998"
    },
    {
      title: "The Connection Era",
      content: "When V3 came out with infrared connection, spent hours trying to mate Tamagotchis with friends. Digital matchmaking!",
      timestamp: "2004"
    },
    {
      title: "Pause Button Discovery",
      content: "Life changed forever when someone discovered you could pause by going to the clock screen. School days were saved!",
      timestamp: "October 1997"
    },
    {
      title: "Bedtime Negotiations",
      content: "'Just five more minutes, I need to put it to sleep!' Convinced parents that digital pets had bedtimes too.",
      timestamp: "Summer 1997"
    },
    {
      title: "The Poop Incident",
      content: "Teacher confiscated it during math test. Returned it after class surrounded by digital poop. Poor Mametchi!",
      timestamp: "February 1998"
    }
  ],
  
  funFacts: [
    {
      title: "Japanese for 'Egg Watch'",
      fact: "Tamagotchi combines 'tamago' (egg) and 'uotchi' (watch), literally meaning 'egg watch' - named because you watch over your digital pet as it grows from an egg.",
      category: "etymology"
    },
    {
      title: "82 Million Sold Worldwide",
      fact: "By 2017, over 82 million Tamagotchis had been sold worldwide since the original 1996 launch, making it one of the best-selling toys ever.",
      category: "sales"
    },
    {
      title: "Banned in Schools",
      fact: "Many schools banned Tamagotchis because students were too distracted caring for their digital pets during class.",
      category: "culture"
    },
    {
      title: "Peak Sales Speed",
      fact: "At peak popularity, 15 Tamagotchis were sold every second in North America alone.",
      category: "sales"
    },
    {
      title: "Original Release Date",
      fact: "First released in Japan on November 23, 1996, then launched in the US on May 1, 1997, causing immediate sell-outs.",
      category: "history"
    },
    {
      title: "Care Mistake System",
      fact: "The adult your Tamagotchi becomes depends on how many 'care mistakes' you make - perfect care gets you Mametchi!",
      category: "features"
    }
  ],
  
  deathReasons: [
    "Forgot to feed for 12 hours",
    "Didn't clean up the poop",
    "Zero happiness for too long",
    "Got sick and no medicine given",
    "Old age (they lived a good life!)"
  ],
  
  colors: {
    primary: '#FF1493',      // Hot pink
    secondary: '#00BFFF',    // Electric blue
    accent: '#32CD32',       // Lime green
    highlight: '#FFD700',    // Gold
    background: '#FF69B4',   // Light pink
    pixel: '#FF00FF'        // Magenta
  }
};

export const getRandomMemory = () => {
  const randomIndex = Math.floor(Math.random() * tamagotchiData.memories.length);
  return tamagotchiData.memories[randomIndex];
};

export const getRandomFunFact = () => {
  const randomIndex = Math.floor(Math.random() * tamagotchiData.funFacts.length);
  return tamagotchiData.funFacts[randomIndex];
};