import { BookMarked, User as UserIcon, LogOut, Bell, Compass, BookOpen, Layers, Users, Menu, Search } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

import UserSearch from './UserSearch';

const Navbar = ({ onOpenDrawer }) => {
  const { user, token, logout } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { data: initialNotifs } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      if (!token) return [];
      const res = await fetch('https://bookmarkd-8wed.onrender.com/api/social/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch notifications');
      return res.json();
    },
    enabled: !!token,
  });

  useEffect(() => {
    if (initialNotifs) {
      setNotifications(initialNotifs);
    }
  }, [initialNotifs]);

  useEffect(() => {
    if (socket) {
      socket.on('new_notification', (notif) => {
        setNotifications((prev) => [notif, ...prev]);
      });
      return () => {
        socket.off('new_notification');
      };
    }
  }, [socket]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navLinks = [
    { name: 'Home', path: '/', icon: BookOpen },
    { name: 'Explore', path: '/search', icon: Compass },
    { name: 'Clubs', path: '/clubs', icon: Users },
    ...(user ? [
      { name: 'My Library', path: '/profile', icon: BookMarked },
      { name: 'Lists', path: '/lists', icon: Layers },
    ] : [
      { name: 'My Library', path: '/profile', icon: BookMarked },
    ]),
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 h-16 z-40 transition-all duration-500 ${
      isScrolled 
        ? 'bg-[#F8F6F2]/80 backdrop-blur-xl border-b border-black/[0.06] shadow-sm' 
        : 'bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-[1500px] mx-auto h-full px-6 flex items-center justify-between">
        
        {/* LEFT: HAMBURGER + LOGO */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenDrawer}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-black/[0.08] flex items-center justify-center text-[#1D1D1F] shadow-sm transition-all hover:scale-105 active:scale-95"
            aria-label="Toggle menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-[#D4A65A]/15 border border-[#D4A65A]/30 flex items-center justify-center text-[#D4A65A] group-hover:scale-105 transition-transform">
              <BookMarked className="w-4 h-4 text-[#D4A65A]" />
            </div>
            <span className="font-serif text-2xl tracking-tight text-[#1D1D1F] font-semibold">
              Bookmarkd
            </span>
          </Link>
        </div>
        
        {/* CENTERED NAVIGATION PILLS */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-white/70 border border-black/[0.06] shadow-sm backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-5 py-1.5 text-xs font-medium tracking-wide transition-all duration-300 rounded-full flex items-center gap-2 ${
                  isActive ? 'text-[#1D1D1F] font-semibold' : 'text-[#666666] hover:text-[#1D1D1F]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavBg"
                    className="absolute inset-0 bg-[#D4A65A]/20 rounded-full border border-[#D4A65A]/30"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </div>

        {/* RIGHT SIDE: SEARCH + SIGN IN / USER PROFILE */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <UserSearch />
          </div>
          
          {user ? (
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifs(!showNotifs)}
                  className="relative p-2 text-[#666666] hover:text-[#1D1D1F] transition-colors rounded-full hover:bg-black/[0.04]"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D4A65A] rounded-full shadow-[0_0_8px_#D4A65A]"></span>
                  )}
                </button>

                <AnimatePresence>
                  {showNotifs && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-80 bg-white/95 backdrop-blur-2xl border border-black/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50 text-[#1D1D1F]"
                    >
                      <div className="p-4 border-b border-black/[0.06] flex justify-between items-center">
                        <h3 className="font-serif text-sm font-semibold">Notifications</h3>
                        {unreadCount > 0 && <span className="text-xs text-[#D4A65A] font-medium">{unreadCount} new</span>}
                      </div>
                      <div className="max-h-80 overflow-y-auto divide-y divide-black/[0.04]">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-[#666666] text-xs font-sans">No notifications yet.</div>
                        ) : (
                          notifications.map(n => (
                            <div key={n._id} className="p-3.5 hover:bg-black/[0.02] transition-colors cursor-pointer flex gap-3 items-center">
                              <div className="w-7 h-7 rounded-full bg-[#D4A65A]/10 flex-shrink-0 flex items-center justify-center text-[#D4A65A] text-xs font-bold border border-[#D4A65A]/20">
                                {n.type === 'like' ? '❤️' : '💬'}
                              </div>
                              <div className="text-xs">
                                <p className="text-[#1D1D1F]">
                                  <span className="font-semibold">{n.sender?.username || 'Someone'}</span>
                                  {n.type === 'like' ? ' liked your ' : ' replied to your '}
                                  {n.targetId ? 'activity' : 'review'}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Profile link */}
              <Link 
                to="/profile" 
                className="flex items-center gap-2 bg-white/80 hover:bg-white px-3 py-1.5 rounded-full transition-all border border-black/[0.08] shadow-sm"
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-5 h-5 rounded-full object-cover" />
                ) : (
                  <UserIcon className="w-3.5 h-3.5 text-[#D4A65A]" />
                )}
                <span className="text-xs font-medium text-[#1D1D1F] font-sans">{user.username}</span>
              </Link>

              {/* Logout */}
              <button 
                onClick={handleLogout}
                className="text-[#666666] hover:text-red-500 transition-colors p-2 rounded-full hover:bg-black/[0.04]"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="text-xs font-medium px-5 py-2 bg-[#D4A65A] hover:bg-[#C29549] text-white font-semibold rounded-full transition-all shadow-md shadow-[#D4A65A]/20 hover:scale-105 active:scale-95"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
