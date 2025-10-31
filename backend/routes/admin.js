const express = require("express");
const router = express.Router();
const Report = require("../models/Report");

// Simple key-based protection
const ADMIN_KEY = process.env.ADMIN_KEY;

// Middleware to verify admin access
function verifyAdmin(req, res, next) {
  const key = req.headers["x-admin-key"];
  if (key !== ADMIN_KEY) return res.status(403).json({ error: "Forbidden" });
  next();
}

// Get all reports
router.get("/reports", verifyAdmin, async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update report status
router.put("/report/:id", verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete report
router.delete("/report/:id", verifyAdmin, async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: "Report deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
