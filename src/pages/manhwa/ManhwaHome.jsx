import { useQuery } from '@tanstack/react-query';
import { fetchAniList, GET_TRENDING, GET_POPULAR, GET_UPDATED } from '../../services/anilist';
import ManhwaHero from '../../components/manhwa/ManhwaHero';
import ManhwaCard from '../../components/manhwa/ManhwaCard';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const SectionHeader = ({ title, subtitle, accentColor = '#00F0FF', link }) => (
  <div className="flex items-end justify-between mb-6">
    <div className="relative">
      <div 
        className="absolute -left-4 top-1 bottom-1 w-1 rounded-full shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]" 
        style={{ backgroundColor: accentColor, '--accent-rgb': accentColor === '#00F0FF' ? '0,240,255' : '255,0,85' }}
      ></div>
      <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-white/50 mt-1 font-medium">{subtitle}</p>}
    </div>
    {link && (
      <a href={link} className="hidden sm:flex items-center gap-1 text-sm font-bold text-white/70 hover:text-white transition-colors group">
        SEE ALL <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </a>
    )}
  </div>
);

const ManhwaCarousel = ({ manhwas, isLoading, showRank = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col gap-3 rounded-2xl p-2 bg-white/[0.02]">
            <div className="aspect-[3/4] w-full bg-white/5 rounded-xl"></div>
            <div className="h-4 bg-white/5 rounded w-3/4 ml-1"></div>
            <div className="h-3 bg-white/5 rounded w-1/2 ml-1"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6">
      {manhwas?.slice(0, 6).map((manhwa, i) => (
        <ManhwaCard key={manhwa.id} manhwa={manhwa} index={i} rank={showRank ? i + 1 : undefined} />
      ))}
    </div>
  );
};

const ManhwaHome = () => {
  // Querying KR origin for Manhwa/Webtoons
  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ['manhwa', 'trending'],
    queryFn: () => fetchAniList(GET_TRENDING, { page: 1, perPage: 10, countryOfOrigin: 'KR' })
  });

  const { data: popular, isLoading: popularLoading } = useQuery({
    queryKey: ['manhwa', 'popular'],
    queryFn: () => fetchAniList(GET_POPULAR, { page: 1, perPage: 10, countryOfOrigin: 'KR' })
  });

  const { data: updated, isLoading: updatedLoading } = useQuery({
    queryKey: ['manhwa', 'updated'],
    queryFn: () => fetchAniList(GET_UPDATED, { page: 1, perPage: 10, countryOfOrigin: 'KR' })
  });

  const featuredManhwa = trending?.Page?.media[0];
  const trendingList = trending?.Page?.media.slice(1);
  const popularList = popular?.Page?.media;
  const updatedList = updated?.Page?.media;

  if (trendingLoading && !featuredManhwa) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#00F0FF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] pb-24 font-sans text-white">
      {/* Background ambient light */}
      <div className="fixed inset-0 pointer-events-none opacity-40 mix-blend-screen z-0">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#00F0FF]/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#FF0055]/5 rounded-full blur-[150px]"></div>
      </div>
      
      <div className="relative z-10">
        <ManhwaHero manhwa={featuredManhwa} />

        <div className="max-w-[1500px] mx-auto px-6 sm:px-8 mt-16 space-y-24">
          
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeader title="Trending Today" subtitle="The most read webtoons right now." accentColor="#00F0FF" link="#" />
            <ManhwaCarousel manhwas={trendingList} isLoading={trendingLoading} showRank={true} />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-3xl bg-gradient-to-br from-white/[0.05] to-transparent border border-white/[0.05] shadow-2xl backdrop-blur-sm relative overflow-hidden"
          >
            {/* Inner glow for section */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF0055]/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <SectionHeader title="Weekly Popular" subtitle="Top series of the week." accentColor="#FF0055" link="#" />
            <ManhwaCarousel manhwas={popularList} isLoading={popularLoading} />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeader title="Latest Releases" subtitle="Fresh chapters just dropped." accentColor="#00F0FF" link="#" />
            <ManhwaCarousel manhwas={updatedList} isLoading={updatedLoading} />
          </motion.section>

        </div>
      </div>
    </div>
  );
};

export default ManhwaHome;
