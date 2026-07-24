import { useQuery } from '@tanstack/react-query';
import { getBooksBySubject, getTrendingBooks, searchBooks } from '../services/api';
import { mapSubjectsToCategories } from '../utils/categoryMapper';

export const useBooks = (category) => {
  return useQuery({
    queryKey: ['books', category],
    queryFn: async () => {
      let rawData;
      
      const safeCategory = (category || '').toLowerCase();
      
      const GENRE_TO_SUBJECT = {
        'sci-fi': 'science_fiction',
        'self help': 'self_help',
        'young adult': 'young_adult_fiction',
        'historical': 'historical_fiction',
        'business': 'business',
      };
      
      switch (safeCategory) {
        case 'trending':
          rawData = await getTrendingBooks();
          break;
        case 'popular':
          rawData = await searchBooks('bestseller');
          break;
        case 'recent':
          rawData = await searchBooks('new');
          break;
        default: {
          // For all other categories (e.g., 'Fantasy', 'Sci-Fi'), use the subject API
          const subjectToFetch = GENRE_TO_SUBJECT[safeCategory] || safeCategory;
          rawData = await getBooksBySubject(subjectToFetch);
          break;
        }
      }
      
      // Map the data to a consistent format and calculate Bookmarkd categories
      return rawData.map(book => {
        // Extract subjects safely
        let subjects = [];
        if (book.subject) {
          subjects = Array.isArray(book.subject) ? book.subject : [book.subject];
        }

        return {
          key: book.key,
          title: book.title,
          author: book.author_name ? book.author_name[0] : (book.authors && book.authors[0] ? book.authors[0].name : 'Unknown Author'),
          year: book.first_publish_year || 'Unknown Year',
          coverId: book.cover_i || book.cover_id || null, // subject API sometimes uses cover_id
          bookmarkdCategories: mapSubjectsToCategories(subjects),
        };
      });
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};
