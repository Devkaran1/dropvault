const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const FileBundle = require('../models/FileBundle');

// ─── Cloudinary config ────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// ─── Multer (memory storage, no disk needed) ──────────────────
const MAX_SIZE = 5 * 1024 * 1024 * 1024; // 5 GB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE }
});

// ─── Upload single file to Cloudinary ─────────────────────────
function uploadToCloudinary(buffer, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// ─── POST /api/upload ─────────────────────────────────────────
router.post('/', upload.array('files', 50), async (req, res) => {
  try {
    const { name, key } = req.body;

    if (!name || !key) {
      return res.status(400).json({ error: 'Name and key are required.' });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded.' });
    }

    // Check total size
    const totalSize = req.files.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > MAX_SIZE) {
      return res.status(400).json({ error: 'Total size exceeds 5 GB limit.' });
    }

    // Check if a bundle with same name+key already exists — overwrite it
    await FileBundle.deleteOne({ name: name.toLowerCase().trim(), key: key.trim() });

    // Upload all files to Cloudinary
    const uploadedFiles = [];
    for (const file of req.files) {
      const resourceType = file.mimetype.startsWith('video/') ? 'video'
        : file.mimetype.startsWith('image/') ? 'image'
        : 'raw';

      const result = await uploadToCloudinary(file.buffer, {
        folder: 'dropvault',
        resource_type: resourceType,
        public_id: `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`
      });

      uploadedFiles.push({
        url: result.secure_url,
        filename: file.originalname,
        type: file.mimetype,
        size: file.size,
        publicId: result.public_id
      });
    }

    // Save to MongoDB
    const bundle = new FileBundle({
      name: name.toLowerCase().trim(),
      key: key.trim(),
      files: uploadedFiles,
      totalSize
    });
    await bundle.save();

    res.json({
      success: true,
      message: 'Files uploaded successfully!',
      fileCount: uploadedFiles.length,
      totalSize
    });

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed: ' + err.message });
  }
});

module.exports = router;
