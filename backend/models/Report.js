const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  address: { type: String, required: true },
  description: { type: String, required: true },

  plot: {
    area: { type: String },
    coordinates: { type: [[Number]] }, // [ [lng, lat], ... ]
  },

  building: {
    area: { type: String },
    coordinates: { type: [[Number]] },
  },

  road: {
    type: { type: String },
    width: { type: Number },
    distance: { type: String },
  },

  user: {
    id: { type: String, required: true },
    name: { type: String },
    email: { type: String },
  },

  photos: [String], // filenames or URLs

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"], // ✅ matches admin update route
    default: "pending",
  },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
    },
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
