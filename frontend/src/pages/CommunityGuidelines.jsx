import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, HeartHandshake, FileWarning, MessageCircleWarning } from 'lucide-react';

export default function CommunityGuidelines() {
  const sections = [
    {
      icon: <HeartHandshake className="w-6 h-6 text-primary-400" />,
      title: "Respect & Kindness",
      points: [
        "Treat all donors, volunteers, and NGO representatives with respect and courtesy.",
        "Harassment, discrimination, hate speech, or abuse of any kind will result in immediate account termination.",
        "Remember that everyone is here to help the community."
      ]
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-accent-400" />,
      title: "Food Safety & Quality",
      points: [
        "Only donate food that is safe, hygienic, and untouched.",
        "Do NOT donate expired items, partially eaten food, or items that require refrigeration if the cold chain has been broken.",
        "Clearly label food that contains common allergens (nuts, dairy, gluten)."
      ]
    },
    {
      icon: <MessageCircleWarning className="w-6 h-6 text-blue-400" />,
      title: "Reliability & Communication",
      points: [
        "If you accept a volunteer pickup, commit to it. Do not accept a request if you cannot fulfill it.",
        "Communicate promptly if there are delays or cancellations.",
        "Keep your phone accessible during an active donation process."
      ]
    },
    {
      icon: <FileWarning className="w-6 h-6 text-yellow-400" />,
      title: "Platform Integrity",
      points: [
        "Do not use ShareBite for self-promotion, spam, or any commercial purposes.",
        "Do not create fake donation requests or fictitious donor profiles.",
        "Report any suspicious or inappropriate activity directly to the admin team."
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight"
          >
            Community Guidelines
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-dark-300 text-lg max-w-2xl mx-auto"
          >
            To ensure ShareBite remains a safe, effective, and welcoming platform for everyone, we require all users to adhere to these core guidelines.
          </motion.p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {sections.map((section, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass rounded-3xl p-8 border border-dark-700/50 relative overflow-hidden"
            >
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-full bg-dark-800 flex items-center justify-center shrink-0 border border-dark-700">
                  {section.icon}
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                  <ul className="space-y-3">
                    {section.points.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-3 text-dark-300">
                        <span className="text-primary-500 mt-1.5">•</span>
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center p-8 bg-primary-500/10 rounded-2xl border border-primary-500/20"
        >
          <p className="text-primary-100 font-medium">
            Violations of these guidelines may result in warnings, temporary suspensions, or permanent bans from the ShareBite platform. Let's work together to help safely!
          </p>
        </motion.div>

      </div>
    </div>
  );
}
