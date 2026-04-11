import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';

// ✅ Import all images
// import locationImg from "../assets/location.png";
import volunteerImg from "../assets/Volunteer-pickup.png";
import verificationImg from "../assets/Secure-verification.png";
import FoodDonation from "../assets/Food-donation.png";
export default function HowItWorks() {

  const steps = [
    {
      image: FoodDonation,
      title: "Real-time Location Detection",
      desc: "ShareBite auto-detects your location. Nearby NGOs and volunteers are instantly identified for faster delivery.",
      points: [
        "Automatic proximity matching",
        "Interactive Map integration",
        "Distance and ETA calculation"
      ]
    },
    {
      image: volunteerImg,
      title: "Direct Volunteer Pickup",
      desc: "Volunteers receive real-time notifications and handle pickup and delivery seamlessly.",
      points: [
        "No central admin required",
        "App-based acceptance workflow",
        "Independent community drivers"
      ]
    },
    {
      image: verificationImg,
      title: "Secure & Transparent Verification",
      desc: "Track every step with real-time updates and OTP-based delivery confirmation.",
      points: [
        "End-to-end tracking",
        "OTP verification upon delivery",
        "Strict user guidelines"
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 font-sans selection:bg-primary-500/30">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16 md:mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary-500/10 blur-[100px] rounded-full -z-10"></div>

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
            We've streamlined the donation process to make sharing surplus food as easy as ordering a meal online.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="space-y-16 md:space-y-24">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row items-center gap-10 md:gap-16 ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
            >

              {/* IMAGE SECTION */}
              <div className="flex-1 w-full">
                <div className="relative rounded-3xl overflow-hidden border border-dark-700/50 group">

                  {/* Image */}
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover aspect-video md:aspect-square lg:aspect-[4/3] group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-dark-900/70 via-transparent to-transparent"></div>

                  {/* Step Number */}
                  <div className="absolute top-4 left-4 bg-primary-500 text-dark-900 font-bold px-4 py-2 rounded-lg shadow-lg">
                    0{i + 1}
                  </div>

                </div>
              </div>

              {/* TEXT SECTION */}
              <div className="flex-1 space-y-6">
                <h2 className="text-3xl font-bold text-dark-900 dark:text-white">{step.title}</h2>

                <p className="text-dark-300 text-lg leading-relaxed">
                  {step.desc}
                </p>

                <ul className="space-y-3 pt-2">
                  {step.points.map((point, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-dark-200">
                      <CheckCircle2 className="w-5 h-5 text-primary-400" />
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
          className="mt-32 max-w-4xl mx-auto glass p-10 md:p-16 rounded-3xl border border-primary-500/20 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent"></div>

          <div className="relative z-10">
            <HeartPulse className="w-12 h-12 text-primary-400 mx-auto mb-6" />

            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 dark:text-white mb-6">
              Start Your Journey Today
            </h2>

            <p className="text-dark-300 mb-8 max-w-xl mx-auto">
              Join ShareBite and help bridge the gap between surplus food and those in need.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/signup">
                <button className="px-8 py-4 bg-primary-500 hover:bg-primary-400 text-dark-950 font-bold rounded-full transition-all hover:scale-105 shadow-lg">
                  Join as Volunteer
                </button>
              </Link>

              <Link to="/signup">
                <button className="px-8 py-4 bg-dark-800 hover:bg-dark-700 text-white rounded-full border border-dark-700">
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