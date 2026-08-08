import React from 'react';
import { useStore } from '../context/StoreContext';
import { Crown, Heart, MessageCircle, Phone, MapPin, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, setIsAdminModalOpen } = useStore();

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-black text-stone-400 border-t border-amber-500/20 pt-16 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Crown className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-lg text-white tracking-wider">
                {settings.name}
              </span>
            </div>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              {settings.tagline}. A premium 5-star style Indian tea stall serving freshly brewed cutting chai, tandoori chai, authentic street snacks, and warm hospitality.
            </p>
            <div className="text-[11px] text-amber-400 font-serif italic">
              “ही फक्त चहाची टपरी नाही — हा Premium Chai Experience आहे.”
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              {['Home', 'Signature Chai', 'Menu', 'Combos', 'About', 'Gallery', 'Reviews', 'Contact'].map((item) => {
                const slug = `#${item.toLowerCase().replace(' ', '-')}`;
                return (
                  <li key={item}>
                    <button
                      onClick={() => scrollToSection(slug)}
                      className="hover:text-amber-400 transition-colors"
                    >
                      • {item}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Opening Hours */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Café Timings
            </h4>
            <div className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 text-xs space-y-1.5">
              <div className="font-bold text-amber-300">Every Day (Mon – Sun)</div>
              <div className="text-stone-300 font-mono">6:00 AM – 11:00 PM</div>
              <p className="text-[10px] text-emerald-400 font-medium">
                Piping hot chai served non-stop!
              </p>
            </div>
          </div>

          {/* Contact & Admin */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-white uppercase tracking-wider">
              Location & Contact
            </h4>
            <div className="text-xs space-y-2 text-stone-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{settings.phone}</span>
              </div>
            </div>

            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="mt-2 py-2 px-3 rounded-lg bg-stone-900 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase flex items-center gap-1.5 hover:bg-amber-500 hover:text-black transition-all"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>ADMIN DASHBOARD LOGIN</span>
            </button>
          </div>

        </div>

        <div className="pt-8 border-t border-stone-900 text-center text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} {settings.name}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Tea & Chai Lovers</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
