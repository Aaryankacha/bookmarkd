import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Star } from 'lucide-react';

const MangaHero = ({ manga }) => {
  if (!manga) return null;

  const title = manga.title.english || manga.title.romaji || manga.title.native;
  const bannerImage = manga.bannerImage || manga.coverImage.extraLarge;

  return (
    <div className="relative w-full overflow-hidden bg-[#FAF9F6] border-b border-[#EAE5D9]">
      {/* Paper texture overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.04] mix-blend-multiply" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>
      
      <div className="relative flex flex-col md:flex-row h-auto md:h-[500px] max-w-[1500px] mx-auto">
        
        {/* Left Side: Content */}
        <div className="flex-1 flex flex-col justify-center p-8 md:p-16 z-20 bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6] to-transparent">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-[#E63946] border border-[#E63946]/30 bg-[#E63946]/5 rounded-sm">
                Featured Manga
              </span>
              {manga.averageScore && (
                <div className="flex items-center gap-1 text-[#D4A65A]">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-semibold">{manga.averageScore}%</span>
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[#1D1D1F] leading-[1.1] mb-6">
              {title}
            </h1>

            {manga.description && (
              <div 
                className="text-base text-[#666666] font-serif leading-relaxed mb-8 line-clamp-3"
                dangerouslySetInnerHTML={{ __html: manga.description }}
              />
            )}

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to={`/manga/${manga.id}`}
                className="flex items-center gap-2 px-8 py-3.5 bg-[#E63946] hover:bg-[#D62828] text-white font-semibold tracking-wide rounded-sm transition-all shadow-md shadow-[#E63946]/20 hover:-translate-y-0.5"
              >
                <BookOpen className="w-4 h-4" />
                Read Overview
              </Link>
              
              {manga.genres && (
                <div className="hidden sm:flex items-center gap-2 text-xs text-[#8B8B8B] tracking-wider uppercase font-medium">
                  {manga.genres.slice(0, 3).map((genre, idx) => (
                    <span key={genre} className="flex items-center gap-2">
                      {genre}
                      {idx !== Math.min(manga.genres.length, 3) - 1 && <span className="w-1 h-1 rounded-full bg-[#D4A65A]" />}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Side: Image/Banner */}
        <div className="flex-1 relative h-[300px] md:h-full overflow-hidden mask-image-fade-l">
          <motion.img 
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            src={bannerImage} 
            alt={title}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Gradient fade to blend with left side on desktop */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#FAF9F6] to-transparent hidden md:block"></div>
        </div>

      </div>
    </div>
  );
};

export default MangaHero;
