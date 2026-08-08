import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Calendar, Clock, Users, Sparkles, CheckCircle2, User, Phone, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export const TableBookingSection: React.FC = () => {
  const { addBooking, isBookingModalOpen, setIsBookingModalOpen } = useStore();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('18:00');
  const [guests, setGuests] = useState(2);
  const [seatingArea, setSeatingArea] = useState<'Indoor AC Lounge' | 'Outdoor Courtyard' | 'Royal VIP Sofa'>('Indoor AC Lounge');
  const [specialRequest, setSpecialRequest] = useState('');

  const [confirmedBooking, setConfirmedBooking] = useState<any | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const bkg = addBooking(name, phone, date, time, guests, seatingArea, specialRequest);
    setConfirmedBooking(bkg);
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setName('');
    setPhone('');
    setSpecialRequest('');
    if (isBookingModalOpen) setIsBookingModalOpen(false);
  };

  return (
    <section id="book-table" className="py-20 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-4xl mx-auto rounded-3xl bg-stone-900/90 border border-amber-500/30 p-8 sm:p-12 backdrop-blur-2xl shadow-2xl space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>VIP Reservations</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white">
              Book Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Table</span>
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm max-w-xl mx-auto">
              Reserve your seat in our 5-star chai lounge for a relaxing evening tea session, family gathering or business meetup.
            </p>
          </div>

          {confirmedBooking ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-2xl bg-stone-950 border border-emerald-500/40 text-center space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-white">Table Reserved Successfully!</h3>
                <p className="text-xs text-stone-400">
                  Ref ID: <span className="font-mono font-bold text-amber-300">{confirmedBooking.id}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-stone-900 border border-stone-800 text-left text-xs">
                <div>
                  <span className="text-stone-500 uppercase block font-semibold text-[10px]">Guest Name</span>
                  <span className="text-stone-200 font-bold">{confirmedBooking.customerName}</span>
                </div>
                <div>
                  <span className="text-stone-500 uppercase block font-semibold text-[10px]">Date & Time</span>
                  <span className="text-amber-300 font-bold">{confirmedBooking.date} at {confirmedBooking.time}</span>
                </div>
                <div>
                  <span className="text-stone-500 uppercase block font-semibold text-[10px]">Guests</span>
                  <span className="text-stone-200 font-bold">{confirmedBooking.guests} Persons</span>
                </div>
                <div>
                  <span className="text-stone-500 uppercase block font-semibold text-[10px]">Seating Area</span>
                  <span className="text-amber-300 font-bold">{confirmedBooking.seatingArea}</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
              >
                DONE / MAKE ANOTHER BOOKING
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Customer Name */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase mb-2">
                    Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/80 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase mb-2">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/80 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase mb-2">
                    Date *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/80 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Time */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase mb-2">
                    Time *
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/80 border border-stone-800 text-amber-300 font-bold text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="07:00">07:00 AM (Morning Special)</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="16:00">04:00 PM (Evening High Tea)</option>
                      <option value="18:00">06:00 PM (Prime Hour)</option>
                      <option value="20:00">08:00 PM</option>
                      <option value="22:00">10:00 PM (Late Night Chai)</option>
                    </select>
                  </div>
                </div>

                {/* Number of Guests */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase mb-2">
                    Number of Guests *
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/80 border border-stone-800 text-amber-300 font-bold text-xs focus:outline-none focus:border-amber-500"
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10, 12, 15].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Seating Area */}
                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase mb-2">
                    Seating Area Preference
                  </label>
                  <select
                    value={seatingArea}
                    onChange={(e: any) => setSeatingArea(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/80 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="Indoor AC Lounge">Indoor AC Lounge (Ambient)</option>
                    <option value="Outdoor Courtyard">Outdoor Courtyard (Fresh Air)</option>
                    <option value="Royal VIP Sofa">Royal VIP Sofa (Plush Leather)</option>
                  </select>
                </div>

              </div>

              {/* Special Request */}
              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase mb-2">
                  Special Request (Optional)
                </label>
                <textarea
                  rows={2}
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="e.g. Birthday surprise, quiet corner table, high chair required..."
                  className="w-full p-3 rounded-xl bg-black/80 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs uppercase tracking-widest shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-95"
              >
                BOOK TABLE
              </button>
            </form>
          )}

        </div>

      </div>
    </section>
  );
};
