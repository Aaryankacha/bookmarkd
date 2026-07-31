import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchAniList, GET_DETAILS } from '../../services/anilist';
import { Loader2, Star, Plus, Hash, ArrowLeft, Play, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const ManhwaDetails = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['manhwa', id],
    queryFn: () => fetchAniList(GET_DETAILS, { id: parseInt(id) })
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00F0FF] animate-spin" />
      </div>
    );
  }

  if (error || !data?.Media) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-white mb-4">Webtoon not found</h2>
        <Link to="/manhwa" className="text-[#00F0FF] hover:underline">Return to Home</Link>
      </div>
    );
  }

  const manhwa = data.Media;
  const title = manhwa.title.english || manhwa.title.romaji || manhwa.title.native;
  const bannerImage = manhwa.bannerImage || manhwa.coverImage.extraLarge;

  return (
    <div className="min-h-screen bg-[#0A0A0F] font-sans text-white pb-32">
      
      {/* Immersive Hero Header */}
      <div className="relative h-[60vh] md:h-[75vh] w-full bg-[#0A0A0F] overflow-hidden">
        <div className="absolute inset-0">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear" }}
            src={bannerImage} 
            alt="Banner" 
            className="w-full h-full object-cover opacity-30 blur-sm mix-blend-lighten"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/60 to-transparent"></div>
          {/* Accent lighting */}
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#00F0FF]/20 rounded-full blur-[100px]"></div>
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#FF0055]/20 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="absolute top-6 left-6 z-30">
          <Link to="/manhwa" className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors border border-white/10">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </div>

        {/* Floating Content over Hero */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 z-20">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-end gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="w-48 md:w-64 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border-2 border-white/10 relative group"
            >
              <img 
                src={manhwa.coverImage.extraLarge} 
                alt={title} 
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="w-16 h-16 rounded-full bg-[#00F0FF] text-black flex items-center justify-center hover:scale-110 transition-transform shadow-[0_0_20px_#00F0FF]">
                  <Play className="w-8 h-8 ml-1" />
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 pb-4"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-sm">
                  {manhwa.status}
                </span>
                {manhwa.averageScore && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-xs font-bold text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                    <Star className="w-3.5 h-3.5 fill-current" /> {manhwa.averageScore}%
                  </span>
                )}
                {manhwa.popularity > 10000 && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#FF0055]/10 border border-[#FF0055]/30 text-xs font-bold text-[#FF0055] shadow-[0_0_10px_rgba(255,0,85,0.2)]">
                    <TrendingUp className="w-3.5 h-3.5" /> HOT
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight mb-2 drop-shadow-md">
                {title}
              </h1>
              {manhwa.title.native && (
                <h2 className="text-xl md:text-2xl text-white/50 font-medium mb-6">
                  {manhwa.title.native}
                </h2>
              )}

              <div className="flex flex-wrap items-center gap-4">
                <button className="px-8 py-3.5 rounded-full bg-[#00F0FF] text-black font-bold text-sm tracking-wide hover:bg-white transition-colors shadow-[0_0_20px_rgba(0,240,255,0.3)] flex items-center gap-2 hover:scale-105 active:scale-95">
                  <Play className="w-4 h-4 fill-current" /> START READING
                </button>
                <button className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm tracking-wide backdrop-blur-md border border-white/10 transition-all flex items-center gap-2 hover:scale-105 active:scale-95">
                  <Plus className="w-4 h-4" /> ADD TO LIST
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1200px] mx-auto px-6 md:px-12 mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            
            <section>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-[#00F0FF] rounded-full shadow-[0_0_10px_#00F0FF]"></span>
                Synopsis
              </h3>
              <div 
                className="text-white/70 text-lg leading-relaxed font-medium bg-white/[0.02] p-6 rounded-2xl border border-white/[0.05] shadow-inner"
                dangerouslySetInnerHTML={{ __html: manhwa.description || 'No description available.' }}
              />
            </section>

            {/* Characters */}
            {manhwa.characters?.edges?.length > 0 && (
              <section>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-[#FF0055] rounded-full shadow-[0_0_10px_#FF0055]"></span>
                  Characters
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {manhwa.characters.edges.slice(0, 8).map(({ node, role }) => (
                    <div key={node.id} className="group relative rounded-xl overflow-hidden bg-[#1A1A24]">
                      <div className="aspect-[3/4] w-full">
                        <img src={node.image.large} alt={node.name.full} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                      </div>
                      <div className="absolute bottom-0 left-0 w-full p-3 translate-y-2 group-hover:translate-y-0 transition-transform">
                        <div className="text-sm font-bold text-white truncate">{node.name.full}</div>
                        <div className="text-[10px] text-[#00F0FF] font-bold uppercase tracking-wider">{role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-white/[0.05] to-transparent p-6 rounded-3xl border border-white/[0.05] backdrop-blur-sm">
              <h4 className="text-lg font-bold text-white mb-6 border-b border-white/10 pb-4">Details</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Format</div>
                  <div className="text-white font-medium">{manhwa.format || 'Unknown'}</div>
                </div>
                
                <div>
                  <div className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Chapters</div>
                  <div className="text-white font-medium">{manhwa.chapters || 'Ongoing'}</div>
                </div>

                <div>
                  <div className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Popularity</div>
                  <div className="text-white font-medium flex items-center gap-2">
                    <Hash className="w-4 h-4 text-[#00F0FF]" /> {manhwa.popularity?.toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-white/40 uppercase font-bold tracking-wider mb-2">Genres</div>
                  <div className="flex flex-wrap gap-2">
                    {manhwa.genres?.map(genre => (
                      <span key={genre} className="px-2.5 py-1 bg-white/5 rounded-md text-xs font-medium text-white/80 border border-white/10">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManhwaDetails;
