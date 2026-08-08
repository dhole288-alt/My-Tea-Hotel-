import React from 'react';
import { Coffee, Leaf, ShieldCheck, Award, Zap, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: Coffee,
      title: 'Freshly Brewed',
      desc: 'Boiled continuously in small batches using traditional brass kettles so every cup arrives steaming hot.'
    },
    {
      icon: Leaf,
      title: 'Premium Ingredients',
      desc: 'Single-origin Assam CTC tea leaves, hand-picked green cardamom, fresh ginger, and 100% pure whole milk.'
    },
    {
      icon: ShieldCheck,
      title: 'Hygienic Preparation',
      desc: '100% untouched touchless stainless steel boilers and sterilized clay kulhad cups.'
    },
    {
      icon: Award,
      title: 'Expert Chai Makers',
      desc: 'Master Chai Ustads with 15+ years of specialized experience in Indian spice decoction and temperature control.'
    },
    {
      icon: Zap,
      title: 'Fast Service',
      desc: 'Under 5 minutes prep time for in-cafe orders and express vacuum-sealed hot delivery.'
    },
    {
      icon: Heart,
      title: 'Made With Love',
      desc: 'Every cup is poured with traditional Indian hospitality and warmth, making every visit special.'
    }
  ];

  return (
    <section className="py-20 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-widest uppercase">
            <span>The 5-Star Standard</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Why Royal Chai <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Is Exceptional</span>
          </h2>
          <p className="text-stone-400 text-sm sm:text-base font-light">
            We redefined the humble Indian tea stall into a luxury culinary experience without losing its authentic soul.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group p-8 rounded-2xl bg-stone-900/80 border border-amber-500/20 hover:border-amber-500/60 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 mb-6 group-hover:scale-110 transition-transform">
                  <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                    <Icon className="w-7 h-7 text-amber-400" />
                  </div>
                </div>

                <h3 className="text-xl font-serif font-bold text-white mb-3 group-hover:text-amber-300 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-stone-400 text-sm font-light leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
