import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import Document from '../models/Document.js';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

// ✅ Print config for debug (optional, good for dev only)
console.log("🧪 Cloudinary config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET ? "✅ set" : "❌ missing"
});

// ✅ Correct Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Ensure uploads/ directory exists
const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Upload handler
const handleUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('📎 File received:', req.file.originalname);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: 'raw'
    });
    console.log("✅ Uploaded to Cloudinary:", result.secure_url);

    // Read PDF and parse text
    const dataBuffer = fs.readFileSync(req.file.path);
    const parsed = await pdfParse(dataBuffer);

    // Save in DB
    const doc = await Document.create({
      fileName: req.file.originalname,
      cloudinaryUrl: result.secure_url,
      content: parsed.text
    });

    // Cleanup local file
    fs.unlink(req.file.path, (err) => {
      if (err) console.warn('⚠️ Cleanup failed:', err.message);
    });

    res.status(200).json({ message: 'Uploaded successfully', docId: doc._id });
  } catch (err) {
    console.error('❌ Upload failed:', err);
    res.status(500).json({ error: err.message });
  }
};

export { upload, handleUpload };
