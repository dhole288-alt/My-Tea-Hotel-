import React from 'react';
import { Heart, Sparkles, Shield, Coffee, Users, Smile, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';

export const AboutSection: React.FC = () => {
  const { settings } = useStore();

  const highlights = [
    { title: 'Assam Tea Gardens', desc: 'Directly sourced single-estate CTC and Orthodox tea leaves.' },
    { title: 'Organic Spices', desc: 'Freshly crushed ginger root and wild green cardamom.' },
    { title: 'Brass Kettle Boiling', desc: 'Sustained temperature extraction for thick, aromatic decoctions.' },
    { title: 'Eco Kulhad Clay Cups', desc: 'Traditional terracotta clay cups for earthy, fragrant notes.' },
  ];

  const tandooriImage = "/src/assets/images/tandoori_kulhad_chai_1786206693877.jpg";

  return (
    <section id="about" className="py-24 bg-stone-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Visual Grid Column */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-2xl overflow-hidden aspect-[3/4] border border-amber-500/30 shadow-2xl"
              >
                <img
                  src={tandooriImage}
                  alt="Traditional Kulhad Chai Craft"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="rounded-2xl overflow-hidden aspect-[3/4] border border-amber-500/30 shadow-2xl translate-y-6"
              >
                <img
                  src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=800"
                  alt="Fresh Tea Spices & Leaves"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </div>

            {/* Overlaid Floating Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-2xl bg-black/90 border border-amber-500/40 backdrop-blur-xl text-center shadow-2xl space-y-1">
              <div className="text-2xl font-serif font-extrabold text-amber-300">100% Authentic</div>
              <div className="text-[10px] uppercase tracking-widest text-stone-300">Indian Chai Heritage</div>
            </div>
          </div>

          {/* Right Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Our Philosophy</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              More Than Just a <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Tea Stall</span>
            </h2>

            <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed">
              In India, chai is not merely a hot drink — it is an emotion, a conversation starter, a morning ritual, and an afternoon sanctuary. Owned and managed by <strong className="text-amber-300 font-semibold">Bala Jadhav</strong> at {settings.name}, we set out to elevate this beloved ritual into a 5-star culinary experience at Harsul, Trimbakeshwar.
            </p>

            <p className="text-stone-400 text-sm font-light leading-relaxed">
              By combining pristine hygiene, single-origin Assam CTC tea leaves, hand-crushed whole cardamom and ginger, with luxurious warm golden ambiance, we bring you <strong className="text-amber-300">Affordable Luxury</strong> in every single cup.
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {highlights.map((h, i) => (
                <div key={i} className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 space-y-1">
                  <div className="font-serif font-bold text-sm text-amber-300">{h.title}</div>
                  <div className="text-xs text-stone-400 font-light">{h.desc}</div>
                </div>
              ))}
            </div>

            {/* Quote Badge */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/60 to-stone-900 border-l-4 border-amber-500 text-amber-200 text-xs italic">
              “ही फक्त चहाची टपरी नाही — हा Premium Chai Experience आहे.”
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
