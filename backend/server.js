const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const app = express();

// ─── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── MongoDB Connection ────────────────────────────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ─── Routes ───────────────────────────────────────────────────
app.use('/api/upload', require('./routes/upload'));
app.use('/api/download', require('./routes/download'));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'DropVault API running', time: new Date().toISOString() });
});

// ─── Auto-delete cron (runs every hour) ───────────────────────
cron.schedule('0 * * * *', async () => {
  try {
    const FileBundle = require('./models/FileBundle');
    const cutoff = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    const result = await FileBundle.deleteMany({ createdAt: { $lt: cutoff } });
    if (result.deletedCount > 0) {
      console.log(`🗑️  Deleted ${result.deletedCount} expired bundle(s)`);
    }
  } catch (err) {
    console.error('Cleanup error:', err);
  }
});

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
