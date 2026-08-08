import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CategoryType, Product } from '../types';
import { Search, Plus, Check, Star, Coffee, Utensils, CupSoda, Cake, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export const MenuSection: React.FC = () => {
  const { products, addToCart } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  const categories: { label: string; value: CategoryType | 'All'; icon: React.FC<{ className?: string }> }[] = [
    { label: 'All Items', value: 'All', icon: Zap },
    { label: '☕ Tea', value: 'Tea', icon: Coffee },
    { label: '☕ Coffee', value: 'Coffee', icon: Coffee },
    { label: '🥪 Snacks', value: 'Snacks', icon: Utensils },
    { label: '🍔 Quick Bites', value: 'Quick Bites', icon: Utensils },
    { label: '🍰 Desserts', value: 'Desserts', icon: Cake },
    { label: '🥤 Cold Beverages', value: 'Cold Beverages', icon: CupSoda },
  ];

  const filteredProducts = products.filter(product => {
    if (!product.isAvailable) return false;
    if (selectedCategory !== 'All' && product.category !== selectedCategory) return false;
    if (vegOnly && !product.isVeg) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAdd = (product: Product) => {
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section id="menu" className="py-20 bg-stone-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-widest uppercase">
            <span>Freshly Prepared Daily</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">Grand Menu</span>
          </h2>
          <p className="text-stone-400 text-sm sm:text-base font-light">
            Select your favorite teas, coffees, authentic street snacks and warm baked goods.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="space-y-6 mb-12">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20 scale-105'
                      : 'bg-stone-900 text-stone-300 hover:text-amber-400 border border-stone-800'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search & Veg Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-stone-900/80 border border-amber-500/20 backdrop-blur-xl">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/60 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Veg Only Toggle & Items Count */}
            <div className="flex items-center justify-between w-full sm:w-auto gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300 font-medium">
                <input
                  type="checkbox"
                  checked={vegOnly}
                  onChange={(e) => setVegOnly(e.target.checked)}
                  className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded border border-emerald-500 flex items-center justify-center p-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </span>
                  Pure Veg Only
                </span>
              </label>

              <div className="text-xs text-amber-400 font-mono">
                Showing {filteredProducts.length} items
              </div>
            </div>
          </div>

        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-stone-900/50 rounded-2xl border border-stone-800 space-y-3">
            <p className="text-stone-400 text-sm">No items match your selected filters.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setVegOnly(false);
              }}
              className="text-xs text-amber-400 underline font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, idx) => {
              const isAdded = addedId === product.id;
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className="group rounded-2xl bg-stone-900/90 border border-amber-500/20 hover:border-amber-500/50 p-4 backdrop-blur-xl shadow-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
                >
                  <div>
                    {/* Image */}
                    <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-3 bg-stone-950">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                      {/* Veg indicator badge */}
                      <div className="absolute top-2.5 left-2.5 p-1 rounded bg-black/80 backdrop-blur-md">
                        <span className="w-4 h-4 rounded border border-emerald-500 flex items-center justify-center p-0.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        </span>
                      </div>

                      {/* Bestseller badge */}
                      {product.isBestseller && (
                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-amber-500 text-black text-[10px] font-extrabold uppercase tracking-wider">
                          BESTSELLER
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-serif font-bold text-stone-100 text-base group-hover:text-amber-300 transition-colors">
                          {product.name}
                        </h3>
                        {product.rating && (
                          <div className="flex items-center gap-1 text-amber-400 text-xs font-bold shrink-0">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{product.rating}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-stone-400 text-xs line-clamp-2 font-light leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Price & Add Button */}
                  <div className="pt-4 mt-4 border-t border-stone-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-stone-400 uppercase block font-medium">Price</span>
                      <span className="text-lg font-extrabold text-amber-300">₹{product.price}</span>
                    </div>

                    <button
                      onClick={() => handleAdd(product)}
                      className={`py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
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
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
