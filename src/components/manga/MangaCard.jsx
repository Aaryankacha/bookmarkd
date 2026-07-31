import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const MangaCard = ({ manga, index = 0 }) => {
  const title = manga.title.english || manga.title.romaji || manga.title.native;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group flex flex-col gap-3"
    >
      <Link to={`/manga/${manga.id}`} className="relative aspect-[2/3] w-full overflow-hidden bg-[#f0eae1] shadow-sm transition-all duration-300 group-hover:shadow-md">
        <img 
          src={manga.coverImage.extraLarge || manga.coverImage.large} 
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Subtle gradient overlay at bottom for contrast if needed, but keeping it minimal */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {manga.averageScore && (
          <div className="absolute bottom-2 left-2 flex translate-y-2 items-center gap-1 bg-white/90 px-2 py-1 text-xs font-medium opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <Star className="h-3 w-3 fill-[#E63946] text-[#E63946]" />
            <span className="text-[#1D1D1F]">{manga.averageScore}%</span>
          </div>
        )}

        {/* Paper texture overlay (subtle) */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>
      </Link>
      
      <div className="flex flex-col gap-1">
        <Link to={`/manga/${manga.id}`}>
          <h3 className="line-clamp-2 font-serif text-sm font-semibold leading-snug text-[#1D1D1F] transition-colors group-hover:text-[#E63946]">
            {title}
          </h3>
        </Link>
        {manga.genres && manga.genres.length > 0 && (
          <p className="truncate text-xs text-[#8B8B8B] font-sans tracking-wide">
            {manga.genres.slice(0, 2).join(' • ')}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default MangaCard;
