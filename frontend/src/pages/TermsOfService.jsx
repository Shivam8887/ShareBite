import React from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative font-sans">
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-amber-50 blur-[100px] rounded-full pointer-events-none -z-10"></div>

      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border border-gray-200 mb-2">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight"
          >
            Terms of Service
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-lg"
          >
            Last updated: February 28, 2026
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-8 md:p-12 border border-gray-200 space-y-10 text-gray-700 leading-relaxed"
        >
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl text-gray-900 font-bold tracking-tight">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the ShareBite platform, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-2xl text-gray-900 font-bold tracking-tight">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on ShareBite for personal, non-commercial transitory viewing only. Under this license you may not:
            </p>
            <ul className="space-y-2 list-none pl-0 bg-white p-6 rounded-2xl border border-gray-200">
              {['Modify or copy the materials', 'Use the materials for any commercial purpose', 'Attempt to decompile or reverse engineer any software', 'Remove any copyright or other proprietary notations', 'Violate any applicable laws or regulations'].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-amber-600 mt-1.5">•</span>
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl text-gray-900 font-bold tracking-tight">3. Disclaimer</h2>
            <p>
              The materials on ShareBite are provided on an 'as is' basis. ShareBite makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl text-gray-900 font-bold tracking-tight">4. User Responsibilities</h2>
            <p>As a user of ShareBite, you agree and are responsible for:</p>
            <ul className="space-y-2 list-none pl-0">
              <li className="flex items-start gap-3"><span className="text-amber-600 mt-1.5">•</span><span>Maintaining the confidentiality of your account information.</span></li>
              <li className="flex items-start gap-3"><span className="text-amber-600 mt-1.5">•</span><span>Providing accurate and truthful information during registration.</span></li>
              <li className="flex items-start gap-3"><span className="text-amber-600 mt-1.5">•</span><span>Donating only legitimate, safe, and legal items.</span></li>
              <li className="flex items-start gap-3"><span className="text-amber-600 mt-1.5">•</span><span>Not engaging in illegal, harmful, or abusive activities towards the community.</span></li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-2xl text-gray-900 font-bold tracking-tight">5. Termination</h2>
            <p>
              ShareBite may terminate or suspend your account and access to the platform at any time, for any reason, without prior notice or liability. Reasons for termination may include, but are not limited to, violation of these terms, illegal activity, or conduct we deem harmful.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-2xl text-gray-900 font-bold tracking-tight">6. Modifications</h2>
            <p>
              ShareBite may revise these terms of service at any time without notice. By using the platform, you are agreeing to be bound by the then current version of these terms.
            </p>
          </section>

          {/* Contact */}
          <div className="pt-8 mt-8 border-t border-gray-200">
            <p className="text-sm text-gray-700 leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at <a href="mailto:legal@sharebite.com" className="text-white font-medium hover:text-amber-500 transition-colors">legal@sharebite.com</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
