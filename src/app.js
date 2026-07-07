const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");

// 1. IMPORT ROUTES
// Import your existing book operations menu
const bookRoutes = require("./routes/book.routes");
// Import your brand-new user security gate system
const authRoutes = require("./routes/auth.routes");

// 2. INITIALIZE EXPRESS APP
const app = express();

// 3. CONNECT TO DATABASE
// Establishes the secure telephone line to your local MongoDB server
connectDB();

// 4. GLOBAL MIDDLEWARE
// Crucial gatekeeper: translates incoming raw JSON text payloads 
// into clean JavaScript objects so your routes can read 'req.body'
app.use(express.json());

// 5. MOUNT API ROUTE MODULES
// Mounts your book management paths at: http://localhost:5000/api/books
app.use("/api", bookRoutes);

// Mounts your authentication paths at: http://localhost:5000/api/auth/signup and /login
app.use("/api/auth", authRoutes);

// 6. BASE TEST ENDPOINT
// A quick sanity check route to ensure your server receptionist is breathing
app.get("/", (req, res) => {
  res.status(200).json({ message: "Library Demo API is running smoothly!" });
});

// 7. START NETWORK LISTENING PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 Server running on network port ${PORT}`);
  console.log(`=========================================`);
});