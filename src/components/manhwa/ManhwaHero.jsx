import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Star, ChevronRight } from 'lucide-react';

const ManhwaHero = ({ manhwa }) => {
  if (!manhwa) return null;

  const title = manhwa.title.english || manhwa.title.romaji || manhwa.title.native;
  const bannerImage = manhwa.bannerImage || manhwa.coverImage.extraLarge;
  const coverImage = manhwa.coverImage.extraLarge;

  return (
    <div className="relative w-full h-[80vh] md:h-[600px] overflow-hidden bg-[#0A0A0F]">
      
      {/* Background with animated blur and gradient */}
      <div className="absolute inset-0">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={bannerImage} 
          alt=""
          className="w-full h-full object-cover blur-sm"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F] via-[#0A0A0F]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent"></div>
        {/* Neon glow effect */}
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-[#00F0FF]/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-[#FF0055]/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      </div>

      <div className="relative max-w-[1500px] mx-auto h-full px-4 sm:px-6 flex flex-col md:flex-row items-center">
        
        {/* Left Side: Content */}
        <div className="flex-1 w-full flex flex-col justify-center pt-20 md:pt-0 z-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 text-xs font-black tracking-widest text-[#0A0A0F] bg-[#00F0FF] rounded-sm shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                WEBTOON OF THE DAY
              </span>
              {manhwa.averageScore && (
                <div className="flex items-center gap-1.5 text-white/90">
                  <Star className="w-4 h-4 fill-[#00F0FF] text-[#00F0FF]" />
                  <span className="text-sm font-bold">{manhwa.averageScore}%</span>
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
              {title}
            </h1>

            {manhwa.genres && (
              <div className="flex items-center gap-3 mb-6">
                {manhwa.genres.slice(0, 4).map((genre) => (
                  <span key={genre} className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-semibold backdrop-blur-md border border-white/10">
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {manhwa.description && (
              <div 
                className="text-base text-white/60 font-medium leading-relaxed mb-8 line-clamp-3 md:line-clamp-4 max-w-xl"
                dangerouslySetInnerHTML={{ __html: manhwa.description }}
              />
            )}

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to={`/manhwa/${manhwa.id}`}
                className="group flex items-center gap-2 px-8 py-4 bg-white text-[#0A0A0F] font-bold text-sm tracking-wide rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              >
                <Play className="w-4 h-4 fill-current" />
                READ FIRST EPISODE
              </Link>
              
              <Link
                to={`/manhwa/${manhwa.id}`}
                className="group flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm tracking-wide rounded-full transition-all backdrop-blur-md border border-white/10 hover:border-white/30"
              >
                DETAILS
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Floating Cover Image on Desktop */}
        <div className="hidden md:flex flex-1 relative h-full items-center justify-end z-20 perspective-[1000px]">
          <motion.div
            initial={{ opacity: 0, rotateY: -15, x: 50 }}
            animate={{ opacity: 1, rotateY: -5, x: 0, y: [0, -10, 0] }}
            transition={{ 
              opacity: { duration: 0.8, delay: 0.4 },
              x: { duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 },
              rotateY: { duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" } 
            }}
            className="relative w-[320px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl shadow-[#00F0FF]/10 border border-white/10"
          >
            <img src={coverImage} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00F0FF]/20 to-transparent mix-blend-overlay"></div>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default ManhwaHero;
