const express = require('express');
const router = express.Router();
const submitController = require('../controllers/submitController');
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/authMiddleware'); // ✅ added

// Protected route — only logged-in users can submit
router.post(
  '/reports',
  authMiddleware,
  upload.array('photos', 5),
  submitController.handleReportSubmission
);

// Fetch all reports (you can later protect this for admin only)
router.get('/reports', submitController.getAllReports);

module.exports = router;
