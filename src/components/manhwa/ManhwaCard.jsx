import { Link } from 'react-router-dom';
import { Star, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const ManhwaCard = ({ manhwa, index = 0, rank }) => {
  const title = manhwa.title.english || manhwa.title.romaji || manhwa.title.native;
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative flex flex-col gap-3 rounded-2xl p-2 transition-all hover:bg-white/[0.04]"
    >
      <Link to={`/manhwa/${manhwa.id}`} className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#1A1A24] shadow-lg shadow-black/40 transition-all duration-500 group-hover:shadow-[#00F0FF]/10 group-hover:shadow-2xl">
        <img 
          src={manhwa.coverImage.extraLarge || manhwa.coverImage.large} 
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Neon Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#0A0A0F]/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#00F0FF]/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 mix-blend-overlay" />
        
        {rank && (
          <div className="absolute top-2 left-2 flex h-8 w-8 items-center justify-center rounded-lg bg-black/60 font-bold text-white shadow-[0_0_15px_rgba(0,240,255,0.3)] backdrop-blur-md border border-white/10">
            {rank}
          </div>
        )}

        <div className="absolute bottom-0 left-0 w-full p-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 flex items-center justify-between">
          {manhwa.averageScore && (
            <div className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/20">
              <Star className="h-3 w-3 fill-[#00F0FF] text-[#00F0FF]" />
              {manhwa.averageScore}%
            </div>
          )}
          {manhwa.popularity > 10000 && (
            <div className="flex items-center gap-1 rounded-full bg-[#FF0055]/20 px-2 py-1 text-[10px] font-bold text-[#FF0055] backdrop-blur-md border border-[#FF0055]/30">
              <TrendingUp className="h-3 w-3" />
              HOT
            </div>
          )}
        </div>
      </Link>
      
      <div className="flex flex-col gap-1 px-1">
        <Link to={`/manhwa/${manhwa.id}`}>
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white transition-colors group-hover:text-[#00F0FF]">
            {title}
          </h3>
        </Link>
        {manhwa.genres && manhwa.genres.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {manhwa.genres.slice(0, 2).map(genre => (
              <span key={genre} className="text-[10px] font-medium text-white/50 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5">
                {genre}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ManhwaCard;
