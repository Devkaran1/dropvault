const express = require('express');
const router = express.Router();
const FileBundle = require('../models/FileBundle');

// POST /api/download
// Body: { name: string, key: string }
router.post('/', async (req, res) => {
  try {
    const { name, key } = req.body;

    if (!name || !key) {
      return res.status(400).json({ error: 'Both name and key are required.' });
    }

    // Find bundle — name stored lowercase
    const bundle = await FileBundle.findOne({
      name: name.toLowerCase().trim(),
      key: key.trim()
    });

    if (!bundle) {
      return res.status(404).json({
        error: 'Wrong key or name. Files not found. Please check and try again.'
      });
    }

    // Extra safety check: 48-hour expiry
    const ageMs = Date.now() - new Date(bundle.createdAt).getTime();
    const LIMIT = 2 * 24 * 60 * 60 * 1000;
    if (ageMs > LIMIT) {
      await bundle.deleteOne();
      return res.status(410).json({
        error: 'These files have expired (48-hour limit). Ask the sender to re-upload.'
      });
    }

    res.json({
      success: true,
      files: bundle.files,
      fileCount: bundle.files.length,
      totalSize: bundle.totalSize,
      createdAt: bundle.createdAt
    });

  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

module.exports = router;
