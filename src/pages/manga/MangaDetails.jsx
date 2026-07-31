import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchAniList, GET_DETAILS } from '../../services/anilist';
import { Loader2, Star, Calendar, BookOpen, Hash, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const MangaDetails = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['manga', id],
    queryFn: () => fetchAniList(GET_DETAILS, { id: parseInt(id) })
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#E63946] animate-spin" />
      </div>
    );
  }

  if (error || !data?.Media) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center pt-16">
        <h2 className="text-2xl font-serif text-[#1D1D1F]">Failed to load manga details</h2>
        <Link to="/manga" className="mt-4 text-[#E63946] hover:underline">Return to Manga Home</Link>
      </div>
    );
  }

  const manga = data.Media;
  const title = manga.title.english || manga.title.romaji || manga.title.native;
  const bannerImage = manga.bannerImage || manga.coverImage.extraLarge;

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
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] via-transparent to-transparent"></div>
          </div>
          <div className="absolute top-6 left-6 z-20">
            <Link to="/manga" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors">
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
                className="bg-white p-2 shadow-xl shadow-black/10 rounded-sm"
              >
                <img 
                  src={manga.coverImage.extraLarge} 
                  alt={title} 
                  className="w-full h-auto object-cover rounded-sm"
                />
              </motion.div>

              <div className="mt-6 flex flex-col gap-3">
                <button className="w-full py-3 bg-[#E63946] hover:bg-[#D62828] text-white font-semibold rounded-sm transition-colors shadow-md flex items-center justify-center gap-2">
                  <BookOpen className="w-4 h-4" /> Add to Library
                </button>
              </div>
              
              <div className="mt-8 bg-white p-6 shadow-sm border border-black/[0.04] rounded-sm">
                <h3 className="text-sm font-semibold text-[#1D1D1F] uppercase tracking-wider mb-4 border-b border-black/[0.04] pb-2">Information</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-[#8B8B8B]">Format</dt>
                    <dd className="font-medium text-[#1D1D1F]">{manga.format || 'Unknown'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#8B8B8B]">Chapters</dt>
                    <dd className="font-medium text-[#1D1D1F]">{manga.chapters || 'Ongoing'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#8B8B8B]">Status</dt>
                    <dd className="font-medium text-[#1D1D1F]">{manga.status}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-[#8B8B8B]">Start Date</dt>
                    <dd className="font-medium text-[#1D1D1F]">
                      {manga.startDate?.year ? `${manga.startDate.year}-${manga.startDate.month}-${manga.startDate.day}` : 'Unknown'}
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
                
                {manga.title.native && (
                  <h2 className="text-xl md:text-2xl font-serif text-[#666666] mb-6">
                    {manga.title.native}
                  </h2>
                )}

                {/* Stats Row */}
                <div className="flex flex-wrap items-center gap-6 mb-8 py-4 border-y border-black/[0.06]">
                  {manga.averageScore && (
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-[#D4A65A] fill-current" />
                      <div>
                        <div className="text-lg font-bold text-[#1D1D1F]">{manga.averageScore}%</div>
                        <div className="text-xs text-[#8B8B8B] uppercase tracking-wider">Score</div>
                      </div>
                    </div>
                  )}
                  {manga.popularity && (
                    <div className="flex items-center gap-2">
                      <Hash className="w-5 h-5 text-[#E63946]" />
                      <div>
                        <div className="text-lg font-bold text-[#1D1D1F]">{manga.popularity.toLocaleString()}</div>
                        <div className="text-xs text-[#8B8B8B] uppercase tracking-wider">Popularity</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {manga.genres?.map(genre => (
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
                    dangerouslySetInnerHTML={{ __html: manga.description || 'No description available.' }}
                  />
                </div>

                {/* Characters */}
                {manga.characters?.edges?.length > 0 && (
                  <div className="mb-12">
                    <h3 className="text-lg font-serif font-bold text-[#1D1D1F] mb-6 border-b border-black/[0.06] pb-2">Characters</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {manga.characters.edges.map(({ node, role }) => (
                        <div key={node.id} className="flex flex-col gap-2 group">
                          <div className="aspect-square rounded-sm overflow-hidden bg-[#EAE5D9]">
                            <img src={node.image.large} alt={node.name.full} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-[#1D1D1F] truncate">{node.name.full}</div>
                            <div className="text-xs text-[#8B8B8B] uppercase tracking-wider mt-0.5">{role}</div>
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

export default MangaDetails;
