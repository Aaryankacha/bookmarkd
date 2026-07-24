import { Github, BookMarked, Heart, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-black/[0.06] bg-[#F8F6F2]/90 backdrop-blur-xl mt-24 relative z-10 w-full">
      <div className="max-w-[1500px] mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#D4A65A]/15 border border-[#D4A65A]/30 flex items-center justify-center text-[#D4A65A]">
              <BookMarked className="w-4 h-4 text-[#D4A65A]" />
            </div>
            <div>
              <span className="font-serif text-lg font-semibold text-[#1D1D1F] tracking-tight">Bookmarkd</span>
              <p className="text-[11px] text-[#666666] font-sans">The literary sanctuary for passionate readers.</p>
            </div>
          </div>
          
          {/* Nav Links */}
          <div className="flex gap-8 text-xs font-sans text-[#666666]">
            <Link to="/" className="hover:text-[#D4A65A] transition-colors">Home</Link>
            <Link to="/search" className="hover:text-[#D4A65A] transition-colors">Discover</Link>
            <Link to="/clubs" className="hover:text-[#D4A65A] transition-colors">Book Clubs</Link>
            <Link to="/lists" className="hover:text-[#D4A65A] transition-colors">Curated Lists</Link>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-xl bg-white hover:bg-[#F0ECE1] border border-black/[0.08] text-[#666666] hover:text-[#1D1D1F] transition-all shadow-sm"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2 rounded-xl bg-white hover:bg-[#F0ECE1] border border-black/[0.08] text-[#666666] hover:text-[#1D1D1F] transition-all shadow-sm"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-black/[0.04] flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-sans text-[#888888]">
          <p>&copy; {new Date().getFullYear()} Bookmarkd. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-[#D4A65A] fill-[#D4A65A] animate-pulse" />
            <span>for readers everywhere.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
