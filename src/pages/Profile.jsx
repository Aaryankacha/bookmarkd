import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, CheckCircle2, Bookmark, XCircle, User as UserIcon, Sparkles, BookMarked, Trophy } from 'lucide-react';
import BookCard from '../components/BookCard';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, token } = useAuth();

  const { data: progressList, isLoading } = useQuery({
    queryKey: ['myProgress'],
    queryFn: async () => {
      const res = await fetch('https://bookmarkd-8wed.onrender.com/api/progress', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch progress');
      return res.json();
    },
    enabled: !!token
  });

  if (isLoading) {
    return (
      <div className="min-h-screen pt-28 pb-12 px-6 max-w-6xl mx-auto flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#D4A65A]/30 border-t-[#D4A65A] rounded-full animate-spin mb-4" />
        <span className="text-xs font-semibold text-[#888888] tracking-widest uppercase font-sans">Opening your library...</span>
      </div>
    );
  }

  const reading = progressList?.filter(p => p.status === 'Reading') || [];
  const completed = progressList?.filter(p => p.status === 'Completed') || [];
  const wantToRead = progressList?.filter(p => p.status === 'Want to Read') || [];
  const dropped = progressList?.filter(p => p.status === 'Dropped') || [];

  const stats = [
    { label: 'Reading', value: reading.length, icon: BookOpen, color: 'text-[#D4A65A]', bg: 'bg-[#D4A65A]/10' },
    { label: 'Completed', value: completed.length, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Want to Read', value: wantToRead.length, icon: Bookmark, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Dropped', value: dropped.length, icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F2] pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* User Hero Header Card */}
        <motion.div 
          className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-[28px] border border-black/[0.06] shadow-sm relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4A65A]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between relative z-10">
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-[#FAF8F5] flex items-center justify-center border-2 border-[#D4A65A]/30 shadow-md shrink-0 relative group">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="w-12 h-12 text-[#D4A65A]" />
                )}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-sans">
                  Avatar
                </div>
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A65A]/15 border border-[#D4A65A]/30 text-[#D4A65A] text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curator & Bibliophile</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight">
                  {user.username}
                </h1>
                <p className="text-[#666666] text-sm sm:text-base max-w-xl font-sans leading-relaxed">
                  {user.bio || 'Book lover exploring literary worlds, sharing thoughts, and tracking reading adventures.'}
                </p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-black/[0.06]">
              {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="bg-[#FAF8F5] p-4 rounded-2xl border border-black/[0.05] text-center min-w-[100px] flex flex-col items-center justify-center hover:border-[#D4A65A]/40 transition-colors shadow-2xs">
                    <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} mb-2`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="font-serif text-2xl font-semibold text-[#1D1D1F]">{stat.value}</div>
                    <div className="text-[10px] text-[#888888] font-sans font-semibold uppercase tracking-wider mt-0.5">{stat.label}</div>
                  </div>
                );
              })}
            </div>

          </div>
        </motion.div>

        {/* Bookshelves Sections */}
        <div className="space-y-12">
          
          {/* Currently Reading */}
          <section className="bg-white/60 backdrop-blur-md p-4 sm:p-6 lg:p-8 rounded-[24px] border border-black/[0.05] shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-black/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#D4A65A]/15 flex items-center justify-center text-[#D4A65A]">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-[#1D1D1F]">Currently Reading</h2>
                  <p className="text-xs text-[#666666] font-sans">Active books on your nightstand</p>
                </div>
              </div>
              <span className="text-xs font-semibold font-sans px-3 py-1 bg-[#D4A65A]/10 text-[#D4A65A] rounded-full">
                {reading.length} {reading.length === 1 ? 'Book' : 'Books'}
              </span>
            </div>

            {reading.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
                {reading.map(p => (
                  <BookCard key={p._id} book={{ key: p.openLibraryId, title: p.title, author: p.author, coverId: p.coverId }} />
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-14 px-4 bg-gradient-to-b from-[#FAF8F5]/80 to-[#FAF8F5]/40 rounded-[24px] border border-dashed border-black/[0.1] shadow-2xs relative overflow-hidden flex flex-col items-center"
              >
                <div className="absolute inset-0 bg-[#D4A65A]/5 blur-2xl opacity-50 pointer-events-none" />
                <div className="w-16 h-16 rounded-2xl bg-[#D4A65A]/10 border border-[#D4A65A]/20 flex items-center justify-center text-[#D4A65A] mb-4 relative z-10 shadow-sm">
                  <BookOpen className="w-8 h-8" />
                </div>
                <p className="font-serif text-xl text-[#1D1D1F] font-medium relative z-10">No books currently in progress</p>
                <p className="text-sm text-[#888888] font-sans mt-2 max-w-sm relative z-10">Explore trending titles or search to add books to your reading shelf.</p>
              </motion.div>
            )}
          </section>

          {/* Want to Read */}
          <section className="bg-white/60 backdrop-blur-md p-4 sm:p-6 lg:p-8 rounded-[24px] border border-black/[0.05] shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-black/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600">
                  <Bookmark className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-[#1D1D1F]">To Read Wishlist</h2>
                  <p className="text-xs text-[#666666] font-sans">Saved stories waiting for your time</p>
                </div>
              </div>
              <span className="text-xs font-semibold font-sans px-3 py-1 bg-amber-50 text-amber-700 rounded-full">
                {wantToRead.length} {wantToRead.length === 1 ? 'Book' : 'Books'}
              </span>
            </div>

            {wantToRead.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
                {wantToRead.map(p => (
                  <BookCard key={p._id} book={{ key: p.openLibraryId, title: p.title, author: p.author, coverId: p.coverId }} />
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-14 px-4 bg-gradient-to-b from-amber-50/60 to-[#FAF8F5]/40 rounded-[24px] border border-dashed border-amber-600/10 shadow-2xs relative overflow-hidden flex flex-col items-center"
              >
                <div className="absolute inset-0 bg-amber-500/5 blur-2xl opacity-50 pointer-events-none" />
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 mb-4 relative z-10 shadow-sm">
                  <Bookmark className="w-8 h-8" />
                </div>
                <p className="font-serif text-xl text-[#1D1D1F] font-medium relative z-10">Your wishlist is empty</p>
                <p className="text-sm text-[#888888] font-sans mt-2 max-w-sm relative z-10">Bookmark books from any catalog to save them for later.</p>
              </motion.div>
            )}
          </section>

          {/* Completed Books */}
          <section className="bg-white/60 backdrop-blur-md p-4 sm:p-6 lg:p-8 rounded-[24px] border border-black/[0.05] shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-black/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-600">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-[#1D1D1F]">Completed Shelf</h2>
                  <p className="text-xs text-[#666666] font-sans">Finished literary journeys</p>
                </div>
              </div>
              <span className="text-xs font-semibold font-sans px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full">
                {completed.length} {completed.length === 1 ? 'Book' : 'Books'}
              </span>
            </div>

            {completed.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
                {completed.map(p => (
                  <BookCard key={p._id} book={{ key: p.openLibraryId, title: p.title, author: p.author, coverId: p.coverId }} />
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-14 px-4 bg-gradient-to-b from-emerald-50/60 to-[#FAF8F5]/40 rounded-[24px] border border-dashed border-emerald-600/10 shadow-2xs relative overflow-hidden flex flex-col items-center"
              >
                <div className="absolute inset-0 bg-emerald-500/5 blur-2xl opacity-50 pointer-events-none" />
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 mb-4 relative z-10 shadow-sm">
                  <Trophy className="w-8 h-8" />
                </div>
                <p className="font-serif text-xl text-[#1D1D1F] font-medium relative z-10">No completed books logged yet</p>
                <p className="text-sm text-[#888888] font-sans mt-2 max-w-sm relative z-10">Mark books as completed as you finish reading.</p>
              </motion.div>
            )}
          </section>

        </div>

      </div>
    </div>
  );
};

export default Profile;

