// Run with: npm run seed
// Populates the database with one admin user and a few sample products.
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Product = require("./models/Product");

const run = async () => {
  await connectDB();

  const ADMIN_EMAIL = "2017ayaz1985@gmail.com";

  await User.deleteMany({ email: ADMIN_EMAIL });
  await Product.deleteMany({});

  await User.create({
    name: "Admin",
    email: ADMIN_EMAIL,
    password: "admin123", // change after first login
    role: "admin",
  });

  await Product.insertMany([
    {
      name: "Wireless Earbuds",
      img: "https://via.placeholder.com/300x300?text=Earbuds",
      price: 24.99,
      stock: 50,
      cat: "electronics",
    },
    {
      name: "Cotton T-Shirt",
      img: "https://via.placeholder.com/300x300?text=T-Shirt",
      price: 9.99,
      stock: 100,
      cat: "clothing",
    },
    {
      name: "Ceramic Mug",
      img: "https://via.placeholder.com/300x300?text=Mug",
      price: 6.5,
      stock: 75,
      cat: "home",
    },
  ]);

  console.log(`Seed data created. Admin login: ${ADMIN_EMAIL} / admin123`);
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
