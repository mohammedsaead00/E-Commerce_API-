// Seed catalog data. In a real backend integration, this file goes away and
// services/api.js fetches the same shape from your API instead.

export const CATEGORIES = [
  { id: "home-living", label: "Home & Living", icon: "🏺" },
  { id: "fashion", label: "Fashion", icon: "👕" },
  { id: "electronics", label: "Electronics", icon: "🎧" },
  { id: "beauty", label: "Beauty", icon: "🧴" },
  { id: "sports", label: "Sports", icon: "🏃" },
  { id: "stationery", label: "Stationery", icon: "✏️" },
];

const img = (seed) => `https://picsum.photos/seed/${seed}/600/600`;

export const PRODUCTS = [
  {
    id: "p-001",
    name: "Hand-thrown Stoneware Mug",
    category: "home-living",
    price: 18.0,
    compareAtPrice: 24.0,
    rating: 4.7,
    reviewCount: 132,
    tag: "Best seller",
    description:
      "A wide-bellied mug thrown in small batches from speckled stoneware clay, finished with a satin glaze that's kind to the lips. Dishwasher and microwave safe.",
    images: [img("mug-1"), img("mug-2"), img("mug-3")],
    colors: ["Sand", "Moss", "Charcoal"],
    stock: 24,
  },
  {
    id: "p-002",
    name: "Linen Table Runner",
    category: "home-living",
    price: 32.0,
    rating: 4.5,
    reviewCount: 58,
    description:
      "Pre-washed European linen with a naturally soft hand and relaxed drape. Frays are hemmed by hand to stay crisp wash after wash.",
    images: [img("linen-1"), img("linen-2")],
    colors: ["Oat", "Clay"],
    stock: 40,
  },
  {
    id: "p-003",
    name: "Ribbed Cotton Sweater",
    category: "fashion",
    price: 54.0,
    compareAtPrice: 68.0,
    rating: 4.6,
    reviewCount: 211,
    tag: "New",
    description:
      "A midweight ribbed knit cut for a relaxed silhouette. Brushed on the inside for warmth without the bulk. Pairs equally well with denim or tailored trousers.",
    images: [img("sweater-1"), img("sweater-2"), img("sweater-3")],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Forest", "Oatmeal", "Black"],
    stock: 15,
  },
  {
    id: "p-004",
    name: "Selvedge Denim Jacket",
    category: "fashion",
    price: 89.0,
    rating: 4.8,
    reviewCount: 97,
    description:
      "Rigid selvedge denim that softens and fades uniquely to you over time. Chest pockets sized for a phone, corozo buttons throughout.",
    images: [img("jacket-1"), img("jacket-2")],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Indigo"],
    stock: 9,
  },
  {
    id: "p-005",
    name: "Wireless Over-ear Headphones",
    category: "electronics",
    price: 129.0,
    compareAtPrice: 159.0,
    rating: 4.4,
    reviewCount: 340,
    tag: "Best seller",
    description:
      "Active noise cancellation, 38-hour battery life, and memory-foam ear cushions for all-day listening. Pairs to two devices at once.",
    images: [img("headphones-1"), img("headphones-2"), img("headphones-3")],
    colors: ["Graphite", "Cream"],
    stock: 60,
  },
  {
    id: "p-006",
    name: "Mechanical Keyboard, 65%",
    category: "electronics",
    price: 99.0,
    rating: 4.6,
    reviewCount: 152,
    description:
      "Hot-swappable switches, a gasket-mounted plate for a softer typing feel, and a compact 65% layout that keeps your desk uncluttered.",
    images: [img("keyboard-1"), img("keyboard-2")],
    colors: ["White", "Black"],
    stock: 33,
  },
  {
    id: "p-007",
    name: "Portable Espresso Maker",
    category: "electronics",
    price: 45.0,
    rating: 4.3,
    reviewCount: 88,
    description:
      "Manual, no-battery espresso for camping, travel, or a small kitchen. Brews a full shot in under a minute with consistent pressure.",
    images: [img("espresso-1"), img("espresso-2")],
    stock: 50,
  },
  {
    id: "p-008",
    name: "Mineral Sunscreen SPF 40",
    category: "beauty",
    price: 22.0,
    rating: 4.5,
    reviewCount: 174,
    description:
      "A lightweight, no-white-cast mineral formula with zinc oxide. Fragrance-free and safe for sensitive, reef, and daily wear.",
    images: [img("sunscreen-1"), img("sunscreen-2")],
    stock: 80,
  },
  {
    id: "p-009",
    name: "Vitamin C Serum",
    category: "beauty",
    price: 28.0,
    compareAtPrice: 34.0,
    rating: 4.4,
    reviewCount: 265,
    description:
      "15% stabilized vitamin C with ferulic acid to brighten tone and soften the look of fine lines. One dropper, once daily.",
    images: [img("serum-1"), img("serum-2")],
    stock: 45,
  },
  {
    id: "p-010",
    name: "Bamboo Bristle Toothbrush Set",
    category: "beauty",
    price: 12.0,
    rating: 4.2,
    reviewCount: 61,
    description:
      "A set of four biodegradable bamboo toothbrushes with soft charcoal-infused bristles, packaged plastic-free.",
    images: [img("toothbrush-1"), img("toothbrush-2")],
    stock: 100,
  },
  {
    id: "p-011",
    name: "Trail Running Shoes",
    category: "sports",
    price: 118.0,
    rating: 4.7,
    reviewCount: 203,
    tag: "New",
    description:
      "Aggressive lug pattern for loose terrain, a rock plate underfoot, and a breathable knit upper that drains fast after stream crossings.",
    images: [img("shoes-1"), img("shoes-2"), img("shoes-3")],
    sizes: ["7", "8", "9", "10", "11", "12"],
    stock: 27,
  },
  {
    id: "p-012",
    name: "Foldable Yoga Mat",
    category: "sports",
    price: 58.0,
    rating: 4.6,
    reviewCount: 119,
    description:
      "Folds down to the size of a paperback for travel, then unrolls flat with no curling. Closed-cell surface resists sweat absorption.",
    images: [img("yoga-1"), img("yoga-2")],
    colors: ["Sage", "Berry"],
    stock: 38,
  },
  {
    id: "p-013",
    name: "Adjustable Dumbbell Pair",
    category: "sports",
    price: 199.0,
    rating: 4.8,
    reviewCount: 76,
    description:
      "Dial-adjustable from 5 to 52.5 lbs per hand, replacing 15 pairs of fixed weights with one compact set.",
    images: [img("dumbbell-1"), img("dumbbell-2")],
    stock: 12,
  },
  {
    id: "p-014",
    name: "Refillable Fountain Pen",
    category: "stationery",
    price: 34.0,
    rating: 4.5,
    reviewCount: 92,
    description:
      "A medium nib fountain pen with a brass body that gains character with use. Includes a converter for bottled ink.",
    images: [img("pen-1"), img("pen-2")],
    colors: ["Brass", "Black"],
    stock: 55,
  },
  {
    id: "p-015",
    name: "Dot-grid Notebook, Set of 2",
    category: "stationery",
    price: 24.0,
    rating: 4.6,
    reviewCount: 140,
    description:
      "160gsm acid-free paper that resists ghosting from fountain pens and markers alike, in a lay-flat stitched binding.",
    images: [img("notebook-1"), img("notebook-2")],
    stock: 70,
  },
  {
    id: "p-016",
    name: "Woven Storage Baskets, Set of 3",
    category: "home-living",
    price: 46.0,
    rating: 4.4,
    reviewCount: 84,
    description:
      "Hand-woven seagrass baskets in graduated sizes, sturdy enough for books and light enough to move one-handed.",
    images: [img("basket-1"), img("basket-2")],
    stock: 30,
  },
  {
    id: "p-017",
    name: "Ceramic Pour-over Dripper",
    category: "home-living",
    price: 29.0,
    rating: 4.7,
    reviewCount: 66,
    description:
      "A single-cone dripper with a wide extraction hole for a fuller-bodied cup, and a stable three-point base for any mug.",
    images: [img("dripper-1"), img("dripper-2")],
    colors: ["White", "Terracotta"],
    stock: 42,
  },
  {
    id: "p-018",
    name: "Recycled Canvas Tote",
    category: "fashion",
    price: 26.0,
    rating: 4.5,
    reviewCount: 108,
    description:
      "Heavyweight canvas woven from recycled cotton scraps, reinforced straps rated for 20kg, and an interior zip pocket.",
    images: [img("tote-1"), img("tote-2")],
    colors: ["Natural", "Black"],
    stock: 65,
  },
];

export function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id);
}

export function getProductsByCategory(categoryId) {
  return PRODUCTS.filter((p) => p.category === categoryId);
}

export function getRelatedProducts(product, limit = 4) {
  return PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, limit);
}

export function searchProducts(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
}
