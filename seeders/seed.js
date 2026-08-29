/**
 * seeders/seed.js
 * Run with:  npm run seed
 *
 * Seeds the database with:
 *   - 1 admin user  (admin@shop.com / admin123)
 *   - 1 normal user (user@shop.com  / user1234)
 *   - 6 categories
 *   - 24 products (4 per category)
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const {
  sequelize,
  User,
  Category,
  Product,
} = require('../models');

const bcrypt = require('bcryptjs');

// ── Seed Data ─────────────────────────────────────────────────

const categories = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Latest gadgets, phones, laptops and tech accessories.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400',
  },
  {
    name: 'Fashion',
    slug: 'fashion',
    description: 'Trending clothing, shoes, and accessories for every style.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
  },
  {
    name: 'Home & Living',
    slug: 'home-living',
    description: 'Furniture, décor, and everything to make your home beautiful.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
  },
  {
    name: 'Sports & Fitness',
    slug: 'sports-fitness',
    description: 'Equipment and apparel for every sport and fitness goal.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
  },
  {
    name: 'Books',
    slug: 'books',
    description: 'Best sellers, textbooks, fiction, and non-fiction titles.',
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
  },
  {
    name: 'Beauty & Personal Care',
    slug: 'beauty-care',
    description: 'Skincare, haircare, and grooming essentials.',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400',
  },
];

const getProducts = (categoryIds) => [
  // ── Electronics ──────────────────────────────────────────────
  {
    name: 'iPhone 15 Pro Max',
    description: 'Apple\'s most powerful iPhone with A17 Pro chip, 48MP camera system, and titanium design.',
    price: 1199.00,
    originalPrice: 1299.00,
    stock: 50,
    rating: 4.8,
    reviewCount: 1240,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
    categoryId: categoryIds[0],
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Samsung\'s flagship with built-in S Pen, 200MP camera, and AI-powered features.',
    price: 1099.00,
    originalPrice: 1199.00,
    stock: 35,
    rating: 4.7,
    reviewCount: 890,
    image: 'https://images.unsplash.com/photo-1706276837601-bf8a0dbc7b94?w=400',
    categoryId: categoryIds[0],
  },
  {
    name: 'MacBook Pro 14" M3',
    description: 'Professional laptop with M3 chip, stunning Liquid Retina XDR display, and all-day battery.',
    price: 1999.00,
    originalPrice: 2199.00,
    stock: 20,
    rating: 4.9,
    reviewCount: 567,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    categoryId: categoryIds[0],
  },
  {
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise cancelling wireless headphones with 30-hour battery life.',
    price: 349.00,
    originalPrice: 399.00,
    stock: 80,
    rating: 4.8,
    reviewCount: 2100,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    categoryId: categoryIds[0],
  },

  // ── Fashion ──────────────────────────────────────────────────
  {
    name: 'Classic Leather Jacket',
    description: 'Premium genuine leather jacket with modern slim fit. Available in black and brown.',
    price: 299.00,
    originalPrice: 399.00,
    stock: 45,
    rating: 4.6,
    reviewCount: 320,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    categoryId: categoryIds[1],
  },
  {
    name: 'Nike Air Max 270',
    description: 'Iconic sneakers with Max Air unit for all-day comfort and bold style.',
    price: 130.00,
    originalPrice: 150.00,
    stock: 120,
    rating: 4.7,
    reviewCount: 1850,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    categoryId: categoryIds[1],
  },
  {
    name: 'Slim Fit Chino Pants',
    description: 'Versatile chino pants perfect for casual and semi-formal occasions.',
    price: 59.00,
    originalPrice: 79.00,
    stock: 200,
    rating: 4.3,
    reviewCount: 450,
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400',
    categoryId: categoryIds[1],
  },
  {
    name: 'Designer Sunglasses',
    description: 'UV400 protection polarized lenses in a classic aviator frame.',
    price: 149.00,
    originalPrice: 199.00,
    stock: 60,
    rating: 4.5,
    reviewCount: 280,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
    categoryId: categoryIds[1],
  },

  // ── Home & Living ─────────────────────────────────────────────
  {
    name: 'Ergonomic Office Chair',
    description: 'Fully adjustable mesh chair with lumbar support for long working sessions.',
    price: 399.00,
    originalPrice: 499.00,
    stock: 25,
    rating: 4.7,
    reviewCount: 610,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    categoryId: categoryIds[2],
  },
  {
    name: 'Scented Soy Candle Set',
    description: 'Set of 4 premium soy wax candles in calming lavender, vanilla, cedar and jasmine.',
    price: 45.00,
    originalPrice: 60.00,
    stock: 150,
    rating: 4.8,
    reviewCount: 940,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    categoryId: categoryIds[2],
  },
  {
    name: 'Minimalist Wall Clock',
    description: 'Silent quartz movement clock with a clean scandinavian design.',
    price: 35.00,
    originalPrice: 45.00,
    stock: 90,
    rating: 4.4,
    reviewCount: 230,
    image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400',
    categoryId: categoryIds[2],
  },
  {
    name: 'Ceramic Dinner Set (12 pcs)',
    description: 'Elegant 12-piece ceramic dinner set with a matte finish, microwave and dishwasher safe.',
    price: 89.00,
    originalPrice: 120.00,
    stock: 40,
    rating: 4.6,
    reviewCount: 370,
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400',
    categoryId: categoryIds[2],
  },

  // ── Sports & Fitness ─────────────────────────────────────────
  {
    name: 'Adjustable Dumbbell Set',
    description: 'Space-saving adjustable dumbbells from 5 to 52.5 lbs. Perfect for home gyms.',
    price: 349.00,
    originalPrice: 429.00,
    stock: 30,
    rating: 4.8,
    reviewCount: 780,
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400',
    categoryId: categoryIds[3],
  },
  {
    name: 'Yoga Mat Pro',
    description: 'Non-slip 6mm thick yoga mat with carrying strap and alignment lines.',
    price: 49.00,
    originalPrice: 65.00,
    stock: 200,
    rating: 4.6,
    reviewCount: 1200,
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
    categoryId: categoryIds[3],
  },
  {
    name: 'Running Shoes — Men',
    description: 'Lightweight and breathable running shoes with responsive cushioning.',
    price: 110.00,
    originalPrice: 130.00,
    stock: 85,
    rating: 4.5,
    reviewCount: 660,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    categoryId: categoryIds[3],
  },
  {
    name: 'Resistance Band Set',
    description: 'Set of 5 resistance bands with different tension levels for full-body workouts.',
    price: 29.00,
    originalPrice: 39.00,
    stock: 300,
    rating: 4.7,
    reviewCount: 2400,
    image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400',
    categoryId: categoryIds[3],
  },

  // ── Books ─────────────────────────────────────────────────────
  {
    name: 'Atomic Habits',
    description: 'James Clear\'s #1 NYT bestseller on how tiny changes lead to remarkable results.',
    price: 16.00,
    originalPrice: 20.00,
    stock: 500,
    rating: 4.9,
    reviewCount: 12500,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
    categoryId: categoryIds[4],
  },
  {
    name: 'The Psychology of Money',
    description: 'Morgan Housel\'s timeless lessons on wealth, greed, and happiness.',
    price: 14.00,
    originalPrice: 18.00,
    stock: 400,
    rating: 4.8,
    reviewCount: 8700,
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400',
    categoryId: categoryIds[4],
  },
  {
    name: 'Deep Work',
    description: 'Cal Newport\'s guide to focused success in a distracted world.',
    price: 15.00,
    originalPrice: 19.00,
    stock: 350,
    rating: 4.7,
    reviewCount: 5600,
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
    categoryId: categoryIds[4],
  },
  {
    name: 'Zero to One',
    description: 'Peter Thiel\'s notes on startups and how to build the future.',
    price: 13.00,
    originalPrice: 17.00,
    stock: 280,
    rating: 4.6,
    reviewCount: 4100,
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
    categoryId: categoryIds[4],
  },

  // ── Beauty & Personal Care ────────────────────────────────────
  {
    name: 'Vitamin C Serum',
    description: '20% Vitamin C + Hyaluronic Acid + Vitamin E serum for brighter, firmer skin.',
    price: 29.00,
    originalPrice: 45.00,
    stock: 180,
    rating: 4.7,
    reviewCount: 3200,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
    categoryId: categoryIds[5],
  },
  {
    name: 'Electric Sonic Toothbrush',
    description: 'Rechargeable sonic toothbrush with 5 modes, smart timer, and 30-day battery.',
    price: 79.00,
    originalPrice: 99.00,
    stock: 95,
    rating: 4.8,
    reviewCount: 1800,
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400',
    categoryId: categoryIds[5],
  },
  {
    name: 'Natural Face Moisturizer',
    description: 'Lightweight non-comedogenic daily moisturizer with SPF 30 and hyaluronic acid.',
    price: 24.00,
    originalPrice: 35.00,
    stock: 220,
    rating: 4.6,
    reviewCount: 2600,
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
    categoryId: categoryIds[5],
  },
  {
    name: 'Hair Care Gift Set',
    description: 'Luxury 4-piece set: shampoo, conditioner, hair mask, and argan oil serum.',
    price: 55.00,
    originalPrice: 75.00,
    stock: 70,
    rating: 4.7,
    reviewCount: 1100,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400',
    categoryId: categoryIds[5],
  },
];

// ── Main Seed Function ─────────────────────────────────────────

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅  Connected to database');

    // Sync schema
    await sequelize.sync({ force: true });
    console.log('✅  Database synced (tables reset)');

    // Users
    const adminPasswordHash = await bcrypt.hash('admin123', 12);
    const userPasswordHash  = await bcrypt.hash('user1234', 12);

    await User.bulkCreate([
      {
        name:     'Admin User',
        email:    'admin@shop.com',
        password: adminPasswordHash,
        role:     'admin',
        phone:    '+1-555-0100',
        address:  '123 Admin Street, Tech City, TC 10001',
      },
      {
        name:     'John Doe',
        email:    'user@shop.com',
        password: userPasswordHash,
        role:     'user',
        phone:    '+1-555-0200',
        address:  '456 User Lane, Sample City, SC 20002',
      },
    ], { individualHooks: false });    // skip bcrypt hooks — already hashed above

    console.log('✅  Users seeded (admin@shop.com / admin123 | user@shop.com / user1234)');

    // Categories
    const createdCategories = await Category.bulkCreate(categories);
    const categoryIds = createdCategories.map((c) => c.id);
    console.log(`✅  ${createdCategories.length} categories seeded`);

    // Products
    const products = getProducts(categoryIds);
    await Product.bulkCreate(products);
    console.log(`✅  ${products.length} products seeded`);

    console.log('\n🎉  Seed complete!');
    console.log('   Admin:  admin@shop.com  /  admin123');
    console.log('   User:   user@shop.com   /  user1234');
    process.exit(0);
  } catch (err) {
    console.error('❌  Seed failed:', err);
    process.exit(1);
  }
}

seed();
