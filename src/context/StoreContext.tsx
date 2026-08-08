import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { 
  Product, Combo, CartItem, Order, TableBooking, Enquiry, Review, Offer, 
  BusinessSettings, CustomerCRM, OrderStatus, OrderType 
} from '../types';
import { 
  signatureChais, additionalMenuItems, initialCombos, initialReviews, 
  initialOffers, initialBusinessSettings 
} from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  // Products & Combos
  products: Product[];
  combos: Combo[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  toggleProductAvailability: (id: string) => void;
  toggleProductBestseller: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, specialInstructions?: string) => void;
  addComboToCart: (combo: Combo) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Orders
  orders: Order[];
  placeOrder: (
    customerName: string, 
    customerPhone: string, 
    orderType: OrderType, 
    paymentMethod: 'UPI' | 'Cash' | 'Pay at Counter',
    address?: string, 
    tableNumber?: string,
    specialInstructions?: string
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;

  // Table Bookings
  bookings: TableBooking[];
  addBooking: (
    customerName: string,
    customerPhone: string,
    date: string,
    time: string,
    guests: number,
    seatingArea?: 'Indoor AC Lounge' | 'Outdoor Courtyard' | 'Royal VIP Sofa',
    specialRequest?: string
  ) => TableBooking;
  updateBookingStatus: (id: string, status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled') => void;
  deleteBooking: (id: string) => void;

  // Enquiries & Reviews
  enquiries: Enquiry[];
  addEnquiry: (name: string, phone: string, email: string, message: string) => void;
  deleteEnquiry: (id: string) => void;

  reviews: Review[];
  addReview: (customerName: string, rating: number, comment: string, favoriteTea?: string) => void;
  deleteReview: (id: string) => void;

  // Offers
  offers: Offer[];
  addOffer: (offer: Omit<Offer, 'id'>) => void;
  deleteOffer: (id: string) => void;

  // Admin & Settings
  isAdminLoggedIn: boolean;
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;
  settings: BusinessSettings;
  updateSettings: (newSettings: Partial<BusinessSettings>) => void;

  // Customers CRM
  getCustomersCRM: () => CustomerCRM[];

  // Toast notifications
  toast: Toast | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;

  // UI Drawer / Modal states
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (isOpen: boolean) => void;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (isOpen: boolean) => void;
  lastCreatedOrder: Order | null;
  setLastCreatedOrder: (order: Order | null) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PRODUCTS = 'royal_chai_products_v1';
const LOCAL_STORAGE_KEY_CART = 'royal_chai_cart_v1';
const LOCAL_STORAGE_KEY_ORDERS = 'royal_chai_orders_v1';
const LOCAL_STORAGE_KEY_BOOKINGS = 'royal_chai_bookings_v1';
const LOCAL_STORAGE_KEY_ENQUIRIES = 'royal_chai_enquiries_v1';
const LOCAL_STORAGE_KEY_REVIEWS = 'royal_chai_reviews_v1';
const LOCAL_STORAGE_KEY_OFFERS = 'royal_chai_offers_v1';
const LOCAL_STORAGE_KEY_SETTINGS = 'prakash_dhole_tea_hotel_settings_v2';
const LOCAL_STORAGE_KEY_ADMIN = 'royal_chai_admin_logged_v1';

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PRODUCTS);
    return saved ? JSON.parse(saved) : [...signatureChais, ...additionalMenuItems];
  });

  // Combos
  const [combos] = useState<Combo[]>(initialCombos);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CART);
    return saved ? JSON.parse(saved) : [];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ORDERS);
    if (saved) return JSON.parse(saved);
    // Seed an initial demo order so admin panel isn't empty
    return [
      {
        id: "ORD-9281",
        createdAt: new Date().toISOString(),
        customerName: "Rahul Sharma",
        customerPhone: "9876543210",
        orderType: "Delivery",
        address: "Apartment 402, Royal Residency, Grand Road",
        items: [
          { product: signatureChais[1], quantity: 2 }, // Masala Chai
          { product: additionalMenuItems[2], quantity: 2 } // Bun Maska
        ],
        totalAmount: 170,
        status: "Preparing",
        paymentMethod: "UPI",
        paymentStatus: "Paid",
        specialInstructions: "Please make chai extra hot with less sugar."
      }
    ];
  });

  // Bookings
  const [bookings, setBookings] = useState<TableBooking[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_BOOKINGS);
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "BKG-104",
        createdAt: new Date().toISOString(),
        customerName: "Pooja Verma",
        customerPhone: "9812345678",
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        time: "19:30",
        guests: 4,
        seatingArea: "Royal VIP Sofa",
        specialRequest: "Anniversary celebration tea table setup.",
        status: "Confirmed"
      }
    ];
  });

  // Enquiries
  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ENQUIRIES);
    return saved ? JSON.parse(saved) : [
      {
        id: "ENQ-501",
        createdAt: new Date().toISOString(),
        name: "Sanjay Kapoor",
        phone: "9988776655",
        email: "sanjay@techcorp.com",
        message: "Hi, we want to book bulk high-tea catering for 50 people at our corporate event next Tuesday.",
        status: "Unread"
      }
    ];
  });

  // Reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_REVIEWS);
    return saved ? JSON.parse(saved) : initialReviews;
  });

  // Offers
  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_OFFERS);
    return saved ? JSON.parse(saved) : initialOffers;
  });

  // Settings
  const [settings, setSettings] = useState<BusinessSettings>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SETTINGS);
    return saved ? JSON.parse(saved) : initialBusinessSettings;
  });

  // Admin
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEY_ADMIN) === 'true';
  });

  // UI Modal / Drawer states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

  // Toast
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 3500);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_ENQUIRIES, JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_OFFERS, JSON.stringify(offers));
  }, [offers]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_ADMIN, isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  // Cart operations
  const addToCart = (product: Product, quantity = 1, specialInstructions?: string) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        if (specialInstructions) updated[existingIndex].specialInstructions = specialInstructions;
        return updated;
      }
      return [...prev, { product, quantity, specialInstructions }];
    });
    showToast(`Added ${product.name} to your order! ☕`);
  };

  const addComboToCart = (combo: Combo) => {
    // Create a virtual combo product
    const comboProduct: Product = {
      id: combo.id,
      name: combo.name,
      category: "Snacks",
      description: combo.description,
      price: combo.price,
      image: combo.image,
      isVeg: true,
      isBestseller: true,
      isAvailable: true
    };
    addToCart(comboProduct, 1, `Combo: ${combo.itemsIncluded.join(', ')}`);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Orders
  const placeOrder = (
    customerName: string,
    customerPhone: string,
    orderType: OrderType,
    paymentMethod: 'UPI' | 'Cash' | 'Pay at Counter',
    address?: string,
    tableNumber?: string,
    specialInstructions?: string
  ): Order => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      customerName,
      customerPhone,
      orderType,
      address,
      tableNumber,
      items: [...cart],
      totalAmount: cartTotal,
      status: 'New',
      paymentMethod,
      paymentStatus: paymentMethod === 'UPI' ? 'Paid' : 'Pending',
      specialInstructions
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setLastCreatedOrder(newOrder);

    // Fire festive celebration confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#E5C158', '#4A7C59', '#FDFBF7']
    });

    showToast('Your order has been placed successfully! 🎉');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status } : order));
    showToast(`Order #${orderId} status updated to ${status}`);
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    showToast(`Order #${orderId} deleted`, 'info');
  };

  // Table Bookings
  const addBooking = (
    customerName: string,
    customerPhone: string,
    date: string,
    time: string,
    guests: number,
    seatingArea?: 'Indoor AC Lounge' | 'Outdoor Courtyard' | 'Royal VIP Sofa',
    specialRequest?: string
  ): TableBooking => {
    const newBooking: TableBooking = {
      id: `BKG-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      customerName,
      customerPhone,
      date,
      time,
      guests,
      seatingArea: seatingArea || 'Indoor AC Lounge',
      specialRequest,
      status: 'Pending'
    };
    setBookings(prev => [newBooking, ...prev]);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#D4AF37', '#ffffff']
    });

    showToast(`Table reservation request #${newBooking.id} submitted! ☕`);
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled') => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    showToast(`Booking #${id} is now ${status}`);
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
    showToast('Booking record removed', 'info');
  };

  // Enquiries
  const addEnquiry = (name: string, phone: string, email: string, message: string) => {
    const newEnq: Enquiry = {
      id: `ENQ-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      name,
      phone,
      email,
      message,
      status: 'Unread'
    };
    setEnquiries(prev => [newEnq, ...prev]);
    showToast('Enquiry sent successfully! We will contact you soon.');
  };

  const deleteEnquiry = (id: string) => {
    setEnquiries(prev => prev.filter(e => e.id !== id));
    showToast('Enquiry removed', 'info');
  };

  // Reviews
  const addReview = (customerName: string, rating: number, comment: string, favoriteTea?: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      customerName,
      rating,
      comment,
      verifiedCustomer: true,
      favoriteTea: favoriteTea || 'Special Cutting Chai'
    };
    setReviews(prev => [newRev, ...prev]);
    showToast('Thank you for your valuable 5-star review! ⭐');
  };

  const deleteReview = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
    showToast('Review removed', 'info');
  };

  // Product CRUD
  const addProduct = (prod: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...prod,
      id: `prod-${Date.now()}`
    };
    setProducts(prev => [newProd, ...prev]);
    showToast(`Product "${prod.name}" added to menu!`);
  };

  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
    showToast(`Updated "${updated.name}"`);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product deleted', 'info');
  };

  const toggleProductAvailability = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isAvailable: !p.isAvailable } : p));
    showToast('Product availability toggled');
  };

  const toggleProductBestseller = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, isBestseller: !p.isBestseller } : p));
    showToast('Product bestseller status updated');
  };

  // Offers
  const addOffer = (offer: Omit<Offer, 'id'>) => {
    const newOffer: Offer = {
      ...offer,
      id: `off-${Date.now()}`
    };
    setOffers(prev => [newOffer, ...prev]);
    showToast(`New offer "${offer.title}" added!`);
  };

  const deleteOffer = (id: string) => {
    setOffers(prev => prev.filter(o => o.id !== id));
    showToast('Offer removed', 'info');
  };

  // Settings
  const updateSettings = (newSettings: Partial<BusinessSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Business settings updated successfully!');
  };

  // Admin Auth
  const loginAdmin = (passcode: string) => {
    if (passcode === 'admin123' || passcode === 'royal123' || passcode === 'admin') {
      setIsAdminLoggedIn(true);
      showToast('Welcome to Royal Chai Admin Portal 👑');
      return true;
    }
    showToast('Invalid passcode. Try "admin123"', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    showToast('Logged out of Admin Portal', 'info');
  };

  // Customers CRM derivation
  const getCustomersCRM = (): CustomerCRM[] => {
    const customerMap: { [phone: string]: CustomerCRM } = {};

    orders.forEach(order => {
      const phone = order.customerPhone;
      if (!customerMap[phone]) {
        customerMap[phone] = {
          phone,
          name: order.customerName,
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: order.createdAt,
          status: 'New'
        };
      }
      const c = customerMap[phone];
      c.totalOrders += 1;
      c.totalSpent += order.totalAmount;
      if (new Date(order.createdAt) > new Date(c.lastOrderDate)) {
        c.lastOrderDate = order.createdAt;
      }
      if (c.totalOrders >= 5 || c.totalSpent >= 1000) {
        c.status = 'VIP';
      } else if (c.totalOrders >= 2) {
        c.status = 'Regular';
      }
    });

    return Object.values(customerMap);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        combos,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailability,
        toggleProductBestseller,
        cart,
        addToCart,
        addComboToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        orders,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        bookings,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        enquiries,
        addEnquiry,
        deleteEnquiry,
        reviews,
        addReview,
        deleteReview,
        offers,
        addOffer,
        deleteOffer,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        settings,
        updateSettings,
        getCustomersCRM,
        toast,
        showToast,
        isCartOpen,
        setIsCartOpen,
        isAdminModalOpen,
        setIsAdminModalOpen,
        isBookingModalOpen,
        setIsBookingModalOpen,
        lastCreatedOrder,
        setLastCreatedOrder
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
