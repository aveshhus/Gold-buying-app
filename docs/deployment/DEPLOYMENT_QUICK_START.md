# ⚡ Quick Start - 5 Minute Overview

## 🎯 What You're Doing (Simple Version)

You're putting your app on the internet in 3 main steps:

```
1. Put Backend on Server  →  2. Put Frontend on Server  →  3. Connect Domain
     (Your API)                    (Your Website)              (Your Address)
```

---

## 📝 The 3 Main Steps

### STEP 1: Backend (Your API Server)
**What:** The brain of your app that handles data
**Where:** Goes in `/var/www/goldapp-backend/`
**How:** Upload code → Install → Configure → Start

### STEP 2: Frontend (Your Website)
**What:** What users see in their browser
**Where:** Goes in `/var/www/goldapp-frontend/`
**How:** Upload code → Build → Start

### STEP 3: Domain & SSL (Your Address)
**What:** Makes your app accessible via `https://yourdomain.com`
**How:** Point domain to server → Install SSL certificate

---

## 🔢 Step-by-Step (Super Simple)

### Before You Start - Get These Ready:

1. **Domain name:** `_________________`
2. **Server IP:** `_________________`
3. **MongoDB connection string:** `_________________`

---

## 🚀 The Process (Copy-Paste Commands)

### Part 1: Setup Server (Do this ONCE)

```bash
# Connect to server
ssh root@your-server-ip

# Install everything
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx git
npm install -g pm2
```

**✅ Done! Server is ready**

---

### Part 2: Backend (5 minutes)

```bash
# Go to backend folder
cd /var/www/goldapp-backend

# Install packages
npm install --production

# Create config file
nano .env
# (Paste your MongoDB connection and domain)

# Start it
pm2 start ecosystem.config.js --env production
pm2 save
```

**✅ Backend is running!**

---

### Part 3: Frontend (5 minutes)

```bash
# Go to frontend folder
cd /var/www/goldapp-frontend

# Install packages
npm install

# Create config
nano .env.production
# (Paste: NEXT_PUBLIC_API_URL=https://yourdomain.com/api)

# Build it
npm run build

# Start it
pm2 start npm --name "goldapp-frontend" -- start
pm2 save
```

**✅ Frontend is running!**

---

### Part 4: Domain & SSL (5 minutes)

```bash
# Setup Nginx
cp nginx/goldapp-combined.conf /etc/nginx/sites-available/goldapp
nano /etc/nginx/sites-available/goldapp
# (Replace 'yourdomain.com' with your domain - 4 times)

ln -s /etc/nginx/sites-available/goldapp /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# Get SSL certificate
apt install -y certbot python3-certbot-nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**✅ Your app is live at https://yourdomain.com!**

---

## 📋 What Goes in .env File

**Backend `.env`:**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gold-silver-app
JWT_SECRET=<run: openssl rand -base64 32>
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**Frontend `.env.production`:**
```
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

---

## ✅ Check if It's Working

1. **Backend:** Visit `https://yourdomain.com/api/prices`
   - Should see JSON (not error page)

2. **Frontend:** Visit `https://yourdomain.com`
   - Should see your website

3. **PM2:** Run `pm2 status`
   - Should show both apps as "online"

---

## 🆘 Quick Fixes

**App not working?**
```bash
pm2 restart all
pm2 logs
```

**Nginx error?**
```bash
nginx -t
systemctl reload nginx
```

**Can't connect?**
- Check if PM2 is running: `pm2 status`
- Check logs: `pm2 logs goldapp-backend`

---

## 📚 Full Details

For complete step-by-step instructions, see:
- **`SIMPLE_DEPLOYMENT_GUIDE.md`** - Detailed beginner-friendly guide
- **`PRODUCTION_DEPLOYMENT_GUIDE.md`** - Complete technical guide

---

## 🎯 Summary

**3 Things to Remember:**

1. **Backend** = Your API (handles data)
2. **Frontend** = Your website (what users see)
3. **Domain** = Your address (how people find you)

**The Process:**
```
Upload Code → Install → Configure → Start → Done!
```

**That's it!** 🎉

