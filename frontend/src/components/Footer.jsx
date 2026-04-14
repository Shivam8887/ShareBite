import React from 'react';
import { Heart, Github, Twitter, Linkedin, Mail, MapPin, Phone, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const quickLinks = [
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact Us' },
    { to: '/how-it-works', label: 'How it Works' },
    { to: '/login', label: 'Partner with Us' },
    { to: '/faq', label: 'FAQ' },
  ];

  const legalLinks = [
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms of Service' },
    { to: '/guidelines', label: 'Community Guidelines' },
    { to: '/cookie-policy', label: 'Cookie Policy' },
  ];

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8 relative overflow-hidden">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-60" />

      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-green-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50 rounded-full translate-y-1/2 -translate-x-1/2 opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" onClick={scrollToTop} className="flex items-center gap-2.5 group mb-6 w-fit">
              <div className="p-2 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                <img src="/ShareBiteicon.png" alt="ShareBite Logo" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-xl font-bold gradient-text">ShareBite</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
              Connecting surplus food with those in need. Join our community of donors, NGOs, and volunteers to make a real difference, one meal at a time.
            </p>
            <div className="flex gap-3 pt-2">
              <a
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-green-500 hover:border-green-300 hover:shadow-soft transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/Shivam8887/ShareBite"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-green-500 hover:border-green-300 hover:shadow-soft transition-all"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-green-500 hover:border-green-300 hover:shadow-soft transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-slate-800 font-bold tracking-tight">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={scrollToTop}
                    className="text-sm text-slate-500 hover:text-green-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-6 text-slate-800 font-bold tracking-tight">Legal</h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    onClick={scrollToTop}
                    className="text-sm text-slate-500 hover:text-green-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-slate-800 font-bold tracking-tight">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-slate-500 text-sm leading-relaxed">
                  Institute of Technology and Management, Gida Gorakhpur.
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-slate-500 text-sm">+91 8887830748</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-green-500" />
                </div>
                <a
                  href="mailto:info@sharebite.com"
                  className="text-slate-500 hover:text-green-600 text-sm transition-colors"
                >
                  info@sharebite.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} ShareBite. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-slate-400 text-sm">
              Made with{' '}
              <Heart className="w-4 h-4 text-green-500 fill-green-500" />
              {' '}for the community
            </div>

            <button
              onClick={scrollToTop}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 hover:text-green-500 hover:border-green-300 hover:shadow-soft transition-all group"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
