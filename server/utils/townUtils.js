import Story from '../models/Story.js';
import Town from '../models/Town.js';

// ASCII art patterns for different crest types
const CREST_PATTERNS = [
  {
    pattern: `    ⭐    
   /|\\   
  / | \\  
 /_____\\ 
| TOWN  |
|_______|`,
    rarity: 'common',
    unlockCondition: 'default',
    themes: []
  },
  {
    pattern: `   🌸🌸   
  🌸🏠🌸  
 🌸🌸🌸🌸 
  \\     /  
   \\___/   `,
    rarity: 'common',
    unlockCondition: 'nature theme',
    themes: ['nature']
  },
  {
    pattern: `   🍞🥖   
  \\     /  
   )   (   
  /     \\  
 🥧_____🧁`,
    rarity: 'uncommon',
    unlockCondition: 'cooking theme',
    themes: ['cooking']
  },
  {
    pattern: `   🎭🎪   
  🎨🎵🎨  
 🎪🎭🎪🎭 
  \\  🎵 /  
   \\___/   `,
    rarity: 'rare',
    unlockCondition: 'festival theme',
    themes: ['festival']
  },
  {
    pattern: `   ❄️⭐❄️   
  ⭐🏠⭐  
 ❄️⭐❄️⭐ 
  \\     /  
   \\___/   `,
    rarity: 'rare',
    unlockCondition: 'winter theme',
    themes: ['seasons']
  },
  {
    pattern: `   🔮✨   
  ✨🌙✨  
 🔮✨🔮✨ 
  \\  🌟 /  
   \\___/   `,
    rarity: 'legendary',
    unlockCondition: 'mystery theme with 5+ entries',
    themes: ['mystery']
  }
];

export const generateTownCrest = (stories) => {
  if (stories.length === 0) {
    return CREST_PATTERNS[0].pattern;
  }

  // Collect all themes from stories
  const allThemes = stories.flatMap(story => story.themes);
  const themeCount = allThemes.reduce((acc, theme) => {
    acc[theme] = (acc[theme] || 0) + 1;
    return acc;
  }, {});

  // Find matching crest patterns
  const matchingPatterns = CREST_PATTERNS.filter(pattern => {
    if (pattern.themes.length === 0) return true; // Default pattern
    
    // Check if we have the required themes
    return pattern.themes.some(theme => themeCount[theme] >= 1);
  });

  // Special conditions for rare crests
  const eligiblePatterns = matchingPatterns.filter(pattern => {
    if (pattern.rarity === 'legendary') {
      // Legendary crests need specific conditions
      if (pattern.themes.includes('mystery')) {
        return themeCount['mystery'] >= 2 && stories.length >= 5;
      }
    }
    return true;
  });

  if (eligiblePatterns.length === 0) {
    return CREST_PATTERNS[0].pattern;
  }

  // Prioritize rarer patterns
  const rarityWeight = { legendary: 4, rare: 3, uncommon: 2, common: 1 };
  const weightedPatterns = [];
  
  eligiblePatterns.forEach(pattern => {
    const weight = rarityWeight[pattern.rarity];
    for (let i = 0; i < weight; i++) {
      weightedPatterns.push(pattern);
    }
  });

  const selectedPattern = weightedPatterns[Math.floor(Math.random() * weightedPatterns.length)];
  return selectedPattern.pattern;
};

// Generate town motto based on stories
export const generateTownMotto = (stories) => {
  if (stories.length === 0) return "A town waiting to be discovered";
  
  const totalSentiment = stories.reduce((sum, story) => sum + story.sentiment, 0);
  const avgSentiment = totalSentiment / stories.length;
  
  const allThemes = stories.flatMap(story => story.themes);
  const themeCount = allThemes.reduce((acc, theme) => {
    acc[theme] = (acc[theme] || 0) + 1;
    return acc;
  }, {});
  
  const dominantTheme = Object.entries(themeCount)
    .sort(([,a], [,b]) => b - a)[0]?.[0];

  // Generate motto based on sentiment and dominant theme
  if (avgSentiment > 1) {
    const joyfulMottos = [
      "Where every day brings new joy",
      "A place where happiness blooms",
      "United in warmth and wonder",
      "Where smiles are our currency"
    ];
    return joyfulMottos[Math.floor(Math.random() * joyfulMottos.length)];
  } else if (avgSentiment < -1) {
    const mysteriousMottos = [
      "Where shadows hold secrets",
      "Mystery dwells in every corner",
      "A town of whispered tales",
      "Where the curious find their calling"
    ];
    return mysteriousMottos[Math.floor(Math.random() * mysteriousMottos.length)];
  } else {
    // Theme-based mottos
    const themeMottos = {
      'cooking': ["Where every meal tells a story", "Flavors that bring us together"],
      'crafts': ["Built with care, crafted with love", "Where skilled hands shape dreams"],
      'nature': ["In harmony with the earth", "Where nature and hearts intertwine"],
      'festival': ["Every day is a celebration", "Where traditions dance with joy"],
      'community': ["Stronger together, kinder always", "Where neighbors become family"]
    };
    
    if (dominantTheme && themeMottos[dominantTheme]) {
      const mottos = themeMottos[dominantTheme];
      return mottos[Math.floor(Math.random() * mottos.length)];
    }
  }
  
  return "A town woven from stories";
};

// Update town statistics
export const updateTownStats = async (townId) => {
  try {
    const stories = await Story.find({ town: townId });
    const uniqueLocations = new Set(stories.map(s => s.location)).size;
    const uniqueContributors = new Set(stories.map(s => s.author)).size;
    
    // Count themes
    const allThemes = stories.flatMap(story => story.themes);
    const themeCount = allThemes.reduce((acc, theme) => {
      acc[theme] = (acc[theme] || 0) + 1;
      return acc;
    }, {});
    
    const themes = Object.entries(themeCount).map(([name, count]) => ({
      name,
      count
    }));

    await Town.findByIdAndUpdate(townId, {
      'stats.totalStories': stories.length,
      'stats.locationsWithStories': uniqueLocations,
      'stats.contributors': uniqueContributors,
      themes
    });
  } catch (error) {
    console.error('Error updating town stats:', error);
  }
};