import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, UserMinus, UserCheck, Clock, Sparkles, Loader2, User as UserIcon } from 'lucide-react';

const UserProfile = () => {
  const { username } = useParams();
  const { user: currentUser, token } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['userProfile', username],
    queryFn: async () => {
      const res = await fetch(`https://bookmarkd-8wed.onrender.com/api/users/${username}`);
      if (!res.ok) throw new Error('User not found');
      return res.json();
    }
  });

  const { data: followStats } = useQuery({
    queryKey: ['followStats', data?.user?._id],
    queryFn: async () => {
      const res = await fetch(`https://bookmarkd-8wed.onrender.com/api/social/follow-stats/${data.user._id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!res.ok) throw new Error('Failed to fetch follow stats');
      return res.json();
    },
    enabled: !!data?.user?._id,
  });

  const followMutation = useMutation({
    mutationFn: async (action) => {
      const res = await fetch(`https://bookmarkd-8wed.onrender.com/api/social/${action}/${data.user._id}`, {
        method: action === 'follow' ? 'POST' : 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`Failed to ${action}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['followStats', data?.user?._id]);
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] pt-28 pb-16 flex flex-col justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#D4A65A] mb-3" />
        <span className="text-xs font-semibold text-[#888888] uppercase tracking-widest font-sans">Loading Profile...</span>
      </div>
    );
  }

  if (isError || !data?.user) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] pt-28 pb-16 flex flex-col justify-center items-center text-center px-4">
        <UserIcon className="w-12 h-12 text-[#D4A65A]/40 mb-3" />
        <h2 className="font-serif text-2xl font-semibold text-[#1D1D1F]">User Profile Not Found</h2>
        <p className="text-xs text-[#888888] font-sans mt-1">The requested reader profile could not be located.</p>
      </div>
    );
  }

  const profileUser = data.user;
  const isOwnProfile = currentUser && currentUser.username === profileUser.username;

  return (
    <div className="min-h-screen bg-[#F8F6F2] pt-24 pb-16 px-4 sm:px-6 lg:px-12 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-[#D4A65A]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1200px] mx-auto space-y-10 relative z-10">
        
        {/* Banner */}
        <div className="w-full h-44 sm:h-60 rounded-[28px] bg-gradient-to-r from-[#D4A65A]/20 via-[#E8D9BF]/40 to-[#D4A65A]/15 border border-black/[0.08] overflow-hidden relative shadow-2xs">
          {profileUser.banner && (
            <img src={profileUser.banner} alt="banner" className="w-full h-full object-cover" />
          )}
          
          {/* Avatar */}
          <div className="absolute -bottom-10 left-6 sm:left-10 flex items-end gap-4">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl border-4 border-[#F8F6F2] bg-white overflow-hidden shadow-md flex items-center justify-center text-[#D4A65A]">
              {profileUser.avatar ? (
                <img src={profileUser.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-12 h-12 text-[#D4A65A]" />
              )}
            </div>
          </div>
        </div>

        {/* Profile Main Info */}
        <div className="pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-black/[0.08]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4A65A]/15 text-[#D4A65A] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Reader Profile</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight flex items-center gap-3">
              {profileUser.username}
              {profileUser.presence?.status === 'online' && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" title="Online now" />
              )}
            </h1>
            <p className="text-xs sm:text-sm text-[#666666] font-sans max-w-xl leading-relaxed">
              {profileUser.bio || 'This bibliophile has not set a bio yet.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isOwnProfile ? (
              <span className="px-5 py-2 rounded-full bg-white border border-black/[0.08] text-xs font-semibold text-[#666666] shadow-2xs">
                Your Profile
              </span>
            ) : currentUser ? (
              <>
                {followStats?.isFollowing ? (
                  <button 
                    onClick={() => followMutation.mutate('unfollow')}
                    disabled={followMutation.isPending}
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-black/[0.08] hover:bg-black/[0.02] text-xs font-semibold text-[#1D1D1F] transition-all shadow-2xs"
                  >
                    <UserMinus className="w-3.5 h-3.5" /> Unfollow
                  </button>
                ) : (
                  <button 
                    onClick={() => followMutation.mutate('follow')}
                    disabled={followMutation.isPending}
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#D4A65A] hover:bg-[#C29549] text-xs font-semibold text-white transition-all shadow-md shadow-[#D4A65A]/20"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Follow
                  </button>
                )}
                
                {data.friendStatus === 'friends' && (
                  <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" /> Friends
                  </span>
                )}
                {data.friendStatus === 'pending_sent' && (
                  <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5 text-amber-600" /> Request Sent
                  </span>
                )}
                {data.friendStatus === 'pending_received' && (
                  <button 
                    onClick={async () => {
                      await fetch(`https://bookmarkd-8wed.onrender.com/api/social/friends/respond/${data.pendingRequestId}`, {
                        method: 'POST',
                        headers: { 
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}` 
                        },
                        body: JSON.stringify({ action: 'accept' })
                      });
                      queryClient.invalidateQueries(['userProfile', username]);
                    }}
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#D4A65A] hover:bg-[#C29549] text-xs font-semibold text-white transition-all shadow-md shadow-[#D4A65A]/20"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> Accept Friend Request
                  </button>
                )}
                {data.friendStatus === 'none' && (
                  <button 
                    onClick={async () => {
                      await fetch(`https://bookmarkd-8wed.onrender.com/api/social/friends/request/${profileUser._id}`, {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      queryClient.invalidateQueries(['userProfile', username]);
                    }}
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-black/[0.08] hover:bg-black/[0.02] text-xs font-semibold text-[#1D1D1F] transition-all shadow-2xs"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-[#D4A65A]" /> Add Friend
                  </button>
                )}
              </>
            ) : null}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-black/[0.06] text-center shadow-2xs">
            <p className="font-serif text-3xl font-semibold text-[#1D1D1F]">{followStats?.followersCount || 0}</p>
            <p className="text-[10px] text-[#888888] font-sans uppercase font-semibold tracking-wider mt-1">Followers</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-black/[0.06] text-center shadow-2xs">
            <p className="font-serif text-3xl font-semibold text-[#1D1D1F]">{followStats?.followingCount || 0}</p>
            <p className="text-[10px] text-[#888888] font-sans uppercase font-semibold tracking-wider mt-1">Following</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-black/[0.06] text-center shadow-2xs">
            <p className="font-serif text-3xl font-semibold text-[#1D1D1F]">{data.stats?.friends || 0}</p>
            <p className="text-[10px] text-[#888888] font-sans uppercase font-semibold tracking-wider mt-1">Friends</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-black/[0.06] text-center shadow-2xs">
            <p className="font-serif text-3xl font-semibold text-[#D4A65A]">{data.stats?.progressCount || 0}</p>
            <p className="text-[10px] text-[#888888] font-sans uppercase font-semibold tracking-wider mt-1">Books Logged</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-black/[0.06] text-center shadow-2xs col-span-2 sm:col-span-1">
            <p className="font-serif text-3xl font-semibold text-[#D4A65A]">{data.stats?.listsCount || 0}</p>
            <p className="text-[10px] text-[#888888] font-sans uppercase font-semibold tracking-wider mt-1">Lists Created</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;

