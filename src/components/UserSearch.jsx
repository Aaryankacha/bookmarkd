import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const UserSearch = () => {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`https://bookmarkd-8wed.onrender.com/api/users/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsOpen(false);
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div ref={wrapperRef} className="relative hidden sm:block group">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted group-hover:text-primary transition-colors" />
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search books, users..."
        className="w-64 bg-white/80 border border-black/[0.08] rounded-full py-1.5 pl-10 pr-4 text-xs text-[#1D1D1F] focus:outline-none focus:border-[#D4A65A] focus:bg-white transition-all placeholder:text-[#999999] shadow-sm"
      />

      <AnimatePresence>
        {isOpen && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-2 w-full bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-2xl shadow-xl overflow-hidden z-50 text-[#1D1D1F]"
          >
            {isLoading ? (
              <div className="p-4 flex justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-[#D4A65A]" />
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {users.length > 0 && (
                  <div className="p-2">
                    <h4 className="text-xs font-semibold text-[#666666] uppercase tracking-wider px-2 py-1 mb-1">Users</h4>
                    {users.map(u => (
                      <Link 
                        key={u._id} 
                        to={`/u/${u.username}`}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 p-2 hover:bg-black/[0.03] rounded-xl transition-colors"
                      >
                        {u.avatar ? (
                          <img src={u.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#D4A65A]/20 flex items-center justify-center text-[#D4A65A] text-xs font-bold">
                            {u.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-[#1D1D1F]">{u.username}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                <div className="p-2 border-t border-black/[0.04]">
                   <button 
                     onClick={() => {
                        setIsOpen(false);
                        navigate(`/search?q=${encodeURIComponent(query)}`);
                     }}
                     className="w-full text-left px-2 py-2 text-xs text-[#D4A65A] hover:bg-[#D4A65A]/10 rounded-xl transition-colors font-medium"
                   >
                     Search all books for &quot;{query}&quot;
                   </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserSearch;
