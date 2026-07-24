import { NavLink } from 'react-router-dom';
import { Users, Compass, Bookmark, Flame, Sparkles, Feather, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const genres = [
  'Fantasy', 'Sci-Fi', 'Mystery', 'Thriller', 'Romance', 
  'Horror', 'Historical', 'Classics', 'Biography', 
  'Philosophy', 'Self Help', 'Business', 'Programming', 
  'Manga', 'Comics'
];

const discoverLinks = [
  { name: 'Home Feed', path: '/', icon: Flame },
  { name: 'Discover', path: '/search', icon: Compass },
  { name: 'Book Clubs', path: '/clubs', icon: Users },
  { name: 'My Library', path: '/profile', icon: Bookmark },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-[#F8F6F2]/95 backdrop-blur-2xl border-r border-black/[0.08] p-6 z-50 overflow-y-auto hide-scrollbar shadow-2xl"
          >
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-black/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#D4A65A]/15 border border-[#D4A65A]/30 flex items-center justify-center text-[#D4A65A]">
                  <Feather className="w-4 h-4" />
                </div>
                <span className="font-serif text-xl font-semibold text-[#1D1D1F]">Navigation</span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-black/5 text-[#666666] hover:text-[#1D1D1F] transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-8 pb-12">
              {/* Discover Links */}
              <div>
                <h3 className="text-[11px] font-semibold text-[#666666] uppercase tracking-widest font-sans mb-3 px-3">
                  Quick Access
                </h3>
                <ul className="space-y-1">
                  {discoverLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <li key={link.name}>
                        <NavLink 
                          to={link.path}
                          onClick={onClose}
                          className={({ isActive }) => `relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                            isActive 
                              ? 'text-[#1D1D1F] bg-white shadow-sm border border-black/[0.06] font-semibold' 
                              : 'text-[#666666] hover:text-[#1D1D1F] hover:bg-black/[0.03]'
                          }`}
                        >
                          <Icon className="w-4 h-4 text-[#D4A65A]" />
                          <span>{link.name}</span>
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Genres Section */}
              <div>
                <div className="flex items-center gap-2 mb-3 px-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4A65A]" />
                  <h3 className="text-[11px] font-semibold text-[#666666] uppercase tracking-widest font-sans">
                    Explore Genres
                  </h3>
                </div>
                <ul className="space-y-1">
                  {genres.map((genre) => {
                    const toPath = `/genre/${genre}`;
                    return (
                      <li key={genre}>
                        <NavLink 
                          to={toPath}
                          onClick={onClose}
                          className={({ isActive }) => `flex items-center justify-between px-3.5 py-2 rounded-xl text-xs transition-all ${
                            isActive 
                              ? 'text-[#D4A65A] font-semibold font-serif text-sm bg-[#D4A65A]/10 border border-[#D4A65A]/20' 
                              : 'text-[#666666] hover:text-[#1D1D1F] hover:bg-black/[0.03]'
                          }`}
                        >
                          <span>{genre}</span>
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;
