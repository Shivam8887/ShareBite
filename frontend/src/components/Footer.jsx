import React from 'react';
import { Heart, Github, Twitter, Linkedin, Mail, MapPin, Phone, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  // Reusable scroll-to-top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-dark-900/80 border-t border-dark-800/50 pt-16 pb-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" onClick={scrollToTop} className="flex items-center gap-2 group mb-6">
              <div className="p-2 bg-primary-500/10 rounded-xl">
                <Heart className="w-6 h-6 text-primary-400" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
                ShareBite
              </span>
            </Link>
            <p className="text-dark-400 text-sm leading-relaxed">
              Connecting surplus food with those in need. Join our community of donors, NGOs, and volunteers to make a real difference, one meal at a time.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-dark-800/50 flex items-center justify-center text-dark-400 hover:text-primary-400 hover:bg-dark-800 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-dark-800/50 flex items-center justify-center text-dark-400 hover:text-primary-400 hover:bg-dark-800 transition-all">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-dark-800/50 flex items-center justify-center text-dark-400 hover:text-primary-400 hover:bg-dark-800 transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/about" onClick={scrollToTop} className="text-dark-400 hover:text-primary-400 text-sm transition-colors">About Us</Link></li>
              <li><Link to="/contact" onClick={scrollToTop} className="text-dark-400 hover:text-primary-400 text-sm transition-colors">Contact Us</Link></li>
              <li><Link to="/#how-it-works" onClick={scrollToTop} className="text-dark-400 hover:text-primary-400 text-sm transition-colors">How it Works</Link></li>
              <li><Link to="/login" onClick={scrollToTop} className="text-dark-400 hover:text-primary-400 text-sm transition-colors">Partner with Us</Link></li>
              <li><Link to="/faq" onClick={scrollToTop} className="text-dark-400 hover:text-primary-400 text-sm transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-6">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy" onClick={scrollToTop} className="text-dark-400 hover:text-primary-400 text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" onClick={scrollToTop} className="text-dark-400 hover:text-primary-400 text-sm transition-colors">Terms of Service</Link></li>
              <li><Link to="/guidelines" onClick={scrollToTop} className="text-dark-400 hover:text-primary-400 text-sm transition-colors">Community Guidelines</Link></li>
              <li><Link to="/cookie-policy" onClick={scrollToTop} className="text-dark-400 hover:text-primary-400 text-sm transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-400 shrink-0 mt-0.5" />
                <span className="text-dark-400 text-sm">Institute of Technology and Management , Gida Gorakhpur.</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-400 shrink-0" />
                <span className="text-dark-400 text-sm">+91 8887830748</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-400 shrink-0" />
                <a href="mailto:hello@sharebite.org" className="text-dark-400 hover:text-primary-400 text-sm transition-colors">hello@sharebite.org</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-dark-800/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-dark-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} ShareBite. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-dark-500 text-sm">
              Made with <Heart className="w-4 h-4 text-primary-500 mx-1" /> for the community
            </div>
            
            {/* Scroll to Top Button */}
            <button 
              onClick={scrollToTop}
              className="flex items-center justify-center p-2 rounded-full bg-dark-800/80 text-dark-400 hover:text-primary-400 hover:bg-dark-700 transition-all cursor-pointer group"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
