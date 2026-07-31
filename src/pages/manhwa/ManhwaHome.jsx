import { useQuery } from '@tanstack/react-query';
import { fetchAniList, GET_TRENDING, GET_POPULAR, GET_UPDATED } from '../../services/anilist';
import ManhwaHero from '../../components/manhwa/ManhwaHero';
import ManhwaCard from '../../components/manhwa/ManhwaCard';
import ErrorState from '../../components/ErrorState';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const SectionHeader = ({ title, subtitle, link }) => (
  <div className="flex items-end justify-between mb-8 border-b border-black/[0.06] pb-4">
    <div>
      <h2 className="text-2xl font-serif font-bold text-[#1D1D1F] tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-[#8B8B8B] mt-1 font-sans">{subtitle}</p>}
    </div>
    {link && (
      <a href={link} className="hidden sm:flex items-center gap-1 text-sm font-medium text-[#4F46E5] hover:text-[#4338CA] transition-colors group">
        Explore More <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </a>
    )}
  </div>
);

const ManhwaCarousel = ({ manhwas, isLoading, showRank = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse flex flex-col gap-3">
            <div className="aspect-[2/3] w-full bg-[#EAE5D9] rounded-lg"></div>
            <div className="h-4 bg-[#EAE5D9] rounded w-3/4"></div>
            <div className="h-3 bg-[#EAE5D9] rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {manhwas?.slice(0, 6).map((manhwa, i) => (
        <ManhwaCard key={manhwa.id} manhwa={manhwa} index={i} rank={showRank ? i + 1 : undefined} />
      ))}
    </div>
  );
};

const ManhwaHome = () => {
  const { data: trending, isLoading: trendingLoading, error: trendingError, refetch: refetchTrending } = useQuery({
    queryKey: ['manhwa', 'trending'],
    queryFn: () => fetchAniList(GET_TRENDING, { page: 1, perPage: 10, countryOfOrigin: 'KR' })
  });

  const { data: popular, isLoading: popularLoading, error: popularError, refetch: refetchPopular } = useQuery({
    queryKey: ['manhwa', 'popular'],
    queryFn: () => fetchAniList(GET_POPULAR, { page: 1, perPage: 10, countryOfOrigin: 'KR' })
  });

  const { data: updated, isLoading: updatedLoading, error: updatedError, refetch: refetchUpdated } = useQuery({
    queryKey: ['manhwa', 'updated'],
    queryFn: () => fetchAniList(GET_UPDATED, { page: 1, perPage: 10, countryOfOrigin: 'KR' })
  });

  const featuredManhwa = trending?.Page?.media[0];
  const trendingList = trending?.Page?.media.slice(1);
  const popularList = popular?.Page?.media;
  const updatedList = updated?.Page?.media;

  if (trendingLoading && !featuredManhwa) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4F46E5] animate-spin" />
      </div>
    );
  }

  if (trendingError || popularError || updatedError) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] pt-24">
        <ErrorState 
          message="We couldn't fetch the latest manhwa right now. Please try again."
          bgAccent="bg-[#4F46E5]"
          accentColor="text-[#4F46E5]"
          onRetry={() => {
            refetchTrending();
            refetchPopular();
            refetchUpdated();
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24 pt-16">
      {/* Background paper texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply z-0" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}></div>
      
      <div className="relative z-10">
        <ManhwaHero manhwa={featuredManhwa} />

        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 mt-16 space-y-20">
          
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeader title="Trending Today" subtitle="The most read webtoons right now." link="#" />
            <ManhwaCarousel manhwas={trendingList} isLoading={trendingLoading} showRank={true} />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeader title="Weekly Popular" subtitle="Must-read series this week." link="#" />
            <ManhwaCarousel manhwas={popularList} isLoading={popularLoading} />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeader title="Latest Releases" subtitle="Recently updated chapters." link="#" />
            <ManhwaCarousel manhwas={updatedList} isLoading={updatedLoading} />
          </motion.section>

        </div>
      </div>
    </div>
  );
};

export default ManhwaHome;
