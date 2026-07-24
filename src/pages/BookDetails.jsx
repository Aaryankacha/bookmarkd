import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBookDetails, getCoverUrl } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { BookOpen, Calendar, Layers, Loader2, Star, MessageSquare, Heart, Sparkles, User as UserIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const BookDetails = () => {
  const { id } = useParams();
  const openLibraryId = id; // use just ID for the room
  const fullId = `/works/${id}`;
  const { user, token } = useAuth();
  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();
  
  const [status, setStatus] = useState('');
  const [readersCount, setReadersCount] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  const { data: book, isLoading, isError } = useQuery({
    queryKey: ['book', fullId],
    queryFn: () => getBookDetails(fullId),
    staleTime: 1000 * 60 * 30, // 30 mins
  });

  const { data: progress } = useQuery({
    queryKey: ['progress', fullId],
    queryFn: async () => {
      if (!token) return null;
      const res = await fetch('https://bookmarkd-8wed.onrender.com/api/progress', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch progress');
      const allProgress = await res.json();
      return allProgress.find(p => p.openLibraryId === id) || null;
    },
    enabled: !!token,
  });

  const { data: reviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: async () => {
      const res = await fetch(`https://bookmarkd-8wed.onrender.com/api/social/reviews/${id}`);
      if (!res.ok) throw new Error('Failed to fetch reviews');
      return res.json();
    }
  });

  useEffect(() => {
    if (progress) {
      setStatus(progress.status);
    }
  }, [progress]);

  // Socket setup for this book
  useEffect(() => {
    if (socket && isConnected) {
      socket.emit('join_book_room', openLibraryId);

      socket.on('room_presence_update', (data) => {
        if (data.openLibraryId === openLibraryId) {
          setReadersCount(data.readersCount);
        }
      });

      socket.on('new_review', (newReview) => {
        queryClient.setQueryData(['reviews', id], (old) => {
          return [newReview, ...(old || [])];
        });
      });

      socket.on('like_updated', (data) => {
        if (data.targetType === 'Review') {
          queryClient.setQueryData(['reviews', id], (old) => {
            if (!old) return old;
            return old.map(r => r._id === data.targetId ? { ...r, likesCount: data.likesCount } : r);
          });
        }
      });

      return () => {
        socket.emit('leave_book_room', openLibraryId);
        socket.off('room_presence_update');
        socket.off('new_review');
        socket.off('like_updated');
      };
    }
  }, [socket, isConnected, openLibraryId, id, queryClient]);

  const updateProgress = useMutation({
    mutationFn: async (newStatus) => {
      const res = await fetch(`https://bookmarkd-8wed.onrender.com/api/progress/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus,
          title: book?.title,
          author: book?.authorName,
          coverId: book?.covers?.[0] || null
        })
      });
      if (!res.ok) throw new Error('Failed to update progress');
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['progress', fullId], data);
      setStatus(data.status);
    }
  });

  const submitReview = () => {
    if (!reviewText.trim() || !user || !socket) return;
    socket.emit('submit_review', {
      openLibraryId: id,
      rating: reviewRating,
      text: reviewText,
      bookTitle: book.title
    }, (response) => {
      if (response?.status === 'ok') {
        setReviewText('');
        setReviewRating(5);
      }
    });
  };

  const handleLike = (reviewId) => {
    if (!user || !socket) return;
    socket.emit('toggle_like', {
      targetId: reviewId,
      targetType: 'Review',
      openLibraryId: id,
      bookTitle: book.title
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] pt-28 pb-16 flex flex-col justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4A65A] mb-3" />
        <span className="text-xs font-semibold text-[#888888] uppercase tracking-widest font-sans">Fetching Editorial Details...</span>
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] pt-28 pb-16 flex flex-col justify-center items-center text-center px-4">
        <BookOpen className="w-12 h-12 text-[#D4A65A]/40 mb-3" />
        <h2 className="font-serif text-2xl font-semibold text-[#1D1D1F]">Book details unavailable</h2>
        <p className="text-xs text-[#888888] font-sans mt-1">We couldn&apos;t load details for this title at the moment.</p>
      </div>
    );
  }

  const coverUrl = getCoverUrl(book.covers?.[0], 'L');

  return (
    <div className="min-h-screen bg-[#F8F6F2] pt-24 pb-16 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-[#D4A65A]/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Presence Indicator */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {readersCount > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white/90 backdrop-blur-md border border-black/[0.08] shadow-lg px-4 py-2 rounded-full flex items-center gap-2 text-[#1D1D1F]"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-semibold font-sans">{readersCount} reader{readersCount !== 1 && 's'} reading now</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Main Book Overview Grid */}
        <div className="flex flex-col md:flex-row gap-10 lg:gap-14 items-start">
          
          {/* Cover Column */}
          <div className="w-full md:w-80 shrink-0">
            <div className="bg-white p-3 rounded-[28px] border border-black/[0.08] shadow-lg shadow-black/[0.04] sticky top-24">
              <div className="rounded-[20px] overflow-hidden aspect-[2/3] bg-[#FAF8F5] relative group">
                {coverUrl ? (
                  <img src={coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <BookOpen className="w-10 h-10 text-[#D4A65A] mb-2" />
                    <span className="font-serif text-sm font-semibold text-[#1D1D1F]">{book.title}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Book Info Column */}
          <div className="flex-1 space-y-8">
            
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A65A]/15 text-[#D4A65A] text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Literary Work</span>
              </div>
              <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-[#1D1D1F] tracking-tight leading-tight">
                {book.title}
              </h1>
              <p className="font-sans text-lg font-medium text-[#D4A65A]">
                By {book.authorName || 'Unknown Author'}
              </p>
            </div>

            {/* Reading Status Selector */}
            {user && (
              <div className="p-5 bg-white/80 backdrop-blur-md rounded-2xl border border-black/[0.06] shadow-2xs space-y-3">
                <span className="text-xs font-semibold text-[#888888] uppercase tracking-wider block font-sans">
                  My Reading Status
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {['Want to Read', 'Reading', 'Completed', 'Dropped'].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateProgress.mutate(s)}
                      disabled={updateProgress.isPending}
                      className={clsx(
                        "px-4 py-2 rounded-full text-xs font-semibold font-sans transition-all shadow-2xs",
                        status === s 
                          ? "bg-[#D4A65A] text-white shadow-sm" 
                          : "bg-[#FAF8F5] hover:bg-white text-[#666666] hover:text-[#1D1D1F] border border-black/[0.06]"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-white/80 p-4 rounded-2xl border border-black/[0.06] shadow-2xs">
                <Calendar className="w-4 h-4 text-[#D4A65A] mb-1.5" />
                <p className="text-[10px] text-[#888888] font-sans uppercase tracking-wider font-semibold">First Published</p>
                <p className="font-serif font-semibold text-base text-[#1D1D1F] mt-0.5">{book.first_publish_date || 'N/A'}</p>
              </div>
              <div className="bg-white/80 p-4 rounded-2xl border border-black/[0.06] shadow-2xs">
                <Layers className="w-4 h-4 text-[#D4A65A] mb-1.5" />
                <p className="text-[10px] text-[#888888] font-sans uppercase tracking-wider font-semibold">Catalog Editions</p>
                <p className="font-serif font-semibold text-base text-[#1D1D1F] mt-0.5">{book.edition_count || 1}</p>
              </div>
            </div>

            {/* Synopsis Description */}
            {book.description && (
              <div className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-[24px] border border-black/[0.06] shadow-2xs space-y-3">
                <h3 className="font-serif text-xl font-semibold text-[#1D1D1F]">Synopsis</h3>
                <p className="text-[#666666] text-sm sm:text-base leading-relaxed font-sans whitespace-pre-line">
                  {typeof book.description === 'string' ? book.description : book.description.value}
                </p>
              </div>
            )}

            {/* Subject Tags */}
            {book.subjects && book.subjects.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-serif text-lg font-semibold text-[#1D1D1F]">Genres & Themes</h3>
                <div className="flex flex-wrap gap-2">
                  {book.subjects.slice(0, 10).map((subject, idx) => (
                    <span key={idx} className="px-3.5 py-1.5 bg-white/80 rounded-full text-xs font-medium text-[#666666] border border-black/[0.06] shadow-2xs">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* REVIEWS SECTION */}
        <div className="pt-10 border-t border-black/[0.08] space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-3xl font-semibold text-[#1D1D1F]">Community Reviews</h3>
              <p className="text-xs text-[#666666] font-sans mt-0.5">Thoughts and ratings from readers</p>
            </div>
            <span className="text-xs font-semibold px-3.5 py-1.5 bg-white border border-black/[0.06] rounded-full text-[#D4A65A] shadow-2xs">
              {reviews?.length || 0} {reviews?.length === 1 ? 'Review' : 'Reviews'}
            </span>
          </div>
          
          {user && (
            <div className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-[24px] border border-black/[0.06] shadow-2xs space-y-4">
              <h4 className="font-serif text-lg font-semibold text-[#1D1D1F]">Write Your Review</h4>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    onClick={() => setReviewRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star className={clsx("w-6 h-6", star <= reviewRating ? "fill-[#D4A65A] text-[#D4A65A]" : "text-[#CCCCCC]")} />
                  </button>
                ))}
              </div>
              <textarea 
                className="w-full bg-[#FAF8F5] border border-black/[0.08] rounded-xl px-4 py-3 text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#D4A65A]/40 resize-none h-28 font-sans placeholder:text-[#AAAAAA]"
                placeholder="Share your thoughts on this book..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <button 
                onClick={submitReview}
                disabled={!reviewText.trim()}
                className="bg-[#D4A65A] hover:bg-[#C29549] text-white px-6 py-2.5 rounded-full font-semibold text-xs transition-all shadow-md shadow-[#D4A65A]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Publish Review
              </button>
            </div>
          )}

          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {!reviews || reviews.length === 0 ? (
                <div className="text-center py-12 px-4 bg-white/50 rounded-2xl border border-dashed border-black/[0.08]">
                  <p className="font-serif text-lg text-[#1D1D1F]">No reviews written yet</p>
                  <p className="text-xs text-[#888888] font-sans mt-1">Be the first to share your thoughts with the community!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <motion.div 
                    key={review._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 p-6 rounded-2xl border border-black/[0.06] shadow-2xs space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FAF8F5] border border-black/[0.08] overflow-hidden flex items-center justify-center text-[#D4A65A]">
                          {review.user?.avatar ? (
                            <img src={review.user.avatar} alt="avatar" className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-5 h-5 text-[#D4A65A]" />
                          )}
                        </div>
                        <div>
                          <p className="font-serif font-semibold text-sm text-[#1D1D1F]">{review.user?.username || 'Reader'}</p>
                          <p className="text-[11px] text-[#888888] font-sans">
                            {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={clsx("w-4 h-4", i < review.rating ? "fill-[#D4A65A] text-[#D4A65A]" : "text-[#E0E0E0]")} />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-[#1D1D1F] text-sm leading-relaxed font-sans whitespace-pre-line">{review.text}</p>
                    
                    <div className="flex items-center gap-6 border-t border-black/[0.04] pt-3">
                      <button 
                        onClick={() => handleLike(review._id)}
                        className="flex items-center gap-1.5 text-xs text-[#888888] hover:text-rose-500 transition-colors font-medium"
                      >
                        <Heart className="w-4 h-4" />
                        <span>{review.likesCount || 0}</span>
                      </button>
                      <div className="flex items-center gap-1.5 text-xs text-[#888888] font-medium">
                        <MessageSquare className="w-4 h-4" />
                        <span>{review.commentsCount || 0}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
};

export default BookDetails;

