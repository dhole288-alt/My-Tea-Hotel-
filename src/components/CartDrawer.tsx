import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { OrderType } from '../types';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, MessageCircle, CheckCircle2, QrCode, Phone, MapPin, User, Utensils } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
    isCartOpen,
    setIsCartOpen,
    placeOrder,
    settings,
    lastCreatedOrder,
    setLastCreatedOrder
  } = useStore();

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');

  // Checkout form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('Delivery');
  const [address, setAddress] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Cash' | 'Pay at Counter'>('UPI');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleProceedToCheckout = () => {
    if (cart.length === 0) return;
    setStep('checkout');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) return;
    if (orderType === 'Delivery' && !address.trim()) return;

    placeOrder(
      customerName,
      customerPhone,
      orderType,
      paymentMethod,
      address,
      tableNumber,
      specialInstructions
    );
  };

  const generateWhatsAppMessage = () => {
    if (!lastCreatedOrder) return '#';

    const itemsText = lastCreatedOrder.items
      ? lastCreatedOrder.items.map(i => `• ${i.quantity}x ${i.product.name} - ₹${i.product.price * i.quantity}`).join('\n')
      : '';

    const text = `Hello ${settings.name},\nI would like to confirm my order:\n\n*Order ID:* ${lastCreatedOrder.id}\n*Customer:* ${lastCreatedOrder.customerName}\n*Phone:* ${lastCreatedOrder.customerPhone}\n*Type:* ${lastCreatedOrder.orderType}${lastCreatedOrder.tableNumber ? ` (Table #${lastCreatedOrder.tableNumber})` : ''}${lastCreatedOrder.address ? `\n*Address:* ${lastCreatedOrder.address}` : ''}\n\n*Items Ordered:*\n${itemsText}\n\n*Total Amount:* ₹${lastCreatedOrder.totalAmount}\n*Payment Method:* ${lastCreatedOrder.paymentMethod}\n\nPlease prepare my order!`;

    return `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  const closeDrawer = () => {
    setIsCartOpen(false);
    setStep('cart');
    setLastCreatedOrder(null);
  };

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end"
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md bg-stone-950 border-l border-amber-500/30 h-full flex flex-col justify-between shadow-2xl relative"
        >
          {/* Header */}
          <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-900/90">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h3 className="font-serif font-bold text-lg text-white">
                {lastCreatedOrder ? 'Order Confirmation' : step === 'cart' ? 'Your Order Cart' : 'Checkout Details'}
              </h3>
              {cartCount > 0 && !lastCreatedOrder && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </div>

            <button
              onClick={closeDrawer}
              className="p-2 rounded-lg text-stone-400 hover:text-amber-400 hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {lastCreatedOrder ? (
              /* ORDER CONFIRMATION VIEW */
              <div className="text-center space-y-6 py-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-2xl font-serif font-bold text-white">
                    Thank you! Your order has been received.
                  </h4>
                  <p className="text-xs text-amber-300 font-mono font-bold">
                    Order ID: #{lastCreatedOrder.id}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 text-left space-y-3 text-xs">
                  <div className="flex justify-between pb-2 border-b border-stone-800">
                    <span className="text-stone-400">Customer Name:</span>
                    <span className="font-bold text-white">{lastCreatedOrder.customerName}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-stone-800">
                    <span className="text-stone-400">Order Preference:</span>
                    <span className="font-bold text-amber-300">{lastCreatedOrder.orderType}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-stone-800">
                    <span className="text-stone-400">Total Payable:</span>
                    <span className="font-extrabold text-amber-400 text-sm">₹{lastCreatedOrder.totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Payment Method:</span>
                    <span className="font-bold text-emerald-400">{lastCreatedOrder.paymentMethod}</span>
                  </div>
                </div>

                {/* Direct WhatsApp Send CTA */}
                <div className="space-y-3 pt-2">
                  <a
                    href={generateWhatsAppMessage()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>SEND ORDER DETAILS ON WHATSAPP</span>
                  </a>

                  <button
                    onClick={closeDrawer}
                    className="w-full py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 font-bold text-xs uppercase tracking-wider"
                  >
                    CONTINUE BROWSING
                  </button>
                </div>
              </div>
            ) : step === 'cart' ? (
              /* CART VIEW */
              cart.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center mx-auto text-stone-600">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <p className="text-stone-400 text-sm">Your order cart is empty.</p>
                  <button
                    onClick={closeDrawer}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 text-black text-xs font-bold uppercase tracking-wider"
                  >
                    Explore Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="p-3.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center gap-3"
                    >
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 rounded-lg object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-sm text-stone-200 truncate">
                          {item.product.name}
                        </h4>
                        <div className="text-xs font-bold text-amber-400">
                          ₹{item.product.price}
                        </div>
                        {item.specialInstructions && (
                          <div className="text-[10px] text-stone-400 truncate font-mono">
                            Note: {item.specialInstructions}
                          </div>
                        )}
                      </div>

                      {/* Quantity Modifier */}
                      <div className="flex items-center gap-2 bg-black/60 p-1.5 rounded-lg border border-stone-800">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 hover:text-amber-400 text-stone-400"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold text-stone-200 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 hover:text-amber-400 text-stone-400"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="p-1.5 text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* CHECKOUT FORM VIEW */
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase mb-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/80 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/80 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase mb-1">
                    Order Preference
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Delivery', 'Pickup', 'Dine-In'] as OrderType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setOrderType(type)}
                        className={`py-2 rounded-xl text-xs font-bold uppercase border transition-all ${
                          orderType === type
                            ? 'bg-amber-500 text-black border-amber-500'
                            : 'bg-black/80 text-stone-400 border-stone-800 hover:text-stone-200'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {orderType === 'Delivery' && (
                  <div>
                    <label className="block text-xs font-bold text-stone-300 uppercase mb-1">
                      Delivery Address *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                      <textarea
                        rows={2}
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="House/Office No, Street, Landmark..."
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/80 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                )}

                {orderType === 'Dine-In' && (
                  <div>
                    <label className="block text-xs font-bold text-stone-300 uppercase mb-1">
                      Table Number (If seated)
                    </label>
                    <div className="relative">
                      <Utensils className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        placeholder="e.g. Table 04"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-black/80 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase mb-1">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e: any) => setPaymentMethod(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/80 border border-stone-800 text-amber-300 text-xs font-bold focus:outline-none focus:border-amber-500"
                  >
                    <option value="UPI">GPay / PhonePe / Paytm / UPI QR</option>
                    <option value="Cash">Cash on Delivery / Pickup</option>
                    <option value="Pay at Counter">Pay at Counter</option>
                  </select>
                </div>

                {paymentMethod === 'UPI' && (
                  <div className="p-3 rounded-xl bg-stone-900 border border-amber-500/30 text-center space-y-2">
                    <div className="text-[10px] uppercase font-bold text-amber-400">
                      UPI ID: {settings.upiId}
                    </div>
                    <div className="w-28 h-28 bg-white p-2 rounded-lg mx-auto flex items-center justify-center border">
                      <QrCode className="w-24 h-24 text-black" />
                    </div>
                    <div className="text-[10px] text-stone-400">
                      Scan to Pay ₹{cartTotal} directly
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-stone-300 uppercase mb-1">
                    Special Cooking Request
                  </label>
                  <input
                    type="text"
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="e.g. Extra hot, less sugar, spicy chutney..."
                    className="w-full px-3 py-2 rounded-xl bg-black/80 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </form>
            )}
          </div>

          {/* Footer Actions */}
          {!lastCreatedOrder && cart.length > 0 && (
            <div className="p-5 border-t border-stone-800 bg-stone-900/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400 font-medium uppercase">Total Payable:</span>
                <span className="text-xl font-extrabold text-amber-300">₹{cartTotal}</span>
              </div>

              {step === 'cart' ? (
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <span>PROCEED TO CHECKOUT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStep('cart')}
                    className="w-1/3 py-3 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold uppercase"
                  >
                    BACK
                  </button>
                  <button
                    type="submit"
                    form="checkout-form"
                    className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
                  >
                    CONFIRM ORDER (₹{cartTotal})
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
