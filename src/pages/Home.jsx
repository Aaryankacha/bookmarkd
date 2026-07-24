import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import Hero from '../components/Hero';
import GenreGrid from '../components/GenreGrid';
import BookRow from '../components/BookRow';
import { Search, Activity, Star } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';

const Home = () => {
  const [searchParams] = useSearchParams();
  const activeGenre = searchParams.get('genre');
  const { socket } = useSocket();
  const [activities, setActivities] = useState([]);
  const [feedFilter, setFeedFilter] = useState('all');

  // Fetch initial activity feed
  const { data: initialActivities } = useQuery({
    queryKey: ['activityFeed', feedFilter],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`https://bookmarkd-8wed.onrender.com/api/social/activity?filter=${feedFilter}`, { headers });
      if (!res.ok) throw new Error('Failed to fetch activity');
      return res.json();
    }
  });

  useEffect(() => {
    if (initialActivities) {
      setActivities(initialActivities);
    }
  }, [initialActivities]);

  useEffect(() => {
    if (socket) {
      socket.on('new_activity', (activity) => {
        setActivities(prev => [activity, ...prev].slice(0, 50));
      });
      return () => {
        socket.off('new_activity');
      };
    }
  }, [socket]);

  return (
    <div className="w-full relative min-h-screen bg-[#F8F6F2] text-[#1D1D1F] selection:bg-[#D4A65A]/20">
      
      {/* Background warm ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1500px] h-[700px] bg-ambient-warm pointer-events-none z-0 opacity-80" />

      <AnimatePresence mode="wait">
        {!activeGenre ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
          >
            <Hero />

            <div className="max-w-[1500px] mx-auto px-6 sm:px-8 lg:px-12 py-8 flex flex-col xl:flex-row gap-12">
              
              {/* BOOK CAROUSELS MAIN CONTENT */}
              <div className="flex-1 space-y-10">
                <BookRow 
                  title="Trending Now" 
                  subtitle="Most discussed and tracked literature across Bookmarkd" 
                  category="trending" 
                />
                <BookRow 
                  title="Fantasy & Mythology" 
                  subtitle="Immersive worlds, epic sagas, and mystical realms" 
                  category="fantasy" 
                />
                <BookRow 
                  title="Science Fiction" 
                  subtitle="Futuristic visions, space exploration, and speculative worlds" 
                  category="science_fiction" 
                />
                <BookRow 
                  title="Mystery & Thriller" 
                  subtitle="Gripping detective tales and psychological suspense" 
                  category="mystery" 
                />
                <BookRow 
                  title="Literary Romance" 
                  subtitle="Heartfelt journeys and timeless love stories" 
                  category="romance" 
                />
                <BookRow 
                  title="Business & Leadership" 
                  subtitle="Strategies, economics, and entrepreneurial insights" 
                  category="business" 
                />
                <BookRow 
                  title="Software & Technology" 
                  subtitle="Architecture, coding craftsmanship, and innovation" 
                  category="programming" 
                />
                <BookRow 
                  title="Timeless Classics" 
                  subtitle="Enduring masterpieces that shaped human thought" 
                  category="classics" 
                />
                <BookRow 
                  title="Philosophy & Personal Growth" 
                  subtitle="Reflections on life, wisdom, and self-mastery" 
                  category="self_help" 
                />
              </div>

              {/* ACTIVITY FEED SIDEBAR */}
              <div className="w-full xl:w-80 flex-shrink-0">
                <div className="bg-white/80 rounded-3xl border border-black/[0.06] p-6 backdrop-blur-2xl sticky top-24 shadow-lg shadow-black/[0.02]">
                  
                  <div className="flex items-center justify-between mb-5 pb-4 border-b border-black/[0.06]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#D4A65A]/15 border border-[#D4A65A]/30 flex items-center justify-center text-[#D4A65A]">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-serif text-base font-semibold text-[#1D1D1F]">Live Activity</h3>
                        <p className="text-[11px] text-[#666666] font-sans">Real-time reader updates</p>
                      </div>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-[#D4A65A] shadow-[0_0_8px_#D4A65A] animate-pulse"></span>
                  </div>

                  {/* Filter tabs */}
                  <div className="flex items-center gap-1 mb-5 bg-[#F0ECE1]/60 p-1 rounded-xl border border-black/[0.04]">
                    <button 
                      onClick={() => setFeedFilter('all')}
                      className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-all ${
                        feedFilter === 'all' 
                          ? 'bg-white text-[#1D1D1F] shadow-sm font-semibold border border-black/[0.06]' 
                          : 'text-[#666666] hover:text-[#1D1D1F]'
                      }`}
                    >
                      Global
                    </button>
                    <button 
                      onClick={() => setFeedFilter('friends')}
                      className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-all ${
                        feedFilter === 'friends' 
                          ? 'bg-white text-[#1D1D1F] shadow-sm font-semibold border border-black/[0.06]' 
                          : 'text-[#666666] hover:text-[#1D1D1F]'
                      }`}
                    >
                      Friends
                    </button>
                    <button 
                      onClick={() => setFeedFilter('following')}
                      className={`flex-1 text-xs py-1.5 rounded-lg font-medium transition-all ${
                        feedFilter === 'following' 
                          ? 'bg-white text-[#1D1D1F] shadow-sm font-semibold border border-black/[0.06]' 
                          : 'text-[#666666] hover:text-[#1D1D1F]'
                      }`}
                    >
                      Following
                    </button>
                  </div>

                  {/* Activity Items */}
                  <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1 hide-scrollbar">
                    <AnimatePresence>
                      {activities.length === 0 ? (
                        <p className="text-xs text-[#666666] italic text-center py-8 font-sans">No recent activity found.</p>
                      ) : (
                        activities.map((activity) => (
                          <motion.div
                            key={activity._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/90 p-4 rounded-2xl border border-black/[0.05] hover:border-black/[0.1] transition-all text-xs font-sans space-y-2 shadow-sm"
                          >
                            <div className="flex items-center gap-2.5">
                              {activity.user?.avatar ? (
                                <img src={activity.user.avatar} className="w-6 h-6 rounded-full object-cover ring-1 ring-black/10" alt="avatar" />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-[#D4A65A]/20 flex items-center justify-center text-[10px] font-bold text-[#D4A65A] border border-[#D4A65A]/30">
                                  {activity.user?.username?.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <span className="font-semibold text-[#1D1D1F] truncate max-w-[120px]">{activity.user?.username}</span>
                              <span className="text-[#888888] text-[10px] ml-auto">
                                {formatDistanceToNow(new Date(activity.createdAt))} ago
                              </span>
                            </div>

                            <p className="text-[#666666] leading-relaxed">
                              {activity.action === 'reviewed' && 'reviewed '}
                              {activity.action === 'commented' && 'commented on '}
                              {activity.action === 'liked' && 'liked a post for '}
                              {activity.action === 'started_reading' && 'started reading '}
                              {activity.action === 'followed' && 'followed '}
                              {activity.action === 'became_friends' && 'became friends with '}
                              
                              {(activity.action === 'followed' || activity.action === 'became_friends') ? (
                                <span className="text-[#D4A65A] font-medium">{activity.targetId?.username}</span>
                              ) : (
                                <span className="text-[#D4A65A] font-serif font-medium italic">&quot;{activity.bookTitle}&quot;</span>
                              )}
                            </p>

                            {activity.action === 'reviewed' && activity.meta?.rating && (
                              <div className="flex items-center gap-1 text-[#D4A65A] pt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-3 h-3 ${i < activity.meta.rating ? 'fill-[#D4A65A] text-[#D4A65A]' : 'text-black/10'}`} 
                                  />
                                ))}
                              </div>
                            )}
                          </motion.div>
                        ))
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </div>

            </div>
          </motion.div>
        ) : (
          <motion.div
            key="genre-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="max-w-[1500px] mx-auto px-6 py-12 relative z-10"
          >
            <div className="flex items-center gap-4 mb-10 pb-6 border-b border-black/[0.06]">
              <div className="w-12 h-12 rounded-2xl bg-[#D4A65A]/15 border border-[#D4A65A]/30 flex items-center justify-center text-[#D4A65A]">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-serif text-3xl font-semibold text-[#1D1D1F] capitalize">{activeGenre.replace('_', ' ')}</h1>
                <p className="text-[#666666] text-sm font-sans mt-1">Explore curated titles and community reviews in this category</p>
              </div>
            </div>
            
            <GenreGrid genre={activeGenre} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
