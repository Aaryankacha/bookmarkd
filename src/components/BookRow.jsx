import { useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BookCard from './BookCard';
import { BookRowSkeleton } from './LoadingSkeleton';
import { ErrorMessage } from './ErrorMessage';
import { useBooks } from '../hooks/useBooks';

const BookRow = ({ title, subtitle, category }) => {
  const navigate = useNavigate();
  const { data: books, isLoading, isError, error, refetch } = useBooks(category);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth + 100 : scrollLeft + clientWidth - 100;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleViewAll = () => {
    navigate(`/genre/${encodeURIComponent(category)}`);
  };

  return (
    <section className="py-8 my-6 bg-white/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-black/[0.05] shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1D1D1F] tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#666666] mt-1 font-sans">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleViewAll}
            className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-black/[0.08] bg-white/80 hover:bg-white text-xs font-semibold text-[#1D1D1F] hover:border-[#D4A65A]/50 transition-all shadow-sm"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4A65A] transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          <div className="flex gap-1.5">
            <button 
              onClick={() => scroll('left')}
              className="p-2 rounded-full bg-white/80 hover:bg-white border border-black/[0.08] transition-all text-[#666666] hover:text-[#1D1D1F] shadow-sm active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-2 rounded-full bg-white/80 hover:bg-white border border-black/[0.08] transition-all text-[#666666] hover:text-[#1D1D1F] shadow-sm active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        {isError ? (
          <div>
            <ErrorMessage message={error?.message} onRetry={() => refetch()} />
          </div>
        ) : (
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto hide-scrollbar pb-2 snap-x snap-mandatory"
          >
            {isLoading ? (
              <BookRowSkeleton />
            ) : (
              books?.map((book, idx) => (
                <div key={`${book.key}-${idx}`} className="snap-start">
                  <BookCard book={book} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default BookRow;
