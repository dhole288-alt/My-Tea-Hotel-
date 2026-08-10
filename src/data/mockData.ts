import { Product, Combo, Review, Offer, BusinessSettings } from '../types';

export const initialBusinessSettings: BusinessSettings = {
  name: "BALA JADHAV TEA HOTEL",
  tagline: "Not Just Tea — An Experience",
  phone: "+91 80102 71280",
  whatsapp: "918010271280",
  email: "balajadhav8010@gmail.com",
  address: "At Post Harsul, Taluka Trimbakeshwar, Dist Nashik, Maharashtra",
  openingHours: "Monday – Sunday: 6:00 AM – 11:00 PM",
  upiId: "8010271280@upi",
  currencySymbol: "₹",
  googleMapsEmbedUrl: "https://maps.google.com/maps?q=Harsul%20Trimbakeshwar%20Nashik%20Maharashtra&t=&z=13&ie=UTF8&iwloc=&output=embed"
};

export const signatureChais: Product[] = [
  {
    id: "sig-1",
    name: "Special Cutting Chai",
    category: "Tea",
    description: "Traditional strong Assam tea boiled with crushed ginger, cardamom, and thick whole milk, served in half glass.",
    price: 30,
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    isBestseller: true,
    isSpecial: true,
    isAvailable: true,
    rating: 4.9,
    prepTime: "5 mins",
    spiceLevel: "Medium"
  },
  {
    id: "sig-2",
    name: "Masala Chai",
    category: "Tea",
    description: "Infused with our 7-spice royal secret masala blend including clove, cinnamon, black pepper & nutmeg.",
    price: 40,
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    rating: 5.0,
    prepTime: "5 mins",
    spiceLevel: "Medium"
  },
  {
    id: "sig-3",
    name: "Ginger Chai (Adrak Chai)",
    category: "Tea",
    description: "Fresh hand-pounded organic ginger slow-boiled for immunity boosting aroma and refreshing kick.",
    price: 35,
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    rating: 4.8,
    prepTime: "5 mins",
    spiceLevel: "Spicy"
  },
  {
    id: "sig-4",
    name: "Elaichi Chai (Cardamom)",
    category: "Tea",
    description: "Fragrant crushed green cardamom pods infused into creamy sweet tea. Perfectly soothing.",
    price: 35,
    image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    rating: 4.9,
    prepTime: "5 mins",
    spiceLevel: "Mild"
  },
  {
    id: "sig-5",
    name: "Royal Irani Chai",
    category: "Tea",
    description: "Hyderabadi style slow-cooked thick condensed milk tea served rich, velvety and mildly sweet.",
    price: 50,
    image: "https://images.unsplash.com/photo-1571934811356-5cc531766b18?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    isBestseller: true,
    isSpecial: true,
    isAvailable: true,
    rating: 5.0,
    prepTime: "7 mins",
    spiceLevel: "Mild"
  },
  {
    id: "sig-6",
    name: "Kulhad Chai",
    category: "Tea",
    description: "Served in eco-friendly handcrafted unglazed earthen clay cups for that earthy, rustic & authentic aroma.",
    price: 45,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    rating: 4.9,
    prepTime: "5 mins",
    spiceLevel: "Medium"
  },
  {
    id: "sig-7",
    name: "Smoky Tandoori Chai",
    category: "Tea",
    description: "Brewed tea poured into red-hot clay kulhad baked in clay oven, creating a dramatic sizzle and smoky flavor.",
    price: 60,
    image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    isBestseller: true,
    isSpecial: true,
    isAvailable: true,
    rating: 5.0,
    prepTime: "8 mins",
    spiceLevel: "Medium"
  },
  {
    id: "sig-8",
    name: "Belgian Chocolate Chai",
    category: "Tea",
    description: "Fusion of dark Belgian chocolate ganache with traditional spiced chai. Indulgent & rich.",
    price: 65,
    image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    isBestseller: false,
    isSpecial: true,
    isAvailable: true,
    rating: 4.7,
    prepTime: "6 mins",
    spiceLevel: "Mild"
  },
  {
    id: "sig-9",
    name: "Kashmiri Saffron Chai",
    category: "Tea",
    description: "Kashmiri Mongra saffron strands infused with green cardamom, crushed almonds & pistachios.",
    price: 80,
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    isBestseller: true,
    isSpecial: true,
    isAvailable: true,
    rating: 5.0,
    prepTime: "7 mins",
    spiceLevel: "Mild"
  },
  {
    id: "sig-10",
    name: "Himalayan Organic Green Tea",
    category: "Tea",
    description: "Pure whole leaf loose green tea infused with lemongrass, honey & fresh mint leaves.",
    price: 50,
    image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    rating: 4.8,
    prepTime: "4 mins",
    spiceLevel: "Mild"
  }
];

export const additionalMenuItems: Product[] = [
  // Coffee
  {
    id: "cof-1",
    name: "Filter Kaapi (South Indian)",
    category: "Coffee",
    description: "Authentic decoction brewed filter coffee with frothed hot milk served in brass davara-tumbler.",
    price: 50,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    rating: 4.9,
    prepTime: "5 mins"
  },
  {
    id: "cof-2",
    name: "Espresso Cold Coffee",
    category: "Coffee",
    description: "Rich espresso blended with vanilla cream, ice milk, and topped with chocolate drizzle.",
    price: 90,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    rating: 4.8,
    prepTime: "6 mins"
  },
  // Snacks
  {
    id: "snk-1",
    name: "Crispy Samosa (2 Pcs)",
    category: "Snacks",
    description: "Golden flaky pastry stuffed with spiced potato & green peas, served with mint & sweet tamarind chutney.",
    price: 40,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    rating: 4.9,
    prepTime: "6 mins"
  },
  {
    id: "snk-2",
    name: "Mumbai Vada Pav",
    category: "Snacks",
    description: "Spiced garlic potato dumpling fried in chickpea batter, sandwiched in soft bun with dry garlic chutney & fried chili.",
    price: 35,
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    rating: 4.9,
    prepTime: "5 mins"
  },
  {
    id: "snk-3",
    name: "Amritsari Bun Maska",
    category: "Snacks",
    description: "Soft sweet bakery bun toasted and generously slathered with salted Amul butter and fruit jam.",
    price: 45,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    rating: 4.9,
    prepTime: "4 mins"
  },
  {
    id: "snk-4",
    name: "Indori Kanda Poha",
    category: "Snacks",
    description: "Flattened rice tempered with mustard seeds, curry leaves, caramelized onions, topped with Sev & pomegranate.",
    price: 50,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    rating: 4.7,
    prepTime: "6 mins"
  },
  // Quick Bites
  {
    id: "qb-1",
    name: "Spicy Misal Pav",
    category: "Quick Bites",
    description: "Spiced sprout curry topped with crispy farsan, fresh onion, coriander, lemon wedge, and 2 buttered pavs.",
    price: 80,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    rating: 4.9,
    prepTime: "8 mins"
  },
  {
    id: "qb-2",
    name: "Bombay Cheese Grill Sandwich",
    category: "Quick Bites",
    description: "Triple layered sandwich stuffed with potato, cucumber, tomato, beetroot, melted mozzarella & spicy green chutney.",
    price: 110,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    rating: 4.8,
    prepTime: "10 mins"
  },
  {
    id: "qb-3",
    name: "Crispy Onion Pakoda",
    category: "Quick Bites",
    description: "Sliced onions tossed in spiced gram flour and deep fried to golden crunchy perfection.",
    price: 60,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    rating: 4.7,
    prepTime: "8 mins"
  },
  // Desserts
  {
    id: "des-1",
    name: "Royal Maska Nankhatai Cookies (4 Pcs)",
    category: "Desserts",
    description: "Melt-in-mouth traditional shortbread cardamom cookies baked with desi ghee.",
    price: 50,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    rating: 4.9,
    prepTime: "2 mins"
  },
  {
    id: "des-2",
    name: "Kesar Gulab Jamun (2 Pcs)",
    category: "Desserts",
    description: "Soft milk dumplings soaked in warm saffron and cardamom sugar syrup.",
    price: 70,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    rating: 4.8,
    prepTime: "3 mins"
  },
  // Cold Beverages
  {
    id: "cld-1",
    name: "Royal Rose Badam Milk",
    category: "Cold Beverages",
    description: "Chilled almond milk infused with natural Damascus rose syrup and crushed pistachios.",
    price: 75,
    image: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    isBestseller: true,
    isAvailable: true,
    rating: 4.9,
    prepTime: "3 mins"
  },
  {
    id: "cld-2",
    name: "Fresh Lemon Ice Tea",
    category: "Cold Beverages",
    description: "Brewed black tea chilled with fresh squeezed lime juice, mint leaves, and brown sugar.",
    price: 65,
    image: "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&q=80&w=800",
    isVeg: true,
    isBestseller: false,
    isAvailable: true,
    rating: 4.7,
    prepTime: "4 mins"
  }
];

export const initialCombos: Combo[] = [
  {
    id: "combo-1",
    name: "Chai + Samosa Combo",
    itemsIncluded: ["1x Masala Chai", "2x Crispy Samosas", "Mint & Tamarind Chutney"],
    price: 70,
    originalPrice: 80,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800",
    description: "The classic evening indulgence. Hot spiced chai paired with hot potato samosas.",
    isAvailable: true
  },
  {
    id: "combo-2",
    name: "Chai + Vada Pav Combo",
    itemsIncluded: ["1x Cutting Chai", "1x Mumbai Vada Pav", "Fried Green Chili"],
    price: 60,
    originalPrice: 65,
    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&q=80&w=800",
    description: "Mumbai's favorite street food duo. Quick, filling, and packed with flavor.",
    isAvailable: true
  },
  {
    id: "combo-3",
    name: "Chai + Bun Maska Combo",
    itemsIncluded: ["1x Irani Chai", "1x Amritsari Bun Maska"],
    price: 85,
    originalPrice: 95,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
    description: "The quintessential Irani café breakfast experience. Dip soft buttered bun into thick hot chai.",
    isAvailable: true
  },
  {
    id: "combo-4",
    name: "Chai + Poha Combo",
    itemsIncluded: ["1x Ginger Chai", "1x Indori Kanda Poha"],
    price: 75,
    originalPrice: 85,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=800",
    description: "Healthy, light, and invigorating morning starter.",
    isAvailable: true
  },
  {
    id: "combo-5",
    name: "Chai + Misal Combo",
    itemsIncluded: ["1x Kulhad Chai", "1x Spicy Misal Pav (2 Pav)"],
    price: 115,
    originalPrice: 125,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800",
    description: "Fiery sprout curry balanced with rich clay cup kulhad tea.",
    isAvailable: true
  },
  {
    id: "combo-6",
    name: "Chai + Sandwich Combo",
    itemsIncluded: ["1x Masala Chai", "1x Bombay Cheese Grill Sandwich"],
    price: 140,
    originalPrice: 150,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=800",
    description: "Gourmet grilled vegetable sandwich paired with aromatic spiced chai.",
    isAvailable: true
  },
  {
    id: "combo-7",
    name: "Chai + Pakoda Combo",
    itemsIncluded: ["1x Tandoori Chai", "1x Crispy Onion Pakoda"],
    price: 110,
    originalPrice: 120,
    image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=800",
    description: "Monsoon mood maker! Smoky tandoori chai with hot crunchy pakodas.",
    isAvailable: true
  },
  {
    id: "combo-8",
    name: "Chai + Cookies Combo",
    itemsIncluded: ["1x Saffron Chai", "2x Royal Nankhatai Cookies"],
    price: 99,
    originalPrice: 110,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80&w=800",
    description: "Royal Kashmiri saffron tea accompanied by buttery cardamom cookies.",
    isAvailable: true
  }
];

export const initialReviews: Review[] = [
  {
    id: "rev-1",
    createdAt: "2026-08-01",
    customerName: "Vikramaditya Roy",
    rating: 5,
    comment: "Hands down the finest chai experience in the city! The Tandoori Kulhad Chai has a smoky depth that you can't find anywhere else. Absolutely 5-star ambience too.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    verifiedCustomer: true,
    favoriteTea: "Tandoori Chai"
  },
  {
    id: "rev-2",
    createdAt: "2026-08-03",
    customerName: "Priya Sharma",
    rating: 5,
    comment: "The Irani Chai + Bun Maska combo took me right back to authentic heritage cafes. Clean, hygienic, quick service, and warm golden lighting!",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
    verifiedCustomer: true,
    favoriteTea: "Irani Chai"
  },
  {
    id: "rev-3",
    createdAt: "2026-08-05",
    customerName: "Dr. Ananya Deshmukh",
    rating: 5,
    comment: "Their Kashmiri Saffron Chai is pure luxury in a cup! Ordered online via WhatsApp for our office team meeting and it arrived piping hot in vacuum thermoses. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200",
    verifiedCustomer: true,
    favoriteTea: "Kashmiri Saffron Chai"
  },
  {
    id: "rev-4",
    createdAt: "2026-08-07",
    customerName: "Rajesh Kulkarni",
    rating: 5,
    comment: "I visit every single morning for their Ginger Elaichi Cutting Chai and hot Samosa. The staff is courteous and the online table booking is so smooth.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    verifiedCustomer: true,
    favoriteTea: "Ginger Chai"
  }
];

export const initialOffers: Offer[] = [
  {
    id: "off-1",
    title: "Morning Chai Combo",
    description: "Get 20% OFF on any Chai + Bun Maska order between 6:00 AM and 10:00 AM daily.",
    code: "MORNING20",
    discountPercentage: 20,
    validTill: "Valid Daily till 10 AM",
    bgGradient: "from-amber-900/60 via-stone-900 to-black"
  },
  {
    id: "off-2",
    title: "Office Break Combo",
    description: "Order 5+ Chais & get complimentary 4x Hot Samosas for your office team break!",
    code: "TEAMBREAK",
    discountPercentage: 15,
    validTill: "Valid Mon–Fri",
    bgGradient: "from-yellow-900/60 via-amber-950 to-black"
  },
  {
    id: "off-3",
    title: "Student Special",
    description: "Show valid student ID & enjoy flat 15% discount on all Special Cutting Chais & Vada Pav.",
    code: "STUDENT15",
    discountPercentage: 15,
    validTill: "All Days",
    bgGradient: "from-amber-800/60 via-stone-900 to-black"
  },
  {
    id: "off-4",
    title: "Family Tea Combo",
    description: "Flat ₹100 OFF on orders above ₹500. Perfect for weekend evening tea time.",
    code: "ROYALFAMILY",
    discountPercentage: 20,
    validTill: "Weekends Only",
    bgGradient: "from-emerald-950/60 via-stone-900 to-black"
  }
];

export const galleryImages = [
  {
    id: "gal-1",
    title: "Fresh Assam Tea Leaves & Whole Spices",
    category: "Ingredients",
    url: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "gal-2",
    title: "Smoky Tandoori Kulhad Preparation",
    category: "Craft",
    url: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "gal-3",
    title: "Traditional Brass Kettle Pouring",
    category: "Pouring",
    url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "gal-4",
    title: "Piping Hot Samosas & Fresh Green Chutney",
    category: "Snacks",
    url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "gal-5",
    title: "5-Star Royal Tea Lounge Interior",
    category: "Ambience",
    url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: "gal-6",
    title: "Warm Golden Lighting at Night",
    category: "Ambience",
    url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800"
  }
];
