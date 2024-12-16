// config/multer.js

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the path for the uploads folder (you can change 'public/uploads' to any path)
const uploadDir = path.join(__dirname, '../public', 'uploads');

// Check if the uploads folder exists, create it if not
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store files in 'public/uploads'
  },
  filename: (req, file, cb) => {
    // Create a unique filename using timestamp and random number
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = uniqueSuffix + path.extname(file.originalname);
    cb(null, fileName);
  },
});

// Set up multer with a limit of 5 files
const upload = multer({ storage: storage }).array('images', 5);

module.exports = upload;
