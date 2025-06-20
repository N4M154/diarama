import type { TownEntry } from '../types/town';

// Sentiment analysis for town motto generation
export const analyzeSentiment = (text: string): number => {
  const positiveWords = [
    'happy', 'joy', 'love', 'wonderful', 'amazing', 'beautiful', 'peaceful', 
    'kind', 'friendly', 'warm', 'cozy', 'delightful', 'charming', 'magical',
    'bright', 'sunny', 'cheerful', 'sweet', 'gentle', 'caring', 'celebration',
    'festival', 'dance', 'music', 'laughter', 'smile', 'bloom', 'flourish'
  ];
  
  const negativeWords = [
    'sad', 'dark', 'gloomy', 'angry', 'worried', 'trouble', 'problem',
    'difficult', 'harsh', 'cold', 'lonely', 'afraid', 'scary', 'storm',
    'rain', 'shadow', 'mysterious', 'strange', 'lost', 'broken', 'empty'
  ];

  const words = text.toLowerCase().split(/\W+/);
  let score = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 1;
    if (negativeWords.includes(word)) score -= 1;
  });

  return score;
};

// Extract themes from entry content
export const extractThemes = (content: string): string[] => {
  const themes: string[] = [];
  const text = content.toLowerCase();
  
  // Theme detection patterns
  const themePatterns = {
    'cooking': ['bake', 'cook', 'recipe', 'bread', 'cake', 'kitchen', 'chef', 'meal'],
    'crafts': ['craft', 'make', 'build', 'create', 'sew', 'knit', 'wood', 'pottery'],
    'nature': ['garden', 'flower', 'tree', 'bird', 'forest', 'river', 'mountain', 'plant'],
    'festival': ['festival', 'celebration', 'party', 'dance', 'music', 'feast', 'holiday'],
    'seasons': ['spring', 'summer', 'autumn', 'winter', 'snow', 'rain', 'harvest', 'bloom'],
    'mystery': ['secret', 'mysterious', 'hidden', 'strange', 'curious', 'wonder', 'puzzle'],
    'community': ['neighbor', 'friend', 'helper', 'gather', 'together', 'share', 'welcome'],
    'animals': ['cat', 'dog', 'bird', 'rabbit', 'horse', 'cow', 'sheep', 'chicken']
  };

  Object.entries(themePatterns).forEach(([theme, keywords]) => {
    if (keywords.some(keyword => text.includes(keyword))) {
      themes.push(theme);
    }
  });

  return themes;
};

// Generate town motto based on entries
export const generateTownMotto = (entries: TownEntry[]): string => {
  if (entries.length === 0) return "A town waiting to be discovered";
  
  const totalSentiment = entries.reduce((sum, entry) => 
    sum + analyzeSentiment(entry.content), 0
  );
  
  const avgSentiment = totalSentiment / entries.length;
  const allThemes = entries.flatMap(entry => entry.themes);
  const themeCount = allThemes.reduce((acc, theme) => {
    acc[theme] = (acc[theme] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
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
    const themeMottos: Record<string, string[]> = {
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