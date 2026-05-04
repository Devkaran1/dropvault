const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  url: { type: String, required: true },
  filename: { type: String, required: true },
  type: { type: String, default: 'application/octet-stream' },
  size: { type: Number, default: 0 },
  publicId: { type: String } // cloudinary public_id for deletion
});

const fileBundleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true   // store lowercase so "Rahul" == "rahul"
  },
  key: {
    type: String,
    required: true,
    trim: true
  },
  files: [fileSchema],
  totalSize: { type: Number, default: 0 },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 172800   // MongoDB TTL: auto-delete after 172800 seconds = 48 hours
  }
});

module.exports = mongoose.model('FileBundle', fileBundleSchema);
