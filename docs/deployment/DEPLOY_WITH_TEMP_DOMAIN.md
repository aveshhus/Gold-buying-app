# 🚀 Deploy with Hostinger Temporary Domain (Then Switch Later)

## 🎯 Strategy

**Step 1:** Deploy using Hostinger's temporary domain (for testing)  
**Step 2:** Switch to your final domain later (easy process)

---

## 📋 STEP 1: Find Your Hostinger Temporary Domain

### Option A: Check Hostinger Control Panel

1. **Login to Hostinger**
2. **Go to VPS section**
3. **Look for "Temporary Domain" or "Test Domain"**
4. **It might be something like:**
   - `srv1226397.hstgr.cloud` (your hostname)
   - `temporary.yourdomain.com`
   - Or a domain Hostinger provides

### Option B: Use Your Hostname

Your hostname is: `srv1226397.hstgr.cloud`

**We can use this as your temporary domain!**

---

## 📋 STEP 2: Deploy with Temporary Domain

### Connect to Your Server:

```bash
ssh root@93.127.206.164
```

### Install Software (if not done):

```bash
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs nginx git
npm install -g pm2
apt install -y certbot python3-certbot-nginx
```

### Upload Your Code:

**Using FileZilla:**
- Connect to: `sftp://93.127.206.164`
- Upload `backend` to `/var/www/goldapp-backend/`
- Upload `frontend` to `/var/www/goldapp-frontend/`

---

## 📋 STEP 3: Configure Backend with Temporary Domain

### Install Backend Dependencies:

```bash
cd /var/www/goldapp-backend
npm install --production
```

### Create .env File:

```bash
nano .env
```

**Paste this (using your temporary domain):**

```env
# MongoDB Connection (replace with your actual connection string)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gold-silver-app?retryWrites=true&w=majority

# JWT Secret (generate one)
JWT_SECRET=CHANGE_THIS_TO_RANDOM_STRING

# Server Port
PORT=3001

# Environment
NODE_ENV=production

# Allowed Origins - USING TEMPORARY DOMAIN
# Replace with your actual temporary domain
ALLOWED_ORIGINS=https://srv1226397.hstgr.cloud,http://srv1226397.hstgr.cloud
```

**Generate JWT Secret:**
```bash
openssl rand -base64 32
```
**Copy the output and replace `CHANGE_THIS_TO_RANDOM_STRING` in .env**

**Save:** `Ctrl + X`, `Y`, `Enter`

### Create Logs Directory:

```bash
mkdir -p logs
chmod 755 logs
```

### Start Backend:

```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
# Copy and run the command it shows you
```

---

## 📋 STEP 4: Configure Nginx with Temporary Domain

### Copy Configuration:

```bash
cd /var/www/goldapp-backend
cp nginx/goldapp-combined.conf /etc/nginx/sites-available/goldapp
```

### Edit Configuration:

```bash
nano /etc/nginx/sites-available/goldapp
```

**Replace ALL occurrences of `yourdomain.com` with your temporary domain:**

**For example, if using hostname:**
- Find: `yourdomain.com`
- Replace with: `srv1226397.hstgr.cloud`
- Do this 4-5 times (all occurrences)

**Or if Hostinger gave you a different temporary domain:**
- Replace with that domain instead

**Save:** `Ctrl + X`, `Y`, `Enter`

### Enable Site:

```bash
ln -s /etc/nginx/sites-available/goldapp /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

---

## 📋 STEP 5: Configure Firewall

```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

---

## 📋 STEP 6: Get SSL Certificate for Temporary Domain

**Important:** Let's Encrypt might not work with hostnames like `srv1226397.hstgr.cloud`

### Option A: Use HTTP Only (For Testing)

**Skip SSL for now, use HTTP:**
- Your app will be at: `http://srv1226397.hstgr.cloud`
- Not secure, but works for testing

**Edit Nginx config to allow HTTP:**
```bash
nano /etc/nginx/sites-available/goldapp
```

**Comment out the HTTPS redirect (add # at the start of these lines):**
```nginx
# return 301 https://$server_name$request_uri;
```

**And change the server block to listen on port 80:**
```nginx
server {
    listen 80;
    server_name srv1226397.hstgr.cloud;
    # ... rest of config
}
```

**Reload:**
```bash
nginx -t
systemctl reload nginx
```

### Option B: Use Hostinger's Temporary Domain (If Available)

**If Hostinger provided a temporary domain like `temp.yourdomain.com`:**

```bash
certbot --nginx -d temp.yourdomain.com
```

---

## 📋 STEP 7: Configure Frontend

### Install Dependencies:

```bash
cd /var/www/goldapp-frontend
npm install
```

### Create Environment File:

```bash
nano .env.production
```

**Paste (using your temporary domain):**

```env
# Using temporary domain - will change later
NEXT_PUBLIC_API_URL=http://srv1226397.hstgr.cloud/api
# OR if using HTTPS:
# NEXT_PUBLIC_API_URL=https://srv1226397.hstgr.cloud/api
```

**Save:** `Ctrl + X`, `Y`, `Enter`

### Build Frontend:

```bash
npm run build
```

### Start Frontend:

```bash
pm2 start npm --name "goldapp-frontend" -- start
pm2 save
```

---

## 📋 STEP 8: Test Your App

**Test Backend:**
- Visit: `http://srv1226397.hstgr.cloud/api/prices`
- Should see JSON data

**Test Frontend:**
- Visit: `http://srv1226397.hstgr.cloud`
- Should see your website

**✅ Your app is now live on temporary domain!**

---

## 🔄 STEP 9: Switch to Your Final Domain (Later)

**When you're ready to switch to your final domain:**

### Step 1: Update DNS Records

**In your domain registrar:**
- Add A record: `@` → `93.127.206.164`
- Add A record: `www` → `93.127.206.164`
- Wait 5-30 minutes for DNS to update

### Step 2: Update Backend .env

```bash
cd /var/www/goldapp-backend
nano .env
```

**Update ALLOWED_ORIGINS:**
```env
ALLOWED_ORIGINS=https://yourfinaldomain.com,https://www.yourfinaldomain.com,http://srv1226397.hstgr.cloud
```

**Save and restart:**
```bash
pm2 restart goldapp-backend
```

### Step 3: Update Nginx Configuration

```bash
nano /etc/nginx/sites-available/goldapp
```

**Replace temporary domain with final domain:**
- Find: `srv1226397.hstgr.cloud`
- Replace with: `yourfinaldomain.com`
- Do this for all occurrences

**Save:**
```bash
nginx -t
systemctl reload nginx
```

### Step 4: Update Frontend .env.production

```bash
cd /var/www/goldapp-frontend
nano .env.production
```

**Update:**
```env
NEXT_PUBLIC_API_URL=https://yourfinaldomain.com/api
```

**Rebuild frontend:**
```bash
npm run build
pm2 restart goldapp-frontend
```

### Step 5: Get SSL Certificate for Final Domain

```bash
certbot --nginx -d yourfinaldomain.com -d www.yourfinaldomain.com
```

**✅ Your app is now on your final domain!**

---

## 📝 Quick Reference: Your Temporary Setup

**Current Setup:**
- **Temporary Domain:** `srv1226397.hstgr.cloud` (or Hostinger's temp domain)
- **Backend URL:** `http://srv1226397.hstgr.cloud/api`
- **Frontend URL:** `http://srv1226397.hstgr.cloud`
- **Server IP:** `93.127.206.164`

**When Switching:**
- Update `.env` file (ALLOWED_ORIGINS)
- Update `nginx` config (server_name)
- Update `.env.production` (NEXT_PUBLIC_API_URL)
- Rebuild frontend
- Get SSL certificate
- Restart services

---

## 🎯 Summary

**For Now (Testing):**
1. ✅ Use temporary domain: `srv1226397.hstgr.cloud`
2. ✅ Use HTTP (no SSL needed for testing)
3. ✅ Test everything works
4. ✅ Make sure MongoDB is connected

**Later (Production):**
1. ✅ Point your final domain to `93.127.206.164`
2. ✅ Update all config files
3. ✅ Get SSL certificate
4. ✅ Switch is complete!

---

## 💡 Pro Tips

1. **Keep temporary domain in ALLOWED_ORIGINS** - This way both domains work during transition
2. **Test thoroughly on temporary domain** - Fix all issues before switching
3. **Document your changes** - Write down what you changed so you can reverse if needed
4. **Backup .env file** - Before making changes, copy it: `cp .env .env.backup`

---

**🚀 Start with temporary domain, test everything, then switch when ready!**

