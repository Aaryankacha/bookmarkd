import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchAniList, GET_DETAILS } from '../../services/anilist';
import ErrorState from '../../components/ErrorState';
import { Loader2, Star, Plus, Hash, ArrowLeft, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const ManhwaDetails = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['manhwa', id],
    queryFn: () => fetchAniList(GET_DETAILS, { id: parseInt(id) })
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin" />
      </div>
    );
  }

  if (error || !data?.Media) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center pt-16 px-4">
        <ErrorState 
          message="Failed to load webtoon details. It might not exist or the server is busy."
          bgAccent="bg-[#4F46E5]"
          accentColor="text-[#4F46E5]"
          onRetry={() => window.location.reload()} 
        />
        <Link to="/manhwa" className="mt-4 text-[#4F46E5] hover:underline font-medium">Return to Manhwa Home</Link>
      </div>
    );
  }

  const manhwa = data.Media;
  const title = manhwa.title.english || manhwa.title.romaji || manhwa.title.native;
  const bannerImage = manhwa.bannerImage || manhwa.coverImage.extraLarge;

  return (
    <div className="min-h-screen bg-[#FAF9F6] pt-16 pb-24 font-sans">
      {/* Background paper texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply z-0" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

      <div className="relative z-10">
        {/* Banner Section */}
        <div className="relative h-[30vh] md:h-[40vh] w-full bg-[#1D1D1F]">
          <div className="absolute inset-0">
            <img 
              src={bannerImage} 
              alt="Banner" 
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-transparent to-transparent"></div>
          </div>
          <div className="absolute top-6 left-6 z-20">
            <Link to="/manhwa" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/30 backdrop-blur-md text-white hover:bg-white/50 transition-colors border border-white/20">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative -mt-32 md:-mt-48 z-20">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            
            {/* Left Column: Cover & Actions */}
            <div className="w-full md:w-[280px] flex-shrink-0">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-2 shadow-xl shadow-black/10 rounded-xl"
              >
                <img 
                  src={manhwa.coverImage.extraLarge} 
                  alt={title} 
                  className="w-full h-auto object-cover rounded-lg"
                />
              </motion.div>

              <div className="mt-6 flex flex-col gap-3">
                <button className="w-full py-3.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 hover:-translate-y-0.5">
                  <Play className="w-4 h-4 fill-current" /> Start Reading
                </button>
                <button className="w-full py-3.5 bg-white hover:bg-black/[0.02] text-[#1D1D1F] font-semibold rounded-lg transition-colors border border-black/[0.08] shadow-sm flex items-center justify-center gap-2 hover:-translate-y-0.5">
                  <Plus className="w-4 h-4" /> Add to List
                </button>
              </div>
              
              <div className="mt-8 bg-white p-6 shadow-sm border border-black/[0.04] rounded-xl">
                <h3 className="text-sm font-semibold text-[#1D1D1F] uppercase tracking-wider mb-4 border-b border-black/[0.04] pb-2">Information</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-[#8B8B8B]">Format</dt>
                    <dd className="font-medium text-[#1D1D1F]">{manhwa.format || 'Unknown'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#8B8B8B]">Chapters</dt>
                    <dd className="font-medium text-[#1D1D1F]">{manhwa.chapters || 'Ongoing'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#8B8B8B]">Status</dt>
                    <dd className="font-medium text-[#1D1D1F]">{manhwa.status}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#8B8B8B]">Start Date</dt>
                    <dd className="font-medium text-[#1D1D1F]">
                      {manhwa.startDate?.year ? `${manhwa.startDate.year}-${manhwa.startDate.month}-${manhwa.startDate.day}` : 'Unknown'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="flex-1 mt-4 md:mt-40">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#1D1D1F] leading-tight mb-2">
                  {title}
                </h1>
                
                {manhwa.title.native && (
                  <h2 className="text-xl md:text-2xl font-serif text-[#666666] mb-6">
                    {manhwa.title.native}
                  </h2>
                )}

                {/* Stats Row */}
                <div className="flex flex-wrap items-center gap-6 mb-8 py-4 border-y border-black/[0.06]">
                  {manhwa.averageScore && (
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-[#D4A65A] fill-current" />
                      <div>
                        <div className="text-lg font-bold text-[#1D1D1F]">{manhwa.averageScore}%</div>
                        <div className="text-xs text-[#8B8B8B] uppercase tracking-wider">Score</div>
                      </div>
                    </div>
                  )}
                  {manhwa.popularity && (
                    <div className="flex items-center gap-2">
                      <Hash className="w-5 h-5 text-[#4F46E5]" />
                      <div>
                        <div className="text-lg font-bold text-[#1D1D1F]">{manhwa.popularity.toLocaleString()}</div>
                        <div className="text-xs text-[#8B8B8B] uppercase tracking-wider">Popularity</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {manhwa.genres?.map(genre => (
                    <span key={genre} className="px-4 py-1.5 bg-white border border-black/[0.06] rounded-full text-xs font-medium text-[#1D1D1F] shadow-sm">
                      {genre}
                    </span>
                  ))}
                </div>

                {/* Synopsis */}
                <div className="mb-12">
                  <h3 className="text-lg font-serif font-bold text-[#1D1D1F] mb-4">Synopsis</h3>
                  <div 
                    className="prose prose-sm md:prose-base prose-p:text-[#4A4A4A] prose-p:leading-relaxed max-w-none font-serif"
                    dangerouslySetInnerHTML={{ __html: manhwa.description || 'No description available.' }}
                  />
                </div>

                {/* Characters */}
                {manhwa.characters?.edges?.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-lg font-serif font-bold text-[#1D1D1F] mb-6 border-b border-black/[0.06] pb-2">Characters</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {manhwa.characters.edges.map(({ node, role }) => (
                        <div key={node.id} className="flex flex-col gap-2 group">
                          <div className="aspect-square rounded-lg overflow-hidden bg-[#EAE5D9]">
                            <img src={node.image.large} alt={node.name.full} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-[#1D1D1F] truncate">{node.name.full}</div>
                            <div className="text-xs text-[#4F46E5] uppercase tracking-wider mt-0.5">{role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManhwaDetails;
