const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function (req, res, next) {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ Corrected — decoded contains id and email directly
    next();
  } catch (err) {
    console.error("Invalid token:", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};
