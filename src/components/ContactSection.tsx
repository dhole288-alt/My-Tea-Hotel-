import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Send, Phone, MessageCircle, Navigation, Mail, User, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const ContactSection: React.FC = () => {
  const { addEnquiry, settings } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    addEnquiry(name, phone, email, message);
    setSubmitted(true);
    setName('');
    setPhone('');
    setEmail('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 5000);
  };

  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    settings.address
  )}`;

  const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
    `Hello ${settings.name}, I would like to make a quick enquiry!`
  )}`;

  return (
    <section className="py-20 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-4xl mx-auto rounded-3xl bg-stone-900/80 border border-amber-500/30 p-8 sm:p-12 backdrop-blur-2xl shadow-2xl space-y-8">
          
          <div className="text-center space-y-2">
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
              Send Us An <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Enquiry</span>
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm">
              Have a bulk order, catering query, or franchise inquiry? Drop us a message below!
            </p>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-2xl bg-stone-950 border border-emerald-500/40 text-center space-y-4"
            >
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-serif font-bold text-white">Enquiry Received!</h3>
              <p className="text-xs text-stone-300">
                Thank you! Our concierge team will call you back within 30 minutes.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase mb-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/80 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Mobile */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/80 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase mb-1">
                  Email Address (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/80 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your event, catering, or general questions..."
                  className="w-full p-3 rounded-xl bg-black/80 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs uppercase tracking-widest shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>SEND ENQUIRY</span>
              </button>
            </form>
          )}

          {/* Quick Action Bar */}
          <div className="pt-6 border-t border-stone-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a
              href={`tel:${settings.phone}`}
              className="py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>CALL NOW</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WHATSAPP NOW</span>
            </a>

            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <Navigation className="w-4 h-4 text-amber-400" />
              <span>GET DIRECTIONS</span>
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
