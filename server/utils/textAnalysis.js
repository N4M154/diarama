// Sentiment analysis for town motto generation
export const analyzeSentiment = (text) => {
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
export const extractThemes = (content) => {
  const themes = [];
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