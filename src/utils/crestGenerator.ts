import type { TownEntry, CrestPattern } from '../types/town';

// ASCII art patterns for different crest types
const CREST_PATTERNS: CrestPattern[] = [
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

export const generateTownCrest = (entries: TownEntry[]): string => {
  if (entries.length === 0) {
    return CREST_PATTERNS[0].pattern;
  }

  // Collect all themes from entries
  const allThemes = entries.flatMap(entry => entry.themes);
  const themeCount = allThemes.reduce((acc, theme) => {
    acc[theme] = (acc[theme] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
        return themeCount['mystery'] >= 2 && entries.length >= 5;
      }
    }
    return true;
  });

  if (eligiblePatterns.length === 0) {
    return CREST_PATTERNS[0].pattern;
  }

  // Prioritize rarer patterns
  const rarityWeight = { legendary: 4, rare: 3, uncommon: 2, common: 1 };
  const weightedPatterns: CrestPattern[] = [];
  
  eligiblePatterns.forEach(pattern => {
    const weight = rarityWeight[pattern.rarity];
    for (let i = 0; i < weight; i++) {
      weightedPatterns.push(pattern);
    }
  });

  const selectedPattern = weightedPatterns[Math.floor(Math.random() * weightedPatterns.length)];
  return selectedPattern.pattern;
};

export const getCrestRarity = (entries: TownEntry[]): string => {
  const crest = generateTownCrest(entries);
  const pattern = CREST_PATTERNS.find(p => p.pattern === crest);
  return pattern?.rarity || 'common';
};

export const getUnlockedCrestInfo = (entries: TownEntry[]): CrestPattern[] => {
  const allThemes = entries.flatMap(entry => entry.themes);
  const themeCount = allThemes.reduce((acc, theme) => {
    acc[theme] = (acc[theme] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return CREST_PATTERNS.filter(pattern => {
    if (pattern.themes.length === 0) return true;
    
    if (pattern.rarity === 'legendary' && pattern.themes.includes('mystery')) {
      return themeCount['mystery'] >= 2 && entries.length >= 5;
    }
    
    return pattern.themes.some(theme => themeCount[theme] >= 1);
  });
};