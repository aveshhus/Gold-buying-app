# 🚀 Complete Production Deployment Guide

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Essential Questions](#essential-questions)
3. [Backend Production Setup](#backend-production-setup)
4. [Database Connection](#database-connection)
5. [VPS Server Setup](#vps-server-setup)
6. [Nginx Configuration](#nginx-configuration)
7. [SSL Setup (HTTPS)](#ssl-setup-https)
8. [Frontend Production Build](#frontend-production-build)
9. [Mobile Build Preparation](#mobile-build-preparation)
10. [Final Testing Checklist](#final-testing-checklist)

---

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ Hostinger VPS with Ubuntu Linux
- ✅ SSH access to your VPS
- ✅ Domain name (or subdomain) configured
- ✅ MongoDB Atlas account (or local MongoDB)
- ✅ Basic knowledge of Linux commands

---

## ❓ Essential Questions

**Please provide the following information before proceeding:**

1. **Domain Name:**
   - Main domain: `_________________`
   - API subdomain (optional): `api._________________`

2. **MongoDB Choice:**
   - [ ] MongoDB Atlas (Cloud - Recommended)
   - [ ] Local MongoDB on VPS

3. **Deployment Structure:**
   - [ ] Frontend and Backend on same domain (`yourdomain.com` and `yourdomain.com/api`)
   - [ ] Separate subdomains (`yourdomain.com` and `api.yourdomain.com`)

4. **Email Service (for OTP):**
   - [ ] Gmail
   - [ ] Other (specify): `_________________`

---

## 🔧 Backend Production Setup

### Step 1: Connect to Your VPS

```bash
ssh root@your-server-ip
# OR
ssh root@yourdomain.com
```

### Step 2: Run Deployment Script

```bash
# Upload backend folder to /var/www/goldapp-backend
# Then run:
cd /var/www/goldapp-backend
chmod +x deploy-production.sh
./deploy-production.sh
```

**OR manually install:**

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install PM2
npm install -g pm2

# Install Nginx
apt install -y nginx

# Install Git
apt install -y git
```

### Step 3: Install Dependencies

```bash
cd /var/www/goldapp-backend
npm install --production
```

### Step 4: Configure Environment Variables

```bash
nano .env
```

**Required variables:**

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gold-silver-app?retryWrites=true&w=majority

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-generated-secret-key-here

# Server Port
PORT=3001

# Node Environment
NODE_ENV=production

# Allowed Origins (comma-separated, no spaces)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://api.yourdomain.com

# Email (optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Generate JWT Secret:**
```bash
openssl rand -base64 32
```

### Step 5: Create Logs Directory

```bash
mkdir -p logs
chmod 755 logs
```

---

## 🗄️ Database Connection

### Option A: MongoDB Atlas (Recommended)

1. **Create Account:**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account

2. **Create Cluster:**
   - Choose free M0 tier
   - Select region closest to your server
   - Create cluster

3. **Create Database User:**
   - Go to Database Access
   - Add new user
   - Username: `goldapp-user`
   - Password: Generate secure password
   - Save credentials

4. **Whitelist IP:**
   - Go to Network Access
   - Add IP Address
   - Add your VPS IP: `your-server-ip`
   - OR use `0.0.0.0/0` for all IPs (less secure)

5. **Get Connection String:**
   - Go to Clusters → Connect
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your database user password
   - Update `MONGODB_URI` in `.env`

### Option B: Local MongoDB

```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt update
apt install -y mongodb-org

# Start MongoDB
systemctl start mongod
systemctl enable mongod

# Update .env
MONGODB_URI=mongodb://localhost:27017/gold-silver-app
```

---

## 🖥️ VPS Server Setup

### Step 1: Start Backend with PM2

```bash
cd /var/www/goldapp-backend

# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command it outputs (usually: sudo env PATH=... pm2 startup systemd -u root --hp /root)
```

### Step 2: Verify Backend is Running

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs goldapp-backend

# Test API locally
curl http://localhost:3001/api/prices
```

### Step 3: Configure Firewall

```bash
# Allow SSH (if not already allowed)
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

---

## 🌐 Nginx Configuration

### Option 1: Combined Setup (Same Domain)

**Use this if:** Frontend and Backend on same domain

```bash
# Copy configuration
cp nginx/goldapp-combined.conf /etc/nginx/sites-available/goldapp

# Edit with your domain
nano /etc/nginx/sites-available/goldapp
# Replace 'yourdomain.com' with your actual domain

# Enable site
ln -s /etc/nginx/sites-available/goldapp /etc/nginx/sites-enabled/

# Remove default site (optional)
rm /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

### Option 2: Separate Subdomains

**Use this if:** Frontend on `yourdomain.com`, Backend on `api.yourdomain.com`

```bash
# Frontend configuration
cp nginx/goldapp-frontend.conf /etc/nginx/sites-available/goldapp-frontend
nano /etc/nginx/sites-available/goldapp-frontend
ln -s /etc/nginx/sites-available/goldapp-frontend /etc/nginx/sites-enabled/

# Backend configuration
cp nginx/goldapp-backend.conf /etc/nginx/sites-available/goldapp-backend
nano /etc/nginx/sites-available/goldapp-backend
ln -s /etc/nginx/sites-available/goldapp-backend /etc/nginx/sites-enabled/

# Test and reload
nginx -t
systemctl reload nginx
```

---

## 🔒 SSL Setup (HTTPS)

### Install Certbot

```bash
apt install -y certbot python3-certbot-nginx
```

### Get SSL Certificate

**For combined setup:**
```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**For separate subdomains:**
```bash
# Frontend
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Backend
certbot --nginx -d api.yourdomain.com
```

### Auto-Renewal

Certbot automatically sets up renewal. Test with:

```bash
certbot renew --dry-run
```

---

## 🎨 Frontend Production Build

### Step 1: Update API Configuration

Edit `frontend/lib/api.ts`:

```typescript
// Update to use environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
```

Edit `frontend/next.config.js`:

```javascript
// Already updated to use environment variables
// Just set NEXT_PUBLIC_API_URL in production
```

### Step 2: Set Environment Variables

Create `frontend/.env.production`:

```env
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
# OR if separate subdomain:
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

### Step 3: Build Frontend

**On your local machine or VPS:**

```bash
cd frontend
npm install
npm run build
```

### Step 4: Deploy Frontend to VPS

**Option A: Upload Built Files**

```bash
# On VPS
mkdir -p /var/www/goldapp-frontend
# Upload entire frontend folder via SFTP
```

**Option B: Build on VPS**

```bash
# On VPS
cd /var/www/goldapp-frontend
npm install --production
npm run build
```

### Step 5: Start Frontend with PM2

```bash
cd /var/www/goldapp-frontend
pm2 start npm --name "goldapp-frontend" -- start
pm2 save
```

---

## 📱 Mobile Build Preparation

### Step 1: Update API URLs

**For Android/iOS (mobile folder):**

Edit `mobile/src/api/client.ts`:

```typescript
// Update production URL
const PRODUCTION_API_URL = 'https://yourdomain.com/api';
// OR if separate subdomain:
// const PRODUCTION_API_URL = 'https://api.yourdomain.com/api';
```

**For iOS (ios folder):**

Edit `ios/src/api/client.ts`:

```typescript
// Update production URL
const API_BASE_URL = __DEV__
  ? 'http://localhost:3001/api'
  : 'https://yourdomain.com/api';
```

### Step 2: Build Android APK

```bash
cd mobile

# For production build
npm run build:android:production

# OR for local build
npm run build:android:local
```

**Output:** `mobile/android/app/build/outputs/apk/release/app-release.apk`

### Step 3: Build iOS App

**Requires macOS with Xcode:**

```bash
cd ios

# Install pods
cd ios && pod install && cd ..

# Build for production
eas build --platform ios --profile production
```

---

## ✅ Final Testing Checklist

### Backend Tests

- [ ] Backend accessible: `https://yourdomain.com/api` or `https://api.yourdomain.com/api`
- [ ] Health check: `curl https://yourdomain.com/api/prices`
- [ ] MongoDB connection working
- [ ] PM2 process running: `pm2 status`
- [ ] Logs show no errors: `pm2 logs goldapp-backend`

### Frontend Tests

- [ ] Frontend accessible: `https://yourdomain.com`
- [ ] Can login/register
- [ ] API calls working
- [ ] Images loading
- [ ] No console errors

### Mobile Tests

- [ ] Android APK installs and runs
- [ ] iOS app builds successfully
- [ ] Can connect to production API
- [ ] Login/register works
- [ ] All features functional

### Security Tests

- [ ] HTTPS working (no mixed content)
- [ ] CORS configured correctly
- [ ] JWT_SECRET is strong and secure
- [ ] MongoDB credentials secure
- [ ] Environment variables not in Git

### Performance Tests

- [ ] Page load times acceptable
- [ ] API response times < 500ms
- [ ] No memory leaks (check PM2)
- [ ] SSL certificate valid

---

## 🔄 Update Process

### Update Backend

```bash
cd /var/www/goldapp-backend
git pull  # If using Git
# OR upload new files via SFTP

npm install --production
pm2 restart goldapp-backend
```

### Update Frontend

```bash
cd /var/www/goldapp-frontend
git pull  # If using Git
# OR upload new files via SFTP

npm install
npm run build
pm2 restart goldapp-frontend
```

---

## 🐛 Troubleshooting

### Backend Not Starting

```bash
# Check PM2 logs
pm2 logs goldapp-backend

# Check if port is in use
netstat -tulpn | grep 3001

# Restart PM2
pm2 restart all
```

### CORS Errors

- Check `ALLOWED_ORIGINS` in `.env`
- Ensure domain matches exactly (including https://)
- Restart backend after changing `.env`

### MongoDB Connection Failed

- Verify connection string in `.env`
- Check MongoDB Atlas IP whitelist
- Test connection: `mongosh "your-connection-string"`

### SSL Certificate Issues

```bash
# Renew certificate
certbot renew

# Check certificate status
certbot certificates
```

---

## 📞 Support

If you encounter issues:

1. Check PM2 logs: `pm2 logs`
2. Check Nginx logs: `tail -f /var/log/nginx/error.log`
3. Check system logs: `journalctl -u nginx`
4. Verify environment variables: `cat .env`

---

## 🎯 Quick Reference Commands

```bash
# PM2
pm2 status
pm2 logs goldapp-backend
pm2 restart goldapp-backend
pm2 stop goldapp-backend

# Nginx
nginx -t
systemctl reload nginx
systemctl status nginx

# SSL
certbot renew
certbot certificates

# MongoDB (if local)
systemctl status mongod
mongosh
```

---

**🎉 Your application is now production-ready!**

Follow this guide step-by-step, and your GoldApp will be live and accessible from anywhere in the world.

