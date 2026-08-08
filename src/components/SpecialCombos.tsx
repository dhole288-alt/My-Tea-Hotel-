import React from 'react';
import { useStore } from '../context/StoreContext';
import { initialCombos } from '../data/mockData';
import { ShoppingBag, Sparkles, CheckCircle, Tag } from 'lucide-react';
import { motion } from 'motion/react';

export const SpecialCombos: React.FC = () => {
  const { addComboToCart } = useStore();

  return (
    <section id="combos" className="py-20 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-widest uppercase">
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>Value Pairing Specials</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Chai + Snacks = <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Perfect Combination</span>
          </h2>
          <p className="text-stone-400 text-sm sm:text-base font-light">
            Carefully curated culinary pairings designed for the ultimate Indian tea break experience.
          </p>
        </div>

        {/* Combos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {initialCombos.map((combo, idx) => {
            const savings = combo.originalPrice - combo.price;
            return (
              <motion.div
                key={combo.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group rounded-2xl bg-stone-900/90 border border-amber-500/20 hover:border-amber-500/60 overflow-hidden shadow-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-950">
                    <img
                      src={combo.image}
                      alt={combo.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    
                    {/* Savings Tag */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-[11px] uppercase tracking-wider shadow-lg flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>SAVE ₹{savings}</span>
                    </div>

                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/90 border border-amber-500/40 text-amber-300 font-extrabold text-lg shadow">
                      ₹{combo.price}
                      <span className="text-xs text-stone-400 line-through font-normal ml-1.5">
                        ₹{combo.originalPrice}
                      </span>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-serif font-bold text-lg text-white group-hover:text-amber-300 transition-colors">
                      {combo.name}
                    </h3>
                    <p className="text-stone-400 text-xs font-light leading-relaxed">
                      {combo.description}
                    </p>

                    {/* Included items */}
                    <div className="pt-2 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-amber-400/80 tracking-wider">
                        Included in Combo:
                      </span>
                      <ul className="space-y-1">
                        {combo.itemsIncluded.map((item, i) => (
                          <li key={i} className="text-xs text-stone-300 flex items-center gap-1.5">
                            <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Add Button */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => addComboToCart(combo)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD COMBO TO ORDER</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
