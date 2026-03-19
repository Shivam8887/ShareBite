import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, ShieldCheck, ArrowRight, HeartPulse, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  const steps = [
    {
      icon: <MapPin className="w-8 h-8 text-primary-400" />,
      title: "Real-time Location Detection",
      desc: "ShareBite auto-detects your location. When a donor posts surplus food, the platform immediately identifies nearby NGOs and volunteers. This ensures the fastest possible pickup and delivery, prioritizing the freshest food.",
      points: ["Automatic proximity matching", "Interactive Map integration", "Distance and ETA calculation"]
    },
    {
      icon: <Users className="w-8 h-8 text-accent-400" />,
      title: "Direct Volunteer Pickup",
      desc: "Operating like a modern food delivery app, but for charity. Available volunteers get notifications for nearby donation requests. Once accepted, they navigate directly to the donor and then to the NGO.",
      points: ["No central admin required", "App-based acceptance workflow", "Independent community drivers"]
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary-600" />,
      title: "Secure & Transparent Verification",
      desc: "Every step is tracked in real-time. Donors can see when a volunteer arrives, and NGOs confirm when the food is delivered. Our robust authentication ensures only verified users participate in the network.",
      points: ["End-to-end tracking", "OTP verification upon delivery", "Strict user guidelines"]
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 font-sans selection:bg-primary-500/30">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16 md:mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6"
          >
            How <span className="text-primary-400">ShareBite</span> Works
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-dark-300 max-w-2xl mx-auto"
          >
            We've streamlined the donation process to make sharing surplus food as easy as ordering a meal online. Here is how our community operates.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="space-y-12 md:space-y-24">
          {steps.map((step, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              key={i}
              className={`flex flex-col md:flex-row gap-8 md:gap-16 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Visual Element */}
              <div className="flex-1 w-full">
                <div className="aspect-video md:aspect-square lg:aspect-[4/3] rounded-3xl glass border border-dark-700/50 flex items-center justify-center bg-dark-800/20 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-dark-900 via-transparent to-transparent z-10"></div>
                  <div className="w-24 h-24 rounded-full bg-dark-800 border border-dark-600 flex items-center justify-center z-20 group-hover:scale-110 transition-transform duration-500">
                    {step.icon}
                  </div>
                  {/* Decorative background grid */}
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-500/10 text-primary-400 font-bold text-xl border border-primary-500/20 mb-2">
                  0{i + 1}
                </div>
                <h2 className="text-3xl font-bold text-white">{step.title}</h2>
                <p className="text-dark-300 text-lg leading-relaxed">{step.desc}</p>
                <ul className="space-y-3 pt-4">
                  {step.points.map((point, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-dark-200">
                      <CheckCircle2 className="w-5 h-5 text-primary-400 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 max-w-4xl mx-auto glass p-10 md:p-16 rounded-3xl border border-primary-500/20 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent"></div>
          <div className="relative z-10">
            <HeartPulse className="w-12 h-12 text-primary-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Start Your Journey Today</h2>
            <p className="text-dark-300 mb-8 max-w-xl mx-auto">
              Ready to be part of the solution? Join ShareBite and help us bridge the gap between surplus food and those in need.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup">
                <button className="px-8 py-4 bg-primary-500 hover:bg-primary-400 text-dark-950 font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                  Join as a Volunteer
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-8 py-4 bg-dark-800 hover:bg-dark-700 text-white font-medium rounded-full border border-dark-700 transition-colors">
                  Donate Food
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
