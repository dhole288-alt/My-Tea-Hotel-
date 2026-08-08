import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, OrderStatus, CategoryType } from '../types';
import { 
  Shield, X, Lock, LayoutDashboard, ShoppingBag, Utensils, Calendar, 
  Users, MessageSquare, Tag, Settings, LogOut, CheckCircle, Clock, 
  Trash2, Plus, Edit, Star, Phone, MessageCircle, AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDashboard: React.FC = () => {
  const {
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    isAdminModalOpen,
    setIsAdminModalOpen,
    orders,
    updateOrderStatus,
    deleteOrder,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability,
    toggleProductBestseller,
    bookings,
    updateBookingStatus,
    deleteBooking,
    enquiries,
    deleteEnquiry,
    getCustomersCRM,
    settings,
    updateSettings,
    offers,
    addOffer,
    deleteOffer,
    reviews,
    deleteReview
  } = useStore();

  const [passcode, setPasscode] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'bookings' | 'crm' | 'enquiries' | 'settings'>('dashboard');

  // Product Edit Modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // New product form
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<CategoryType>('Tea');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState(40);
  const [prodImage, setProdImage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAdmin(passcode);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        name: prodName,
        category: prodCategory,
        description: prodDesc,
        price: prodPrice,
        image: prodImage || editingProduct.image
      });
    } else {
      addProduct({
        name: prodName,
        category: prodCategory,
        description: prodDesc,
        price: prodPrice,
        image: prodImage || 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800',
        isVeg: true,
        isAvailable: true
      });
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
    setProdName('');
    setProdDesc('');
    setProdPrice(40);
  };

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdCategory(prod.category);
    setProdDesc(prod.description);
    setProdPrice(prod.price);
    setProdImage(prod.image);
    setIsProductModalOpen(true);
  };

  // Stats
  const todaySales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter(o => o.status === 'New' || o.status === 'Confirmed' || o.status === 'Preparing');
  const pendingBookings = bookings.filter(b => b.status === 'Pending');
  const customersList = getCustomersCRM();

  if (!isAdminModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl p-4 md:p-8 flex items-center justify-center overflow-y-auto"
      >
        <div className="w-full max-w-6xl bg-stone-950 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
          
          {/* Top Admin Header */}
          <div className="p-5 bg-stone-900 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-white">Royal Chai Admin Portal</h3>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest">Management System</p>
              </div>
            </div>

            <button
              onClick={() => setIsAdminModalOpen(false)}
              className="p-2 rounded-lg text-stone-400 hover:text-amber-400 hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {!isAdminLoggedIn ? (
            /* LOGIN SCREEN */
            <div className="p-8 md:p-16 max-w-md mx-auto my-auto text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
                <Lock className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-2xl font-serif font-bold text-white">Admin Authentication</h4>
                <p className="text-xs text-stone-400">Enter your secure passcode to access control dashboard.</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter Passcode (Default: admin123)"
                    className="w-full p-3.5 rounded-xl bg-black border border-stone-800 text-amber-300 font-mono text-center tracking-widest text-sm focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-[11px] text-amber-400/80 mt-1 font-mono">Hint: Use "admin123"</p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
                >
                  UNLOCK ADMIN PORTAL
                </button>
              </form>
            </div>
          ) : (
            /* ADMIN PORTAL MAIN INTERFACE */
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              
              {/* Sidebar Tabs */}
              <div className="w-full md:w-64 bg-stone-900/60 border-r border-stone-800 p-4 space-y-2 shrink-0 overflow-x-auto md:overflow-y-auto flex md:flex-col">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider text-left flex items-center gap-2.5 transition-all ${
                    activeTab === 'dashboard' ? 'bg-amber-500 text-black' : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider text-left flex items-center justify-between transition-all ${
                    activeTab === 'orders' ? 'bg-amber-500 text-black' : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Orders</span>
                  </div>
                  {pendingOrders.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                      {pendingOrders.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider text-left flex items-center gap-2.5 transition-all ${
                    activeTab === 'products' ? 'bg-amber-500 text-black' : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  <span>Products & Menu</span>
                </button>

                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider text-left flex items-center justify-between transition-all ${
                    activeTab === 'bookings' ? 'bg-amber-500 text-black' : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4" />
                    <span>Table Bookings</span>
                  </div>
                  {pendingBookings.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-bold">
                      {pendingBookings.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('crm')}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider text-left flex items-center gap-2.5 transition-all ${
                    activeTab === 'crm' ? 'bg-amber-500 text-black' : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Customer CRM</span>
                </button>

                <button
                  onClick={() => setActiveTab('enquiries')}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider text-left flex items-center gap-2.5 transition-all ${
                    activeTab === 'enquiries' ? 'bg-amber-500 text-black' : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Enquiries</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold uppercase tracking-wider text-left flex items-center gap-2.5 transition-all ${
                    activeTab === 'settings' ? 'bg-amber-500 text-black' : 'text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>

                <div className="pt-4 border-t border-stone-800 mt-auto">
                  <button
                    onClick={logoutAdmin}
                    className="w-full py-2 px-3 rounded-xl bg-stone-900 text-rose-400 text-xs font-bold uppercase flex items-center gap-2 hover:bg-rose-950"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>LOGOUT</span>
                  </button>
                </div>
              </div>

              {/* Tab Panel Content */}
              <div className="flex-1 p-6 overflow-y-auto space-y-6">
                
                {/* 1. DASHBOARD OVERVIEW */}
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-serif font-bold text-white">Dashboard Statistics</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl bg-stone-900 border border-amber-500/20">
                        <div className="text-stone-400 text-[11px] font-bold uppercase">Today's Sales</div>
                        <div className="text-2xl font-extrabold text-amber-400 font-mono">₹{todaySales}</div>
                      </div>

                      <div className="p-4 rounded-2xl bg-stone-900 border border-amber-500/20">
                        <div className="text-stone-400 text-[11px] font-bold uppercase">Total Orders</div>
                        <div className="text-2xl font-extrabold text-white font-mono">{orders.length}</div>
                      </div>

                      <div className="p-4 rounded-2xl bg-stone-900 border border-amber-500/20">
                        <div className="text-stone-400 text-[11px] font-bold uppercase">Pending Orders</div>
                        <div className="text-2xl font-extrabold text-rose-400 font-mono">{pendingOrders.length}</div>
                      </div>

                      <div className="p-4 rounded-2xl bg-stone-900 border border-amber-500/20">
                        <div className="text-stone-400 text-[11px] font-bold uppercase">Total Customers</div>
                        <div className="text-2xl font-extrabold text-emerald-400 font-mono">{customersList.length}</div>
                      </div>

                      <div className="p-4 rounded-2xl bg-stone-900 border border-amber-500/20">
                        <div className="text-stone-400 text-[11px] font-bold uppercase">Table Reservations</div>
                        <div className="text-2xl font-extrabold text-amber-300 font-mono">{bookings.length}</div>
                      </div>

                      <div className="p-4 rounded-2xl bg-stone-900 border border-amber-500/20">
                        <div className="text-stone-400 text-[11px] font-bold uppercase">New Enquiries</div>
                        <div className="text-2xl font-extrabold text-sky-400 font-mono">{enquiries.length}</div>
                      </div>
                    </div>

                    {/* Quick Recent Orders */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-stone-300 uppercase">Recent Orders</h4>
                      <div className="space-y-2">
                        {orders.slice(0, 5).map(o => (
                          <div key={o.id} className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between text-xs">
                            <div>
                              <span className="font-bold text-amber-300">#{o.id}</span>
                              <span className="text-stone-400 ml-2">{o.customerName} ({o.customerPhone})</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-extrabold text-white">₹{o.totalAmount}</span>
                              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                                {o.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. ORDERS MANAGEMENT */}
                {activeTab === 'orders' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-serif font-bold text-white">Order Management</h3>
                      <span className="text-xs text-amber-400 font-mono">{orders.length} total orders</span>
                    </div>

                    <div className="space-y-4">
                      {orders.length === 0 ? (
                        <p className="text-stone-400 text-xs text-center py-8">No orders placed yet.</p>
                      ) : (
                        orders.map((o) => (
                          <div key={o.id} className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-800">
                              <div>
                                <span className="font-serif font-bold text-base text-amber-300">Order #{o.id}</span>
                                <span className="text-xs text-stone-400 ml-2">({o.orderType})</span>
                              </div>
                              
                              {/* Status Select */}
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-stone-400">Status:</span>
                                <select
                                  value={o.status}
                                  onChange={(e: any) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                                  className="px-3 py-1 rounded-lg bg-black text-amber-300 text-xs font-bold border border-amber-500/40"
                                >
                                  {(['New', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'] as OrderStatus[]).map(st => (
                                    <option key={st} value={st}>{st}</option>
                                  ))}
                                </select>

                                <button
                                  onClick={() => deleteOrder(o.id)}
                                  className="p-1.5 text-rose-400 hover:text-rose-300"
                                  title="Delete Order"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="text-xs space-y-1 text-stone-300">
                              <div><strong>Customer:</strong> {o.customerName} ({o.customerPhone})</div>
                              {o.address && <div><strong>Address:</strong> {o.address}</div>}
                              {o.tableNumber && <div><strong>Table:</strong> {o.tableNumber}</div>}
                              <div><strong>Payment:</strong> {o.paymentMethod} ({o.paymentStatus})</div>
                            </div>

                            <div className="p-3 rounded-xl bg-black/60 border border-stone-800 text-xs space-y-1">
                              <span className="text-[10px] font-bold text-amber-400 uppercase">Items:</span>
                              {o.items?.map((it, i) => (
                                <div key={i} className="flex justify-between text-stone-300">
                                  <span>{it.quantity}x {it.product.name}</span>
                                  <span>₹{it.product.price * it.quantity}</span>
                                </div>
                              ))}
                              <div className="pt-2 border-t border-stone-800 flex justify-between font-bold text-amber-300">
                                <span>TOTAL</span>
                                <span>₹{o.totalAmount}</span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* 3. PRODUCTS & MENU MANAGEMENT */}
                {activeTab === 'products' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-serif font-bold text-white">Menu Products</h3>
                      <button
                        onClick={() => {
                          setEditingProduct(null);
                          setProdName('');
                          setProdDesc('');
                          setProdPrice(40);
                          setIsProductModalOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" />
                        <span>ADD NEW PRODUCT</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {products.map((p) => (
                        <div key={p.id} className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-16 h-16 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" />
                          <div className="flex-1 min-w-0 space-y-1">
                            <h4 className="font-serif font-bold text-sm text-white truncate">{p.name}</h4>
                            <div className="text-xs font-bold text-amber-400">₹{p.price} • {p.category}</div>
                          </div>
                          
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => openEditProduct(p)}
                              className="px-2.5 py-1 rounded bg-stone-800 text-stone-300 text-[10px] font-bold uppercase hover:text-amber-400"
                            >
                              EDIT
                            </button>
                            <button
                              onClick={() => toggleProductAvailability(p.id)}
                              className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                                p.isAvailable ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                              }`}
                            >
                              {p.isAvailable ? 'AVAILABLE' : 'OFF'}
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="px-2.5 py-1 rounded bg-rose-950 text-rose-400 text-[10px] font-bold uppercase"
                            >
                              DEL
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. TABLE BOOKINGS */}
                {activeTab === 'bookings' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-serif font-bold text-white">Table Reservations</h3>
                    
                    <div className="space-y-3">
                      {bookings.length === 0 ? (
                        <p className="text-stone-400 text-xs">No table bookings yet.</p>
                      ) : (
                        bookings.map(b => (
                          <div key={b.id} className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-2">
                            <div className="flex justify-between items-center pb-2 border-b border-stone-800">
                              <span className="font-serif font-bold text-amber-300">#{b.id} - {b.customerName}</span>
                              <div className="flex items-center gap-2">
                                <select
                                  value={b.status}
                                  onChange={(e: any) => updateBookingStatus(b.id, e.target.value)}
                                  className="px-2 py-1 rounded bg-black text-amber-300 text-xs font-bold"
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Completed">Completed</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                                <button onClick={() => deleteBooking(b.id)} className="text-rose-400">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="text-xs text-stone-300 grid grid-cols-2 sm:grid-cols-4 gap-2">
                              <div><strong>Phone:</strong> {b.customerPhone}</div>
                              <div><strong>Date & Time:</strong> {b.date} at {b.time}</div>
                              <div><strong>Guests:</strong> {b.guests}</div>
                              <div><strong>Seating:</strong> {b.seatingArea}</div>
                            </div>
                            {b.specialRequest && (
                              <div className="text-[11px] text-amber-400/80 italic">Request: {b.specialRequest}</div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* 5. CUSTOMER CRM */}
                {activeTab === 'crm' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-serif font-bold text-white">Customer CRM Directory</h3>
                    
                    <div className="space-y-2">
                      {customersList.length === 0 ? (
                        <p className="text-stone-400 text-xs">No customer history recorded yet.</p>
                      ) : (
                        customersList.map((c, i) => (
                          <div key={i} className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between text-xs">
                            <div>
                              <div className="font-serif font-bold text-white text-sm">{c.name}</div>
                              <div className="text-stone-400">{c.phone}</div>
                            </div>
                            <div className="text-right space-y-0.5">
                              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase">
                                {c.status}
                              </span>
                              <div className="text-stone-300 font-bold">{c.totalOrders} Orders • ₹{c.totalSpent} Spent</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* 6. ENQUIRIES */}
                {activeTab === 'enquiries' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-serif font-bold text-white">Customer Enquiries</h3>
                    <div className="space-y-3">
                      {enquiries.length === 0 ? (
                        <p className="text-stone-400 text-xs">No enquiries received yet.</p>
                      ) : (
                        enquiries.map((enq) => (
                          <div key={enq.id} className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-2 text-xs">
                            <div className="flex justify-between items-center border-b border-stone-800 pb-2">
                              <span className="font-serif font-bold text-amber-300">{enq.name} ({enq.phone})</span>
                              <button onClick={() => deleteEnquiry(enq.id)} className="text-rose-400">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <p className="text-stone-300">{enq.message}</p>
                            <div className="text-[10px] text-stone-500">{enq.createdAt}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* 7. SETTINGS */}
                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-serif font-bold text-white">Business Cafe Settings</h3>
                    <div className="space-y-4 max-w-lg">
                      <div>
                        <label className="block text-xs font-bold text-stone-300 uppercase mb-1">Café Name</label>
                        <input
                          type="text"
                          value={settings.name}
                          onChange={(e) => updateSettings({ name: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-black border border-stone-800 text-stone-200 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-300 uppercase mb-1">WhatsApp Order Number</label>
                        <input
                          type="text"
                          value={settings.whatsapp}
                          onChange={(e) => updateSettings({ whatsapp: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-black border border-stone-800 text-stone-200 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-300 uppercase mb-1">Business Phone</label>
                        <input
                          type="text"
                          value={settings.phone}
                          onChange={(e) => updateSettings({ phone: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-black border border-stone-800 text-stone-200 text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-300 uppercase mb-1">UPI ID for Payment QR</label>
                        <input
                          type="text"
                          value={settings.upiId}
                          onChange={(e) => updateSettings({ upiId: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-black border border-stone-800 text-amber-300 text-xs font-mono font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-stone-300 uppercase mb-1">Address</label>
                        <textarea
                          rows={2}
                          value={settings.address}
                          onChange={(e) => updateSettings({ address: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-black border border-stone-800 text-stone-200 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

        </div>
      </motion.div>

      {/* Product Add/Edit Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md p-4 flex items-center justify-center">
          <div className="w-full max-w-md rounded-2xl bg-stone-900 border border-amber-500/30 p-6 space-y-4">
            <h4 className="font-serif font-bold text-lg text-white">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h4>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-300 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black border border-stone-800 text-stone-200"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">Category</label>
                <select
                  value={prodCategory}
                  onChange={(e: any) => setProdCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black border border-stone-800 text-amber-300 font-bold"
                >
                  <option value="Tea">Tea</option>
                  <option value="Coffee">Coffee</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Quick Bites">Quick Bites</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Cold Beverages">Cold Beverages</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">Price (₹)</label>
                <input
                  type="number"
                  required
                  value={prodPrice}
                  onChange={(e) => setProdPrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl bg-black border border-stone-800 text-stone-200"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black border border-stone-800 text-stone-200"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-300 mb-1">Image URL</label>
                <input
                  type="text"
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl bg-black border border-stone-800 text-stone-200"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-stone-800 text-stone-300 font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-amber-500 text-black font-extrabold"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
