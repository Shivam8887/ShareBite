import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Users, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import HeroCarousel from '../components/HeroCarousel';

export default function LandingPage() {

  const features = [
    {
      icon: <MapPin className="w-6 h-6 text-primary-400" />,
      title: "Real-time Location",
      desc: "Our system automatically detects and matches your location with nearby NGOs and volunteers, ensuring faster pickup and minimal delay in delivering food to those who need it most."
    },
    {
      icon: <Users className="w-6 h-6 text-accent-400" />,
      title: "Direct Volunteer Pickup",
      desc: "Just like a delivery app, volunteers can accept requests instantly and pick up food directly from donors, ensuring quick, efficient, and reliable delivery to NGOs."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary-600" />,
      title: "Secure & Transparent",
      desc: "Every donation is tracked in real-time with proper authentication, giving complete visibility and trust to donors, NGOs, and volunteers throughout the process."
    }
  ];

  const stats = [
    { label: "Meals Saved", value: "100+" },
    { label: "Active NGOs", value: "10+" },
    { label: "Volunteers", value: "10+" },
    { label: "Cities", value: "2+" }
  ];

  return (
    <div className="min-h-screen pt-24 font-sans selection:bg-primary-500/30">
      
      <SEO 
        title="Home"
        description="ShareBite connects surplus food with NGOs and volunteers in real-time."
      />

      {/* HERO */}
      <HeroCarousel />

      {/* ================= PROBLEM ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl md:text-4xl mb-6 text-gray-900 dark:text-dark-50 font-bold tracking-tight">
          The Problem We’re Solving
        </h2>

        <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-dark-300 leading-relaxed">
          Every day, restaurants, events, and households generate large amounts of surplus food that goes to waste. 
          At the same time, millions of people struggle to find even a single meal. The issue is not the lack of food, 
          but the lack of a real-time system that connects food donors with those who need it.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="glass p-6 rounded-2xl border border-gray-200 dark:border-dark-700/50 bg-white/50 dark:bg-transparent">
            <h3 className="text-xl mb-2 text-gray-900 dark:text-dark-50 font-bold tracking-tight">Food Waste</h3>
            <p className="text-gray-600 dark:text-dark-300 leading-relaxed">
              Large quantities of perfectly edible food are discarded daily due to lack of distribution channels and awareness.
            </p>
          </div>

          <div className="glass p-6 rounded-2xl border border-gray-200 dark:border-dark-700/50 bg-white/50 dark:bg-transparent">
            <h3 className="text-xl mb-2 text-gray-900 dark:text-dark-50 font-bold tracking-tight">Hunger</h3>
            <p className="text-gray-600 dark:text-dark-300 leading-relaxed">
              Millions of underprivileged people struggle with hunger and malnutrition despite food being available elsewhere.
            </p>
          </div>

          <div className="glass p-6 rounded-2xl border border-gray-200 dark:border-dark-700/50 bg-white/50 dark:bg-transparent">
            <h3 className="text-xl mb-2 text-gray-900 dark:text-dark-50 font-bold tracking-tight">No Connection</h3>
            <p className="text-gray-600 dark:text-dark-300 leading-relaxed">
              There is no efficient real-time system to connect donors, NGOs, and volunteers in a seamless way.
            </p>
          </div>
        </div>
      </section>

      {/* ================= SOLUTION ================= */}
      <section className="bg-gray-50 dark:bg-dark-900/50 py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl mb-6 text-gray-900 dark:text-dark-50 font-bold tracking-tight">
            Our Solution
          </h2>

          <p className="max-w-3xl mx-auto mb-12 text-gray-600 dark:text-dark-300 leading-relaxed">
            ShareBite is a smart platform that bridges the gap between surplus food and hunger. 
            By using real-time location tracking, intelligent matching, and a strong volunteer network, 
            we ensure that excess food reaches the right people quickly and efficiently.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass p-6 rounded-2xl border border-gray-200 dark:border-dark-700/50 bg-white/50 dark:bg-transparent">
              <h3 className="text-lg mb-2 text-gray-900 dark:text-dark-50 font-bold tracking-tight">Smart Matching</h3>
              <p className="text-gray-600 dark:text-dark-300 leading-relaxed">
                Automatically connects donors with the nearest NGOs and available volunteers using location-based technology.
              </p>
            </div>

            <div className="glass p-6 rounded-2xl border border-gray-200 dark:border-dark-700/50 bg-white/50 dark:bg-transparent">
              <h3 className="text-lg mb-2 text-gray-900 dark:text-dark-50 font-bold tracking-tight">Fast Delivery</h3>
              <p className="text-gray-600 dark:text-dark-300 leading-relaxed">
                Volunteers pick up food quickly and deliver it efficiently, reducing spoilage and ensuring timely distribution.
              </p>
            </div>

            <div className="glass p-6 rounded-2xl border border-gray-200 dark:border-dark-700/50 bg-white/50 dark:bg-transparent">
              <h3 className="text-lg mb-2 text-gray-900 dark:text-dark-50 font-bold tracking-tight">Full Transparency</h3>
              <p className="text-gray-600 dark:text-dark-300 leading-relaxed">
                Real-time tracking allows all users to monitor the journey of donations from pickup to delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="border-y border-gray-200 dark:border-dark-800 bg-gray-50 dark:bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-gray-900 dark:text-dark-50">{stat.value}</div>
                <div className="text-gray-500 dark:text-dark-400 text-sm uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/impact" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              View Full Impact →
            </Link>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl text-center mb-16 text-gray-900 dark:text-dark-50 font-bold tracking-tight">
          Key Features
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="glass p-8 rounded-3xl border border-gray-200 dark:border-dark-700/50 bg-white/50 dark:bg-transparent">
              <div className="mb-4">{f.icon}</div>
              <h3 className="text-xl mb-2 text-gray-900 dark:text-dark-50 font-bold tracking-tight">{f.title}</h3>
              <p className="text-gray-600 dark:text-dark-300 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* ================= USERS ================= */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl text-center mb-16 text-gray-900 dark:text-dark-50 font-bold tracking-tight">
          Who Can Use ShareBite?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="glass p-8 rounded-3xl border border-gray-200 dark:border-dark-700/50 bg-white/50 dark:bg-transparent">
            <h3 className="text-xl text-gray-900 dark:text-dark-50 font-bold tracking-tight">Restaurants</h3>
            <p className="mt-2 text-gray-600 dark:text-dark-300 leading-relaxed">
              Easily donate surplus food instead of wasting it, while contributing to a meaningful cause.
            </p>
          </div>

          <div className="glass p-8 rounded-3xl border border-gray-200 dark:border-dark-700/50 bg-white/50 dark:bg-transparent">
            <h3 className="text-xl text-gray-900 dark:text-dark-50 font-bold tracking-tight">NGOs</h3>
            <p className="mt-2 text-gray-600 dark:text-dark-300 leading-relaxed">
              Receive food donations efficiently and distribute them to communities in need.
            </p>
          </div>

          <div className="glass p-8 rounded-3xl border border-gray-200 dark:border-dark-700/50 bg-white/50 dark:bg-transparent">
            <h3 className="text-xl text-gray-900 dark:text-dark-50 font-bold tracking-tight">Volunteers</h3>
            <p className="mt-2 text-gray-600 dark:text-dark-300 leading-relaxed">
              Join as a volunteer and help bridge the gap by picking up and delivering food.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="glass p-16 rounded-3xl text-center border border-primary-500/20 bg-white/50 dark:bg-transparent">
          <h2 className="text-4xl mb-6 text-gray-900 dark:text-dark-50 font-bold tracking-tight">
            Ready to Make an Impact?
          </h2>

          <p className="mb-10 text-gray-600 dark:text-dark-300 leading-relaxed">
            Join ShareBite today and become a part of a growing movement to reduce food waste 
            and fight hunger through technology and community collaboration.
          </p>

          <Link to="/signup">
            <button className="px-8 py-4 bg-primary-500 hover:bg-primary-400 text-dark-900 font-bold rounded-full">
              Get Started
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}