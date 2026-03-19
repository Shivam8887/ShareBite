import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative font-sans">
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-primary-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-dark-800 border border-dark-700 mb-2">
            <ShieldCheck className="w-8 h-8 text-primary-400" />
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-white tracking-tight"
          >
            Privacy Policy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-dark-400 text-lg"
          >
            Last updated: February 28, 2026
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-8 md:p-12 border border-dark-700/50 space-y-10 text-dark-300 leading-relaxed"
        >
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
            <p>
              ShareBite ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-white">2. Information We Collect</h2>
            <p>We may collect information about you in a variety of ways:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-dark-800/50 border border-dark-700">
                <h3 className="text-white font-medium mb-2">Personal Information</h3>
                <p className="text-sm">Name, email address, phone number, address, date of birth, and any other information you voluntarily provide when registering.</p>
              </div>
              <div className="p-5 rounded-2xl bg-dark-800/50 border border-dark-700">
                <h3 className="text-white font-medium mb-2">Donation Information</h3>
                <p className="text-sm">Details about donations you make or receive, including types, quantities, dates, and locations.</p>
              </div>
              <div className="p-5 rounded-2xl bg-dark-800/50 border border-dark-700">
                <h3 className="text-white font-medium mb-2">Technical Information</h3>
                <p className="text-sm">IP address, browser type, operating system, referring URL, and pages visited on our platform.</p>
              </div>
              <div className="p-5 rounded-2xl bg-dark-800/50 border border-dark-700">
                <h3 className="text-white font-medium mb-2">Location Data</h3>
                <p className="text-sm">We may collect location information with your consent to help match donors with recipients in your area.</p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. How We Use Your Information</h2>
            <p>We use the collected information for various purposes:</p>
            <ul className="space-y-2 list-none pl-0">
              {['To provide, operate, and maintain our services', 'To process donations and match donors with recipients', 'To send you administrative information and updates', 'To respond to your inquiries and provide customer support', 'To improve and optimize our platform', 'To comply with legal obligations and prevent fraud'].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-primary-500 mt-1.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Information Sharing and Disclosure</h2>
            <p>
              We do not sell, trade, or rent your personal information to third parties. However, we may share information in the following circumstances:
            </p>
            <ul className="space-y-2 list-none pl-0">
              <li className="flex items-start gap-3"><span className="text-primary-500 mt-1.5">•</span><span>With service providers who assist us in operating our website and providing services.</span></li>
              <li className="flex items-start gap-3"><span className="text-primary-500 mt-1.5">•</span><span>When required by law or to protect our rights and safety.</span></li>
              <li className="flex items-start gap-3"><span className="text-primary-500 mt-1.5">•</span><span>With your explicit consent for specific purposes.</span></li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">6. Your Privacy Rights</h2>
            <p>Depending on your location, you may have the following rights regarding your data: accessing, correcting, restricting, and requesting deletion of your personal data.</p>
          </section>

          {/* Contact */}
          <div className="pt-8 mt-8 border-t border-dark-700/50">
            <p className="text-sm">
              If you have questions about this Privacy Policy, please contact us at <a href="mailto:privacy@sharebite.com" className="text-primary-400 font-medium hover:text-primary-300">privacy@sharebite.com</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
