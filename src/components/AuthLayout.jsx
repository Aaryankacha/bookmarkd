import { motion } from 'framer-motion';
import { BookMarked, Sparkles, BookOpen, Heart, Library, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] pt-20 pb-12 flex items-center justify-center bg-[#F8F6F2] overflow-hidden select-none">
      
      {/* Soft radial ambient background glow & graphic textures */}
      <div className="absolute top-1/4 left-10 w-[600px] h-[600px] bg-[#D4A65A]/12 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#E2C799]/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#D4A65A]/5 to-transparent blur-[120px] rounded-full pointer-events-none" />

      {/* Subtle Background SVG Line Art & Geometric Pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="auth-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1D1D1F" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#auth-grid)" />
      </svg>

      <div className="w-full max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[calc(100vh-8rem)]">
          
          {/* LEFT SIDE (55% -> 7 columns on desktop): Editorial Graphic Design Showcase */}
          <motion.div 
            className="lg:col-span-7 flex flex-col justify-center relative w-full h-full py-8 lg:py-12 order-first lg:order-none space-y-8"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Top Badge */}
            <motion.div 
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-black/[0.06] shadow-sm w-fit"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-6 h-6 rounded-lg bg-[#D4A65A]/20 border border-[#D4A65A]/30 flex items-center justify-center text-[#D4A65A]">
                <BookMarked className="w-3.5 h-3.5" />
              </div>
              <span className="font-sans text-xs font-semibold tracking-wider text-[#1D1D1F] uppercase">
                The Digital Reading Sanctuary
              </span>
            </motion.div>

            {/* Editorial Headline */}
            <div className="space-y-4 max-w-xl">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#1D1D1F] leading-[1.12] tracking-tight">
                Where stories find their <span className="italic font-serif text-[#D4A65A]">home</span> & readers unite.
              </h1>
              <p className="font-sans text-base sm:text-lg text-[#666666] leading-relaxed">
                Curate custom bookshelves, track your reading velocity, and join intimate book discussions with fellow bibliophiles around the world.
              </p>
            </div>

            {/* Floating Graphic Cards & Literary Elements */}
            <div className="relative w-full max-w-xl grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              
              {/* Card 1: Live Literary Quote */}
              <motion.div 
                className="bg-white/70 backdrop-blur-md p-5 rounded-2xl border border-black/[0.06] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#D4A65A]/10 rounded-full blur-xl group-hover:bg-[#D4A65A]/20 transition-colors" />
                <div className="flex items-center gap-2 text-[#D4A65A] mb-3">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[11px] font-semibold tracking-widest uppercase text-[#888888]">Quote of the Day</span>
                </div>
                <p className="font-serif italic text-sm text-[#1D1D1F] leading-snug">
                  &ldquo;A reader lives a thousand lives before he dies.&rdquo;
                </p>
                <span className="text-xs text-[#888888] font-sans mt-2 block">— George R.R. Martin</span>
              </motion.div>

              {/* Card 2: Community Reading Stats */}
              <motion.div 
                className="bg-white/70 backdrop-blur-md p-5 rounded-2xl border border-black/[0.06] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold tracking-widest uppercase text-[#888888]">Community Growth</span>
                  <div className="w-7 h-7 rounded-full bg-[#D4A65A]/15 flex items-center justify-center text-[#D4A65A]">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-3xl font-semibold text-[#1D1D1F]">12,400+</span>
                  <span className="text-xs text-[#2E7D32] font-medium font-sans">+18% this month</span>
                </div>
                <p className="text-xs text-[#666666] mt-1 font-sans">Active reading streaks tracked daily</p>
              </motion.div>

              {/* Card 3: Feature Highlights */}
              <motion.div 
                className="sm:col-span-2 bg-gradient-to-r from-white/80 via-white/60 to-white/80 backdrop-blur-md p-5 rounded-2xl border border-black/[0.06] shadow-sm flex items-center justify-between gap-4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#D4A65A]/15 border border-[#D4A65A]/30 flex items-center justify-center text-[#D4A65A] shrink-0">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-semibold text-sm text-[#1D1D1F]">Intelligent Recommendations</h4>
                    <p className="text-xs text-[#666666] font-sans">Discover books tailored to your unique literary taste.</p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1D1D1F] text-white text-xs font-medium shrink-0 shadow-sm">
                  <Library className="w-3.5 h-3.5 text-[#D4A65A]" />
                  <span>Free Forever</span>
                </div>
              </motion.div>

            </div>

            {/* Subtle Floating Decorative Graphics */}
            <div className="flex items-center gap-6 pt-2 text-[#888888] text-xs font-sans">
              <div className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-[#D4A65A]" />
                <span>Zero Ads or Distractions</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-[#CCCCCC]" />
              <div>Cloud Sync Across Devices</div>
            </div>

          </motion.div>

          {/* RIGHT SIDE (45% -> 5 columns on desktop): Glassmorphism Auth Card */}
          <motion.div 
            className="lg:col-span-5 flex items-center justify-center w-full z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="w-full max-w-[480px] bg-white/80 backdrop-blur-2xl p-8 sm:p-10 rounded-[24px] border border-white/90 shadow-[0_20px_60px_rgba(0,0,0,0.06)] text-[#1D1D1F] transition-all">
              
              {/* Header */}
              <div className="flex flex-col items-center text-center mb-8">
                <Link to="/" className="w-12 h-12 rounded-2xl bg-[#D4A65A]/15 border border-[#D4A65A]/30 flex items-center justify-center text-[#D4A65A] mb-4 hover:scale-105 transition-transform shadow-sm">
                  <BookMarked className="w-6 h-6" />
                </Link>
                <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1D1D1F] tracking-tight">
                  {title}
                </h2>
                <p className="text-[#666666] text-sm mt-2 font-sans max-w-sm">
                  {subtitle}
                </p>
              </div>

              {/* Form content (passed as children) */}
              {children}

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

