import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { MessageSquare, Users, Target, Send, Sparkles, Loader2, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const ClubDetails = () => {
  const { id } = useParams();
  const { token, user } = useAuth();
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('discussions');

  const { data, isLoading } = useQuery({
    queryKey: ['club', id],
    queryFn: async () => {
      const res = await fetch(`/api/clubs/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error('Failed to fetch club');
      return res.json();
    }
  });

  const { data: discussions } = useQuery({
    queryKey: ['discussions', id],
    queryFn: async () => {
      const res = await fetch(`/api/clubs/${id}/discussions`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error('Failed to fetch discussions');
      return res.json();
    },
    enabled: !!data
  });

  const joinMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/clubs/${id}/join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to join');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['club', id]);
    }
  });

  const [newDiscussionTitle, setNewDiscussionTitle] = useState('');
  const [newDiscussionContent, setNewDiscussionContent] = useState('');
  const createDiscussionMutation = useMutation({
    mutationFn: async (discData) => {
      const res = await fetch(`/api/clubs/${id}/discussions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(discData)
      });
      if (!res.ok) throw new Error('Failed to create discussion');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['discussions', id]);
      setNewDiscussionTitle('');
      setNewDiscussionContent('');
    }
  });

  useEffect(() => {
    if (socket && data) {
      socket.emit('join_session', `club_${id}`);
      socket.on('new_discussion', (discussion) => {
        queryClient.setQueryData(['discussions', id], old => [discussion, ...(old || [])]);
      });
      return () => {
        socket.emit('leave_session', `club_${id}`);
        socket.off('new_discussion');
      };
    }
  }, [socket, data, id, queryClient]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] pt-28 pb-16 flex flex-col justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4A65A] mb-3" />
        <span className="text-xs font-semibold text-[#888888] uppercase tracking-widest font-sans">Loading Club Sanctuary...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] pt-28 pb-16 flex flex-col justify-center items-center text-center px-4">
        <Users className="w-12 h-12 text-[#D4A65A]/40 mb-3" />
        <h2 className="font-serif text-2xl font-semibold text-[#1D1D1F]">Book club not found</h2>
        <p className="text-xs text-[#888888] font-sans mt-1">This club may have been moved or removed.</p>
      </div>
    );
  }

  const { club, memberCount, recentMembers } = data;
  const isMember = recentMembers?.some(m => m.user._id === user?._id);

  return (
    <div className="min-h-screen bg-[#F8F6F2] pt-24 pb-16 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-[#D4A65A]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1200px] mx-auto space-y-10 relative z-10">
        
        {/* Banner */}
        <div className="w-full h-44 sm:h-56 rounded-[28px] bg-gradient-to-r from-[#D4A65A]/20 via-[#E8D9BF]/40 to-[#D4A65A]/15 border border-black/[0.08] overflow-hidden p-8 flex flex-col justify-end shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 text-[#D4A65A] text-xs font-semibold uppercase tracking-wider w-fit shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Sanctuary</span>
          </div>
        </div>

        {/* Header Details */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-black/[0.08]">
          <div className="space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight">{club.name}</h1>
            <p className="text-xs sm:text-sm text-[#666666] font-sans max-w-2xl leading-relaxed">{club.description || 'No description provided.'}</p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#888888] font-sans">
              <span className="flex items-center gap-1.5 font-semibold text-[#1D1D1F]"><Users className="w-3.5 h-3.5 text-[#D4A65A]" /> {memberCount} Members</span>
              <span>•</span>
              <span>Organized by <strong className="text-[#1D1D1F]">{club.owner?.username}</strong></span>
            </div>
          </div>
          
          {user && !isMember && (
            <button 
              onClick={() => joinMutation.mutate()}
              disabled={joinMutation.isPending}
              className="px-6 py-2.5 rounded-full bg-[#D4A65A] hover:bg-[#C29549] transition-all text-xs font-semibold text-white shadow-md shadow-[#D4A65A]/20 hover:scale-105 active:scale-95"
            >
              {joinMutation.isPending ? 'Joining...' : 'Join Club'}
            </button>
          )}
          {user && isMember && (
            <span className="px-5 py-2 rounded-full bg-white border border-black/[0.08] text-xs font-semibold text-[#D4A65A] shadow-2xs">
              Joined Member
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-8 border-b border-black/[0.06]">
          {['discussions', 'members', 'challenges'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-xs sm:text-sm font-semibold tracking-wide transition-colors relative font-sans ${activeTab === tab ? 'text-[#1D1D1F]' : 'text-[#888888] hover:text-[#1D1D1F]'}`}
            >
              <span className="capitalize">{tab}</span>
              {activeTab === tab && (
                <motion.div layoutId="clubTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4A65A]" />
              )}
            </button>
          ))}
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'discussions' && (
              <div className="space-y-6">
                {isMember && (
                  <form 
                    onSubmit={e => {
                      e.preventDefault();
                      if(newDiscussionTitle.trim() && newDiscussionContent.trim()) {
                        createDiscussionMutation.mutate({ title: newDiscussionTitle, content: newDiscussionContent });
                      }
                    }}
                    className="bg-white/80 backdrop-blur-md border border-black/[0.06] rounded-[24px] p-6 shadow-2xs space-y-3"
                  >
                    <h3 className="font-serif text-lg font-semibold text-[#1D1D1F]">Start a Discussion</h3>
                    <input
                      type="text"
                      placeholder="Discussion Topic Title"
                      value={newDiscussionTitle}
                      onChange={e => setNewDiscussionTitle(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#D4A65A]/40 font-sans"
                    />
                    <textarea
                      placeholder="Share your perspective, chapter thoughts, or questions..."
                      value={newDiscussionContent}
                      onChange={e => setNewDiscussionContent(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-black/[0.08] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-[#D4A65A]/40 h-28 resize-none font-sans"
                    />
                    <div className="flex justify-end pt-2">
                      <button 
                        type="submit"
                        disabled={createDiscussionMutation.isPending}
                        className="px-5 py-2 rounded-full bg-[#D4A65A] hover:bg-[#C29549] text-white text-xs font-semibold transition-all shadow-md shadow-[#D4A65A]/20 flex items-center gap-2"
                      >
                        <Send className="w-3.5 h-3.5" /> Post Discussion
                      </button>
                    </div>
                  </form>
                )}

                {discussions?.map(disc => (
                  <div key={disc._id} className="bg-white/80 backdrop-blur-md p-6 rounded-[24px] border border-black/[0.06] shadow-2xs space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-black/[0.08] overflow-hidden flex items-center justify-center text-[#D4A65A]">
                        {disc.author?.avatar ? (
                          <img src={disc.author.avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon className="w-4 h-4 text-[#D4A65A]" />
                        )}
                      </div>
                      <div>
                        <p className="font-serif font-semibold text-xs text-[#1D1D1F]">{disc.author?.username}</p>
                        <p className="text-[10px] text-[#888888] font-sans">Recent contributor</p>
                      </div>
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-[#1D1D1F]">{disc.title}</h3>
                    <p className="text-[#666666] text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-line">{disc.content}</p>
                    
                    <div className="flex items-center gap-4 pt-3 border-t border-black/[0.04]">
                      <span className="flex items-center gap-1.5 text-xs text-[#888888] font-sans font-medium">
                        <MessageSquare className="w-3.5 h-3.5" /> Discussion Thread
                      </span>
                    </div>
                  </div>
                ))}
                
                {discussions?.length === 0 && (
                  <div className="text-center py-16 px-4 bg-white/50 rounded-2xl border border-dashed border-black/[0.08]">
                    <p className="font-serif text-lg text-[#1D1D1F]">No discussions started yet</p>
                    <p className="text-xs text-[#888888] font-sans mt-1">Be the first member to spark a topic!</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'members' && (
              <div className="space-y-3">
                {recentMembers?.map(member => (
                  <div key={member._id} className="flex items-center justify-between p-4 rounded-2xl bg-white/80 border border-black/[0.06] shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#FAF8F5] border border-black/[0.08] flex items-center justify-center text-[#D4A65A]">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-serif font-semibold text-sm text-[#1D1D1F]">{member.user?.username}</p>
                        <p className="text-[11px] text-[#888888] font-sans capitalize">{member.role || 'Member'}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'challenges' && (
              <div className="text-center py-16 px-4 bg-white/50 rounded-2xl border border-dashed border-black/[0.08]">
                <Target className="w-10 h-10 text-[#D4A65A]/40 mx-auto mb-3" />
                <p className="font-serif text-lg text-[#1D1D1F]">No active reading challenges</p>
                <p className="text-xs text-[#888888] font-sans mt-1">Check back soon for upcoming group reading goals.</p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-[24px] border border-black/[0.06] shadow-2xs space-y-3">
              <h3 className="font-serif font-semibold text-[#1D1D1F] flex items-center gap-2">
                <Target className="w-4 h-4 text-[#D4A65A]" /> Group Reading Goal
              </h3>
              <p className="text-xs text-[#666666] font-sans leading-relaxed">
                Connect with members in discussions to decide on this month&apos;s featured reading title.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClubDetails;

