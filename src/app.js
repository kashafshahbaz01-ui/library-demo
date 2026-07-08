const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// FIX: Removed the extra 'src' from the path since app.js is already inside src/
const authRoutes = require('./routes/auth.routes');
const bookRoutes = require('./routes/book.routes');

const app = express();

// Body parsing middleware (Crucial for reading JSON raw bodies from Postman)
app.use(express.json());

// ==========================================
// ROUTE PREFIX DEFINITIONS
// ==========================================
// Maps authentication endpoints to http://localhost:5000/api/auth/...
app.use('/api/auth', authRoutes);

// Maps book management endpoints to http://localhost:5000/api/books/...
app.use('/api/books', bookRoutes);

// Global simple health-check fallback path
app.get('/', (req, res) => {
  res.status(200).json({ message: "Library system API is live and operational." });
});

// ==========================================
// DATABASE CONNECTION & SERVER STARTUP
// ==========================================
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/library-demo";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("🚀 Connected to MongoDB Database successfully.");
    app.listen(PORT, () => {
      console.log(`📡 Server running smoothly on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection error occurred: ", err.message);
  });

module.exports = app;