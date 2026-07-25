import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchBooks } from '../services/api';
import BookCard from '../components/BookCard';
import { BookCardSkeleton } from '../components/LoadingSkeleton';
import { ErrorMessage } from '../components/ErrorMessage';
import { Search as SearchIcon, Sparkles, BookOpen, Filter } from 'lucide-react';
import { mapSubjectsToCategories } from '../utils/categoryMapper';
import { motion } from 'framer-motion';

const POPULAR_TAGS = ['Classics', 'Fantasy', 'Sci-Fi', 'Mystery', 'Romance', 'Dune', '1984', 'Tolkien'];

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const Search = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  const { data: books, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return [];
      const rawData = await searchBooks(debouncedQuery, 24);
      return rawData.map(book => {
        let subjects = [];
        if (book.subject) {
          subjects = Array.isArray(book.subject) ? book.subject : [book.subject];
        }
        return {
          key: book.key,
          title: book.title,
          author: book.author_name ? book.author_name[0] : (book.authors && book.authors[0] ? book.authors[0].name : 'Unknown Author'),
          year: book.first_publish_year || 'Unknown Year',
          coverId: book.cover_i || null,
          bookmarkdCategories: mapSubjectsToCategories(subjects),
        };
      });
    },
    enabled: debouncedQuery.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <div className="min-h-screen bg-[#F8F6F2] pt-24 pb-16 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      
      {/* Background Editorial Mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#D4A65A]/15 to-transparent blur-[140px] rounded-[100%] pointer-events-none opacity-80" />

      <div className="max-w-[1500px] mx-auto space-y-10 relative z-10">
        
        {/* Search Header Container */}
        <motion.div 
          className="max-w-3xl mx-auto text-center space-y-6 pt-4"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-black/[0.08] shadow-2xs text-[#D4A65A] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Universal Catalog Search</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-[#1D1D1F] tracking-tight">
            Discover your next <span className="italic text-[#D4A65A]">literary masterpiece</span>
          </h1>

          {/* Search Input Box */}
          <div className="relative max-w-2xl mx-auto">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999999]" />
            <input 
              type="text" 
              autoFocus
              placeholder="Search by title, author, key phrases, or genre..." 
              className="w-full bg-white/90 backdrop-blur-xl border border-black/[0.1] rounded-2xl py-4.5 pl-14 pr-12 text-base text-[#1D1D1F] placeholder:text-[#AAAAAA] focus:outline-none focus:ring-2 focus:ring-[#D4A65A]/40 focus:border-[#D4A65A] transition-all shadow-md shadow-black/[0.03]"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-1 rounded-md bg-black/5 hover:bg-black/10 text-[#666666] transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filter Tags */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
            <span className="text-xs text-[#888888] font-sans flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3 text-[#D4A65A]" />
              <span>Trending:</span>
            </span>
            {POPULAR_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all shadow-2xs ${
                  query === tag 
                    ? 'bg-[#D4A65A] text-white shadow-sm' 
                    : 'bg-white/80 hover:bg-white text-[#666666] hover:text-[#1D1D1F] border border-black/[0.06]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results / Empty States */}
        {!debouncedQuery ? (
          <motion.div 
            className="text-center py-20 px-4 bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-md rounded-[28px] border border-dashed border-black/[0.1] shadow-2xs relative overflow-hidden max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="absolute inset-0 bg-[#D4A65A]/5 blur-3xl opacity-50" />
            <div className="w-16 h-16 rounded-2xl bg-[#D4A65A]/10 border border-[#D4A65A]/20 flex items-center justify-center text-[#D4A65A] mx-auto mb-5 relative z-10">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl text-[#1D1D1F] font-semibold relative z-10">Ready to explore</h3>
            <p className="text-sm text-[#888888] max-w-md mx-auto font-sans mt-2 relative z-10">
              Type a book title, author, or click a popular tag above to search millions of books on Open Library.
            </p>
          </motion.div>
        ) : isError ? (
          <ErrorMessage message={error?.message} onRetry={() => refetch()} />
        ) : isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => <BookCardSkeleton key={i} />)}
          </div>
        ) : books && books.length > 0 ? (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between text-xs font-sans text-[#888888] pb-2 border-b border-black/[0.06]">
              <span>Showing search results for &quot;<strong className="text-[#1D1D1F]">{debouncedQuery}</strong>&quot;</span>
              <span>{books.length} books found</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {books.map((book, idx) => (
                <div key={`${book.key}-${idx}`} className="flex justify-center">
                  <BookCard book={book} />
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 px-4 bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-md rounded-[28px] border border-dashed border-black/[0.1] shadow-2xs relative overflow-hidden max-w-md mx-auto"
          >
            <div className="absolute inset-0 bg-[#D4A65A]/5 blur-3xl opacity-50" />
            <SearchIcon className="w-8 h-8 text-[#D4A65A]/40 mx-auto mb-4 relative z-10" />
            <p className="font-serif text-xl text-[#1D1D1F] relative z-10">No books found for &quot;{debouncedQuery}&quot;</p>
            <p className="text-sm text-[#888888] font-sans mt-2 relative z-10">Try checking for typos or searching with broader keywords.</p>
          </motion.div>
        )}

      </div>
    </div>
  );
};

export default Search;

