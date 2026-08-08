import React from 'react';
import { useStore } from '../context/StoreContext';
import { Tag, Clock, ArrowRight, Copy } from 'lucide-react';
import { motion } from 'motion/react';

export const OffersSection: React.FC = () => {
  const { offers, showToast } = useStore();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Promo code "${code}" copied to clipboard! 🎟️`);
  };

  const handleApplyOffer = (code: string) => {
    handleCopyCode(code);
    const menuEl = document.querySelector('#menu');
    if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-widest uppercase">
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>Exclusive Promotions</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Special <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Promotions & Offers</span>
          </h2>
          <p className="text-stone-400 text-sm sm:text-base font-light">
            Enjoy premium discounts and special team combos every single day.
          </p>
        </div>

        {/* Offer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {offers.map((offer, idx) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className={`rounded-2xl p-6 bg-gradient-to-br ${offer.bgGradient || 'from-amber-950/80 via-stone-900 to-black'} border border-amber-500/30 shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden group`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>LIMITED TIME</span>
                </span>
                <span className="text-2xl font-extrabold text-amber-400">{offer.discountPercentage}% OFF</span>
              </div>

              {/* Body */}
              <div className="space-y-2">
                <h3 className="text-xl font-serif font-bold text-white group-hover:text-amber-300 transition-colors">
                  {offer.title}
                </h3>
                <p className="text-stone-300 text-xs font-light leading-relaxed">
                  {offer.description}
                </p>
                <div className="text-[11px] text-amber-400/80 font-mono pt-1">
                  ⏰ {offer.validTill}
                </div>
              </div>

              {/* Coupon Code & Claim Button */}
              <div className="pt-4 border-t border-amber-500/20 space-y-3">
                <div
                  onClick={() => handleCopyCode(offer.code)}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-black/80 border border-dashed border-amber-500/40 cursor-pointer hover:border-amber-400 transition-colors"
                >
                  <span className="text-xs font-mono font-bold text-amber-300">{offer.code}</span>
                  <span className="text-[10px] font-semibold text-stone-400 uppercase flex items-center gap-1">
                    <Copy className="w-3 h-3" /> COPY
                  </span>
                </div>

                <button
                  onClick={() => handleApplyOffer(offer.code)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1 shadow-md shadow-amber-500/20 transition-all"
                >
                  <span>ORDER NOW</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
