import React from 'react';
import { useStore } from '../context/StoreContext';
import { Home, Coffee, ShoppingBag, MapPin, Phone, MessageCircle } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { cartCount, setIsCartOpen, settings } = useStore();

  const scrollToSection = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
    `Hello ${settings.name}, I would like to order!`
  )}`;

  return (
    <>
      {/* Floating Pulse WhatsApp Button for Desktop & Mobile */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-20 md:bottom-8 left-4 md:left-8 z-40 p-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black shadow-2xl shadow-emerald-500/50 flex items-center justify-center transition-all hover:scale-110 active:scale-95 group animate-bounce"
        aria-label="Contact on WhatsApp"
        title="Direct WhatsApp Order"
      >
        <MessageCircle className="w-6 h-6 text-black fill-black" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-bold uppercase pl-0 group-hover:pl-2">
          Chat / Order
        </span>
      </a>

      {/* Sticky Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/95 border-t border-amber-500/30 backdrop-blur-2xl px-2 py-2">
        <div className="grid grid-cols-5 gap-1 text-center">
          
          <button
            onClick={() => scrollToSection('#home')}
            className="flex flex-col items-center justify-center py-1 text-stone-400 hover:text-amber-400 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-wider uppercase mt-1">Home</span>
          </button>

          <button
            onClick={() => scrollToSection('#menu')}
            className="flex flex-col items-center justify-center py-1 text-stone-400 hover:text-amber-400 transition-colors"
          >
            <Coffee className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-wider uppercase mt-1">Menu</span>
          </button>

          <button
            onClick={() => setIsCartOpen(true)}
            className="flex flex-col items-center justify-center py-1 text-amber-400 relative"
          >
            <div className="w-10 h-10 -mt-5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-black flex items-center justify-center shadow-lg shadow-amber-500/30 border-2 border-black">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-amber-300 mt-1">Order</span>
          </button>

          <button
            onClick={() => scrollToSection('#contact')}
            className="flex flex-col items-center justify-center py-1 text-stone-400 hover:text-amber-400 transition-colors"
          >
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-wider uppercase mt-1">Location</span>
          </button>

          <a
            href={`tel:${settings.phone}`}
            className="flex flex-col items-center justify-center py-1 text-stone-400 hover:text-amber-400 transition-colors"
          >
            <Phone className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-wider uppercase mt-1">Call</span>
          </a>

        </div>
      </nav>
    </>
  );
};
