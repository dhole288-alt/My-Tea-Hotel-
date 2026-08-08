import React from 'react';
import { Star, Flame, Sparkles, ShoppingBag, Calendar, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { motion } from 'motion/react';

export const Hero: React.FC = () => {
  const { settings, setIsBookingModalOpen } = useStore();

  const trustBadges = [
    { icon: Star, text: 'Premium Quality', color: 'text-amber-400' },
    { icon: Sparkles, text: 'Fresh Ingredients', color: 'text-emerald-400' },
    { icon: Flame, text: 'Freshly Brewed', color: 'text-orange-400' },
    { icon: Heart, text: 'Customer Favourite', color: 'text-rose-400' },
  ];

  const heroImage = "/src/assets/images/hero_chai_lounge_1786206680949.jpg";

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-black">
      {/* Background Cinematic Image with Luxury Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Cinematic 5-Star Indian Chai Lounge"
          className="w-full h-full object-cover object-center opacity-40 scale-105 animate-pulse"
          style={{ animationDuration: '10s' }}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-black/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Copy Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Tagline Pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/90 border border-amber-500/40 text-amber-300 text-xs font-semibold uppercase tracking-widest backdrop-blur-xl shadow-xl shadow-amber-500/10"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{settings.tagline}</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-6xl xl:text-7xl font-serif font-extrabold tracking-tight text-white leading-tight"
            >
              THE PERFECT <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 drop-shadow-lg">
                CUP OF CHAI
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-stone-300 font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              “Freshly Brewed. Perfectly Crafted. Made With Love.”
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <button
                onClick={() => scrollToSection('#menu')}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm tracking-widest uppercase shadow-xl shadow-amber-500/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group"
              >
                <span>VIEW MENU</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => scrollToSection('#signature-chai')}
                className="px-8 py-4 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-amber-300 border border-amber-500/40 font-bold text-sm tracking-widest uppercase backdrop-blur-xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>ORDER NOW</span>
              </button>

              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="px-6 py-4 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-500/30 font-bold text-sm tracking-widest uppercase shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>BOOK TABLE</span>
              </button>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-6 border-t border-amber-500/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left"
            >
              {trustBadges.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div key={idx} className="flex items-center gap-2 p-2.5 rounded-lg bg-stone-900/50 border border-stone-800">
                    <Icon className={`w-4 h-4 ${badge.color} shrink-0`} />
                    <span className="text-xs font-medium text-stone-300">{badge.text}</span>
                  </div>
                );
              })}
            </motion.div>

          </div>

          {/* Featured Visual Glassmorphism Card Column */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative rounded-3xl p-6 bg-stone-900/80 border border-amber-500/30 backdrop-blur-2xl shadow-2xl shadow-amber-500/10 space-y-6"
            >
              {/* Top Card Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Live Tea Counter Open
                  </span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>4.9 / 5.0 Rating</span>
                </div>
              </div>

              {/* Special Featured Kulhad Chai Highlight */}
              <div className="relative rounded-2xl overflow-hidden group">
                <img
                  src={heroImage}
                  alt="Signature Hot Tandoori Kulhad Chai"
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/80 backdrop-blur-md p-3 rounded-xl border border-amber-500/30">
                  <div>
                    <h4 className="text-sm font-serif font-bold text-amber-200">Smoky Tandoori Kulhad Chai</h4>
                    <p className="text-[11px] text-stone-400">Authentic Clay Oven Brewed</p>
                  </div>
                  <span className="text-base font-extrabold text-amber-400">₹60</span>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-3 text-center pt-2">
                <div className="p-3 rounded-xl bg-black/60 border border-stone-800">
                  <div className="text-xl font-bold text-amber-400">50K+</div>
                  <div className="text-[10px] uppercase text-stone-400">Happy Customers</div>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-stone-800">
                  <div className="text-xl font-bold text-amber-400">25+</div>
                  <div className="text-[10px] uppercase text-stone-400">Secret Spices</div>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-stone-800">
                  <div className="text-xl font-bold text-amber-400">100%</div>
                  <div className="text-[10px] uppercase text-stone-400">Fresh Milk</div>
                </div>
              </div>

            </motion.div>
          </div>

        </div>
      </div>

      {/* Marquee Ticker */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-amber-950/90 via-stone-900 to-amber-950/90 border-t border-b border-amber-500/30 py-2.5 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee text-amber-200/90 text-xs font-semibold tracking-widest uppercase gap-8">
          <span>☕ Special Cutting Chai ₹30</span>
          <span>•</span>
          <span>🔥 Smoky Tandoori Chai ₹60</span>
          <span>•</span>
          <span>👑 Royal Irani Chai ₹50</span>
          <span>•</span>
          <span>🫓 Fresh Bun Maska ₹45</span>
          <span>•</span>
          <span>🥠 Crispy Samosa ₹40</span>
          <span>•</span>
          <span>✨ 100% Hygienic & Fresh</span>
          <span>•</span>
          <span>🚚 Express Local Delivery & Drive-Thru Pickup</span>
        </div>
      </div>
    </section>
  );
};
