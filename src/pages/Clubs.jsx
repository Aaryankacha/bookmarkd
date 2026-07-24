import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Users, Plus, Search as SearchIcon, Loader2, Sparkles, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Clubs = () => {
  const { token, user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClubName, setNewClubName] = useState('');
  const [newClubDesc, setNewClubDesc] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: clubs, isLoading } = useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      const res = await fetch('https://bookmarkd-8wed.onrender.com/api/clubs');
      if (!res.ok) throw new Error('Failed to fetch clubs');
      return res.json();
    }
  });

  const filteredClubs = useMemo(() => {
    if (!clubs) return [];
    if (!searchQuery.trim()) return clubs;
    const q = searchQuery.toLowerCase();
    return clubs.filter(c => 
      c.name?.toLowerCase().includes(q) || 
      c.description?.toLowerCase().includes(q) ||
      c.owner?.username?.toLowerCase().includes(q)
    );
  }, [clubs, searchQuery]);

  const createMutation = useMutation({
    mutationFn: async (clubData) => {
      const res = await fetch('https://bookmarkd-8wed.onrender.com/api/clubs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(clubData)
      });
      if (!res.ok) throw new Error('Failed to create club');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['clubs']);
      setShowCreateModal(false);
      setNewClubName('');
      setNewClubDesc('');
    }
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newClubName.trim()) return;
    createMutation.mutate({ name: newClubName, description: newClubDesc });
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] pt-24 pb-16 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-[#D4A65A]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1200px] mx-auto space-y-10 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-black/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A65A]/15 text-[#D4A65A] text-xs font-semibold uppercase tracking-wider mb-3">
              <Users className="w-3.5 h-3.5" />
              <span>Literary Communities</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight">
              Book Clubs
            </h1>
            <p className="text-xs sm:text-sm text-[#666666] font-sans mt-1">
              Join interactive reading groups, discuss chapters, and share perspectives.
            </p>
          </div>

          {user && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4A65A] hover:bg-[#C29549] transition-all text-xs font-semibold text-white shadow-md shadow-[#D4A65A]/20 hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Create Club
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative max-w-xl">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search book clubs by title or organizer..." 
            className="w-full bg-white/80 backdrop-blur-md border border-black/[0.08] rounded-full py-2.5 pl-11 pr-4 text-xs sm:text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#D4A65A]/40 transition-colors shadow-2xs placeholder:text-[#888888]"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-20 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#D4A65A] mb-3" />
            <span className="text-xs font-semibold text-[#888888] uppercase tracking-widest font-sans">Loading Book Clubs...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs?.map((club) => (
              <Link key={club._id} to={`/clubs/${club._id}`}>
                <motion.div 
                  whileHover={{ y: -4 }}
                  className="bg-white/80 backdrop-blur-md p-6 rounded-[24px] border border-black/[0.06] shadow-2xs hover:shadow-md hover:border-[#D4A65A]/40 transition-all h-full flex flex-col cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-serif text-lg font-semibold text-[#1D1D1F] group-hover:text-[#D4A65A] transition-colors leading-snug">
                      {club.name}
                    </h3>
                    <div className="p-2 rounded-xl bg-[#FAF8F5] border border-black/[0.06] text-[#D4A65A]">
                      <BookOpen className="w-4 h-4" />
                    </div>
                  </div>

                  <p className="text-xs text-[#666666] line-clamp-3 flex-1 font-sans leading-relaxed">
                    {club.description || 'No description provided for this club.'}
                  </p>

                  <div className="flex items-center gap-2.5 mt-6 pt-4 border-t border-black/[0.04] text-xs text-[#888888]">
                    <div className="w-6 h-6 rounded-full bg-[#D4A65A]/15 flex items-center justify-center text-[10px] text-[#D4A65A] font-bold border border-[#D4A65A]/30">
                      {club.owner?.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-sans font-medium text-[#1D1D1F]">
                      Organized by <span className="text-[#D4A65A]">{club.owner?.username || 'Community Member'}</span>
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
            
            {filteredClubs?.length === 0 && (
              <div className="col-span-full text-center py-16 px-4 bg-white/50 rounded-2xl border border-dashed border-black/[0.08]">
                <Users className="w-10 h-10 text-[#D4A65A]/40 mx-auto mb-3" />
                <p className="font-serif text-lg text-[#1D1D1F]">No clubs match your query</p>
                <p className="text-xs text-[#888888] font-sans mt-1">Try a different search term or start your own book club.</p>
              </div>
            )}
          </div>
        )}

        {/* Create Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white/95 border border-black/[0.08] p-6 sm:p-8 rounded-[28px] w-full max-w-md shadow-2xl space-y-6"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#D4A65A]" />
                  <h2 className="font-serif text-2xl font-semibold text-[#1D1D1F]">Create Book Club</h2>
                </div>

                <form onSubmit={handleCreate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#888888] uppercase tracking-wider mb-1.5 font-sans">
                      Club Name
                    </label>
                    <input 
                      type="text" 
                      value={newClubName}
                      onChange={(e) => setNewClubName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#D4A65A]/40"
                      placeholder="e.g. Victorian Classics Circle"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#888888] uppercase tracking-wider mb-1.5 font-sans">
                      Description
                    </label>
                    <textarea 
                      value={newClubDesc}
                      onChange={(e) => setNewClubDesc(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#D4A65A]/40 h-28 resize-none font-sans"
                      placeholder="What themes, frequency, or books will this group cover?"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-black/[0.06]">
                    <button 
                      type="button" 
                      onClick={() => setShowCreateModal(false)}
                      className="px-5 py-2 rounded-full text-xs font-semibold text-[#666666] hover:text-[#1D1D1F] hover:bg-black/[0.04] transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      disabled={createMutation.isPending}
                      className="px-5 py-2 rounded-full bg-[#D4A65A] hover:bg-[#C29549] text-white text-xs font-semibold transition-all shadow-md shadow-[#D4A65A]/20 disabled:opacity-50"
                    >
                      {createMutation.isPending ? 'Creating...' : 'Create Club'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Clubs;

