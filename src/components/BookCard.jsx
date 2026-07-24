import { motion } from 'framer-motion';
import { getCoverUrl } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Bookmark, CheckCircle2, ListPlus, Star } from 'lucide-react';

const BookCard = ({ book }) => {
  const coverUrl = getCoverUrl(book.coverId, 'M');
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const queryClient = useQueryClient();

  const id = book.key?.replace('/works/', '') || book.key;

  const updateProgress = useMutation({
    mutationFn: async (status) => {
      const res = await fetch(`/api/progress/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          title: book.title,
          author: book.author,
          coverId: book.coverId
        })
      });
      if (!res.ok) throw new Error('Failed to update progress');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myProgress']);
      queryClient.invalidateQueries(['progress', `/works/${id}`]);
    }
  });

  const handleAction = (e, status) => {
    e.stopPropagation();
    if (!user) return navigate('/login');
    updateProgress.mutate(status);
  };

  const handleCardClick = () => {
    navigate(`/book/${id}`);
  };

  // Mock a rating if none provided
  const rating = book.rating || (4.2 + (Math.abs(book.title?.length || 5) % 8) * 0.1).toFixed(1);

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="flex-none w-[180px] group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="w-full h-[260px] bg-white rounded-2xl overflow-hidden mb-3 relative shadow-md shadow-black/[0.04] border border-black/[0.06] group-hover:border-[#D4A65A]/50 group-hover:shadow-xl group-hover:shadow-[#D4A65A]/15 transition-all duration-500">
        {coverUrl ? (
          <img 
            src={coverUrl} 
            alt={book.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-white via-[#F8F6F2] to-[#EFECE6] flex flex-col items-center justify-center p-5 text-center border-t border-black/[0.06]">
            <span className="font-serif text-sm font-semibold text-[#1D1D1F] line-clamp-3 leading-snug">{book.title}</span>
            <span className="text-[11px] text-[#666666] mt-2 font-sans">{book.author}</span>
          </div>
        )}

        {/* Hover overlay & quick action buttons */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5">
          <div className="flex justify-end gap-1.5 translate-y-[-10px] group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button 
              onClick={(e) => handleAction(e, 'Want to Read')}
              className="p-2 bg-white/90 hover:bg-[#D4A65A] text-[#1D1D1F] hover:text-white rounded-xl backdrop-blur-md transition-all border border-black/[0.1] shadow-lg"
              title="Want to Read"
            >
              <Bookmark className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={(e) => handleAction(e, 'Completed')}
              className="p-2 bg-white/90 hover:bg-emerald-600 text-[#1D1D1F] hover:text-white rounded-xl backdrop-blur-md transition-all border border-black/[0.1] shadow-lg"
              title="Mark Completed"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if(!user) return navigate('/login');
                navigate('/lists');
              }}
              className="p-2 bg-white/90 hover:bg-[#7C5C38] text-[#1D1D1F] hover:text-white rounded-xl backdrop-blur-md transition-all border border-black/[0.1] shadow-lg"
              title="Add to List"
            >
              <ListPlus className="w-3.5 h-3.5" />
            </button>
          </div>
          
          {book.bookmarkdCategories && book.bookmarkdCategories.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto translate-y-[10px] group-hover:translate-y-0 transition-all duration-300">
              {book.bookmarkdCategories.slice(0, 2).map(cat => (
                <span key={cat} className="text-[9px] font-sans font-semibold tracking-wider uppercase px-2 py-0.5 bg-[#D4A65A] text-white rounded-md shadow-sm">
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="px-1 space-y-0.5">
        <h4 className="font-serif text-sm font-semibold text-[#1D1D1F] truncate group-hover:text-[#D4A65A] transition-colors" title={book.title}>
          {book.title}
        </h4>
        <p className="text-xs text-[#666666] truncate font-sans" title={book.author}>
          {book.author}
        </p>
        <div className="flex items-center justify-between text-[11px] text-[#888888] pt-0.5 font-sans">
          <span>{book.year || 'Classic'}</span>
          <div className="flex items-center gap-1 text-[#D4A65A]">
            <Star className="w-3 h-3 fill-[#D4A65A] text-[#D4A65A]" />
            <span className="font-semibold text-[#1D1D1F] text-[11px]">{rating}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookCard;
