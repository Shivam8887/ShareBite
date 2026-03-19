import React from 'react';
import { motion } from 'framer-motion';
import { Cookie } from 'lucide-react';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative font-sans">
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-dark-800 border border-dark-700 mb-2">
            <Cookie className="w-8 h-8 text-yellow-500" />
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-white tracking-tight"
          >
            Cookie Policy
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
            <h2 className="text-2xl font-bold text-white">1. What are cookies?</h2>
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. How we use cookies</h2>
            <p>We use cookies and similar tracking technologies for several purposes:</p>
            <ul className="space-y-4 list-none pl-0">
              <li className="bg-dark-800/50 p-4 rounded-xl border border-dark-700">
                <h3 className="text-white font-medium mb-1">Essential Cookies</h3>
                <p className="text-sm">Required for the platform to function properly. These include cookies that enable you to log into secure areas like your User Dashboard.</p>
              </li>
              <li className="bg-dark-800/50 p-4 rounded-xl border border-dark-700">
                <h3 className="text-white font-medium mb-1">Analytical/Performance Cookies</h3>
                <p className="text-sm">These allow us to recognize and count the number of visitors and see how visitors move around our platform when using it. This helps us improve the way ShareBite works.</p>
              </li>
              <li className="bg-dark-800/50 p-4 rounded-xl border border-dark-700">
                <h3 className="text-white font-medium mb-1">Functionality Cookies</h3>
                <p className="text-sm">Used to recognize you when you return to our platform. This enables us to personalize our content for you and remember your preferences.</p>
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Third-party cookies</h2>
            <p>
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the Service and deliver map location data (such as Leaflet tracking).
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Managing your cookie preferences</h2>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service (like staying securely logged in).
            </p>
            <p>
              To learn more about cookies and how to manage them, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noreferrer" className="text-yellow-500 hover:text-yellow-400 font-medium">allaboutcookies.org</a>.
            </p>
          </section>

          {/* Contact */}
          <div className="pt-8 mt-8 border-t border-dark-700/50">
            <p className="text-sm">
              If you have any questions about this Cookie Policy, please contact us at <a href="mailto:privacy@sharebite.com" className="text-white font-medium hover:text-yellow-500 transition-colors">privacy@sharebite.com</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CookiePolicy;
