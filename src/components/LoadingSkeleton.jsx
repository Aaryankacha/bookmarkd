import { motion } from 'framer-motion';

export const BookCardSkeleton = () => {
  return (
    <div className="flex-none w-[180px] space-y-3">
      <div className="w-full h-[260px] bg-surface rounded-xl overflow-hidden relative">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-surface rounded-md w-3/4 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <div className="h-3 bg-surface rounded-md w-1/2 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>
    </div>
  );
};

export const BookRowSkeleton = () => {
  return (
    <div className="flex gap-6 overflow-hidden">
      {[...Array(6)].map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
};
