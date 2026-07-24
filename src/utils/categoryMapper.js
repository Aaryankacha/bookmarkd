const CATEGORY_MAP = {
  'Fantasy': ['fantasy', 'magic', 'wizards', 'dragons', 'epic fantasy', 'high fantasy'],
  'Sci-Fi': ['science fiction', 'space opera', 'cyberpunk', 'dystopian', 'time travel'],
  'Mystery': ['mystery', 'detective', 'whodunit', 'crime'],
  'Thriller': ['thriller', 'suspense', 'psychological thriller'],
  'Romance': ['romance', 'love story', 'contemporary romance', 'historical romance'],
  'Horror': ['horror', 'vampires', 'zombies', 'supernatural', 'ghosts'],
  'Historical': ['historical fiction', 'history', 'world war'],
  'Classics': ['classic literature', 'classics'],
  'Biography': ['biography', 'autobiography', 'memoir'],
  'Philosophy': ['philosophy', 'existentialism'],
  'Self Help': ['self-help', 'psychology', 'personal development', 'motivational'],
  'Business': ['business', 'economics', 'finance', 'management', 'leadership'],
  'Programming': ['programming', 'computer science', 'software engineering', 'computers', 'coding'],
  'Manga': ['manga', 'japanese comics'],
  'Comics': ['comics', 'graphic novels'],
  'Young Adult': ['young adult', 'ya', 'teen'],
  'Adventure': ['adventure', 'action'],
  'Crime': ['true crime', 'crime fiction']
};

export const mapSubjectsToCategories = (subjects = []) => {
  if (!subjects || !Array.isArray(subjects) || subjects.length === 0) return [];

  const matchedCategories = new Set();
  const lowerSubjects = subjects
    .filter(s => typeof s === 'string')
    .map(s => s.toLowerCase());

  for (const subject of lowerSubjects) {
    for (const [category, keywords] of Object.entries(CATEGORY_MAP)) {
      if (keywords.some(keyword => subject.includes(keyword))) {
        matchedCategories.add(category);
      }
    }
  }

  return Array.from(matchedCategories);
};
