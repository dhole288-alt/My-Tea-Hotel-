import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { signatureChais } from '../data/mockData';
import { Product } from '../types';
import { ShoppingBag, MessageCircle, Star, Sparkles, Plus, Check } from 'lucide-react';
import { motion } from 'motion/react';

export const SignatureChai: React.FC = () => {
  const { addToCart, settings } = useStore();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAdd = (product: Product) => {
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  const getWhatsAppLink = (product: Product) => {
    const text = `Hello Royal Chai Co., I would like to order:\n1x ${product.name} - ₹${product.price}\nPlease confirm my order!`;
    return `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="signature-chai" className="py-20 bg-stone-950 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Master Brewer's Choice</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Our Signature <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Chai Collection</span>
          </h2>
          <p className="text-stone-400 text-sm sm:text-base font-light leading-relaxed">
            Handcrafted with organic Assam tea leaves, hand-pounded spices, whole milk, and traditional brass kettle boiling. Pure liquid perfection in every sip.
          </p>
        </div>

        {/* 10 Signature Chai Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {signatureChais.map((chai, idx) => {
            const isAdded = addedId === chai.id;
            return (
              <motion.div
                key={chai.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group relative rounded-2xl bg-stone-900/80 border border-amber-500/20 hover:border-amber-500/60 p-4 backdrop-blur-xl shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-4 bg-stone-950">
                    <img
                      src={chai.image}
                      alt={chai.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                      {chai.isSpecial && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500 text-black font-extrabold text-[10px] uppercase tracking-wider shadow">
                          SPECIAL
                        </span>
                      )}
                      {chai.isBestseller && (
                        <span className="px-2 py-0.5 rounded-md bg-stone-950/90 text-amber-300 border border-amber-500/40 text-[10px] font-bold uppercase">
                          BESTSELLER
                        </span>
                      )}
                    </div>

                    {/* Price Tag */}
                    <div className="absolute bottom-2.5 right-2.5 px-3 py-1 rounded-lg bg-black/90 border border-amber-500/40 text-amber-300 font-extrabold text-sm shadow">
                      ₹{chai.price}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif font-bold text-stone-100 text-base group-hover:text-amber-300 transition-colors">
                        {chai.name}
                      </h3>
                      {chai.rating && (
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{chai.rating}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-stone-400 text-xs line-clamp-2 font-light leading-relaxed">
                      {chai.description}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 mt-4 border-t border-stone-800/80 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAdd(chai)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1 ${
                      isAdded
                        ? 'bg-emerald-500 text-black'
                        : 'bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/20 active:scale-95'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>ADDED</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>ADD</span>
                      </>
                    )}
                  </button>

                  <a
                    href={getWhatsAppLink(chai)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-2 rounded-xl bg-emerald-950/90 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/30 text-xs font-semibold tracking-wider flex items-center justify-center gap-1 transition-all"
                    title="Order via WhatsApp"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WA ORDER</span>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
