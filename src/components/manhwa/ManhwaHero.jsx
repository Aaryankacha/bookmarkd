import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Star, ChevronRight } from 'lucide-react';

const ManhwaHero = ({ manhwa }) => {
  if (!manhwa) return null;

  const title = manhwa.title.english || manhwa.title.romaji || manhwa.title.native;
  const bannerImage = manhwa.bannerImage || manhwa.coverImage.extraLarge;
  const coverImage = manhwa.coverImage.extraLarge;

  return (
    <div className="relative w-full overflow-hidden bg-[#FAF9F6] border-b border-[#EAE5D9]">
      {/* Paper texture overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.04] mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>

      <div className="relative max-w-[1500px] mx-auto flex flex-col md:flex-row min-h-[500px] z-20">
        
        {/* Left Side: Content */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-16 z-20 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6]/95 to-transparent">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-[#4F46E5] border border-[#4F46E5]/30 bg-[#4F46E5]/5 rounded-sm">
                Webtoon of the Day
              </span>
              {manhwa.averageScore && (
                <div className="flex items-center gap-1 text-[#D4A65A]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-semibold">{manhwa.averageScore}%</span>
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#1D1D1F] leading-[1.1] mb-6">
              {title}
            </h1>

            {manhwa.genres && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                {manhwa.genres.slice(0, 4).map((genre) => (
                  <span key={genre} className="px-2.5 py-1 rounded-full bg-white border border-black/[0.06] text-[#666666] text-xs font-medium shadow-sm">
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {manhwa.description && (
              <div 
                className="text-base text-[#666666] font-serif leading-relaxed mb-8 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: manhwa.description }}
              />
            )}

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to={`/manhwa/${manhwa.id}`}
                className="group flex items-center gap-2 px-8 py-3.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-semibold tracking-wide rounded-sm transition-all shadow-md shadow-[#4F46E5]/20 hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4 fill-current" />
                Start Reading
              </Link>
              
              <Link
                to={`/manhwa/${manhwa.id}`}
                className="group flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-black/[0.02] text-[#1D1D1F] font-semibold tracking-wide rounded-sm transition-all border border-black/[0.08] shadow-sm hover:-translate-y-0.5"
              >
                Details
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Floating Cover Image on Desktop */}
        <div className="hidden md:flex flex-1 relative items-center justify-center p-12 z-20">
          <motion.div
            initial={{ opacity: 0, rotateZ: 5, y: 20 }}
            animate={{ opacity: 1, rotateZ: -2, y: 0 }}
            transition={{ duration: 1, delay: 0.2, type: "spring", stiffness: 100 }}
            className="relative w-[280px] lg:w-[320px] aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-black/10 border-4 border-white transform hover:rotate-0 hover:scale-105 transition-all duration-500"
          >
            <img src={coverImage} alt={title} className="w-full h-full object-cover" />
          </motion.div>
          {/* Decorative background blob */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-[#4F46E5]/10 to-[#D4A65A]/10 rounded-full blur-3xl -z-10"></div>
        </div>

      </div>

      {/* Abstract background image for mobile or subtle backdrop */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 mix-blend-multiply md:opacity-[0.03] z-0 mask-image-fade-l pointer-events-none">
         <img src={bannerImage} alt="" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default ManhwaHero;
