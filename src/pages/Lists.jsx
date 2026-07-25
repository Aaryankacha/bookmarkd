import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Trash2, Layers, Sparkles, Loader2, BookOpen } from 'lucide-react';
import BookCard from '../components/BookCard';

const Lists = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const { data: lists, isLoading } = useQuery({
    queryKey: ['myLists'],
    queryFn: async () => {
      const res = await fetch('https://bookmarkd-8wed.onrender.com/api/lists', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch lists');
      return res.json();
    },
    enabled: !!token
  });

  const createList = useMutation({
    mutationFn: async (newList) => {
      const res = await fetch('https://bookmarkd-8wed.onrender.com/api/lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newList)
      });
      if (!res.ok) throw new Error('Failed to create list');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myLists']);
      setShowForm(false);
      setTitle('');
      setDescription('');
    }
  });

  const deleteList = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`https://bookmarkd-8wed.onrender.com/api/lists/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete list');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myLists']);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createList.mutate({ title, description });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] pt-28 pb-16 flex flex-col justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4A65A] mb-3" />
        <span className="text-xs font-semibold text-[#888888] uppercase tracking-widest font-sans">Loading Curated Lists...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2] pt-24 pb-16 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      
      {/* Background Editorial Mesh */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#D4A65A]/15 to-transparent blur-[120px] rounded-full pointer-events-none opacity-70" />
      <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-[#E2C799]/15 blur-[100px] rounded-full pointer-events-none opacity-60" />

      <div className="max-w-[1200px] mx-auto space-y-10 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-black/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A65A]/15 text-[#D4A65A] text-xs font-semibold uppercase tracking-wider mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>Custom Collections</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight">
              My Reading Lists
            </h1>
            <p className="text-xs sm:text-sm text-[#666666] font-sans mt-1">
              Organize books into custom thematic lists and personal recommendations.
            </p>
          </div>

          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#D4A65A] hover:bg-[#C29549] transition-all text-xs font-semibold text-white shadow-md shadow-[#D4A65A]/20 hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Create List
          </button>
        </div>

        {/* Creation Form */}
        {showForm && (
          <div className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-[28px] border border-black/[0.06] shadow-2xs space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#D4A65A]" />
              <h2 className="font-serif text-2xl font-semibold text-[#1D1D1F]">Create Custom List</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-semibold text-[#888888] uppercase tracking-wider mb-1.5 font-sans">
                  List Title
                </label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-[#FAF8F5] border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#D4A65A]/40 font-sans"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Favorite Historical Biographies, 2026 Reading Goals"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#888888] uppercase tracking-wider mb-1.5 font-sans">
                  Description (Optional)
                </label>
                <textarea 
                  className="w-full bg-[#FAF8F5] border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#D4A65A]/40 h-24 resize-none font-sans"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add context or notes about this collection..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="submit"
                  disabled={createList.isPending}
                  className="px-5 py-2 rounded-full bg-[#D4A65A] hover:bg-[#C29549] text-white text-xs font-semibold transition-all shadow-md shadow-[#D4A65A]/20"
                >
                  {createList.isPending ? 'Saving...' : 'Save List'}
                </button>
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-5 py-2 rounded-full text-xs font-semibold text-[#666666] hover:text-[#1D1D1F] hover:bg-black/[0.04] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lists Grid */}
        <div className="space-y-8">
          {lists?.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 px-4 bg-gradient-to-b from-white/60 to-white/30 backdrop-blur-md rounded-[28px] border border-dashed border-black/[0.1] shadow-2xs relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#D4A65A]/5 blur-3xl opacity-50" />
              <Layers className="w-10 h-10 text-[#D4A65A]/40 mx-auto mb-4 relative z-10" />
              <p className="font-serif text-2xl text-[#1D1D1F] relative z-10">You haven&apos;t created any lists yet</p>
              <p className="text-sm text-[#888888] font-sans mt-2 relative z-10">Click &quot;Create List&quot; above to organize your personal reading collections.</p>
            </motion.div>
          ) : (
            lists?.map(list => (
              <div key={list._id} className="bg-white/80 backdrop-blur-md rounded-[28px] border border-black/[0.06] p-6 sm:p-8 shadow-2xs space-y-6">
                <div className="flex justify-between items-start border-b border-black/[0.06] pb-4">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-[#1D1D1F]">{list.title}</h3>
                    {list.description && <p className="text-xs text-[#666666] font-sans mt-1">{list.description}</p>}
                  </div>
                  <button 
                    onClick={() => {
                      if(window.confirm('Are you sure you want to delete this list?')) {
                        deleteList.mutate(list._id);
                      }
                    }}
                    className="p-2 text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-full transition-colors"
                    title="Delete list"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                {list.books.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                    {list.books.map(book => (
                      <BookCard key={book.openLibraryId} book={{ key: book.openLibraryId, title: book.title, author: book.author, coverId: book.coverId }} />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 py-4 text-xs text-[#888888] font-sans italic">
                    <BookOpen className="w-4 h-4 text-[#D4A65A]" />
                    <span>No books added to this list yet. Browse titles and add them to this collection!</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default Lists;

