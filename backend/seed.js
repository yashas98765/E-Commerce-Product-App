const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const products = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium over-ear headphones with 30-hour battery life, active noise cancellation, and studio-quality sound. Perfect for music lovers and remote workers.',
    price: 299.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    stock: 45,
    rating: 4.8,
    numReviews: 256,
    featured: true
  },
  {
    name: 'Smart Watch Pro X',
    description: 'Advanced fitness tracking, heart rate monitoring, GPS, and 7-day battery. Compatible with iOS and Android.',
    price: 249.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    stock: 30,
    rating: 4.6,
    numReviews: 189,
    featured: true
  },
  {
    name: 'Mechanical Gaming Keyboard',
    description: 'RGB backlit mechanical keyboard with Cherry MX switches, anti-ghosting, and programmable macros for competitive gaming.',
    price: 129.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400&h=300&fit=crop',
    stock: 60,
    rating: 4.7,
    numReviews: 342
  },
  {
    name: '4K Ultra-Wide Monitor',
    description: '34-inch curved ultrawide monitor with 144Hz refresh rate, HDR support, and USB-C connectivity for immersive productivity.',
    price: 599.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=300&fit=crop',
    stock: 15,
    rating: 4.9,
    numReviews: 98
  },
  {
    name: 'Classic Denim Jacket',
    description: 'Timeless denim jacket with a modern slim fit. Made from 100% organic cotton, available in multiple washes.',
    price: 89.99,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=300&fit=crop',
    stock: 120,
    rating: 4.5,
    numReviews: 78
  },
  {
    name: 'Running Shoes Ultra Boost',
    description: 'Lightweight running shoes with responsive foam cushioning, breathable mesh upper, and anti-slip outsole for all terrains.',
    price: 159.99,
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    stock: 85,
    rating: 4.8,
    numReviews: 412,
    featured: true
  },
  {
    name: 'JavaScript: The Good Parts',
    description: 'Essential guide to the best features of JavaScript by Douglas Crockford. A must-read for every web developer.',
    price: 34.99,
    category: 'Books',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
    stock: 200,
    rating: 4.7,
    numReviews: 1205
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Extra-thick 6mm non-slip yoga mat with alignment lines, carrying strap, and eco-friendly TPE material.',
    price: 49.99,
    category: 'Sports',
    imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=300&fit=crop',
    stock: 150,
    rating: 4.6,
    numReviews: 334
  },
  {
    name: 'Scented Soy Candle Set',
    description: 'Set of 3 hand-poured soy wax candles in calming lavender, vanilla, and eucalyptus scents. 40-hour burn time each.',
    price: 44.99,
    category: 'Home & Garden',
    imageUrl: 'https://images.unsplash.com/photo-1602910344008-22f323cc1817?w=400&h=300&fit=crop',
    stock: 75,
    rating: 4.9,
    numReviews: 567
  },
  {
    name: 'Vitamin C Serum',
    description: 'Brightening 20% Vitamin C serum with hyaluronic acid and ferulic acid. Reduces dark spots and boosts collagen.',
    price: 38.99,
    category: 'Beauty',
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop',
    stock: 90,
    rating: 4.7,
    numReviews: 823
  },
  {
    name: 'Bamboo Desk Organizer',
    description: 'Elegant 7-compartment bamboo desk organizer with phone stand, pen holder, and cable management slots.',
    price: 29.99,
    category: 'Home & Garden',
    imageUrl: 'https://images.unsplash.com/photo-1593640408182-31c228e9bfe8?w=400&h=300&fit=crop',
    stock: 110,
    rating: 4.4,
    numReviews: 156
  },
  {
    name: 'Portable Bluetooth Speaker',
    description: '360° surround sound, waterproof IPX7, 20-hour playtime, and built-in powerbank. The perfect outdoor companion.',
    price: 79.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop',
    stock: 55,
    rating: 4.5,
    numReviews: 290,
    featured: true
  },
  {
    name: 'Organic Green Tea (50 bags)',
    description: 'Premium Japanese sencha green tea, USDA certified organic, individually wrapped for freshness. Rich in antioxidants.',
    price: 19.99,
    category: 'Food',
    imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
    stock: 300,
    rating: 4.8,
    numReviews: 445
  },
  {
    name: 'LEGO Architecture Set',
    description: 'Build the iconic Eiffel Tower in 648 pieces. Suitable for ages 12+, with instruction booklet and display stand.',
    price: 59.99,
    category: 'Toys',
    imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=300&fit=crop',
    stock: 40,
    rating: 4.9,
    numReviews: 203
  },
  {
    name: 'Merino Wool Sweater',
    description: 'Soft, breathable merino wool crew-neck sweater. Anti-itch, temperature-regulating, and machine washable.',
    price: 119.99,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?w=400&h=300&fit=crop',
    stock: 65,
    rating: 4.6,
    numReviews: 132
  },
  {
    name: 'Wireless Charging Pad',
    description: '15W fast wireless charging pad compatible with all Qi-enabled devices. Slim design with LED indicator.',
    price: 24.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
    stock: 180,
    rating: 4.3,
    numReviews: 678
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@shopnest.com',
      password: 'Admin@123',
      role: 'admin'
    });
    console.log('Admin created:', admin.email);

    // Create regular user
    await User.create({
      name: 'John Doe',
      email: 'user@shopnest.com',
      password: 'User@123',
      role: 'user'
    });

    // Insert products
    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);

    console.log('\n=== CREDENTIALS ===');
    console.log('Admin: admin@shopnest.com / Admin@123');
    console.log('User:  user@shopnest.com / User@123');
    console.log('===================\n');

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
