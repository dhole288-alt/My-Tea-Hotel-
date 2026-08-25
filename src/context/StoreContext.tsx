import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, firebaseConfig } from '../lib/firebase';
import { 
  Product, Combo, CartItem, Order, TableBooking, Enquiry, Review, Offer, 
  BusinessSettings, CustomerCRM, OrderStatus, OrderType, FirebaseAdminUser 
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

export type AdminRoute = '/' | '/admin' | '/admin/login' | '/admin/dashboard';

interface StoreContextType {
  // Navigation / Route state
  currentRoute: string;
  navigateTo: (route: string) => void;

  // Products & Combos
  products: Product[];
  combos: Combo[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  toggleProductAvailability: (id: string) => Promise<void>;
  toggleProductBestseller: (id: string) => Promise<void>;

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
  ) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;

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
  ) => Promise<TableBooking>;
  updateBookingStatus: (id: string, status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled') => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;

  // Enquiries & Reviews
  enquiries: Enquiry[];
  addEnquiry: (name: string, phone: string, email: string, message: string) => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;

  reviews: Review[];
  addReview: (customerName: string, rating: number, comment: string, favoriteTea?: string) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;

  // Offers
  offers: Offer[];
  addOffer: (offer: Omit<Offer, 'id'>) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;

  // Firebase Authentication & Admin Management
  isAdminLoggedIn: boolean;
  adminUser: FirebaseAdminUser | null;
  authLoading: boolean;
  authError: string | null;
  loginAdmin: (email: string, password: string) => Promise<void>;
  signupAdmin: (email: string, password: string, displayName?: string) => Promise<void>;
  resetAdminPassword: (email: string) => Promise<void>;
  logoutAdmin: () => Promise<void>;
  clearAuthError: () => void;
  firebaseProjectId: string;

  // Settings
  settings: BusinessSettings;
  updateSettings: (newSettings: Partial<BusinessSettings>) => Promise<void>;

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

// LocalStorage cache keys
const LOCAL_STORAGE_KEY_PRODUCTS = 'royal_chai_products_v2';
const LOCAL_STORAGE_KEY_CART = 'royal_chai_cart_v2';
const LOCAL_STORAGE_KEY_ORDERS = 'royal_chai_orders_v2';
const LOCAL_STORAGE_KEY_BOOKINGS = 'royal_chai_bookings_v2';
const LOCAL_STORAGE_KEY_ENQUIRIES = 'royal_chai_enquiries_v2';
const LOCAL_STORAGE_KEY_REVIEWS = 'royal_chai_reviews_v2';
const LOCAL_STORAGE_KEY_OFFERS = 'royal_chai_offers_v2';
const LOCAL_STORAGE_KEY_SETTINGS = 'bala_jadhav_tea_hotel_settings_v4';

function getInitialRoute(): string {
  if (typeof window === 'undefined') return '/';
  const pathname = window.location.pathname;
  const hash = window.location.hash;

  if (pathname.startsWith('/admin') || pathname === '/admin' || pathname === '/admin/login' || pathname === '/admin/dashboard') {
    return pathname;
  }
  if (hash === '#admin' || hash === '#/admin') return '/admin';
  if (hash === '#admin/login' || hash === '#/admin/login') return '/admin/login';
  if (hash === '#admin/dashboard' || hash === '#/admin/dashboard') return '/admin/dashboard';
  return '/';
}

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Routing state
  const [currentRoute, setCurrentRoute] = useState<string>(getInitialRoute());

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
    return [
      {
        id: "ORD-9281",
        createdAt: new Date().toISOString(),
        customerName: "Rahul Sharma",
        customerPhone: "9876543210",
        orderType: "Delivery",
        address: "Apartment 402, Royal Residency, Grand Road",
        items: [
          { product: signatureChais[1], quantity: 2 },
          { product: additionalMenuItems[2], quantity: 2 }
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

  // Firebase Authentication State
  const [adminUser, setAdminUser] = useState<FirebaseAdminUser | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // UI Modal / Drawer states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

  // Toast
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 4000);
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  // Safe router navigation function
  const navigateTo = useCallback((route: string) => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', route);
      // Also scroll top if routing to admin pages
      if (route.startsWith('/admin')) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, []);

  // Sync route on popstate and hash change
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(getInitialRoute());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  // Firebase Auth State Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (user) {
        const adminProfile: FirebaseAdminUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'Admin',
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
          createdAt: user.metadata.creationTime,
          lastLoginAt: user.metadata.lastSignInTime
        };
        setAdminUser(adminProfile);
        setIsAdminLoggedIn(true);
        setAuthError(null);
      } else {
        setAdminUser(null);
        setIsAdminLoggedIn(false);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Route protection and redirection effect
  useEffect(() => {
    if (authLoading) return;

    if (currentRoute === '/admin') {
      if (isAdminLoggedIn) {
        navigateTo('/admin/dashboard');
      } else {
        navigateTo('/admin/login');
      }
    } else if (currentRoute === '/admin/dashboard') {
      if (!isAdminLoggedIn) {
        navigateTo('/admin/login');
      }
    } else if (currentRoute === '/admin/login') {
      if (isAdminLoggedIn) {
        navigateTo('/admin/dashboard');
      }
    }
  }, [currentRoute, isAdminLoggedIn, authLoading, navigateTo]);

  // Firestore Real-Time Subscriptions: Products (Public read)
  useEffect(() => {
    try {
      const q = collection(db, 'products');
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const fetchedProducts: Product[] = [];
          snapshot.forEach((docSnap) => {
            fetchedProducts.push({ id: docSnap.id, ...docSnap.data() } as Product);
          });
          setProducts(fetchedProducts);
          localStorage.setItem(LOCAL_STORAGE_KEY_PRODUCTS, JSON.stringify(fetchedProducts));
        } else {
          // If Firestore is empty, initialize with default menu
          const initialList = [...signatureChais, ...additionalMenuItems];
          initialList.forEach(async (p) => {
            try {
              await setDoc(doc(db, 'products', p.id), p);
            } catch (err) {
              console.warn('Initial product seed note:', err);
            }
          });
        }
      }, (err) => {
        console.warn('Firestore products listener fallback:', err);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore products init error:', err);
    }
  }, []);

  // Firestore Real-Time Subscriptions: Settings (Public read)
  useEffect(() => {
    try {
      const settingsDocRef = doc(db, 'settings', 'general');
      const unsubscribe = onSnapshot(settingsDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as BusinessSettings;
          setSettings(data);
          localStorage.setItem(LOCAL_STORAGE_KEY_SETTINGS, JSON.stringify(data));
        } else {
          setDoc(settingsDocRef, initialBusinessSettings).catch((err) => {
            console.warn('Initial settings seed note:', err);
          });
        }
      }, (err) => {
        console.warn('Firestore settings listener fallback:', err);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore settings init error:', err);
    }
  }, []);

  // Firestore Real-Time Subscriptions: Reviews (Public read)
  useEffect(() => {
    try {
      const reviewsCol = collection(db, 'reviews');
      const unsubscribe = onSnapshot(reviewsCol, (snapshot) => {
        if (!snapshot.empty) {
          const list: Review[] = [];
          snapshot.forEach(d => list.push({ id: d.id, ...d.data() } as Review));
          setReviews(list);
          localStorage.setItem(LOCAL_STORAGE_KEY_REVIEWS, JSON.stringify(list));
        }
      }, (err) => {
        console.warn('Firestore reviews listener fallback:', err);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore reviews init error:', err);
    }
  }, []);

  // Firestore Real-Time Subscriptions: Offers (Public read)
  useEffect(() => {
    try {
      const offersCol = collection(db, 'offers');
      const unsubscribe = onSnapshot(offersCol, (snapshot) => {
        if (!snapshot.empty) {
          const list: Offer[] = [];
          snapshot.forEach(d => list.push({ id: d.id, ...d.data() } as Offer));
          setOffers(list);
          localStorage.setItem(LOCAL_STORAGE_KEY_OFFERS, JSON.stringify(list));
        }
      }, (err) => {
        console.warn('Firestore offers listener fallback:', err);
      });
      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore offers init error:', err);
    }
  }, []);

  // Firestore Real-Time Subscriptions for Authenticated Admin: Orders, Bookings, Enquiries
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    // Orders Subscription
    let unsubscribeOrders = () => {};
    try {
      const ordersCol = collection(db, 'orders');
      unsubscribeOrders = onSnapshot(ordersCol, (snapshot) => {
        if (!snapshot.empty) {
          const list: Order[] = [];
          snapshot.forEach(d => list.push({ id: d.id, ...d.data() } as Order));
          // Sort newest first
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setOrders(list);
          localStorage.setItem(LOCAL_STORAGE_KEY_ORDERS, JSON.stringify(list));
        }
      }, (err) => {
        console.warn('Firestore admin orders listener note:', err);
      });
    } catch (err) {
      console.warn('Orders listener err:', err);
    }

    // Bookings Subscription
    let unsubscribeBookings = () => {};
    try {
      const bookingsCol = collection(db, 'bookings');
      unsubscribeBookings = onSnapshot(bookingsCol, (snapshot) => {
        if (!snapshot.empty) {
          const list: TableBooking[] = [];
          snapshot.forEach(d => list.push({ id: d.id, ...d.data() } as TableBooking));
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setBookings(list);
          localStorage.setItem(LOCAL_STORAGE_KEY_BOOKINGS, JSON.stringify(list));
        }
      }, (err) => {
        console.warn('Firestore admin bookings listener note:', err);
      });
    } catch (err) {
      console.warn('Bookings listener err:', err);
    }

    // Enquiries Subscription
    let unsubscribeEnquiries = () => {};
    try {
      const enqCol = collection(db, 'enquiries');
      unsubscribeEnquiries = onSnapshot(enqCol, (snapshot) => {
        if (!snapshot.empty) {
          const list: Enquiry[] = [];
          snapshot.forEach(d => list.push({ id: d.id, ...d.data() } as Enquiry));
          list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setEnquiries(list);
          localStorage.setItem(LOCAL_STORAGE_KEY_ENQUIRIES, JSON.stringify(list));
        }
      }, (err) => {
        console.warn('Firestore admin enquiries listener note:', err);
      });
    } catch (err) {
      console.warn('Enquiries listener err:', err);
    }

    return () => {
      unsubscribeOrders();
      unsubscribeBookings();
      unsubscribeEnquiries();
    };
  }, [isAdminLoggedIn]);

  // Sync state to localStorage for offline resilience
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

  // --- FIREBASE AUTH ACTIONS ---

  const mapAuthError = (code: string): string => {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Incorrect email or password. Please verify your admin credentials.';
      case 'auth/email-already-in-use':
        return 'This email address is already registered. Please log in instead.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Access is temporarily locked. Please try again later or reset password.';
      case 'auth/network-request-failed':
        return 'Network connection error. Please check your internet connection.';
      default:
        return `Authentication failed: ${code.replace('auth/', '').replace(/-/g, ' ')}`;
    }
  };

  const loginAdmin = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const user = userCredential.user;
      showToast(`👑 Welcome, ${user.displayName || user.email}! Authenticated securely with Firebase.`, 'success');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
      navigateTo('/admin/dashboard');
    } catch (err: any) {
      const errMsg = mapAuthError(err.code || '');
      setAuthError(errMsg);
      showToast(errMsg, 'error');
      throw err;
    }
  };

  const signupAdmin = async (_email: string, _pass: string, _displayName?: string) => {
    const errMsg = 'Public admin registration is closed for production security. Please sign in with your Owner credentials.';
    setAuthError(errMsg);
    showToast(errMsg, 'error');
    throw new Error(errMsg);
  };

  const resetAdminPassword = async (email: string) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      showToast(`Password reset link sent to ${email}. Please check your inbox.`, 'info');
    } catch (err: any) {
      const errMsg = mapAuthError(err.code || '');
      setAuthError(errMsg);
      showToast(errMsg, 'error');
      throw err;
    }
  };

  const logoutAdmin = async () => {
    try {
      await signOut(auth);
      setAdminUser(null);
      setIsAdminLoggedIn(false);
      showToast('Logged out of Admin Portal successfully', 'info');
      navigateTo('/admin/login');
    } catch (err: any) {
      showToast(`Logout error: ${err.message}`, 'error');
    }
  };

  // --- PRODUCT OPERATIONS ---
  const addProduct = async (newProd: Omit<Product, 'id'>) => {
    const id = `PROD-${Date.now().toString().slice(-4)}`;
    const product: Product = {
      ...newProd,
      id
    };

    // Update local state immediately
    setProducts(prev => [product, ...prev]);

    // Save to Firestore
    try {
      await setDoc(doc(db, 'products', id), product);
    } catch (err) {
      console.warn('Firestore product write note:', err);
    }

    showToast(`Added "${product.name}" to menu!`);
  };

  const updateProduct = async (updated: Product) => {
    setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));

    try {
      await setDoc(doc(db, 'products', updated.id), updated);
    } catch (err) {
      console.warn('Firestore product update note:', err);
    }

    showToast(`Updated "${updated.name}"`);
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));

    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      console.warn('Firestore product delete note:', err);
    }

    showToast('Product removed from menu', 'info');
  };

  const toggleProductAvailability = async (id: string) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;

    const updated = { ...prod, isAvailable: !prod.isAvailable };
    setProducts(prev => prev.map(p => (p.id === id ? updated : p)));

    try {
      await setDoc(doc(db, 'products', id), updated);
    } catch (err) {
      console.warn('Firestore toggle availability note:', err);
    }

    showToast('Availability status updated');
  };

  const toggleProductBestseller = async (id: string) => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;

    const updated = { ...prod, isBestseller: !prod.isBestseller };
    setProducts(prev => prev.map(p => (p.id === id ? updated : p)));

    try {
      await setDoc(doc(db, 'products', id), updated);
    } catch (err) {
      console.warn('Firestore toggle bestseller note:', err);
    }

    showToast('Bestseller tag toggled');
  };

  // --- CART OPERATIONS ---
  const addToCart = (product: Product, quantity = 1, specialInstructions?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity, specialInstructions: specialInstructions || item.specialInstructions }
            : item
        );
      }
      return [...prev, { product, quantity, specialInstructions }];
    });
    showToast(`Added ${quantity}x ${product.name} to cart ☕`);
  };

  const addComboToCart = (combo: Combo) => {
    const comboProduct: Product = {
      id: combo.id,
      name: combo.name,
      category: 'Snacks',
      description: combo.description,
      price: combo.price,
      image: combo.image,
      isVeg: true,
      isAvailable: true
    };
    addToCart(comboProduct, 1);
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- ORDERS ---
  const placeOrder = async (
    customerName: string,
    customerPhone: string,
    orderType: OrderType,
    paymentMethod: 'UPI' | 'Cash' | 'Pay at Counter',
    address?: string,
    tableNumber?: string,
    specialInstructions?: string
  ): Promise<Order> => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
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
    setLastCreatedOrder(newOrder);
    clearCart();

    // Persist in Firestore
    try {
      await setDoc(doc(db, 'orders', orderId), newOrder);
    } catch (err) {
      console.warn('Firestore order write note:', err);
    }

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    showToast(`Order #${newOrder.id} placed successfully!`);
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status } : o))
    );

    try {
      await setDoc(doc(db, 'orders', orderId), { status }, { merge: true });
    } catch (err) {
      console.warn('Firestore update order status note:', err);
    }

    showToast(`Order status updated to "${status}"`);
  };

  const deleteOrder = async (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));

    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (err) {
      console.warn('Firestore delete order note:', err);
    }

    showToast('Order deleted', 'info');
  };

  // --- TABLE BOOKINGS ---
  const addBooking = async (
    customerName: string,
    customerPhone: string,
    date: string,
    time: string,
    guests: number,
    seatingArea?: 'Indoor AC Lounge' | 'Outdoor Courtyard' | 'Royal VIP Sofa',
    specialRequest?: string
  ): Promise<TableBooking> => {
    const bookingId = `BKG-${Math.floor(100 + Math.random() * 900)}`;
    const booking: TableBooking = {
      id: bookingId,
      createdAt: new Date().toISOString(),
      customerName,
      customerPhone,
      date,
      time,
      guests,
      seatingArea,
      specialRequest,
      status: 'Confirmed'
    };

    setBookings(prev => [booking, ...prev]);

    try {
      await setDoc(doc(db, 'bookings', bookingId), booking);
    } catch (err) {
      console.warn('Firestore booking write note:', err);
    }

    showToast(`Table booked for ${customerName}! Booking ID: ${booking.id}`);

    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.7 }
    });

    return booking;
  };

  const updateBookingStatus = async (id: string, status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled') => {
    setBookings(prev =>
      prev.map(b => (b.id === id ? { ...b, status } : b))
    );

    try {
      await setDoc(doc(db, 'bookings', id), { status }, { merge: true });
    } catch (err) {
      console.warn('Firestore booking update note:', err);
    }

    showToast(`Booking marked as ${status}`);
  };

  const deleteBooking = async (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));

    try {
      await deleteDoc(doc(db, 'bookings', id));
    } catch (err) {
      console.warn('Firestore booking delete note:', err);
    }

    showToast('Booking deleted', 'info');
  };

  // --- ENQUIRIES ---
  const addEnquiry = async (name: string, phone: string, email: string, message: string) => {
    const enqId = `ENQ-${Math.floor(100 + Math.random() * 900)}`;
    const enq: Enquiry = {
      id: enqId,
      createdAt: new Date().toISOString(),
      name,
      phone,
      email,
      message,
      status: 'Unread'
    };

    setEnquiries(prev => [enq, ...prev]);

    try {
      await setDoc(doc(db, 'enquiries', enqId), enq);
    } catch (err) {
      console.warn('Firestore enquiry write note:', err);
    }

    showToast('Your message has been sent to our concierge!');
  };

  const deleteEnquiry = async (id: string) => {
    setEnquiries(prev => prev.filter(e => e.id !== id));

    try {
      await deleteDoc(doc(db, 'enquiries', id));
    } catch (err) {
      console.warn('Firestore enquiry delete note:', err);
    }

    showToast('Enquiry removed', 'info');
  };

  // --- REVIEWS ---
  const addReview = async (customerName: string, rating: number, comment: string, favoriteTea?: string) => {
    const revId = `REV-${Date.now().toString().slice(-4)}`;
    const rev: Review = {
      id: revId,
      createdAt: new Date().toISOString(),
      customerName,
      rating,
      comment,
      verifiedCustomer: true,
      favoriteTea
    };

    setReviews(prev => [rev, ...prev]);

    try {
      await setDoc(doc(db, 'reviews', revId), rev);
    } catch (err) {
      console.warn('Firestore review write note:', err);
    }

    showToast('Thank you for your rating and review! ⭐');
  };

  const deleteReview = async (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));

    try {
      await deleteDoc(doc(db, 'reviews', id));
    } catch (err) {
      console.warn('Firestore review delete note:', err);
    }

    showToast('Review removed', 'info');
  };

  // --- OFFERS ---
  const addOffer = async (newOffer: Omit<Offer, 'id'>) => {
    const offId = `OFF-${Date.now().toString().slice(-4)}`;
    const off: Offer = {
      ...newOffer,
      id: offId
    };

    setOffers(prev => [off, ...prev]);

    try {
      await setDoc(doc(db, 'offers', offId), off);
    } catch (err) {
      console.warn('Firestore offer write note:', err);
    }

    showToast(`Created offer promo code: ${off.code}`);
  };

  const deleteOffer = async (id: string) => {
    setOffers(prev => prev.filter(o => o.id !== id));

    try {
      await deleteDoc(doc(db, 'offers', id));
    } catch (err) {
      console.warn('Firestore offer delete note:', err);
    }

    showToast('Offer removed', 'info');
  };

  // --- SETTINGS ---
  const updateSettings = async (newSettings: Partial<BusinessSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);

    try {
      await setDoc(doc(db, 'settings', 'general'), updated, { merge: true });
    } catch (err) {
      console.warn('Firestore settings update note:', err);
    }

    showToast('Business settings updated in Firebase Firestore!');
  };

  // Customer CRM derivation
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
        currentRoute,
        navigateTo,
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
        adminUser,
        authLoading,
        authError,
        loginAdmin,
        signupAdmin,
        resetAdminPassword,
        logoutAdmin,
        clearAuthError,
        firebaseProjectId: firebaseConfig.projectId,
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
