import { BookMarked, Github, Linkedin, Twitter, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="bookmarkd-footer-container">
      <div className="footer-top-divider"></div>
      
      <div className="bookmarkd-footer-content">
        {/* Left Section */}
        <motion.div 
          className="footer-brand"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="footer-brand-header">
            <div className="footer-logo-icon">
              <BookMarked className="w-5 h-5" />
            </div>
            <span className="footer-logo-text">Bookmarkd</span>
          </div>
          <p className="footer-tagline">
            Your digital bookshelf for discovering, tracking, and sharing great books.
          </p>
          <p className="footer-description">
            Bookmarkd helps readers discover new stories, organize their personal library, and connect with book lovers around the world.
          </p>
        </motion.div>

        {/* Quick Links: Explore */}
        <motion.div 
          className="footer-column"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h3>Explore</h3>
          <ul className="footer-links">
            <li><Link to="/" className="footer-link">Home</Link></li>
            <li><Link to="/search" className="footer-link">Discover</Link></li>
            <li><Link to="/search?sort=trending" className="footer-link">Trending</Link></li>
            <li><Link to="/search?category=fiction" className="footer-link">Genres</Link></li>
            <li><Link to="/search" className="footer-link">Search</Link></li>
          </ul>
        </motion.div>

        {/* Community */}
        <motion.div 
          className="footer-column"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3>Community</h3>
          <ul className="footer-links">
            <li><Link to="/reviews" className="footer-link">Reviews</Link></li>
            <li><Link to="/lists" className="footer-link">Book Lists</Link></li>
            <li><Link to="/clubs" className="footer-link">Reading Clubs</Link></li>
            <li><Link to="/feed" className="footer-link">Activity Feed</Link></li>
            <li><Link to="/friends" className="footer-link">Friends</Link></li>
          </ul>
        </motion.div>

        {/* Account */}
        <motion.div 
          className="footer-column"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3>Account</h3>
          <ul className="footer-links">
            <li><Link to="/profile" className="footer-link">Profile</Link></li>
            <li><Link to="/profile?tab=reading" className="footer-link">Reading List</Link></li>
            <li><Link to="/profile?tab=favorites" className="footer-link">Favorites</Link></li>
            <li><Link to="/settings" className="footer-link">Settings</Link></li>
            <li><Link to="/login" className="footer-link">Sign In / Sign Out</Link></li>
          </ul>
        </motion.div>

        {/* Legal */}
        <motion.div 
          className="footer-column"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3>Legal</h3>
          <ul className="footer-links">
            <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
            <li><Link to="/terms" className="footer-link">Terms of Service</Link></li>
            <li><Link to="/contact" className="footer-link">Contact</Link></li>
            <li><Link to="/about" className="footer-link">About</Link></li>
          </ul>
        </motion.div>
      </div>

      <div className="footer-bottom-section">
        <div className="footer-social-newsletter">
          <motion.div 
            className="footer-socials"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-social-btn"
              aria-label="GitHub"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Github className="w-5 h-5" />
            </motion.a>
            <motion.a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-social-btn"
              aria-label="LinkedIn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Linkedin className="w-5 h-5" />
            </motion.a>
            <motion.a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="footer-social-btn"
              aria-label="Twitter"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Twitter className="w-5 h-5" />
            </motion.a>
          </motion.div>

          <motion.div 
            className="footer-newsletter"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h4 className="newsletter-title">Stay Updated</h4>
            <p className="newsletter-subtitle">Receive book recommendations and feature updates.</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="newsletter-input" 
                required 
              />
              <motion.button 
                type="submit" 
                className="newsletter-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>

        <div className="footer-bottom-bar">
          <p>&copy; {new Date().getFullYear()} Bookmarkd. All rights reserved.</p>
          <p className="made-with-love">
            Made with <Heart className="w-4 h-4 heart-icon" fill="currentColor" /> for readers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
