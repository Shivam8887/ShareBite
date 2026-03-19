import React from 'react';
import { motion } from 'framer-motion';
import { Users, Globe, Award, TrendingUp, HandHeart, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Impact() {
  const stats = [
    { label: "Meals Saved", value: "10,000+", icon: <UtensilsCrossed className="w-8 h-8 text-primary-400" /> },
    { label: "Active NGOs", value: "150+", icon: <Users className="w-8 h-8 text-accent-400" /> },
    { label: "Volunteers", value: "500+", icon: <HandHeart className="w-8 h-8 text-primary-600" /> },
    { label: "Cities Reached", value: "12", icon: <Globe className="w-8 h-8 text-white" /> }
  ];

  const milestones = [
    { year: "2024", title: "Launch of ShareBite", desc: "Started operations with our first 5 NGO partners and successfully saved 100 meals in the first week." },
    { year: "2025", title: "Expanding the Network", desc: "Partnered with over 50 restaurants, hitting the milestone of 5,000 meals saved." },
    { year: "2026", title: "National Outreach", desc: "Expanded to 12 cities across the nation with a robust fleet of dedicated volunteers." },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 font-sans selection:bg-primary-500/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dark-800/50 border border-dark-700 text-accent-400 text-sm font-medium mb-6"
          >
            <Award className="w-4 h-4" />
            Our Impact So Far
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6"
          >
            Making a <span className="bg-gradient-to-r from-accent-400 to-accent-200 bg-clip-text text-transparent">Real Difference</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-dark-300 max-w-2xl mx-auto"
          >
            At ShareBite, every meal saved is a step toward ending global hunger and reducing food waste. Discover the numbers that drive our passion.
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
          {stats.map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={i}
              className="glass p-8 rounded-3xl border border-dark-700/50 relative overflow-hidden group hover:border-dark-600 transition-colors"
            >
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-dark-800/50 rounded-full blur-2xl group-hover:bg-primary-500/10 transition-colors"></div>
              <div className="mb-6">{stat.icon}</div>
              <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-dark-400 font-medium tracking-wide uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Timeline Section */}
        <div className="max-w-4xl mx-auto glass p-10 md:p-16 rounded-3xl border border-dark-700/50 mb-24">
          <div className="flex items-center gap-4 mb-12">
            <TrendingUp className="w-8 h-8 text-primary-400" />
            <h2 className="text-3xl font-bold text-white">Our Journey</h2>
          </div>
          
          <div className="space-y-12">
            {milestones.map((milestone, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                key={i}
                className="relative pl-8 md:pl-0"
              >
                {/* Desktop layout line */}
                <div className="hidden md:block absolute left-[120px] top-0 bottom-[-48px] w-px bg-dark-700 last:hidden"></div>
                
                <div className="flex flex-col md:flex-row gap-4 md:gap-12 relative">
                  {/* Timeline dot */}
                  <div className="absolute left-[-32px] md:left-[116px] top-2 w-2 h-2 rounded-full bg-primary-400 ring-4 ring-dark-900 border border-primary-400"></div>
                  
                  <div className="md:w-[100px] text-primary-400 font-bold text-xl pt-1">
                    {milestone.year}
                  </div>
                  <div className="flex-1 pb-12 md:pb-0 border-b md:border-b-0 border-dark-800 last:border-0">
                    <h3 className="text-2xl font-bold text-white mb-3">{milestone.title}</h3>
                    <p className="text-dark-300 leading-relaxed">{milestone.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-dark-800/50 p-12 rounded-3xl border border-dark-700/50"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Be Part of Our Story</h2>
          <p className="text-dark-300 mb-8 max-w-xl mx-auto">
            The simplest actions can have the biggest impact. Sign up as a donor or a volunteer and start making a difference today.
          </p>
          <Link to="/signup">
            <button className="px-8 py-4 bg-primary-500 hover:bg-primary-400 text-dark-950 font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              Get Involved Now
            </button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
