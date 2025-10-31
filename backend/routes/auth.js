const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("📩 Login attempt:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.warn("⚠️ No user found:", email);
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.warn("⚠️ Invalid password for:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is missing in environment!");
      return res.status(500).json({ message: "Server misconfiguration" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("✅ Login successful for:", email);
    res.json({ token, user });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;
