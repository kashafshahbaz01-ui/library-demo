const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// 1. SIGNUP ENDPOINT: POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists in the database
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Create a new user instance (the pre-save hook in User.js will hash the password here!)
    const newUser = new User({
      name,
      email,
      password,
    });

    // Save the user to MongoDB
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error during registration", error: error.message });
  }
});

// 2. LOGIN ENDPOINT: POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by their email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Use the helper method we wrote in User.js to compare the passwords
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // If password matches, generate a secure JWT Token (Digital Security Badge)
    const token = jwt.sign(
      { id: user._id }, // Embed the user's unique ID inside the token
      process.env.JWT_SECRET, // Sign it with our secret stamp key
      { expiresIn: "1d" } // Make the token expire in 1 day for security
    );

    // Send the token back to Postman or the Frontend
    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
});

module.exports = router;