# 🚀 Simple Step-by-Step Deployment Guide

## 📖 What This Guide Does

This guide will help you put your GoldApp on the internet so people can use it from anywhere.

**Think of it like this:**
- Your app is like a house
- Your VPS (server) is the land where you build it
- Your domain (like `yourdomain.com`) is the address
- MongoDB is where you store all the data

---

## 🎯 What You Need Before Starting

1. ✅ Hostinger VPS account (you have this)
2. ✅ A domain name (like `yourdomain.com`)
3. ✅ SSH access to your VPS (Hostinger gives you this)
4. ✅ Basic computer skills (copy/paste commands)

---

## 📋 STEP 1: Get Your Information Ready

**Write down these details:**

1. **Your Domain Name:** `_________________`
   - Example: `goldapp.com` or `mygoldapp.com`

2. **Your VPS IP Address:** `_________________`
   - You can find this in your Hostinger control panel

3. **Your VPS Username:** Usually `root`
4. **Your VPS Password:** `_________________`

---

## 📋 STEP 2: Set Up MongoDB (Your Database)

### Option A: Use MongoDB Atlas (FREE - Recommended) ⭐

**Why?** It's free, easy, and works from anywhere.

**Steps:**

1. **Go to:** https://www.mongodb.com/cloud/atlas
2. **Click:** "Try Free" or "Sign Up"
3. **Create account** (use email/password)
4. **Create a FREE cluster:**
   - Click "Build a Database"
   - Choose "FREE" (M0)
   - Select region closest to you
   - Click "Create"
   - Wait 3-5 minutes for it to create

5. **Create Database User:**
   - Click "Database Access" (left menu)
   - Click "Add New Database User"
   - Username: `goldapp` (or any name)
   - Password: Click "Autogenerate Secure Password" ⚠️ **SAVE THIS PASSWORD!**
   - Click "Add User"

6. **Allow Your Server to Connect:**
   - Click "Network Access" (left menu)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (or add your VPS IP)
   - Click "Confirm"

7. **Get Connection String:**
   - Click "Database" (left menu)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://goldapp:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
   - **Replace `<password>` with the password you saved**
   - **Add database name:** Change `?retryWrites=true` to `/gold-silver-app?retryWrites=true`

**✅ Save this connection string - you'll need it!**

---

## 📋 STEP 3: Connect to Your Server

### On Windows:

1. **Download PuTTY** (if you don't have it):
   - Go to: https://www.putty.org/
   - Download and install

2. **Connect:**
   - Open PuTTY
   - Host Name: `your-server-ip` (or `root@your-server-ip`)
   - Port: `22`
   - Connection Type: `SSH`
   - Click "Open"
   - Login as: `root`
   - Password: (paste your password)

### On Mac/Linux:

1. **Open Terminal**
2. **Type:**
   ```bash
   ssh root@your-server-ip
   ```
3. **Enter password** when asked

**✅ You're now connected to your server!**

---

## 📋 STEP 4: Install Required Software

**Copy and paste these commands one by one:**

```bash
# Update your server
apt update && apt upgrade -y
```

```bash
# Install Node.js (the software that runs your app)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

```bash
# Check if it worked
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
# Install Git (for downloading code)
apt install -y git
```

**✅ All software is now installed!**

---

## 📋 STEP 5: Upload Your Backend Code

### Option A: Using SFTP (FileZilla) - Easiest

1. **Download FileZilla:** https://filezilla-project.org/
2. **Connect:**
   - Host: `sftp://your-server-ip`
   - Username: `root`
   - Password: `your-password`
   - Port: `22`
   - Click "Quickconnect"

3. **Upload:**
   - On LEFT side: Find your `backend` folder on your computer
   - On RIGHT side: Go to `/var/www/`
   - Create folder: `goldapp-backend`
   - Drag entire `backend` folder to `/var/www/goldapp-backend/`

### Option B: Using Git (if your code is on GitHub)

```bash
cd /var/www
git clone https://github.com/your-username/your-repo.git goldapp-backend
cd goldapp-backend
```

**✅ Your code is now on the server!**

---

## 📋 STEP 6: Install Backend Dependencies

```bash
cd /var/www/goldapp-backend
npm install --production
```

**Wait for it to finish (takes 1-2 minutes)**

---

## 📋 STEP 7: Create Environment File

```bash
nano .env
```

**This opens a text editor. Paste this:**

```env
MONGODB_URI=mongodb+srv://goldapp:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/gold-silver-app?retryWrites=true&w=majority
JWT_SECRET=CHANGE_THIS_TO_RANDOM_STRING_AT_LEAST_32_CHARACTERS_LONG
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**Important:**
- Replace `YOUR_PASSWORD` with your MongoDB password
- Replace `cluster0.xxxxx` with your actual cluster address
- Replace `yourdomain.com` with your actual domain
- For JWT_SECRET, generate one: Run `openssl rand -base64 32` and copy the result

**To save:**
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

---

## 📋 STEP 8: Generate JWT Secret

```bash
openssl rand -base64 32
```

**Copy the output and paste it as JWT_SECRET in your .env file**

---

## 📋 STEP 9: Create Logs Folder

```bash
mkdir -p logs
chmod 755 logs
```

---

## 📋 STEP 10: Start Your Backend

```bash
pm2 start ecosystem.config.js --env production
```

```bash
# Save PM2 configuration
pm2 save
```

```bash
# Make it start automatically when server restarts
pm2 startup
# Copy and run the command it shows you (usually starts with: sudo env PATH=...)
```

**✅ Your backend is now running!**

**Check if it's working:**
```bash
pm2 status
# Should show "goldapp-backend" as "online"
```

**View logs:**
```bash
pm2 logs goldapp-backend
# Press Ctrl+C to exit
```

---

## 📋 STEP 11: Configure Nginx (Web Server)

```bash
# Copy the configuration file
cp nginx/goldapp-combined.conf /etc/nginx/sites-available/goldapp
```

```bash
# Edit it with your domain
nano /etc/nginx/sites-available/goldapp
```

**Find and replace:**
- Find: `yourdomain.com`
- Replace with: `your-actual-domain.com`
- Do this for ALL occurrences (usually 4-5 times)

**Save:** `Ctrl+X`, then `Y`, then `Enter`

```bash
# Enable the site
ln -s /etc/nginx/sites-available/goldapp /etc/nginx/sites-enabled/
```

```bash
# Remove default site (optional)
rm /etc/nginx/sites-enabled/default
```

```bash
# Test configuration
nginx -t
# Should say "syntax is ok"
```

```bash
# Restart Nginx
systemctl reload nginx
```

**✅ Nginx is configured!**

---

## 📋 STEP 12: Set Up Your Domain

**In your domain registrar (where you bought the domain):**

1. Go to DNS settings
2. Add/Edit A Record:
   - Type: `A`
   - Name: `@` (or leave blank)
   - Value: `your-server-ip`
   - TTL: `3600` (or default)
   - Save

3. Add/Edit A Record for www:
   - Type: `A`
   - Name: `www`
   - Value: `your-server-ip`
   - TTL: `3600`
   - Save

**Wait 5-30 minutes for DNS to update**

**Test if it works:**
```bash
ping yourdomain.com
# Should show your server IP
```

---

## 📋 STEP 13: Install SSL Certificate (HTTPS)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx
```

```bash
# Get SSL certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**It will ask:**
- Email: Enter your email
- Terms: Type `A` and press Enter
- Share email: Type `N` and press Enter
- Redirect HTTP to HTTPS: Type `2` and press Enter

**✅ Your site now has HTTPS!**

**Test it:**
- Open browser: `https://yourdomain.com`
- Should show a padlock icon 🔒

---

## 📋 STEP 14: Upload and Start Frontend

### Upload Frontend Code:

1. **Using FileZilla:**
   - Connect to server
   - Upload `frontend` folder to `/var/www/goldapp-frontend/`

2. **Or using Git:**
   ```bash
   cd /var/www
   git clone https://github.com/your-username/your-repo.git goldapp-frontend
   cd goldapp-frontend
   ```

### Install Dependencies:

```bash
cd /var/www/goldapp-frontend
npm install
```

### Create Environment File:

```bash
nano .env.production
```

**Paste:**
```env
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

**Save:** `Ctrl+X`, `Y`, `Enter`

### Build Frontend:

```bash
npm run build
```

**Wait 2-5 minutes for build to complete**

### Start Frontend:

```bash
pm2 start npm --name "goldapp-frontend" -- start
pm2 save
```

**✅ Frontend is now running!**

---

## 📋 STEP 15: Update Mobile App API URLs

### For Android App:

1. **Open:** `mobile/src/api/client.ts`
2. **Find:** `const PRODUCTION_API_URL = 'https://your-domain.com/api';`
3. **Change to:** `const PRODUCTION_API_URL = 'https://yourdomain.com/api';`
4. **Save**

### For iOS App:

1. **Open:** `ios/src/api/client.ts`
2. **Find the production URL line**
3. **Change to:** Your actual domain
4. **Save**

---

## 📋 STEP 16: Build Mobile Apps

### Android:

```bash
cd mobile
npm run build:android:production
```

**APK location:** `mobile/android/app/build/outputs/apk/release/app-release.apk`

### iOS (requires Mac):

```bash
cd ios
pod install
eas build --platform ios --profile production
```

---

## ✅ Testing Checklist

### Test Backend:
- [ ] Visit: `https://yourdomain.com/api/prices`
- [ ] Should see JSON data (not error)

### Test Frontend:
- [ ] Visit: `https://yourdomain.com`
- [ ] Should see your website
- [ ] Try to login/register
- [ ] Check browser console (F12) for errors

### Test Mobile:
- [ ] Install APK on phone
- [ ] Open app
- [ ] Try to login
- [ ] Check if data loads

---

## 🐛 Common Problems & Solutions

### Problem: "Cannot connect to server"
**Solution:** Check if PM2 is running:
```bash
pm2 status
```
If not running:
```bash
pm2 start ecosystem.config.js --env production
```

### Problem: "502 Bad Gateway"
**Solution:** Backend might not be running. Check:
```bash
pm2 logs goldapp-backend
```

### Problem: "CORS error"
**Solution:** Check your `.env` file:
```bash
nano .env
```
Make sure `ALLOWED_ORIGINS` has your domain with `https://`

### Problem: "MongoDB connection failed"
**Solution:** 
1. Check MongoDB Atlas IP whitelist
2. Verify connection string in `.env`
3. Check password is correct

### Problem: "Domain not working"
**Solution:**
1. Wait longer for DNS (can take up to 48 hours)
2. Check DNS settings in domain registrar
3. Verify A record points to correct IP

---

## 📞 Quick Commands Reference

```bash
# Check if backend is running
pm2 status

# View backend logs
pm2 logs goldapp-backend

# Restart backend
pm2 restart goldapp-backend

# Stop backend
pm2 stop goldapp-backend

# Check Nginx status
systemctl status nginx

# Restart Nginx
systemctl reload nginx

# View Nginx error logs
tail -f /var/log/nginx/error.log
```

---

## 🎉 You're Done!

Your app should now be:
- ✅ Accessible from anywhere
- ✅ Running on HTTPS (secure)
- ✅ Automatically restarting if it crashes
- ✅ Ready for users!

**Next Steps:**
1. Test everything thoroughly
2. Share your app with users
3. Monitor with `pm2 monit` if needed

---

## 💡 Tips

1. **Always backup:** Before making changes, backup your `.env` file
2. **Check logs:** If something breaks, check `pm2 logs`
3. **Update regularly:** Run `apt update && apt upgrade` monthly
4. **Monitor:** Use `pm2 monit` to see resource usage

---

**Need help? Check the logs first, then refer to the detailed guide!**

