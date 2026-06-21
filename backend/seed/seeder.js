const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing data
    await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany()]);

    // Create admin and a sample customer
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    await User.create({
      name: 'Test Customer',
      email: 'customer@example.com',
      password: 'customer123',
      role: 'user',
    });

    // Create categories
    const categories = await Category.insertMany([
      { name: 'Electronics', description: 'Phones, laptops, gadgets and accessories' },
      { name: 'Fashion', description: 'Clothing, footwear and accessories' },
      { name: 'Home & Living', description: 'Furniture, decor and kitchenware' },
      { name: 'Books', description: 'Fiction, non-fiction and academic books' },
    ]);

    const [electronics, fashion, home, books] = categories;

    // Create sample products
    await Product.insertMany([
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'Over-ear wireless headphones with active noise cancellation and 30-hour battery life.',
        price: 2999,
        discountPrice: 2499,
        category: electronics._id,
        brand: 'SoundMax',
        stock: 50,
        images: [{ url: 'https://placehold.co/600x400?text=Headphones', alt: 'Headphones' }],
        isFeatured: true,
        createdBy: admin._id,
      },
      {
        name: 'Smartphone 128GB',
        description: 'A reliable mid-range smartphone with a 6.5-inch display and triple camera setup.',
        price: 18999,
        category: electronics._id,
        brand: 'TechOne',
        stock: 30,
        images: [{ url: 'https://placehold.co/600x400?text=Smartphone', alt: 'Smartphone' }],
        isFeatured: true,
        createdBy: admin._id,
      },
      {
        name: "Men's Cotton T-Shirt",
        description: 'Breathable, soft cotton t-shirt available in multiple colors.',
        price: 599,
        category: fashion._id,
        brand: 'UrbanWear',
        stock: 100,
        images: [{ url: 'https://placehold.co/600x400?text=T-Shirt', alt: 'T-Shirt' }],
        createdBy: admin._id,
      },
      {
        name: 'Ceramic Coffee Mug Set (4 pcs)',
        description: 'Stylish ceramic mug set, dishwasher and microwave safe.',
        price: 899,
        category: home._id,
        brand: 'HomeCraft',
        stock: 75,
        images: [{ url: 'https://placehold.co/600x400?text=Mug+Set', alt: 'Mug set' }],
        createdBy: admin._id,
      },
      {
        name: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        description: 'A must-read book for every software developer on writing maintainable code.',
        price: 1299,
        category: books._id,
        brand: "Prentice Hall",
        stock: 40,
        images: [{ url: 'https://placehold.co/600x400?text=Clean+Code', alt: 'Book cover' }],
        isFeatured: true,
        createdBy: admin._id,
      },
    ]);

    console.log('Sample data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Seeder error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  await connectDB();
  try {
    await Promise.all([User.deleteMany(), Category.deleteMany(), Product.deleteMany()]);
    console.log('All data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Seeder error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  seedData();
}
