import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Search, Users, ShieldCheck, HeartPulse, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function LandingPage() {
  const features = [
    {
      icon: <MapPin className="w-6 h-6 text-primary-400" />,
      title: "Real-time Location",
      desc: "Auto-detects location for seamless matching between donors and NGOs."
    },
    {
      icon: <Users className="w-6 h-6 text-accent-400" />,
      title: "Direct Volunteer Pickup",
      desc: "Like food delivery, but for donations. Volunteers accept and deliver directly."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary-600" />,
      title: "Secure & Transparent",
      desc: "Real-time status tracking and robust auth structure ensure safe operations."
    }
  ];

  const stats = [
    { label: "Meals Saved", value: "10,000+" },
    { label: "Active NGOs", value: "150+" },
    { label: "Volunteers", value: "500+" },
    { label: "Cities", value: "12" }
  ];

  return (
    <div className="min-h-screen pt-24 font-sans selection:bg-primary-500/30">
      <SEO 
        title="Home"
        description="ShareBite: Connect restaurants and individuals with surplus food to NGOs and volunteers in real-time."
      />
      {/* Hero Section */}
      <div className="relative overflow-hidden w-full max-w-7xl mx-auto px-6 pt-10 pb-24 md:pt-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-500/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-800/50 border border-dark-700 text-primary-400 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              Now live in 12 cities
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-dark-50">
              Share Food, <br/>
              <span className="bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">Spread Hope.</span>
            </h1>
            
            <p className="text-lg text-dark-300 max-w-xl leading-relaxed">
              ShareBite connects restaurants and individuals with surplus food to NGOs and volunteers in real-time. Eliminating waste, one meal at a time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/signup">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-4 bg-primary-500 hover:bg-primary-400 text-dark-950 font-semibold rounded-full shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-colors flex items-center justify-center gap-2"
                >
                  Join the Movement <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <Link to="/how-it-works">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto px-8 py-4 bg-dark-800 hover:bg-dark-700 text-white font-medium rounded-full border border-dark-700 transition-colors"
                >
                  See How It Works
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 w-full relative"
          >
            <div className="aspect-square md:aspect-[4/3] rounded-3xl border border-dark-700/50 glass relative overflow-hidden flex items-center justify-center bg-dark-800/20">
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent z-10"></div>
              {/* Decorative map elements */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-20 flex flex-col items-center gap-4"
              >
                <div className="w-24 h-24 rounded-full bg-primary-500/20 flex items-center justify-center border border-primary-500/30">
                  <MapPin className="w-10 h-10 text-primary-400" />
                </div>
                <div className="glass px-6 py-4 rounded-2xl flex items-center gap-4 border border-dark-700/50">
                   <div className="w-10 h-10 rounded-full bg-accent-500/20 flex items-center justify-center">
                     <span className="w-2.5 h-2.5 bg-accent-500 rounded-full animate-pulse"></span>
                   </div>
                   <div>
                     <p className="text-white font-medium text-sm">Donation Available</p>
                     <p className="text-dark-400 text-xs">0.5 km away • 50 meals</p>
                   </div>
                </div>
                <div className="glass px-6 py-4 rounded-2xl flex items-center gap-4 border border-dark-700/50 ml-12">
                   <div className="w-10 h-10 rounded-full bg-primary-600/20 flex items-center justify-center">
                     <span className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-pulse"></span>
                   </div>
                   <div>
                     <p className="text-white font-medium text-sm">Volunteer En Route</p>
                     <p className="text-dark-400 text-xs">Arriving in 10 mins</p>
                   </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Divider */}
      <div className="border-y border-dark-800 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i} 
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-dark-400 font-medium tracking-wide uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link to="/impact" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors">
              View Our Full Impact <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-32 relative">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How ShareBite Works</h2>
          <p className="text-dark-400 max-w-2xl mx-auto">A seamless platform connecting the dots between surplus food and empty stomachs.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              key={i}
              className="glass p-8 rounded-3xl hover:bg-dark-800/40 transition-colors border border-dark-700/50"
            >
              <div className="w-14 h-14 rounded-2xl bg-dark-800 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-dark-300 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/how-it-works">
            <button className="px-8 py-4 bg-dark-800 hover:bg-dark-700 text-white font-medium rounded-full border border-dark-700 transition-colors">
              Explore Our Process in Detail
            </button>
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-6 pb-32">
        <div className="relative rounded-3xl overflow-hidden glass border border-primary-500/20 p-12 md:p-16 text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-primary-300/10 z-0"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to make an impact?</h2>
            <p className="text-dark-200 text-lg mb-10">Whether you're a restaurant with surplus food, an NGO needing supplies, or an individual ready to volunteer—we need you.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup">
                <button className="px-8 py-4 bg-primary-500 hover:bg-primary-400 text-dark-950 font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                  Create an Account
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
