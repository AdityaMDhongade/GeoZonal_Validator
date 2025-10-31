// backend/middleware/upload.js

const multer = require('multer');
const path = require('path');

// Set up storage engine for Multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize the upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
  }
});

// VERY IMPORTANT: This line MUST be at the end of the file.
module.exports = upload;