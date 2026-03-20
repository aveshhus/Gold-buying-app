# 🌐 Hostinger Frontend (Web App) Deployment Guide

## 📋 What to Upload to Hostinger

You need to upload **BOTH**:
1. **Frontend** (Next.js web app) - For your website
2. **Backend** (Node.js API) - For API endpoints

But they can be on **different servers** or the **same server**.

---

## 🎯 Deployment Options

### Option 1: Both on Same Hostinger VPS (Recommended)

**Best for:** Full control, same server

```
Hostinger VPS
├── Frontend (Next.js) → Port 3000 or 80/443
└── Backend (Express) → Port 3001
```

### Option 2: Frontend on Hostinger, Backend Separate

**Best for:** Shared hosting for frontend, VPS for backend

```
Hostinger Shared Hosting → Frontend (Static or Next.js)
Hostinger VPS → Backend (Express API)
```

### Option 3: Frontend Static Export on Hostinger

**Best for:** Shared hosting without Node.js support

```
Hostinger Shared Hosting → Static HTML/CSS/JS files
Hostinger VPS → Backend (Express API)
```

---

## 🚀 Option 1: Deploy Both on Same VPS (Recommended)

### Step 1: Upload Frontend Code

```bash
# On your Hostinger VPS
cd /var/www
mkdir -p goldapp-frontend
cd goldapp-frontend

# Upload frontend folder via SFTP or Git
```

### Step 2: Install Dependencies

```bash
cd /var/www/goldapp-frontend
npm install --production
```

### Step 3: Update Frontend API Configuration

Edit `frontend/lib/api.ts`:

```typescript
// Change from:
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// To your live backend URL:
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-domain.com/api';
// OR if backend is on same server:
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
```

Edit `frontend/next.config.js`:

```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      // Change to your live backend URL
      destination: 'https://your-domain.com/api/:path*',
      // OR if same server:
      // destination: 'http://localhost:3001/api/:path*',
    },
  ];
},
```

### Step 4: Build Frontend

```bash
cd /var/www/goldapp-frontend
npm run build
```

This creates a `.next` folder with optimized production files.

### Step 5: Configure Nginx for Frontend

```bash
nano /etc/nginx/sites-available/goldapp-frontend
```

Add configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API (if on same server)
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Enable site:**
```bash
ln -s /etc/nginx/sites-available/goldapp-frontend /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 6: Start Frontend with PM2

```bash
cd /var/www/goldapp-frontend
pm2 start npm --name "goldapp-frontend" -- start
pm2 save
```

### Step 7: Install SSL

```bash
certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## 🚀 Option 2: Static Export (For Shared Hosting)

If Hostinger shared hosting doesn't support Node.js:

### Step 1: Update Next.js Config for Static Export

Edit `frontend/next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export
  reactStrictMode: true,
  images: {
    unoptimized: true, // Required for static export
  },
  // Remove rewrites - not supported in static export
  // Instead, update API calls to use full URL
};

module.exports = nextConfig;
```

### Step 2: Update API Calls

Edit `frontend/lib/api.ts`:

```typescript
// Use environment variable or direct URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-backend-domain.com/api';
```

### Step 3: Build Static Files

```bash
cd frontend
npm run build
```

This creates an `out` folder with static HTML/CSS/JS files.

### Step 4: Upload to Hostinger

Upload the entire `out` folder contents to:
- `public_html/` (for main domain)
- `public_html/subdomain/` (for subdomain)

### Step 5: Configure Backend URL

Create `.env.production` or update API URL in code:

```typescript
// In lib/api.ts
const API_BASE_URL = 'https://your-backend-domain.com/api';
```

---

## 📁 What Files to Upload

### For VPS (Node.js):

**Frontend:**
```
frontend/
├── app/
├── components/
├── lib/
├── public/
├── store/
├── types/
├── package.json
├── next.config.js
├── tsconfig.json
└── tailwind.config.ts
```

**Backend:**
```
backend/
├── config/
├── models/
├── public/
├── scripts/
├── server.js
├── package.json
└── .env (create on server)
```

### For Shared Hosting (Static):

**Frontend (after build):**
```
out/  (entire folder contents)
├── _next/
├── index.html
├── dashboard.html
└── ... (all static files)
```

**Backend:** (Still needs VPS or separate server)

---

## 🔧 Complete Setup Example (Same VPS)

### Directory Structure:

```
/var/www/
├── goldapp-frontend/    # Next.js frontend
│   ├── app/
│   ├── components/
│   ├── .next/          # Built files
│   └── package.json
│
└── goldapp-backend/     # Express backend
    ├── server.js
    ├── models/
    └── package.json
```

### PM2 Configuration:

```bash
# Start backend
cd /var/www/goldapp-backend
pm2 start server.js --name goldapp-backend

# Start frontend
cd /var/www/goldapp-frontend
pm2 start npm --name "goldapp-frontend" -- start

# Save and enable auto-start
pm2 save
pm2 startup
```

### Nginx Configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🔄 Update Process

### Update Frontend:

```bash
cd /var/www/goldapp-frontend
git pull  # If using Git
# OR upload new files via SFTP

npm install
npm run build
pm2 restart goldapp-frontend
```

### Update Backend:

```bash
cd /var/www/goldapp-backend
git pull  # If using Git
# OR upload new files via SFTP

npm install
pm2 restart goldapp-backend
```

---

## 📝 Environment Variables

### Frontend `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

### Backend `.env`:

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
PORT=3001
```

---

## ✅ Quick Checklist

### Frontend:
- [ ] Frontend code uploaded
- [ ] Dependencies installed (`npm install`)
- [ ] API URL updated in `lib/api.ts`
- [ ] `next.config.js` updated
- [ ] Built for production (`npm run build`)
- [ ] PM2 process running
- [ ] Nginx configured
- [ ] SSL certificate installed

### Backend:
- [ ] Backend code uploaded
- [ ] Dependencies installed
- [ ] `.env` file configured
- [ ] MongoDB Atlas connected
- [ ] PM2 process running
- [ ] Nginx configured (if separate)
- [ ] SSL certificate installed

---

## 🎯 Recommended Setup

**For Best Performance:**

1. **Frontend:** Hostinger VPS with Next.js
2. **Backend:** Same VPS or separate VPS
3. **Database:** MongoDB Atlas (cloud)
4. **CDN:** Cloudflare (optional, for static assets)

**Domain Setup:**
- `yourdomain.com` → Frontend
- `api.yourdomain.com` → Backend (optional subdomain)

---

## 💡 Summary

**What to Upload:**

1. **Frontend folder** (`frontend/`) - For web app
2. **Backend folder** (`backend/`) - For API

**Where:**
- **VPS:** Both can run on same server
- **Shared Hosting:** Frontend as static files, backend on VPS

**Key Changes:**
- Update API URLs in frontend code
- Update `next.config.js` rewrites
- Configure Nginx for both
- Use PM2 to run both processes

---

**Both frontend and backend are needed for a complete web application!** 🚀




