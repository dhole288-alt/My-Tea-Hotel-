import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Star, MessageSquare, CheckCircle, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ReviewsSection: React.FC = () => {
  const { reviews, addReview } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [favoriteTea, setFavoriteTea] = useState('Masala Chai');
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    addReview(name, rating, comment, favoriteTea);
    setName('');
    setComment('');
    setIsModalOpen(false);
  };

  return (
    <section id="reviews" className="py-20 bg-stone-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-widest">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>4.9 / 5.0 Star Rating</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
              What Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Customers Say</span>
            </h2>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>WRITE A REVIEW</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="rounded-2xl p-6 bg-stone-900/90 border border-amber-500/20 backdrop-blur-xl shadow-2xl flex flex-col justify-between space-y-4 hover:border-amber-500/50 transition-all"
            >
              <div className="space-y-3">
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-stone-300 text-xs font-light leading-relaxed italic">
                  “{rev.comment}”
                </p>
              </div>

              <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                <div>
                  <div className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
                    <span>{rev.customerName}</span>
                    {rev.verifiedCustomer && (
                      <span title="Verified Guest">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      </span>
                    )}
                  </div>
                  {rev.favoriteTea && (
                    <div className="text-[10px] text-amber-400 font-mono">
                      Fav: {rev.favoriteTea}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-stone-500 font-mono">{rev.createdAt}</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Write a Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-center cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl bg-stone-900 border border-amber-500/30 p-6 sm:p-8 shadow-2xl space-y-6 relative cursor-default"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-stone-800 text-stone-400 hover:text-amber-400"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <h3 className="text-2xl font-serif font-bold text-white">Write a Review</h3>
                <p className="text-xs text-stone-400">Share your 5-star chai experience with us!</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Verma"
                    className="w-full p-3 rounded-xl bg-black/70 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-300 uppercase mb-1">Rating</label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full p-3 rounded-xl bg-black/70 border border-stone-800 text-amber-300 text-xs font-bold focus:outline-none focus:border-amber-500"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                      <option value={3}>⭐⭐⭐ (3 Stars)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-300 uppercase mb-1">Favorite Chai</label>
                    <input
                      type="text"
                      value={favoriteTea}
                      onChange={(e) => setFavoriteTea(e.target.value)}
                      placeholder="e.g. Tandoori Chai"
                      className="w-full p-3 rounded-xl bg-black/70 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase mb-1">Your Review Comment *</label>
                  <textarea
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you loved about the tea, taste, and atmosphere..."
                    className="w-full p-3 rounded-xl bg-black/70 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
                >
                  SUBMIT REVIEW
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
