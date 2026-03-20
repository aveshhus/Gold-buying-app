# 📤 What to Upload to Hostinger - Simple Guide

## 🎯 Quick Answer

You need to upload **BOTH**:
1. ✅ **Frontend** (Web App) - What users see in browser
2. ✅ **Backend** (API Server) - Handles data and logic

---

## 📁 What Each Does

### Frontend (`frontend/` folder)
- **What it is:** Your website/web app (Next.js)
- **What users see:** Login page, dashboard, forms, etc.
- **Files:** HTML, CSS, JavaScript, React components
- **Runs on:** Port 3000 (or 80/443 with Nginx)

### Backend (`backend/` folder)
- **What it is:** API server (Express.js)
- **What it does:** Handles login, database, payments, etc.
- **Files:** `server.js`, models, routes
- **Runs on:** Port 3001

---

## 🚀 Deployment Options

### Option 1: Both on Same VPS (Recommended) ⭐

**Best for:** Full control, easier management

```
Hostinger VPS
├── Frontend → yourdomain.com
└── Backend → yourdomain.com/api
```

**What to upload:**
- ✅ Entire `frontend/` folder
- ✅ Entire `backend/` folder

### Option 2: Frontend Static, Backend Separate

**Best for:** Shared hosting for frontend

```
Hostinger Shared Hosting → Frontend (static files)
Hostinger VPS → Backend (API)
```

**What to upload:**
- ✅ Frontend: Built static files (`out/` folder after `npm run build`)
- ✅ Backend: Entire `backend/` folder

---

## 📦 Step-by-Step: Upload Both to VPS

### Step 1: Prepare Files Locally

**Frontend:**
```bash
cd frontend
# No need to build yet, we'll build on server
```

**Backend:**
```bash
cd backend
# Ready to upload
```

### Step 2: Upload to Hostinger VPS

**Using SFTP (FileZilla, WinSCP):**
1. Connect to your Hostinger VPS
2. Navigate to `/var/www/`
3. Upload `frontend/` folder → `/var/www/goldapp-frontend/`
4. Upload `backend/` folder → `/var/www/goldapp-backend/`

**Using Git (Recommended):**
```bash
# On server
cd /var/www
git clone https://github.com/your-username/your-repo.git goldapp
cd goldapp
```

### Step 3: Install Dependencies

**Backend:**
```bash
cd /var/www/goldapp-backend
npm install --production
```

**Frontend:**
```bash
cd /var/www/goldapp-frontend
npm install --production
```

### Step 4: Configure Backend

```bash
cd /var/www/goldapp-backend
nano .env
```

Add:
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
PORT=3001
```

### Step 5: Configure Frontend

Edit `frontend/lib/api.ts`:
```typescript
// Change to your backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://yourdomain.com/api';
```

Edit `frontend/next.config.js`:
```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: 'https://yourdomain.com/api/:path*', // Your backend URL
    },
  ];
},
```

### Step 6: Build Frontend

```bash
cd /var/www/goldapp-frontend
npm run build
```

### Step 7: Start Both Services

**Backend:**
```bash
cd /var/www/goldapp-backend
pm2 start server.js --name goldapp-backend
```

**Frontend:**
```bash
cd /var/www/goldapp-frontend
pm2 start npm --name "goldapp-frontend" -- start
```

**Save PM2:**
```bash
pm2 save
pm2 startup
```

### Step 8: Configure Nginx

```bash
nano /etc/nginx/sites-available/goldapp
```

Add:
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
    }
}
```

Enable:
```bash
ln -s /etc/nginx/sites-available/goldapp /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Step 9: Install SSL

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 📋 File Upload Checklist

### Backend Files:
- [ ] `backend/server.js`
- [ ] `backend/package.json`
- [ ] `backend/config/` folder
- [ ] `backend/models/` folder
- [ ] `backend/public/` folder (if any)
- [ ] Create `.env` file on server

### Frontend Files:
- [ ] `frontend/app/` folder
- [ ] `frontend/components/` folder
- [ ] `frontend/lib/` folder
- [ ] `frontend/public/` folder
- [ ] `frontend/package.json`
- [ ] `frontend/next.config.js`
- [ ] `frontend/tsconfig.json`
- [ ] `frontend/tailwind.config.ts`

### Don't Upload:
- ❌ `node_modules/` (install on server)
- ❌ `.next/` (build on server)
- ❌ `.env` files (create on server)
- ❌ `.git/` (optional)

---

## 🎯 Quick Summary

**What to Upload:**
1. ✅ **Frontend folder** - Your web app
2. ✅ **Backend folder** - Your API server

**Where:**
- Both can go on same VPS
- Or frontend on shared hosting, backend on VPS

**After Upload:**
1. Install dependencies (`npm install`)
2. Configure environment variables
3. Build frontend (`npm run build`)
4. Start with PM2
5. Configure Nginx
6. Install SSL

---

## 💡 Pro Tips

1. **Use Git:** Upload once, update with `git pull`
2. **Separate Domains:** 
   - `yourdomain.com` → Frontend
   - `api.yourdomain.com` → Backend
3. **Environment Variables:** Never commit `.env` files
4. **PM2:** Keeps services running, auto-restarts on crash

---

**You need BOTH frontend and backend for a complete web application!** 🚀

Frontend = What users see
Backend = What makes it work




