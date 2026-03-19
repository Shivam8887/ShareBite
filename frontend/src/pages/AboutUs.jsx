import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Target, Users, Zap, ShieldCheck } from 'lucide-react';

export default function AboutUs() {
  const values = [
    {
      icon: <Heart className="w-8 h-8 text-primary-400" />,
      title: "Compassion First",
      desc: "Every action we take is driven by empathy and a genuine desire to help those facing food insecurity."
    },
    {
      icon: <Target className="w-8 h-8 text-accent-400" />,
      title: "Zero Waste Goal",
      desc: "Our primary objective is to connect edible surplus food directly to empty plates, reducing environmental impact."
    },
    {
      icon: <Users className="w-8 h-8 text-blue-400" />,
      title: "Community Driven",
      desc: "We believe real change happens when local communities, businesses, and volunteers unite for a common cause."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Action Oriented",
      desc: "Time is of the essence when it comes to food. Our platform operates in real-time to ensure fast, efficient distribution."
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative font-sans">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-6xl mx-auto space-y-24">
        
        {/* Header Section */}
        <section className="text-center space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extrabold text-white tracking-tight"
          >
            About <span className="bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">ShareBite</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-dark-300 max-w-3xl mx-auto leading-relaxed"
          >
            We are on a mission to bridge the gap between food surplus and food scarcity, empowering communities to share resources seamlessly and sustainably.
          </motion.p>
        </section>

        {/* The Story Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-white">Our Story</h2>
            <div className="space-y-4 text-dark-300 leading-relaxed text-lg">
              <p>
                ShareBite began with a simple observation: every day, massive amounts of perfectly good food are thrown away by restaurants, events, and households, while simultaneously, people in our very communities go to bed hungry.
              </p>
              <p>
                We realized the problem wasn't a lack of food, but a lack of connection. Transportation and logistics were the missing links.
              </p>
              <p>
                By building a real-time, location-aware platform, we've created a direct bridge. NGOs can signal needs, restaurants can signal surplus, and a dedicated fleet of community volunteers can make the delivery happen securely and transparently.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-8 rounded-3xl border border-dark-700/50 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5"></div>
            <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6 py-8">
              <ShieldCheck className="w-20 h-20 text-primary-400" />
              <h3 className="text-2xl font-bold text-white">Share Food, Spread Hope.</h3>
              <p className="text-dark-300">Join thousands of others in the movement against food waste.</p>
            </div>
          </motion.div>
        </section>

        {/* Core Values Section */}
        <section className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Our Core Values</h2>
            <p className="text-dark-400 max-w-2xl mx-auto">The principles that guide our platform, our team, and our wonderful community.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-6 rounded-2xl border border-dark-700/50 hover:border-primary-500/30 transition-all hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-dark-800 rounded-2xl flex items-center justify-center mb-6">
                  {v.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{v.title}</h3>
                <p className="text-dark-300 leading-relaxed text-sm">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
