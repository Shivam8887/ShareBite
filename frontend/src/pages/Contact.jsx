import React, { useState } from "react";
import { contactAPI } from "../services/api";
import { motion } from "framer-motion";
import { Mail, Phone, User, MessageSquare, MapPin } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [status, setStatus] = useState({ type: "", msg: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setStatus({ type: "", msg: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const key of Object.keys(formData)) {
      if (!formData[key]) {
        return setStatus({ type: "error", msg: "Please fill all fields" });
      }
    }

    setLoading(true);
    try {
      await contactAPI.sendMessage(formData);
      setStatus({ type: "success", msg: "Message sent successfully!" });
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", msg: err.response?.data?.error || "Failed to send message" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 relative font-sans">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-white tracking-tight"
          >
            Get in Touch
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-dark-300 text-lg max-w-2xl mx-auto"
          >
            Have questions about donations, volunteering, or partnering with us? We'd love to hear from you.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="glass p-8 rounded-3xl border border-dark-700/50">
              <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-dark-800 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Our Office</h4>
                    <p className="text-dark-300 text-sm leading-relaxed">123 Innovation Drive,<br/>Tech City, IN 400001</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-dark-800 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Phone</h4>
                    <p className="text-dark-300 text-sm leading-relaxed">+91 (800) 123-4567<br/>Mon-Fri, 9am - 6pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-dark-800 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-primary-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Email</h4>
                    <p className="text-dark-300 text-sm leading-relaxed">support@sharebite.org<br/>hello@sharebite.org</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Social Proof/Extra info */}
            <div className="glass p-8 rounded-3xl border border-primary-500/20 bg-primary-500/5">
              <h3 className="text-lg font-semibold text-white mb-2">Need immediate help?</h3>
              <p className="text-dark-300 text-sm mb-4">Check out our frequently asked questions for quick answers to common issues.</p>
              <a href="/faq" className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">Go to FAQ &rarr;</a>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 glass p-8 md:p-10 rounded-3xl border border-dark-700/50"
          >
            <h3 className="text-2xl font-bold text-white mb-8">Send us a Message</h3>
            
            {status.msg && (
              <div className={`p-4 rounded-xl mb-6 ${status.type === 'success' ? 'bg-primary-500/10 border border-primary-500/20 text-primary-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                {status.msg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark-300">Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark-300">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark-300">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark-300">Subject</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input 
                      type="text" 
                      name="subject" 
                      value={formData.subject} 
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                      placeholder="How can we help?"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-dark-300">Message</label>
                <textarea 
                  name="message" 
                  rows="5" 
                  value={formData.message} 
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark-900 border border-dark-700 rounded-xl text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all resize-none"
                  placeholder="Tell us what you need..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full sm:w-auto px-8 py-4 bg-primary-500 hover:bg-primary-400 text-dark-950 font-semibold rounded-xl transition-all shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;