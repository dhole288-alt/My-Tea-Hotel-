import React from 'react';
import { useStore } from '../context/StoreContext';
import { Star, Flame, ShoppingBag, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export const Bestsellers: React.FC = () => {
  const { products, addToCart } = useStore();
  const topBestsellers = products.filter(p => p.isBestseller).slice(0, 4);

  return (
    <section className="py-20 bg-stone-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Crowd Favorites</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Customer <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Favourites</span>
            </h2>
          </div>

          <button
            onClick={() => {
              const el = document.querySelector('#menu');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider transition-all"
          >
            Explore Full Menu →
          </button>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topBestsellers.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="group rounded-2xl bg-gradient-to-b from-stone-900 to-black border border-amber-500/30 p-5 shadow-2xl relative flex flex-col justify-between hover:border-amber-500/70 transition-all hover:-translate-y-1"
            >
              <div>
                <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-stone-950">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded bg-black/80 backdrop-blur-md text-amber-400 text-xs font-extrabold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>5.0</span>
                  </div>
                </div>

                {/* 5 Stars display */}
                <div className="flex items-center gap-1 text-amber-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                  <span className="text-[11px] text-stone-400 ml-1 font-mono">(1,200+ orders)</span>
                </div>

                <h3 className="font-serif font-bold text-lg text-white mb-1 group-hover:text-amber-300 transition-colors">
                  {item.name}
                </h3>
                <p className="text-stone-400 text-xs line-clamp-2 font-light leading-relaxed mb-3">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                <span className="text-xl font-extrabold text-amber-300">₹{item.price}</span>
                <button
                  onClick={() => addToCart(item, 1)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1 shadow-md shadow-amber-500/20 active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ORDER</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
