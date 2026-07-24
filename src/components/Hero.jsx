import { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Spline = lazy(() => import('@splinetool/react-spline'));

const LITERARY_QUOTES = [
  {
    quote: "How could you live and have no story to tell?",
    author: "Fyodor Dostoevsky"
  },
  {
    quote: "A room without books is like a body without a soul.",
    author: "Cicero"
  },
  {
    quote: "The only way to deal with an unfree world is to become so absolutely free that your very existence is an act of rebellion.",
    author: "Albert Camus"
  },
  {
    quote: "Carpe diem. Seize the day.",
    author: "Horace"
  }
];

const Hero = () => {
  const navigate = useNavigate();
  const [quoteData, setQuoteData] = useState(LITERARY_QUOTES[0]);
  const [splineLoaded, setSplineLoaded] = useState(false);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * LITERARY_QUOTES.length);
    setQuoteData(LITERARY_QUOTES[randomIndex]);
  }, []);

  const handleSplineLoad = (spline) => {
    setSplineLoaded(true);
    if (!spline) return;

    try {
      const applyZoom = () => {
        if (typeof spline.setZoom === 'function') {
          spline.setZoom(0.55);
        }
        const camera = spline._camera || spline.camera;
        if (camera) {
          camera.zoom = 0.55;
          if (typeof camera.updateProjectionMatrix === 'function') {
            camera.updateProjectionMatrix();
          }
        }
      };

      applyZoom();
      window.addEventListener('resize', applyZoom);

      if (typeof spline.requestRender === 'function') {
        spline.requestRender();
      }
    } catch (e) {
      console.log('Spline zoom setting:', e);
    }
  };

  return (
    <div className="relative flex items-center justify-center pt-12 lg:pt-16 pb-6 lg:pb-10 max-w-[1500px] mx-auto px-6 lg:px-12 overflow-hidden">
      
      {/* Soft warm ambient radial lights */}
      <div className="absolute top-10 left-0 w-[600px] h-[600px] bg-[#D4A65A]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#7C5C38]/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* LEFT COLUMN (~35% width for typography) */}
        <motion.div 
          className="lg:col-span-4 xl:col-span-4 flex flex-col justify-center space-y-7 z-10"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-black/[0.08] shadow-sm w-fit"
          >
            <Star className="w-3.5 h-3.5 text-[#D4A65A] fill-[#D4A65A]" />
            <span className="text-[11px] tracking-wider uppercase font-semibold text-[#7C5C38]">
              A Modern Sanctuary For Readers
            </span>
          </motion.div>

          {/* Quote Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-3"
          >
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#1D1D1F] leading-[1.12] tracking-tight">
              &ldquo;{quoteData.quote}&rdquo;
            </h1>
            <p className="text-[#7C5C38] font-serif italic text-lg sm:text-xl tracking-wide pt-1">
              — {quoteData.author}
            </p>
          </motion.div>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[#666666] text-sm sm:text-base leading-relaxed max-w-lg font-sans font-normal"
          >
            Bookmarkd helps readers discover books, build beautiful personal libraries, review their favorites, and connect with readers around the world.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1"
          >
            <button 
              onClick={() => navigate('/search')}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#D4A65A] hover:bg-[#C29549] text-white font-medium text-sm rounded-xl transition-all duration-300 shadow-lg shadow-[#D4A65A]/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Reading</span>
            </button>

            <button 
              onClick={() => navigate('/clubs')}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-white/80 hover:bg-white border border-black/[0.08] hover:border-black/[0.15] text-[#1D1D1F] font-medium text-sm rounded-xl transition-all duration-300 shadow-sm hover:scale-[1.02] active:scale-[0.98]"
            >
              <BookOpen className="w-4 h-4 text-[#666666]" />
              <span>Explore Books</span>
            </button>
          </motion.div>

        </motion.div>

        {/* RIGHT COLUMN (~65% width) - Centered 3D Floating Sculpture */}
        <motion.div 
          className="lg:col-span-8 xl:col-span-8 relative w-full h-[450px] sm:h-[550px] lg:h-[600px] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {!splineLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/30 rounded-3xl backdrop-blur-md">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[#D4A65A]/30 border-t-[#D4A65A] rounded-full animate-spin" />
                <span className="text-xs text-[#666666] font-sans tracking-wider uppercase">Loading 3D Canvas...</span>
              </div>
            </div>
          )}

          <Suspense fallback={null}>
            <div className="w-full h-full flex items-center justify-center relative cursor-grab active:cursor-grabbing -translate-y-12 sm:-translate-y-16 lg:-translate-y-20">
              <Spline
                scene="https://prod.spline.design/DJSaOzH7KcAfKnHX/scene.splinecode"
                onLoad={handleSplineLoad}
                className="w-full h-full block pointer-events-auto"
              />
            </div>
          </Suspense>
        </motion.div>

      </div>
    </div>
  );
};

export default Hero;
