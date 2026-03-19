import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Mail, Phone, MessageSquare } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "What is ShareBite?",
          a: "ShareBite is a community-driven platform that connects donors with those in need. It facilitates the sharing of donations including food, clothing, books, and other essential items to help build a more compassionate community."
        },
        {
          q: "How do I create an account?",
          a: "Click the 'Register' button on the homepage, fill in your information (name, email, password, address), select your user type (Donor, Volunteer, or Needy Person), and submit. You'll receive a confirmation email to verify your account."
        },
        {
          q: "What are the different user types?",
          a: "Donors: People who wish to donate items. Volunteers: People who help transport donations and support the community. Needy Persons: People seeking assistance and donations. Choose the role that best fits you, though you can have multiple accounts if needed."
        },
        {
          q: "Is there a cost to use ShareBite?",
          a: "No! ShareBite is completely free to use. Our mission is to make sharing and helping accessible to everyone."
        }
      ]
    },
    {
      category: "Making Donations",
      questions: [
        {
          q: "What types of items can I donate?",
          a: "You can donate a wide variety of items including food, clothing, books, toys, electronics, furniture, and more. All items must be in good condition and comply with our donation guidelines."
        },
        {
          q: "How do I list a donation?",
          a: "Go to the 'Donations' page, click 'New Donation', fill in the details (title, description, type, quantity, condition, location), and submit. You can upload photos to showcase your donation."
        },
        {
          q: "Can I donate anonymously?",
          a: "While we encourage transparency, you can choose to display minimal personal information in your donor profile. However, recipients need to know how to contact you for pickup or delivery."
        },
        {
          q: "How does pickup and delivery work?",
          a: "Once a recipient accepts your donation, you can arrange pickup with them directly or request a volunteer to help transport the items. Our Volunteers tab shows available helpers in your area."
        }
      ]
    },
    {
      category: "Receiving Help",
      questions: [
        {
          q: "How do I request donations?",
          a: "Navigate to the 'Requests' page, describe what you need (items, quantity, urgency), add your location, and submit. Donors in your area will see your request and can respond with available items."
        },
        {
          q: "How long does it take to fulfill my request?",
          a: "Fulfillment time varies depending on demand, availability, and what you're requesting. Some requests are fulfilled within hours, while others may take a few days. You'll be notified when someone matches your request."
        },
        {
          q: "Is my information secure when I request help?",
          a: "Yes! Your personal information is protected and only shared with donors or volunteers who are helping fulfill your request. You maintain full control over what information is visible."
        },
        {
          q: "Can I request multiple items?",
          a: "Yes, you can create separate requests for different items or list multiple items in a single request. You can also create multiple requests if needed."
        }
      ]
    },
    {
      category: "Volunteering",
      questions: [
        {
          q: "How do I sign up as a volunteer?",
          a: "During registration, select 'Volunteer' as your user type. You'll get access to the Volunteer Dashboard where you can view available delivery requests and contribution opportunities."
        },
        {
          q: "What are the volunteer responsibilities?",
          a: "Volunteers help by picking up donations from donors and delivering them to recipients. You can choose which requests you want to help with based on your availability and location."
        },
        {
          q: "Do I need transportation?",
          a: "While having transportation is helpful, it's not required. You can help with smaller items or assist in other ways like organizing donations or coordinating with donors and recipients."
        },
        {
          q: "How are volunteer hours tracked?",
          a: "Hours are logged automatically when you complete delivery requests. Your volunteer dashboard shows a summary of your contributions, which can be helpful for college applications or work references."
        }
      ]
    },
    {
      category: "Safety and Trust",
      questions: [
        {
          q: "How does ShareBite ensure safety?",
          a: "We verify user information, maintain community ratings, and recommend meeting in safe public locations. Always follow our safety guidelines when arranging pickups or deliveries. Never share your full address until you're ready to meet."
        },
        {
          q: "What happens if someone violates community guidelines?",
          a: "Reports are reviewed by our moderation team. Serious violations result in temporary suspension or permanent removal from the platform. Users can report problematic behavior through the 'Report' button on any profile."
        },
        {
          q: "How are donations vetted?",
          a: "While donors are responsible for the condition of items, recipients and volunteers can report concerns. Photos help verify that items are in acceptable condition before acceptance."
        },
        {
          q: "Can I see ratings of donors or volunteers?",
          a: "Yes! User profiles show community ratings based on previous interactions. This helps build trust and ensures accountability within our community."
        }
      ]
    },
    {
      category: "Technical Issues",
      questions: [
        {
          q: "I forgot my password. How do I reset it?",
          a: "Click 'Forgot Password' on the login page, enter your email, and follow the link in the password reset email. If you don't receive an email, check your spam folder or contact support."
        },
        {
          q: "How can I update my profile information?",
          a: "Log in to your account, go to your Profile or Dashboard, and click 'Edit Profile'. Make your changes and save. Some information changes may require email verification."
        },
        {
          q: "Can I delete my account?",
          a: "Yes, you can request account deletion in your account settings. Please note that this action is permanent and cannot be undone."
        },
        {
          q: "What browsers does ShareBite support?",
          a: "ShareBite works on all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, please keep your browser updated."
        }
      ]
    },
    {
      category: "Policies",
      questions: [
        {
          q: "What items are prohibited from donation?",
          a: "Items that are illegal, hazardous, expired, or unsafe cannot be donated. This includes weapons, drugs, hazardous chemicals, recalled items, and anything that could pose a risk to recipients."
        },
        {
          q: "How is my data used?",
          a: "We use your data only to operate ShareBite, match donors with recipients, and improve our services. Your information is never sold to third parties. See our Privacy Policy for details."
        },
        {
          q: "What is the community code of conduct?",
          a: "Be respectful, honest, and kind to all users. No harassment, discrimination, or malicious behavior is tolerated. We're building a community based on compassion and mutual support."
        },
        {
          q: "How often should I check for new donations or requests?",
          a: "You can enable notifications to get real-time alerts about matching donations or requests. Otherwise, check the app regularly or set a daily reminder to stay updated."
        }
      ]
    },
    {
      category: "Contact & Support",
      questions: [
        {
          q: "How do I contact customer support?",
          a: "Visit our Contact page, email support@sharebite.com, or call (555) 123-4567. We typically respond within 24 hours during business days."
        },
        {
          q: "Is there a mobile app for ShareBite?",
          a: "Currently, ShareBite is available as a web platform optimized for mobile browsers. We are developing native iOS and Android apps - check back soon!"
        },
        {
          q: "Can I provide feedback or suggest features?",
          a: "Absolutely! We'd love to hear from you. Use the feedback form on our Contact page or email suggestions@sharebite.com with your ideas."
        },
        {
          q: "Does ShareBite operate in my area?",
          a: "ShareBite is currently available in select regions. Visit our Maps page or contact support to check if we serve your location. We're expanding to new areas regularly!"
        }
      ]
    }
  ];

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  let globalIndex = 0;

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-white tracking-tight"
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-dark-300 max-w-2xl mx-auto"
          >
            Find answers to common questions about ShareBite and how to get the most out of our platform.
          </motion.p>
        </div>

        {/* FAQ By Category */}
        <div className="space-y-12">
          {faqs.map((section, sectionIndex) => (
            <motion.div 
              key={sectionIndex} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold px-2 border-b border-dark-700/50 pb-3 text-primary-400">
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.questions.map((item, itemIndex) => {
                  const index = globalIndex++;
                  const isOpen = openIndex === index;
                  return (
                    <div 
                      key={itemIndex} 
                      className={`glass rounded-2xl border transition-all duration-300 overflow-hidden ${
                        isOpen ? 'border-primary-500/50 bg-dark-800/80 shadow-[0_0_15px_rgba(34,197,94,0.1)]' : 'border-dark-700/50 hover:border-dark-600'
                      }`}
                    >
                      <button
                        onClick={() => toggleAccordion(index)}
                        className="w-full px-6 py-5 text-left flex items-center justify-between outline-none"
                      >
                        <h3 className={`font-semibold text-lg transition-colors ${isOpen ? 'text-primary-300' : 'text-white'}`}>
                          {item.q}
                        </h3>
                        <div className={`ml-4 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary-400' : 'text-dark-400'}`}>
                          <ChevronDown className="w-5 h-5" />
                        </div>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="px-6 pb-5 pt-0">
                              <p className="text-dark-300 leading-relaxed text-base border-t border-dark-700/50 pt-4">
                                {item.a}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Help Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 glass rounded-3xl p-8 border border-dark-700/50 relative overflow-hidden text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent"></div>
          <div className="relative z-10 space-y-2">
            <h2 className="text-2xl font-bold text-white">Didn't find your answer?</h2>
            <p className="text-dark-300 text-lg">
              Our support team is here to help! Reach out to us with any questions.
            </p>
          </div>
          <div className="relative z-10 flex flex-col gap-3 shrink-0 w-full md:w-auto">
            <a href="mailto:support@sharebite.com" className="flex items-center gap-3 px-6 py-3 bg-dark-800 hover:bg-dark-700 border border-dark-700 rounded-xl transition-colors text-white">
              <Mail className="w-5 h-5 text-primary-400" />
              <span className="font-medium">support@sharebite.com</span>
            </a>
            <div className="flex items-center gap-3 px-6 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white">
              <Phone className="w-5 h-5 text-primary-400" />
              <span className="font-medium">(555) 123-4567</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
