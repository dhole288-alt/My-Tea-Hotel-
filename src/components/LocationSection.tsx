import React from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Clock, Phone, MessageCircle, Navigation, Sparkles } from 'lucide-react';

export const LocationSection: React.FC = () => {
  const { settings } = useStore();

  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    settings.address
  )}`;

  const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
    `Hello ${settings.name}, I would like directions to your tea hotel!`
  )}`;

  return (
    <section id="contact" className="py-20 bg-stone-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Store Locator</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Visit Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Chai Café</span>
          </h2>
          <p className="text-stone-400 text-sm sm:text-base font-light">
            Conveniently located in the heart of the city with valet parking and comfortable outdoor courtyard seating.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Info Card Column */}
          <div className="lg:col-span-5 rounded-3xl bg-stone-900/90 border border-amber-500/30 p-8 backdrop-blur-2xl shadow-2xl flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">
                    Business Address
                  </h4>
                  <p className="text-sm text-stone-200 font-medium leading-relaxed">
                    {settings.address}
                  </p>
                </div>
              </div>

              {/* Opening Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">
                    Opening Hours
                  </h4>
                  <p className="text-sm font-bold text-amber-300">
                    {settings.openingHours}
                  </p>
                  <p className="text-xs text-emerald-400 font-medium mt-0.5">
                    ● Open 7 Days a Week
                  </p>
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">
                    Direct Phone & Order Line
                  </h4>
                  <p className="text-sm font-bold text-stone-200">
                    {settings.phone}
                  </p>
                  <p className="text-xs text-stone-400">
                    Email: {settings.email}
                  </p>
                </div>
              </div>

            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-stone-800">
              <a
                href={`tel:${settings.phone}`}
                className="py-3 px-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-[11px] font-bold uppercase tracking-wider text-center flex flex-col items-center justify-center gap-1 shadow-md shadow-amber-500/20"
              >
                <Phone className="w-4 h-4" />
                <span>CALL NOW</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider text-center flex flex-col items-center justify-center gap-1 shadow-md"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WHATSAPP</span>
              </a>

              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-[11px] font-bold uppercase tracking-wider text-center flex flex-col items-center justify-center gap-1"
              >
                <Navigation className="w-4 h-4 text-amber-400" />
                <span>DIRECTIONS</span>
              </a>
            </div>

          </div>

          {/* Interactive Google Map Column */}
          <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl relative min-h-[350px]">
            <iframe
              title="Google Maps Cafe Location"
              src={settings.googleMapsEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '380px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full grayscale invert opacity-80 hover:opacity-100 transition-opacity"
            />
            <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Valet Parking Available</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
