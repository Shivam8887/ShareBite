import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Heart, User, Sun, Moon, Palette, Leaf, Eye } from 'lucide-react';

export default function NavBar() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const themeDropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(event.target)) {
        setIsThemeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes = [
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'blue', name: 'Blue', icon: Palette },
    { id: 'green', name: 'Green', icon: Leaf },
    { id: 'high-contrast', name: 'High Contrast', icon: Eye },
  ];
  const activeTheme = themes.find(t => t.id === theme) || themes[1];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'How it Works', path: '/how-it-works' },
    { name: 'Impact', path: '/impact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-primary-500/10 rounded-xl group-hover:bg-primary-500/20 transition-colors">
            <Heart className="w-6 h-6 text-primary-400 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
            ShareBite
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className="text-dark-300 hover:text-white text-sm font-medium transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Switcher */}
          <div className="relative" ref={themeDropdownRef}>
            <button 
              onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
              className="p-2 text-dark-300 hover:text-dark-100 hover:bg-dark-800/50 rounded-xl transition-all flex items-center gap-2"
              title="Change Theme"
            >
              <activeTheme.icon className="w-5 h-5 text-primary-400 transform transition-transform duration-300 hover:rotate-12" />
            </button>
            
            {isThemeDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 glass rounded-xl border border-dark-700/50 shadow-xl overflow-hidden py-1 z-50">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setTheme(t.id); setIsThemeDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 transition-colors ${
                      theme === t.id 
                        ? 'bg-primary-500/20 text-primary-400 font-medium' 
                        : 'text-dark-300 hover:bg-dark-800 hover:text-dark-100'
                    }`}
                  >
                    <t.icon className="w-4 h-4" />
                    {t.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                to="/dashboard"
                className="text-sm font-medium text-primary-400 hover:text-primary-300 transition-colors"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-white bg-dark-800 hover:bg-dark-700 rounded-full border border-dark-700 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link 
                to="/login"
                className="text-sm font-medium text-dark-300 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link 
                to="/signup"
                className="px-5 py-2 text-sm font-medium text-dark-900 bg-primary-400 hover:bg-primary-300 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:shadow-[0_0_25px_rgba(52,211,153,0.5)] transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 text-dark-300 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass border-t border-dark-700/50 py-4 px-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className="text-dark-300 hover:text-white text-lg font-medium transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-dark-700/50 w-full my-2"></div>
          
          {/* Theme Options for Mobile */}
          <div className="py-2">
            <span className="text-sm text-dark-400 font-medium px-2 uppercase tracking-wider">Theme</span>
            <div className="flex flex-wrap gap-2 mt-2 px-2">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTheme(t.id); setIsMobileMenuOpen(false); }}
                  className={`p-2 rounded-xl border transition-all flex items-center gap-2 ${
                    theme === t.id 
                      ? 'bg-primary-500/20 border-primary-500/50 text-primary-400' 
                      : 'bg-dark-800/50 border-dark-700/50 text-dark-300 hover:bg-dark-800'
                  }`}
                  title={t.name}
                >
                  <t.icon className="w-5 h-5" />
                  <span className="text-xs">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="h-px bg-dark-700/50 w-full my-2"></div>

          {user ? (
            <>
              <Link 
                to="/dashboard"
                className="text-primary-400 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="text-left text-dark-300 font-medium py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login"
                className="text-dark-300 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log In
              </Link>
              <Link 
                to="/signup"
                className="text-center mt-2 px-5 py-3 text-base font-medium text-dark-900 bg-primary-400 rounded-full"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
