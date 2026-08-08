export type CategoryType = 'Tea' | 'Coffee' | 'Snacks' | 'Quick Bites' | 'Desserts' | 'Cold Beverages';

export interface Product {
  id: string;
  name: string;
  category: CategoryType;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  isBestseller?: boolean;
  isSpecial?: boolean;
  isAvailable: boolean;
  rating?: number;
  prepTime?: string;
  spiceLevel?: 'Mild' | 'Medium' | 'Spicy';
}

export interface Combo {
  id: string;
  name: string;
  itemsIncluded: string[];
  price: number;
  originalPrice: number;
  image: string;
  description: string;
  isAvailable: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  specialInstructions?: string;
}

export type OrderStatus = 'New' | 'Confirmed' | 'Preparing' | 'Ready' | 'Completed' | 'Cancelled';
export type OrderType = 'Delivery' | 'Pickup' | 'Dine-In';

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  orderType: OrderType;
  address?: string;
  tableNumber?: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: 'UPI' | 'Cash' | 'Pay at Counter';
  paymentStatus: 'Paid' | 'Pending';
  specialInstructions?: string;
}

export interface TableBooking {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  guests: number;
  seatingArea?: 'Indoor AC Lounge' | 'Outdoor Courtyard' | 'Royal VIP Sofa';
  specialRequest?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

export interface Enquiry {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  status: 'Unread' | 'Replied' | 'Archived';
}

export interface Review {
  id: string;
  createdAt: string;
  customerName: string;
  rating: number;
  comment: string;
  avatar?: string;
  verifiedCustomer: boolean;
  favoriteTea?: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  code: string;
  discountPercentage: number;
  validTill: string;
  bgGradient?: string;
}

export interface BusinessSettings {
  name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  openingHours: string;
  upiId: string;
  currencySymbol: string;
  googleMapsEmbedUrl: string;
}

export interface CustomerCRM {
  phone: string;
  name: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  status: 'VIP' | 'Regular' | 'New';
}
