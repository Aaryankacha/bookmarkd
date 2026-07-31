import { Link } from 'react-router-dom';
import { Star, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const ManhwaCard = ({ manhwa, index = 0, rank }) => {
  const title = manhwa.title.english || manhwa.title.romaji || manhwa.title.native;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group flex flex-col gap-3"
    >
      <Link to={`/manhwa/${manhwa.id}`} className="relative aspect-[2/3] w-full overflow-hidden bg-[#F0EAE1] rounded-lg shadow-sm transition-all duration-300 group-hover:shadow-lg border border-black/[0.04]">
        <img 
          src={manhwa.coverImage.extraLarge || manhwa.coverImage.large} 
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1D1D1F]/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {rank && (
          <div className="absolute top-2 left-2 flex h-7 w-7 items-center justify-center rounded-md bg-[#4F46E5] font-serif text-sm font-bold text-white shadow-md">
            {rank}
          </div>
        )}

        <div className="absolute bottom-2 left-2 flex flex-col gap-1.5 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          {manhwa.averageScore && (
            <div className="flex items-center gap-1 w-max rounded-md bg-white/95 px-2 py-1 text-[11px] font-semibold text-[#1D1D1F] backdrop-blur-sm shadow-sm border border-black/[0.04]">
              <Star className="h-3 w-3 fill-[#4F46E5] text-[#4F46E5]" />
              {manhwa.averageScore}%
            </div>
          )}
          {manhwa.popularity > 10000 && (
            <div className="flex items-center gap-1 w-max rounded-md bg-[#4F46E5]/95 px-2 py-1 text-[10px] font-bold tracking-wider text-white backdrop-blur-sm shadow-sm">
              <TrendingUp className="h-3 w-3" />
              HOT
            </div>
          )}
        </div>

        {/* Paper texture overlay (subtle) */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>
      </Link>
      
      <div className="flex flex-col gap-1 px-0.5">
        <Link to={`/manhwa/${manhwa.id}`}>
          <h3 className="line-clamp-2 font-serif text-sm font-bold leading-snug text-[#1D1D1F] transition-colors group-hover:text-[#4F46E5]">
            {title}
          </h3>
        </Link>
        {manhwa.genres && manhwa.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-0.5">
            {manhwa.genres.slice(0, 2).map(genre => (
              <span key={genre} className="text-[10px] uppercase font-semibold tracking-wider text-[#8B8B8B]">
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
