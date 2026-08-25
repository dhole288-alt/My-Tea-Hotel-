import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, OrderStatus, CategoryType } from '../types';
import { 
  Shield, X, Lock, LayoutDashboard, ShoppingBag, Utensils, Calendar, 
  Users, MessageSquare, Settings, LogOut, CheckCircle, Clock, 
  Trash2, Plus, Edit, Star, Phone, MessageCircle, AlertCircle, 
  Cloud, ExternalLink, RefreshCw, KeyRound, UserCheck, ShieldAlert,
  ArrowLeft, Tag, DollarSign, Database, CheckCircle2, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminDashboard: React.FC<{ isModalMode?: boolean; onCloseModal?: () => void }> = ({ 
  isModalMode = false, 
  onCloseModal 
}) => {
  const {
    isAdminLoggedIn,
    adminUser,
    logoutAdmin,
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
    offers,
    addOffer,
    deleteOffer,
    getCustomersCRM,
    settings,
    updateSettings,
    showToast,
    navigateTo,
    firebaseProjectId
  } = useStore();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'bookings' | 'crm' | 'enquiries' | 'offers' | 'settings'>('dashboard');

  // Product Edit Modal state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // New product form
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<CategoryType>('Tea');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState(40);
  const [prodImage, setProdImage] = useState('');

  // Offer form modal state
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerTitle, setOfferTitle] = useState('');
  const [offerCode, setOfferCode] = useState('');
  const [offerDiscount, setOfferDiscount] = useState(15);
  const [offerDesc, setOfferDesc] = useState('');

  // Business settings state
  const [settingsForm, setSettingsForm] = useState(settings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Filter state for orders
  const [orderFilter, setOrderFilter] = useState<'ALL' | OrderStatus>('ALL');

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    if (editingProduct) {
      await updateProduct({
        ...editingProduct,
        name: prodName,
        category: prodCategory,
        description: prodDesc,
        price: prodPrice,
        image: prodImage || editingProduct.image
      });
    } else {
      await addProduct({
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
    setProdImage('');
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

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerCode.trim() || !offerTitle.trim()) return;

    await addOffer({
      title: offerTitle,
      code: offerCode.toUpperCase().trim(),
      description: offerDesc || `${offerDiscount}% off on your order!`,
      discountPercentage: offerDiscount,
      validTill: 'Ongoing'
    });

    setIsOfferModalOpen(false);
    setOfferTitle('');
    setOfferCode('');
    setOfferDesc('');
    setOfferDiscount(15);
  };

  const handleSaveBusinessSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await updateSettings(settingsForm);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Derived metrics
  const totalRevenue = orders.reduce((sum, o) => o.paymentStatus === 'Paid' ? sum + o.totalAmount : sum, 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'Completed' && o.status !== 'Cancelled').length;
  const pendingBookingsCount = bookings.filter(b => b.status === 'Pending' || b.status === 'Confirmed').length;
  const unreadEnquiriesCount = enquiries.filter(e => e.status === 'Unread').length;
  const filteredOrders = orderFilter === 'ALL' ? orders : orders.filter(o => o.status === orderFilter);
  const customers = getCustomersCRM();

  return (
    <div className={`min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black ${isModalMode ? 'p-0' : ''}`}>
      {/* Top Admin Navigation Bar */}
      <header className="sticky top-0 z-30 bg-stone-900/95 border-b border-amber-500/30 backdrop-blur-md px-4 sm:px-6 py-3.5 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (isModalMode && onCloseModal) {
                  onCloseModal();
                } else {
                  navigateTo('/');
                }
              }}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-400 transition-colors flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
              title="Return to Public Website"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Storefront</span>
            </button>

            <div className="h-6 w-px bg-stone-800" />

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-black font-bold shadow-md shadow-amber-500/20">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif font-bold text-sm sm:text-base text-white tracking-wide">
                    {settings.name} Admin
                  </h1>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Firebase Live
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 hidden sm:block">
                  Logged in as: <strong className="text-amber-400">{adminUser?.email || 'Administrator'}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2.5">
            {isModalMode && onCloseModal && (
              <button
                onClick={onCloseModal}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => logoutAdmin()}
              className="px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/30 text-xs font-semibold tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar Navigation */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-stone-900/80 border border-amber-500/20 rounded-2xl p-4 shadow-xl space-y-1">
            
            {/* User Profile Snippet */}
            <div className="p-3 mb-3 rounded-xl bg-stone-950/70 border border-stone-800/80 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                  {adminUser?.displayName?.[0] || adminUser?.email?.[0] || 'A'}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-stone-200 truncate">
                    {adminUser?.displayName || 'Owner Admin'}
                  </p>
                  <p className="text-[10px] text-stone-400 truncate">{adminUser?.email}</p>
                </div>
              </div>
              <div className="text-[10px] text-stone-500 font-mono truncate">
                UID: {adminUser?.uid?.slice(0, 12)}...
              </div>
            </div>

            {/* Nav Links */}
            {[
              { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, badge: null },
              { id: 'orders', label: 'Live Orders', icon: ShoppingBag, badge: activeOrdersCount > 0 ? activeOrdersCount : null },
              { id: 'products', label: 'Menu Catalog', icon: Utensils, badge: products.length },
              { id: 'bookings', label: 'Table Bookings', icon: Calendar, badge: pendingBookingsCount > 0 ? pendingBookingsCount : null },
              { id: 'crm', label: 'Customer CRM', icon: Users, badge: customers.length },
              { id: 'enquiries', label: 'Enquiries', icon: MessageSquare, badge: unreadEnquiriesCount > 0 ? unreadEnquiriesCount : null },
              { id: 'offers', label: 'Offers & Promos', icon: Tag, badge: offers.length },
              { id: 'settings', label: 'Business Settings', icon: Settings, badge: null },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10 font-bold'
                      : 'text-stone-300 hover:bg-stone-800/80 hover:text-amber-400'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-amber-400'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== null && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-black text-amber-400'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Firebase Cloud Info Card */}
          <div className="bg-stone-900/60 border border-stone-800 rounded-2xl p-4 text-xs space-y-2.5">
            <div className="flex items-center gap-2 text-stone-300 font-bold text-xs uppercase tracking-wider">
              <Database className="w-4 h-4 text-amber-400" />
              <span>Firebase Database</span>
            </div>
            <div className="space-y-1 text-[11px] text-stone-400">
              <div>Project: <code className="text-amber-300">{firebaseProjectId || 'Connected'}</code></div>
              <div>Auth: <span className="text-emerald-400 font-semibold">Email/Password (Active)</span></div>
              <div>Rules: <span className="text-emerald-400 font-semibold">Admin Protected</span></div>
            </div>
          </div>
        </aside>

        {/* Right Main Content Area */}
        <main className="lg:col-span-9 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl space-y-1">
                  <span className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">Total Revenue</span>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">₹{totalRevenue.toLocaleString()}</p>
                  <span className="text-[10px] text-stone-500">From paid orders</span>
                </div>
                <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl space-y-1">
                  <span className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">Active Orders</span>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-amber-400">{activeOrdersCount}</p>
                  <span className="text-[10px] text-stone-500">In preparation & ready</span>
                </div>
                <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl space-y-1">
                  <span className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">Table Bookings</span>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-blue-400">{pendingBookingsCount}</p>
                  <span className="text-[10px] text-stone-500">Confirmed seats</span>
                </div>
                <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl space-y-1">
                  <span className="text-[11px] text-stone-400 uppercase tracking-wider font-semibold">Menu Items</span>
                  <p className="text-xl sm:text-2xl font-bold font-mono text-purple-400">{products.length}</p>
                  <span className="text-[10px] text-stone-500">Chais & Snacks</span>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                    <span>Recent Customer Orders</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <span>View All ({orders.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-stone-500 py-6 text-center">No orders received yet.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 4).map((order) => (
                      <div
                        key={order.id}
                        className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-amber-400 text-xs">#{order.id}</span>
                            <span className="text-xs font-semibold text-white">{order.customerName}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-mono">
                              {order.orderType}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-400 mt-1">
                            {order.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-white text-sm">₹{order.totalAmount}</span>
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            order.status === 'Ready' || order.status === 'Completed'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : order.status === 'Preparing' || order.status === 'Confirmed'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif font-bold text-lg text-white">Live Orders Management</h2>
                  <p className="text-xs text-stone-400">Manage real-time customer chai and snack orders in Firestore.</p>
                </div>

                {/* Filter Pills */}
                <div className="flex flex-wrap gap-1.5 bg-stone-900 p-1.5 rounded-xl border border-stone-800 text-xs">
                  {['ALL', 'New', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setOrderFilter(status as any)}
                      className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
                        orderFilter === status
                          ? 'bg-amber-500 text-black font-bold'
                          : 'text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center text-stone-500 text-xs">
                  No orders found under {orderFilter} status.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-amber-400 text-sm">#{order.id}</span>
                          <span className="font-bold text-white text-sm">{order.customerName}</span>
                          <a
                            href={`tel:${order.customerPhone}`}
                            className="inline-flex items-center gap-1 text-xs text-emerald-400 hover:underline bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{order.customerPhone}</span>
                          </a>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs text-stone-400 font-mono">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 hover:bg-rose-950/50 transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Items & details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">Ordered Items:</span>
                          <ul className="space-y-1">
                            {order.items.map((it, idx) => (
                              <li key={idx} className="text-stone-300 flex justify-between">
                                <span>{it.quantity}x {it.product.name}</span>
                                <span className="text-stone-400 font-mono">₹{it.product.price * it.quantity}</span>
                              </li>
                            ))}
                          </ul>
                          {order.specialInstructions && (
                            <p className="text-[11px] text-amber-300/80 italic mt-1.5">
                              Note: "{order.specialInstructions}"
                            </p>
                          )}
                        </div>

                        <div className="space-y-2 bg-stone-950/60 p-3 rounded-xl border border-stone-800/80">
                          <div className="flex justify-between">
                            <span className="text-stone-400">Order Type:</span>
                            <span className="font-semibold text-stone-200">{order.orderType}</span>
                          </div>
                          {order.address && (
                            <div className="flex justify-between">
                              <span className="text-stone-400">Delivery Address:</span>
                              <span className="font-medium text-stone-300 truncate max-w-[180px]">{order.address}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-stone-400">Payment:</span>
                            <span className="font-semibold text-emerald-400">{order.paymentMethod} ({order.paymentStatus})</span>
                          </div>
                          <div className="flex justify-between font-bold pt-1 border-t border-stone-800 text-sm">
                            <span className="text-white">Total Amount:</span>
                            <span className="text-amber-400 font-mono">₹{order.totalAmount}</span>
                          </div>
                        </div>
                      </div>

                      {/* Order Status Action Buttons */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs text-stone-400">Update Status:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {(['New', 'Confirmed', 'Preparing', 'Ready', 'Completed', 'Cancelled'] as OrderStatus[]).map((st) => (
                            <button
                              key={st}
                              onClick={() => updateOrderStatus(order.id, st)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                                order.status === st
                                  ? 'bg-amber-500 text-black shadow-md'
                                  : 'bg-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-700'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MENU PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif font-bold text-lg text-white">Menu & Product Catalog</h2>
                  <p className="text-xs text-stone-400">Add, edit pricing, toggle availability and manage chai & snacks.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProdName('');
                    setProdDesc('');
                    setProdPrice(40);
                    setProdImage('');
                    setIsProductModalOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex gap-3.5 items-start"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-xl object-cover border border-stone-800 shrink-0"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-serif font-bold text-sm text-white truncate">{prod.name}</h4>
                        <span className="font-mono font-bold text-amber-400 text-sm">₹{prod.price}</span>
                      </div>
                      <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">{prod.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        {/* Availability toggle */}
                        <button
                          onClick={() => toggleProductAvailability(prod.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            prod.isAvailable
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {prod.isAvailable ? 'In Stock' : 'Out of Stock'}
                        </button>

                        {/* Bestseller toggle */}
                        <button
                          onClick={() => toggleProductBestseller(prod.id)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            prod.isBestseller
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-stone-800 text-stone-500'
                          }`}
                        >
                          {prod.isBestseller ? '★ Bestseller' : 'Standard'}
                        </button>

                        <div className="ml-auto flex items-center gap-1.5">
                          <button
                            onClick={() => openEditProduct(prod)}
                            className="p-1 rounded bg-stone-800 text-stone-300 hover:text-amber-400"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(prod.id)}
                            className="p-1 rounded bg-stone-800 text-stone-300 hover:text-rose-400"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TABLE BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div>
                <h2 className="font-serif font-bold text-lg text-white">Table & Lounge Reservations</h2>
                <p className="text-xs text-stone-400">View and confirm customer seat bookings.</p>
              </div>

              {bookings.length === 0 ? (
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center text-stone-500 text-xs">
                  No table reservations found.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                        <div>
                          <span className="font-mono text-xs font-bold text-amber-400">#{booking.id}</span>
                          <h4 className="font-bold text-sm text-white">{booking.customerName}</h4>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          booking.status === 'Confirmed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : booking.status === 'Pending'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {booking.status}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-stone-300">
                        <div className="flex justify-between">
                          <span className="text-stone-400">Date & Time:</span>
                          <span className="font-mono">{booking.date} at {booking.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">Guests:</span>
                          <span>{booking.guests} Persons</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">Seating Area:</span>
                          <span className="text-amber-300">{booking.seatingArea || 'General Area'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-400">Phone:</span>
                          <a href={`tel:${booking.customerPhone}`} className="text-emerald-400 font-mono hover:underline">
                            {booking.customerPhone}
                          </a>
                        </div>
                        {booking.specialRequest && (
                          <p className="text-[11px] text-amber-200/80 italic pt-1">
                            Note: "{booking.specialRequest}"
                          </p>
                        )}
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-2 border-t border-stone-800">
                        <div className="flex gap-1.5">
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'Confirmed')}
                            className="px-2 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'Completed')}
                            className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] font-bold"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'Cancelled')}
                            className="px-2 py-1 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30 text-[10px] font-bold"
                          >
                            Cancel
                          </button>
                        </div>

                        <button
                          onClick={() => deleteBooking(booking.id)}
                          className="p-1 rounded text-stone-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CUSTOMER CRM */}
          {activeTab === 'crm' && (
            <div className="space-y-4">
              <div>
                <h2 className="font-serif font-bold text-lg text-white">Customer CRM & Loyalty</h2>
                <p className="text-xs text-stone-400">Track repeat customers, order frequencies, and VIP tea lovers.</p>
              </div>

              {customers.length === 0 ? (
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center text-stone-500 text-xs">
                  No customer records collected yet.
                </div>
              ) : (
                <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-950 text-stone-400 font-semibold border-b border-stone-800">
                        <tr>
                          <th className="p-3.5">Customer</th>
                          <th className="p-3.5">Phone</th>
                          <th className="p-3.5">Total Orders</th>
                          <th className="p-3.5">Total Spent</th>
                          <th className="p-3.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-800/60">
                        {customers.map((c, i) => (
                          <tr key={i} className="hover:bg-stone-800/40">
                            <td className="p-3.5 font-bold text-white">{c.name}</td>
                            <td className="p-3.5 font-mono text-emerald-400">{c.phone}</td>
                            <td className="p-3.5 font-mono text-stone-300">{c.totalOrders} orders</td>
                            <td className="p-3.5 font-mono font-bold text-amber-400">₹{c.totalSpent}</td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                c.status === 'VIP'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-stone-800 text-stone-300'
                              }`}>
                                {c.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="space-y-4">
              <div>
                <h2 className="font-serif font-bold text-lg text-white">Event & Catering Enquiries</h2>
                <p className="text-xs text-stone-400">Messages sent through the website contact form.</p>
              </div>

              {enquiries.length === 0 ? (
                <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center text-stone-500 text-xs">
                  No customer enquiries yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {enquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2"
                    >
                      <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                        <div>
                          <span className="font-mono text-xs text-amber-400">#{enq.id}</span>
                          <h4 className="font-bold text-sm text-white">{enq.name}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <a
                            href={`tel:${enq.phone}`}
                            className="text-xs text-emerald-400 font-mono bg-emerald-950/40 px-2 py-1 rounded border border-emerald-500/30"
                          >
                            {enq.phone}
                          </a>
                          <button
                            onClick={() => deleteEnquiry(enq.id)}
                            className="p-1 rounded text-stone-500 hover:text-rose-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-stone-300 leading-relaxed bg-stone-950/50 p-3 rounded-xl">
                        "{enq.message}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: OFFERS & PROMOS */}
          {activeTab === 'offers' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif font-bold text-lg text-white">Promotions & Coupons</h2>
                  <p className="text-xs text-stone-400">Create discount codes for customer online orders.</p>
                </div>

                <button
                  onClick={() => setIsOfferModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Offer Code</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {offers.map((off) => (
                  <div
                    key={off.id}
                    className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 font-mono font-bold text-amber-300 text-xs">
                          {off.code}
                        </span>
                        <span className="font-bold text-emerald-400 text-sm">{off.discountPercentage}% OFF</span>
                      </div>
                      <h4 className="font-serif font-bold text-white text-sm mt-2">{off.title}</h4>
                      <p className="text-xs text-stone-400 mt-1">{off.description}</p>
                    </div>

                    <div className="pt-3 border-t border-stone-800 flex justify-end">
                      <button
                        onClick={() => deleteOffer(off.id)}
                        className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete Offer</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div>
                <h2 className="font-serif font-bold text-lg text-white">Business & Cafe Settings</h2>
                <p className="text-xs text-stone-400">Changes are saved directly to Firebase Firestore.</p>
              </div>

              <form onSubmit={handleSaveBusinessSettings} className="bg-stone-900 border border-stone-800 rounded-2xl p-5 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-300 uppercase">Hotel / Brand Name</label>
                    <input
                      type="text"
                      value={settingsForm.name}
                      onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-300 uppercase">Tagline</label>
                    <input
                      type="text"
                      value={settingsForm.tagline}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-300 uppercase">Phone Number</label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-300 uppercase">WhatsApp (without +)</label>
                    <input
                      type="text"
                      value={settingsForm.whatsapp}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-300 uppercase">UPI ID for Payments</label>
                    <input
                      type="text"
                      value={settingsForm.upiId}
                      onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-300 uppercase">Opening Hours</label>
                    <input
                      type="text"
                      value={settingsForm.openingHours}
                      onChange={(e) => setSettingsForm({ ...settingsForm, openingHours: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-stone-300 uppercase">Full Physical Address</label>
                  <textarea
                    rows={2}
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xs uppercase tracking-wider disabled:opacity-50"
                  >
                    {isSavingSettings ? 'Saving to Firestore...' : 'Save Settings'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* Product Add/Edit Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-stone-900 border border-amber-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <h3 className="font-serif font-bold text-base text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Chai / Food Item'}
                </h3>
                <button onClick={() => setIsProductModalOpen(false)} className="text-stone-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-300">Item Name</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="e.g. Special Elaichi Chai"
                    className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-stone-300">Category</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                    >
                      <option value="Tea">Tea</option>
                      <option value="Coffee">Coffee</option>
                      <option value="Snacks">Snacks</option>
                      <option value="Quick Bites">Quick Bites</option>
                      <option value="Desserts">Desserts</option>
                      <option value="Cold Beverages">Cold Beverages</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-stone-300">Price (₹)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-300">Description</label>
                  <textarea
                    rows={2}
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    placeholder="Flavor notes, brewing method, ingredients..."
                    className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-300">Image URL</label>
                  <input
                    type="url"
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold uppercase tracking-wider"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Offer Modal */}
      <AnimatePresence>
        {isOfferModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-stone-900 border border-amber-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <h3 className="font-serif font-bold text-base text-white">Create Promo Coupon Offer</h3>
                <button onClick={() => setIsOfferModalOpen(false)} className="text-stone-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveOffer} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-300">Offer Title</label>
                  <input
                    type="text"
                    required
                    value={offerTitle}
                    onChange={(e) => setOfferTitle(e.target.value)}
                    placeholder="e.g. Monsoon Chai Fest"
                    className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-stone-300">Promo Code</label>
                    <input
                      type="text"
                      required
                      value={offerCode}
                      onChange={(e) => setOfferCode(e.target.value.toUpperCase())}
                      placeholder="e.g. MONSOON20"
                      className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white outline-none focus:border-amber-500 uppercase font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-stone-300">Discount (%)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={100}
                      value={offerDiscount}
                      onChange={(e) => setOfferDiscount(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-300">Description</label>
                  <input
                    type="text"
                    value={offerDesc}
                    onChange={(e) => setOfferDesc(e.target.value)}
                    placeholder="e.g. Get flat 20% discount on orders above ₹150"
                    className="w-full px-3.5 py-2 bg-stone-950 border border-stone-800 rounded-xl text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOfferModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 text-black text-xs font-bold uppercase tracking-wider"
                  >
                    Create Offer
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
