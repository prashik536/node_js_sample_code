export const PRODUCTS = [
  // Fruits & Vegetables
  {
    id: 'f1',
    name: 'Alphonso Mango (Ratnagiri)',
    category: 'Fruits & Veggies',
    unit: '1 kg (approx 4-5 pcs)',
    price: 249,
    mrp: 349,
    discount: '28% OFF',
    rating: 4.8,
    reviews: 1240,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=80',
    tag: '⚡ 10 MINS',
    description: 'Directly sourced Ratnagiri Alphonso mangoes. Sweet, juicy and naturally ripened.'
  },
  {
    id: 'f2',
    name: 'Robusta Bananas',
    category: 'Fruits & Veggies',
    unit: '1 Dozen (approx 1 kg)',
    price: 48,
    mrp: 65,
    discount: '26% OFF',
    rating: 4.7,
    reviews: 890,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=80',
    tag: 'FRESH TODAY',
    description: 'Energy rich Robusta bananas, fresh and chemical free.'
  },
  {
    id: 'f3',
    name: 'Washington Green Apples',
    category: 'Fruits & Veggies',
    unit: '4 pcs (500g)',
    price: 139,
    mrp: 180,
    discount: '22% OFF',
    rating: 4.9,
    reviews: 430,
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500&auto=format&fit=crop&q=80',
    tag: 'TOP RATED',
    description: 'Crisp, tart and delicious imported Washington apples.'
  },
  {
    id: 'f4',
    name: 'Fresh Hybrid Tomatoes',
    category: 'Fruits & Veggies',
    unit: '1 kg',
    price: 32,
    mrp: 45,
    discount: '28% OFF',
    rating: 4.6,
    reviews: 2100,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
    tag: 'DAILY ESSENTIAL',
    description: 'Firm, juicy and crimson red farm-fresh tomatoes.'
  },

  // Dairy & Bakery
  {
    id: 'd1',
    name: 'Amul Taaza Toned Milk',
    category: 'Dairy & Bakery',
    unit: '1 Litre Pouch',
    price: 54,
    mrp: 54,
    discount: 'BEST PRICE',
    rating: 4.9,
    reviews: 5400,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80',
    tag: '⚡ 10 MINS',
    description: 'Pasteurised toned milk with 3.0% fat content.'
  },
  {
    id: 'd2',
    name: 'Amul Pasteurised Butter',
    category: 'Dairy & Bakery',
    unit: '100 g',
    price: 58,
    mrp: 60,
    discount: '3% OFF',
    rating: 5.0,
    reviews: 4120,
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=80',
    tag: 'MUST HAVE',
    description: 'Utterly butterly delicious salted Amul butter.'
  },
  {
    id: 'd3',
    name: 'Modern 100% Whole Wheat Bread',
    category: 'Dairy & Bakery',
    unit: '400 g',
    price: 45,
    mrp: 50,
    discount: '10% OFF',
    rating: 4.7,
    reviews: 980,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80',
    tag: 'FRESH BAKE',
    description: 'Soft, healthy 100% whole wheat bread with high fibre.'
  },

  // Munchies & Snacks
  {
    id: 's1',
    name: "Lay's India's Magic Masala Chips",
    category: 'Snacks & Munchies',
    unit: '115 g',
    price: 50,
    mrp: 50,
    discount: 'POPULAR',
    rating: 4.8,
    reviews: 3200,
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80',
    tag: 'PARTY PACK',
    description: 'Spicy Indian masala flavor potato chips.'
  },
  {
    id: 's2',
    name: 'Doritos Nacho Cheese Tortilla Chips',
    category: 'Snacks & Munchies',
    unit: '82.5 g',
    price: 50,
    mrp: 60,
    discount: '16% OFF',
    rating: 4.8,
    reviews: 1840,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
    tag: 'CRUNCHY',
    description: 'Bold cheese flavored crunchy tortilla chips.'
  },

  // Cold Drinks & Juices
  {
    id: 'c1',
    name: 'Coca-Cola Soft Drink Can',
    category: 'Drinks & Juices',
    unit: '300 ml Can',
    price: 40,
    mrp: 40,
    discount: 'CHILLED',
    rating: 4.9,
    reviews: 4800,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80',
    tag: '⚡ CHILLED 10m',
    description: 'Refreshing classic Coca-Cola served ice cold.'
  },
  {
    id: 'c2',
    name: 'Real Fruit Power Alphonso Mango Juice',
    category: 'Drinks & Juices',
    unit: '1 Litre',
    price: 110,
    mrp: 130,
    discount: '15% OFF',
    rating: 4.7,
    reviews: 760,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80',
    tag: '100% JUICE',
    description: 'Rich mango nectar juice packed with vitamins.'
  },

  // Instant Food
  {
    id: 'i1',
    name: 'Maggi 2-Minute Masala Instant Noodles',
    category: 'Instant Food',
    unit: ' Pack of 4 (280g)',
    price: 56,
    mrp: 60,
    discount: '6% OFF',
    rating: 5.0,
    reviews: 8900,
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80',
    tag: 'HOT FAVORITE',
    description: 'Classic favorite masala noodles with signature spice mix.'
  }
];

export const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: '🛒' },
  { id: 'Fruits & Veggies', name: 'Fruits & Veggies', icon: '🥭' },
  { id: 'Dairy & Bakery', name: 'Dairy & Bakery', icon: '🥛' },
  { id: 'Snacks & Munchies', name: 'Munchies', icon: '🍿' },
  { id: 'Drinks & Juices', name: 'Cold Drinks', icon: '🥤' },
  { id: 'Instant Food', name: 'Instant Food', icon: '🍜' }
];

export const POST_CHECKOUT_ADDONS = [
  {
    id: 'addon1',
    name: 'Cornetto Double Chocolate Cone',
    unit: '105 ml',
    price: 45,
    image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=300&q=80'
  },
  {
    id: 'addon2',
    name: 'Red Bull Energy Drink',
    unit: '250 ml Can',
    price: 125,
    image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=300&q=80'
  },
  {
    id: 'addon3',
    name: 'Cadbury Dairy Milk Silk',
    unit: '60 g',
    price: 80,
    image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=300&q=80'
  }
];

export const SAVED_ADDRESSES = [
  {
    id: 'addr1',
    label: 'Home',
    tag: 'DEFAULT',
    line1: 'Flat 402, Signature Heights',
    line2: 'Road No 12, Banjara Hills, Hyderabad',
    landmark: 'Near Star Hospital',
    pincode: '500034'
  },
  {
    id: 'addr2',
    label: 'Work / Office',
    tag: 'OFFICE',
    line1: 'Tower B, 6th Floor, Cyber Tech Park',
    line2: 'HITEC City, Madhapur, Hyderabad',
    landmark: 'Opposite Mindspace Phase 2',
    pincode: '500081'
  }
];

export const COUPONS = [
  {
    code: 'ZEPTO100',
    discountAmount: 100,
    minOrder: 299,
    description: 'Flat ₹100 Instant Discount on orders above ₹299'
  },
  {
    code: 'FREEDEL',
    discountAmount: 35,
    minOrder: 99,
    description: 'Free Delivery on your order (Saves ₹35)'
  },
  {
    code: 'SUPER10',
    discountPercent: 10,
    maxDiscount: 50,
    minOrder: 150,
    description: '10% Extra Discount up to ₹50'
  }
];
