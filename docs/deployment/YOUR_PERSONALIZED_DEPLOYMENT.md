# 🚀 Your Personalized Deployment Guide

## ✅ Your VPS Information

Based on your Hostinger VPS details:

- **Server IP:** `93.127.206.164`
- **SSH Username:** `root`
- **Operating System:** Ubuntu 22.04 LTS
- **Server Location:** India - Mumbai
- **Hostname:** `srv1226397.hstgr.cloud`

---

## 📋 STEP 1: Connect to Your Server

### On Windows (Using PuTTY):

1. **Download PuTTY:** https://www.putty.org/
2. **Open PuTTY**
3. **Enter these details:**
   - Host Name: `93.127.206.164`
   - Port: `22`
   - Connection Type: `SSH`
   - Click "Open"
4. **Login:**
   - Username: `root`
   - Password: (Enter your Hostinger password)

### On Mac/Linux (Using Terminal):

```bash
ssh root@93.127.206.164
```

**Enter your password when asked.**

**✅ You're now connected to your server!**

---

## 📋 STEP 2: Install Required Software

**Copy and paste these commands one by one:**

```bash
# Update your server
apt update && apt upgrade -y
```

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

```bash
# Verify Node.js installed
node --version
# Should show: v20.x.x
```

```bash
# Install PM2 (keeps your app running)
npm install -g pm2
```

```bash
# Install Nginx (web server)
apt install -y nginx
```

```bash
# Install Git
apt install -y git
```

```bash
# Install Certbot (for SSL certificates)
apt install -y certbot python3-certbot-nginx
```

**✅ All software installed!**

---

## 📋 STEP 3: Set Up MongoDB Atlas

**If you haven't done this yet:**

1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create FREE cluster (M0)
4. Create database user (save the password!)
5. Add IP to whitelist: `93.127.206.164` (your server IP)
6. Get connection string

**Your connection string will look like:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gold-silver-app?retryWrites=true&w=majority
```

**⚠️ Save this connection string - you'll need it!**

---

## 📋 STEP 4: Upload Your Backend Code

### Option A: Using FileZilla (Easiest)

1. **Download FileZilla:** https://filezilla-project.org/
2. **Connect:**
   - Host: `sftp://93.127.206.164`
   - Username: `root`
   - Password: (Your Hostinger password)
   - Port: `22`
   - Click "Quickconnect"

3. **Upload Backend:**
   - LEFT side: Find your `backend` folder on your computer
   - RIGHT side: Navigate to `/var/www/`
   - Create folder: `goldapp-backend` (right-click → Create directory)
   - Drag entire `backend` folder to `/var/www/goldapp-backend/`

### Option B: Using Git

```bash
cd /var/www
git clone https://github.com/your-username/your-repo.git goldapp-backend
cd goldapp-backend
```

**✅ Backend code uploaded!**

---

## 📋 STEP 5: Install Backend Dependencies

```bash
cd /var/www/goldapp-backend
npm install --production
```

**Wait 1-2 minutes for installation to complete.**

---

## 📋 STEP 6: Create Environment File

```bash
nano .env
```

**Paste this (replace with YOUR actual values):**

```env
# MongoDB Connection (replace with your actual connection string)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gold-silver-app?retryWrites=true&w=majority

# JWT Secret (generate one below)
JWT_SECRET=CHANGE_THIS_TO_RANDOM_STRING

# Server Port
PORT=3001

# Environment
NODE_ENV=production

# Allowed Origins (replace 'yourdomain.com' with YOUR actual domain)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**To save:**
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

---

## 📋 STEP 7: Generate JWT Secret

```bash
openssl rand -base64 32
```

**Copy the output** (it will be a long random string)

**Now edit your .env file again:**
```bash
nano .env
```

**Replace `JWT_SECRET=CHANGE_THIS_TO_RANDOM_STRING` with:**
```
JWT_SECRET=<paste the generated string here>
```

**Save:** `Ctrl + X`, `Y`, `Enter`

---

## 📋 STEP 8: Create Logs Directory

```bash
cd /var/www/goldapp-backend
mkdir -p logs
chmod 755 logs
```

---

## 📋 STEP 9: Start Your Backend

```bash
cd /var/www/goldapp-backend
pm2 start ecosystem.config.js --env production
```

```bash
# Save PM2 configuration
pm2 save
```

```bash
# Make it start automatically on server restart
pm2 startup
```

**It will show a command like:**
```
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u root --hp /root
```

**Copy and run that exact command it shows you.**

**✅ Backend is now running!**

**Check if it's working:**
```bash
pm2 status
# Should show "goldapp-backend" as "online" (green)
```

**Test the API:**
```bash
curl http://localhost:3001/api/prices
# Should return JSON data
```

---

## 📋 STEP 10: Configure Firewall

```bash
# Allow SSH (important!)
ufw allow 22/tcp

# Allow HTTP
ufw allow 80/tcp

# Allow HTTPS
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

---

## 📋 STEP 11: Configure Nginx

**First, let's copy the configuration file:**

```bash
cd /var/www/goldapp-backend
cp nginx/goldapp-combined.conf /etc/nginx/sites-available/goldapp
```

**Now edit it with YOUR domain:**

```bash
nano /etc/nginx/sites-available/goldapp
```

**Find and replace ALL occurrences of `yourdomain.com` with YOUR actual domain:**
- Press `Ctrl + W` to search
- Type: `yourdomain.com`
- Replace with: `your-actual-domain.com`
- Press `Enter`
- Repeat until all are replaced (usually 4-5 times)

**Save:** `Ctrl + X`, `Y`, `Enter`

**Enable the site:**
```bash
ln -s /etc/nginx/sites-available/goldapp /etc/nginx/sites-enabled/
```

**Remove default site (optional):**
```bash
rm /etc/nginx/sites-enabled/default
```

**Test configuration:**
```bash
nginx -t
# Should say: "syntax is ok" and "test is successful"
```

**Reload Nginx:**
```bash
systemctl reload nginx
```

**✅ Nginx configured!**

---

## 📋 STEP 12: Set Up Your Domain DNS

**In your domain registrar (where you bought your domain):**

1. **Go to DNS settings**
2. **Add/Edit A Record:**
   - Type: `A`
   - Name: `@` (or leave blank)
   - Value: `93.127.206.164`
   - TTL: `3600`
   - Save

3. **Add/Edit A Record for www:**
   - Type: `A`
   - Name: `www`
   - Value: `93.127.206.164`
   - TTL: `3600`
   - Save

**Wait 5-30 minutes for DNS to update.**

**Test if DNS is working:**
```bash
ping yourdomain.com
# Should show: 93.127.206.164
```

---

## 📋 STEP 13: Install SSL Certificate (HTTPS)

**Replace `yourdomain.com` with YOUR actual domain:**

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**It will ask you:**
1. **Email address:** Enter your email
2. **Terms of Service:** Type `A` and press Enter
3. **Share email:** Type `N` and press Enter
4. **Redirect HTTP to HTTPS:** Type `2` and press Enter

**✅ SSL certificate installed!**

**Test it:**
- Open browser: `https://yourdomain.com`
- Should show padlock icon 🔒

---

## 📋 STEP 14: Upload and Start Frontend

### Upload Frontend Code:

**Using FileZilla:**
- Connect to `sftp://93.127.206.164`
- Upload `frontend` folder to `/var/www/goldapp-frontend/`

### Install Dependencies:

```bash
cd /var/www/goldapp-frontend
npm install
```

### Create Environment File:

```bash
nano .env.production
```

**Paste (replace with YOUR domain):**
```env
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

**Save:** `Ctrl + X`, `Y`, `Enter`

### Build Frontend:

```bash
npm run build
```

**Wait 2-5 minutes for build to complete.**

### Start Frontend:

```bash
pm2 start npm --name "goldapp-frontend" -- start
pm2 save
```

**✅ Frontend is running!**

**Check status:**
```bash
pm2 status
# Should show both "goldapp-backend" and "goldapp-frontend" as online
```

---

## 📋 STEP 15: Update Mobile App API URLs

### For Android App:

1. **Open:** `mobile/src/api/client.ts` (on your computer)
2. **Find line 19:**
   ```typescript
   const PRODUCTION_API_URL = 'https://your-domain.com/api';
   ```
3. **Change to:**
   ```typescript
   const PRODUCTION_API_URL = 'https://yourdomain.com/api';
   ```
4. **Save**

### For iOS App:

1. **Open:** `ios/src/api/client.ts` (on your computer)
2. **Find the production URL line**
3. **Change to your actual domain**
4. **Save**

---

## ✅ Testing Checklist

### Test Backend API:
- [ ] Visit: `https://yourdomain.com/api/prices`
- [ ] Should see JSON data (not error page)

### Test Frontend:
- [ ] Visit: `https://yourdomain.com`
- [ ] Should see your website
- [ ] Try to login/register
- [ ] Check browser console (F12) - no errors

### Test PM2:
```bash
pm2 status
```
- [ ] Both apps show as "online" (green)

---

## 🐛 Quick Troubleshooting

### Backend Not Running?

```bash
# Check status
pm2 status

# View logs
pm2 logs goldapp-backend

# Restart
pm2 restart goldapp-backend
```

### Can't Access Website?

```bash
# Check Nginx
systemctl status nginx

# Check Nginx logs
tail -f /var/log/nginx/error.log

# Test Nginx config
nginx -t
```

### MongoDB Connection Failed?

1. Check MongoDB Atlas IP whitelist includes: `93.127.206.164`
2. Verify connection string in `.env` file
3. Check password is correct

---

## 📞 Quick Commands Reference

```bash
# Check if apps are running
pm2 status

# View backend logs
pm2 logs goldapp-backend

# View frontend logs
pm2 logs goldapp-frontend

# Restart everything
pm2 restart all

# Check Nginx
systemctl status nginx

# Restart Nginx
systemctl reload nginx
```

---

## 🎉 You're Done!

Your app should now be:
- ✅ Running on: `https://yourdomain.com`
- ✅ Backend API: `https://yourdomain.com/api`
- ✅ Secure (HTTPS with SSL)
- ✅ Auto-restarting if it crashes

**Test it:**
1. Visit `https://yourdomain.com` in your browser
2. Try to login/register
3. Check if everything works

---

## 📝 Important Notes

1. **Your Server IP:** `93.127.206.164` (use this for DNS A records)
2. **SSH Command:** `ssh root@93.127.206.164`
3. **Server Location:** Mumbai, India (good for Indian users)
4. **Always backup:** Your `.env` file before making changes

---

## 🆘 Need Help?

**Check logs first:**
```bash
pm2 logs
```

**Check Nginx:**
```bash
tail -f /var/log/nginx/error.log
```

**Restart everything:**
```bash
pm2 restart all
systemctl reload nginx
```

---

**🎯 Follow these steps one by one, and your app will be live!**

