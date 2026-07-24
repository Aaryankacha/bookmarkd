import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Send, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LiveSession = () => {
  const { sessionId } = useParams();
  const { socket } = useSocket();
  const { user } = useAuth();
  
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [page, setPage] = useState(0);
  const [partnerPage, setPartnerPage] = useState(0);
  const [emojis, setEmojis] = useState([]);

  useEffect(() => {
    setSession({ id: sessionId, title: "Reading Session" });
  }, [sessionId]);

  useEffect(() => {
    if (socket && session) {
      socket.emit('join_session', sessionId);

      socket.on('session_page_updated', (data) => {
        if (data.userId !== user?._id) {
          setPartnerPage(data.page);
        }
      });

      socket.on('session_chat_received', (data) => {
        setMessages(prev => [...prev, data]);
      });

      socket.on('session_emoji_received', (data) => {
        const newEmoji = { id: Date.now(), emoji: data.emoji, fromMe: data.userId === user?._id };
        setEmojis(prev => [...prev, newEmoji]);
        setTimeout(() => {
          setEmojis(prev => prev.filter(e => e.id !== newEmoji.id));
        }, 2000);
      });

      return () => {
        socket.emit('leave_session', sessionId);
        socket.off('session_page_updated');
        socket.off('session_chat_received');
        socket.off('session_emoji_received');
      };
    }
  }, [socket, session, sessionId, user?._id]);

  const updatePage = (newPage) => {
    setPage(newPage);
    socket?.emit('session_update_page', { sessionId, page: newPage });
  };

  const sendEmoji = (emoji) => {
    socket?.emit('session_send_emoji', { sessionId, emoji });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    socket?.emit('session_chat_message', { sessionId, message: chatInput });
    setChatInput('');
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] pt-28 pb-16 flex flex-col justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4A65A] mb-3" />
        <span className="text-xs font-semibold text-[#888888] uppercase tracking-widest font-sans">Connecting Live Session...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2] pt-24 pb-16 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-[#D4A65A]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* Main Reading Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-[28px] border border-black/[0.06] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A65A]/15 text-[#D4A65A] text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Real-Time Co-Reading</span>
              </div>
              <h1 className="font-serif text-3xl font-semibold text-[#1D1D1F] tracking-tight flex items-center gap-2.5">
                <BookOpen className="text-[#D4A65A] w-6 h-6" /> Live Reading Session
              </h1>
              <p className="text-xs text-[#666666] font-sans mt-1">
                Read alongside fellow readers with synchronized page counts and instant reactions.
              </p>
            </div>
            
            <div className="flex gap-2 shrink-0">
              <button onClick={() => sendEmoji('🔥')} className="w-11 h-11 rounded-full bg-[#FAF8F5] border border-black/[0.08] hover:bg-white flex items-center justify-center text-lg transition-transform hover:scale-110 shadow-2xs" title="Reaction 🔥">🔥</button>
              <button onClick={() => sendEmoji('👏')} className="w-11 h-11 rounded-full bg-[#FAF8F5] border border-black/[0.08] hover:bg-white flex items-center justify-center text-lg transition-transform hover:scale-110 shadow-2xs" title="Reaction 👏">👏</button>
              <button onClick={() => sendEmoji('❤️')} className="w-11 h-11 rounded-full bg-[#FAF8F5] border border-black/[0.08] hover:bg-white flex items-center justify-center text-lg transition-transform hover:scale-110 shadow-2xs" title="Reaction ❤️">❤️</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-[24px] border border-black/[0.06] shadow-2xs space-y-3">
              <h3 className="font-serif font-semibold text-sm text-[#1D1D1F]">Your Reading Progress</h3>
              <div className="font-serif text-4xl font-semibold text-[#D4A65A]">Page {page}</div>
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => updatePage(Math.max(0, page - 1))} 
                  className="px-4 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-white border border-black/[0.08] text-xs font-semibold text-[#1D1D1F] transition-all shadow-2xs"
                >
                  - Prev
                </button>
                <button 
                  onClick={() => updatePage(page + 1)} 
                  className="px-4 py-1.5 rounded-full bg-[#D4A65A] hover:bg-[#C29549] text-xs font-semibold text-white transition-all shadow-md shadow-[#D4A65A]/20"
                >
                  + Next Page
                </button>
              </div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-md p-6 rounded-[24px] border border-black/[0.06] shadow-2xs space-y-3">
              <h3 className="font-serif font-semibold text-sm text-[#888888]">Reading Partner</h3>
              <div className="font-serif text-4xl font-semibold text-[#888888]">Page {partnerPage}</div>
              <p className="text-xs text-[#888888] font-sans italic">Syncing live reading socket events...</p>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="bg-white/80 backdrop-blur-md rounded-[28px] border border-black/[0.06] shadow-2xs flex flex-col h-[520px] overflow-hidden">
          <div className="p-4 border-b border-black/[0.06] bg-[#FAF8F5]/80">
            <h3 className="font-serif font-semibold text-sm text-[#1D1D1F]">Session Discussion</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 relative font-sans">
            <AnimatePresence>
              {emojis.map(e => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 30, scale: 0.5 }}
                  animate={{ opacity: 1, y: -80, scale: 1.4 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`absolute text-3xl z-50 ${e.fromMe ? 'right-8' : 'left-8'}`}
                  style={{ bottom: '20px' }}
                >
                  {e.emoji}
                </motion.div>
              ))}
            </AnimatePresence>

            {messages.length === 0 ? (
              <div className="text-center py-12 text-xs text-[#888888] font-sans">
                No messages yet. Send a message to your co-reader!
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`flex ${m.user._id === user?._id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${m.user._id === user?._id ? 'bg-[#D4A65A] text-white rounded-br-xs' : 'bg-[#FAF8F5] border border-black/[0.06] text-[#1D1D1F] rounded-bl-xs'}`}>
                    {m.user._id !== user?._id && <p className="text-[10px] text-[#D4A65A] mb-1 font-bold">{m.user.username}</p>}
                    <p>{m.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={sendMessage} className="p-3 border-t border-black/[0.06] bg-[#FAF8F5]/80 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Type message..."
              className="flex-1 bg-white border border-black/[0.08] rounded-full px-4 py-2 text-xs text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#D4A65A]/40 font-sans"
            />
            <button 
              type="submit" 
              className="w-8 h-8 rounded-full bg-[#D4A65A] hover:bg-[#C29549] flex items-center justify-center text-white transition-all shadow-md shadow-[#D4A65A]/20"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default LiveSession;

