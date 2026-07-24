import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import GenreGrid from '../components/GenreGrid';

const Genre = () => {
  const { genreName } = useParams();

  return (
    <motion.div
      key="genre-view"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-[#F8F6F2] pt-24 pb-16 px-4 sm:px-6 lg:px-12 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-[#D4A65A]/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto space-y-8 relative z-10">
        <div className="flex items-center gap-4 pb-6 border-b border-black/[0.08]">
          <div className="w-12 h-12 rounded-2xl bg-white border border-black/[0.08] shadow-2xs flex items-center justify-center text-[#D4A65A]">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1D1D1F] capitalize tracking-tight">
              {genreName?.replace(/_/g, ' ')}
            </h1>
            <p className="text-xs sm:text-sm text-[#666666] font-sans mt-1">
              Curated selections and timeless titles in this literary discipline.
            </p>
          </div>
        </div>
        
        <GenreGrid genre={genreName} />
      </div>
    </motion.div>
  );
};

export default Genre;

