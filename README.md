# 📦 DropVault — Temporary File Sharing Website

> A full-stack web application for securely sharing files with a secret key. Files auto-delete after 48 hours.

![GitHub Pages](https://img.shields.io/badge/Frontend-GitHub%20Pages-blue)
![Render](https://img.shields.io/badge/Backend-Render.com-purple)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-green)
![Cloudinary](https://img.shields.io/badge/Storage-Cloudinary-orange)
![Free](https://img.shields.io/badge/Cost-100%25%20Free-brightgreen)

---

## 🌐 Live Demo

- **Frontend:** `https://YOUR_USERNAME.github.io/dropvault`
- **Backend API:** `https://dropvault-api.onrender.com`

---

## ✨ Features

- 🔐 **Key + Name authentication** — dual verification to access files
- 📁 **Any file type** — photos, videos, PDFs, ZIPs, documents
- ⏱️ **Auto-delete in 48 hours** — files vanish automatically
- 💾 **Up to 5GB** per upload session
- 📱 **Mobile responsive** — works on all devices
- 🆓 **100% free** — no account needed for users

---

## 🏗️ Project Structure

```
dropvault/
├── frontend/               ← Hosted on GitHub Pages
│   ├── index.html          (Landing page)
│   ├── upload.html         (Upload files + set key)
│   └── download.html       (Enter key to access files)
│
├── backend/                ← Hosted on Render.com
│   ├── server.js           (Express app + cron cleanup)
│   ├── package.json
│   ├── .env.example        (Copy to .env with your credentials)
│   ├── models/
│   │   └── FileBundle.js   (MongoDB schema)
│   └── routes/
│       ├── upload.js       (POST /api/upload)
│       └── download.js     (POST /api/download)
│
├── .gitignore
└── README.md
```

---

## 🚀 Setup Guide — Step by Step

### Step 1: Fork / Clone this Repository

```bash
git clone https://github.com/YOUR_USERNAME/dropvault.git
cd dropvault
```

---

### Step 2: Set up MongoDB Atlas (Free Database)

1. Go to **[mongodb.com/atlas](https://www.mongodb.com/atlas)** → Create free account
2. Click **"Build a Database"** → Choose **M0 Free** tier
3. Set a username and password (remember these!)
4. Under **"Network Access"** → Add IP Address → **Allow access from anywhere** (`0.0.0.0/0`)
5. Click **"Connect"** → **"Connect your application"**
6. Copy the connection string — looks like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
   ```
7. Replace `<password>` with your actual password and add `dropvault` at the end:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dropvault
   ```

---

### Step 3: Set up Cloudinary (Free File Storage)

1. Go to **[cloudinary.com](https://cloudinary.com)** → Create free account
2. On the **Dashboard**, copy these 3 values:
   - `Cloud Name`
   - `API Key`
   - `API Secret`

---

### Step 4: Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in your values:
```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/dropvault
CLOUD_NAME=your_cloud_name
CLOUD_API_KEY=123456789012345
CLOUD_API_SECRET=your_api_secret_here
PORT=3001
```

---

### Step 5: Test Backend Locally

```bash
cd backend
npm install
npm start
```

You should see:
```
✅ MongoDB connected
🚀 Server running on port 3001
```

Test it: open `http://localhost:3001` in browser — you should see a JSON response.

---

### Step 6: Deploy Backend to Render.com (Free)

1. Go to **[render.com](https://render.com)** → Create free account
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub account → select your `dropvault` repo
4. Configure:
   | Setting | Value |
   |---------|-------|
   | **Root Directory** | `backend` |
   | **Build Command** | `npm install` |
   | **Start Command** | `node server.js` |
   | **Instance Type** | Free |

5. Under **"Environment Variables"**, add:
   - `MONGO_URI` = your MongoDB connection string
   - `CLOUD_NAME` = your Cloudinary cloud name
   - `CLOUD_API_KEY` = your Cloudinary API key
   - `CLOUD_API_SECRET` = your Cloudinary API secret

6. Click **"Create Web Service"**
7. Wait ~3 minutes → you get a URL like: `https://dropvault-api.onrender.com`

---

### Step 7: Update Frontend with Backend URL

Open both `frontend/upload.html` and `frontend/download.html`.

Find this line at the top of the `<script>` section:
```javascript
const API = 'https://YOUR_RENDER_URL.onrender.com';
```

Replace it with your actual Render URL:
```javascript
const API = 'https://dropvault-api.onrender.com';
```

---

### Step 8: Deploy Frontend to GitHub Pages

1. Push all your code to GitHub:
```bash
git add .
git commit -m "Complete DropVault setup"
git push origin main
```

2. In your GitHub repo → **Settings** → **Pages**
3. Under **"Source"** → Select **"Deploy from a branch"**
4. Branch: **main**, Folder: **/frontend** → Click **Save**
5. Wait ~2 minutes → your site is live at:
   ```
   https://YOUR_USERNAME.github.io/dropvault
   ```

---

## 🧪 How to Use the Website

### Uploading Files (Sender)

1. Go to `https://YOUR_USERNAME.github.io/dropvault`
2. Click **"Upload Files"**
3. Drag & drop files or click Browse (max 5GB total)
4. Enter your **Name** (e.g. `Rahul`)
5. Set a **Secret Key** (e.g. `myKey@2025`)
6. Click **"Upload & Generate Key"**
7. Share your **name** and **key** with the recipient

### Accessing Files (Receiver)

1. Go to `https://YOUR_USERNAME.github.io/dropvault`
2. Click **"Access Files"**
3. Enter the sender's **Name** and **Key**
4. Click **"Unlock & Access Files"**
5. Click **Download** or **Copy Link** for each file

---

## ⚠️ Free Tier Limitations

| Service | Free Limit | Impact |
|---------|------------|--------|
| **Render.com** | Server sleeps after 15 min idle | First request takes ~30 sec to wake up |
| **MongoDB Atlas** | 512 MB storage | Only stores metadata (file names, keys, URLs) — fine for this app |
| **Cloudinary** | 10 GB storage + 25 GB bandwidth/month | Good for student project |
| **GitHub Pages** | Unlimited | No limits for static HTML |

### ⚡ Fix Render Sleep (Optional)

Add a free uptime monitor at [uptimerobot.com](https://uptimerobot.com) to ping your Render URL every 10 minutes — keeps it awake.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js + Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| File Storage | Cloudinary CDN |
| Hosting (Frontend) | GitHub Pages |
| Hosting (Backend) | Render.com |
| Auto-cleanup | node-cron (hourly) + MongoDB TTL index |

---

## 📡 API Reference

### `POST /api/upload`

Uploads files and creates a new bundle.

**Form Data:**
| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Sender's name |
| `key` | string | Secret access key |
| `files` | File[] | Array of files (max 5GB total) |

**Response:**
```json
{
  "success": true,
  "message": "Files uploaded successfully!",
  "fileCount": 3,
  "totalSize": 1048576
}
```

---

### `POST /api/download`

Retrieves files for a valid name + key pair.

**Body (JSON):**
```json
{
  "name": "rahul",
  "key": "myKey@2025"
}
```

**Response:**
```json
{
  "success": true,
  "files": [
    {
      "url": "https://res.cloudinary.com/...",
      "filename": "photo.jpg",
      "type": "image/jpeg",
      "size": 204800
    }
  ],
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

---

## 🔒 Security Notes

- Keys are stored as plain text — for production, use bcrypt hashing
- CORS is set to `*` (all origins) — restrict in production
- Files are public on Cloudinary — use signed URLs for private files
- This is a **student project** — don't use for sensitive data

---

## 👨‍💻 Built By

**[Your Name]** — BTech Student  
Built as a learning project to understand full-stack web development, cloud storage APIs, and free hosting platforms.

---

## 📄 License

MIT License — free to use and modify.
