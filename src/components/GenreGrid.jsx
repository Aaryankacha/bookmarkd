import { useBooks } from '../hooks/useBooks';
import BookCard from './BookCard';
import { BookCardSkeleton } from './LoadingSkeleton';
import { ErrorMessage } from './ErrorMessage';
import { motion } from 'framer-motion';

const GenreGrid = ({ genre }) => {
  const { data: books, isLoading, isError, error, refetch } = useBooks(genre);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="py-8 px-6"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-text tracking-tight">{genre} Books</h2>
        <p className="text-textMuted mt-2">Explore top books in the {genre} category.</p>
      </div>

      {isError ? (
        <ErrorMessage message={error?.message} onRetry={() => refetch()} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {isLoading ? (
            [...Array(12)].map((_, i) => <BookCardSkeleton key={i} />)
          ) : (
            books?.map((book, idx) => (
              <div key={`${book.key}-${idx}`} className="flex justify-center">
                <BookCard book={book} />
              </div>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
};

export default GenreGrid;
