const express = require("express");
const router = express.Router();
const Member = require("../models/Member"); // <-- Updated to Member
const jwt = require("jsonwebtoken");

// 1. SIGNUP ENDPOINT: POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the member already exists
    const memberExists = await Member.findOne({ email });
    if (memberExists) {
      return res.status(400).json({ message: "Member already exists with this email" });
    }

    // Create a new member instance
    const newMember = new Member({
      name,
      email,
      password,
    });

    await newMember.save();
    res.status(201).json({ message: "Member registered successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error during registration", error: error.message });
  }
});

// 2. LOGIN ENDPOINT: POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the member by email
    const member = await Member.findOne({ email });
    if (!member) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check password match
    const isMatch = await member.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: member._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful!",
      token,
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during login", error: error.message });
  }
});

module.exports = router;