import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Users, ShieldCheck, Leaf, Zap, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import HeroCarousel from '../components/HeroCarousel';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function LandingPage() {
  const problems = [
    {
      icon: '🗑️',
      color: 'bg-red-50 border-red-100',
      iconBg: 'bg-red-100',
      title: 'Massive Food Waste',
      desc: 'Restaurants, events, and households discard tons of perfectly edible food daily due to lack of distribution channels.',
    },
    {
      icon: '😔',
      color: 'bg-amber-50 border-amber-100',
      iconBg: 'bg-amber-100',
      title: 'Widespread Hunger',
      desc: 'Millions of underprivileged people struggle with hunger despite food being readily available and wasted nearby.',
    },
    {
      icon: '🔗',
      color: 'bg-blue-50 border-blue-100',
      iconBg: 'bg-blue-100',
      title: 'No Real-Time Link',
      desc: 'There is no efficient, real-time system connecting food donors with NGOs and volunteers seamlessly.',
    },
  ];

  const solutions = [
    {
      icon: <Zap className="w-6 h-6 text-green-600" />,
      title: 'Smart Matching',
      desc: 'Auto-connects donors with the nearest NGOs and available volunteers using location-based technology.',
    },
    {
      icon: <Leaf className="w-6 h-6 text-green-600" />,
      title: 'Fast Delivery',
      desc: 'Volunteers pick up food quickly and deliver efficiently, reducing spoilage and ensuring timely distribution.',
    },
    {
      icon: <Eye className="w-6 h-6 text-green-600" />,
      title: 'Full Transparency',
      desc: 'Real-time tracking lets all users monitor the journey of donations from pickup to delivery.',
    },
  ];

  const features = [
    {
      icon: <MapPin className="w-6 h-6 text-green-600" />,
      bg: 'bg-green-50',
      title: 'Real-time Location',
      desc: 'Automatically detects and matches your location with nearby NGOs and volunteers for faster pickup.',
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50',
      title: 'Direct Volunteer Pickup',
      desc: 'Like a delivery app, volunteers accept requests instantly and pick up food directly from donors.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50',
      title: 'Secure & Transparent',
      desc: 'Every donation is tracked in real-time with proper authentication and full visibility throughout.',
    },
  ];

  const stats = [
    { value: '100+', label: 'Meals Saved', icon: '🍱' },
    { value: '10+', label: 'Active NGOs', icon: '🏢' },
    { value: '10+', label: 'Volunteers', icon: '🚴' },
    { value: '2+', label: 'Cities', icon: '🌆' },
  ];

  const userTypes = [
    {
      emoji: '🍽️',
      title: 'Restaurants & Donors',
      desc: 'Easily donate surplus food instead of wasting it, while contributing to a meaningful cause.',
      color: 'border-green-200 hover:border-green-400',
      badge: 'bg-green-50 text-green-700',
    },
    {
      emoji: '🏢',
      title: 'NGOs',
      desc: 'Receive food donations efficiently and distribute them to communities in need.',
      color: 'border-blue-200 hover:border-blue-400',
      badge: 'bg-blue-50 text-blue-700',
    },
    {
      emoji: '🚴',
      title: 'Volunteers',
      desc: 'Join as a volunteer and help bridge the gap by picking up and delivering food.',
      color: 'border-amber-200 hover:border-amber-400',
      badge: 'bg-amber-50 text-amber-700',
    },
  ];

  return (
    <div className="min-h-screen pt-[72px] font-sans selection:bg-green-200">
      <SEO
        title="Home"
        description="ShareBite connects surplus food with NGOs and volunteers in real-time. Reduce food waste and fight hunger."
      />

      {/* HERO CAROUSEL */}
      <HeroCarousel />

      {/* ===== PROBLEM SECTION ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
              The Challenge
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              The Problem We're Solving
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-500 leading-relaxed">
              Every day, restaurants, events, and households generate large amounts of surplus food that goes to waste —
              while millions struggle to find even a single meal.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((p, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`card-hover p-7 rounded-2xl border-2 ${p.color} bg-white`}
              >
                <div className={`w-12 h-12 ${p.iconBg} rounded-xl flex items-center justify-center text-2xl mb-5`}>
                  {p.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{p.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOLUTION SECTION ===== */}
      <section className="py-24 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
              Our Approach
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Our Solution
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-500 leading-relaxed">
              ShareBite bridges the gap between surplus food and hunger using real-time location tracking,
              intelligent matching, and a strong volunteer network.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {solutions.map((s, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="card-hover bg-white p-7 rounded-2xl border border-slate-200 shadow-soft"
              >
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-5">
                  {s.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{s.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS SECTION ===== */}
      <section className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-4xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-slate-400 text-sm uppercase tracking-wide font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/impact"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold text-sm transition-colors"
            >
              View Full Impact Report <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full uppercase tracking-wider mb-4">
              Platform Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              Key Features
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="card-hover bg-white p-8 rounded-2xl border border-slate-200 shadow-soft"
              >
                <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-5`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHO CAN USE ===== */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-14"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Who Can Use ShareBite?
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Our platform is designed to serve every stakeholder in the food donation ecosystem.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {userTypes.map((u, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className={`card-hover bg-white p-8 rounded-2xl border-2 ${u.color} text-center transition-all`}
              >
                <div className="text-5xl mb-5">{u.emoji}</div>
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 ${u.badge}`}>
                  {u.title.split(' ')[0]}
                </span>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{u.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{u.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-24 bg-gradient-to-br from-green-500 to-emerald-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="text-5xl mb-6">🌍</div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Ready to Make an Impact?
            </h2>
            <p className="text-green-100 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Join ShareBite today and become part of a growing movement to reduce food waste
              and fight hunger through technology and community collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-4 bg-white text-green-700 font-bold rounded-full hover:bg-green-50 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-lg"
              >
                Get Started Free
              </Link>
              <Link
                to="/how-it-works"
                className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all text-lg"
              >
                How It Works
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}