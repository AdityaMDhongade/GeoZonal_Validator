// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const submitRoutes = require('./routes/submitRoutes');
const connectDB = require('./config/db');
const adminRoutes = require("./routes/admin");
const authRoutes = require("./routes/auth");

connectDB();
const app = express();

// Middleware
app.use(cors()); // Allows requests from your React app
app.use(express.json()); // Parses incoming JSON payloads

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/', submitRoutes); // Connects our submission routes

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});