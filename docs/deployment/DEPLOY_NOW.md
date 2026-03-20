# 🚀 Deploy Your GoldApp - Step by Step

## 📋 Your Server Details
- **Server IP:** 93.127.206.164
- **Temporary Domain:** srv1226397.hstgr.cloud
- **SSH Username:** root

---

## ✅ STEP 1: Connect to Your Server

### On Windows (PowerShell or Command Prompt):

```bash
ssh root@93.127.206.164
```

**Enter your password when asked.**

**✅ You're now connected to your server!**

---

## ✅ STEP 2: Install Required Software

**Copy and paste these commands one by one:**

```bash
# Update system
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

**✅ All software installed!**

---

## ✅ STEP 3: Upload Your Backend Code

### Option A: Using FileZilla (Easiest)

1. **Download FileZilla:** https://filezilla-project.org/
2. **Connect:**
   - Host: `sftp://93.127.206.164`
   - Username: `root`
   - Password: (your Hostinger password)
   - Port: `22`
   - Click "Quickconnect"

3. **Upload:**
   - LEFT side: Find your `backend` folder on your computer
   - RIGHT side: Go to `/var/www/`
   - Create folder: `goldapp-backend` (right-click → Create directory)
   - Drag entire `backend` folder to `/var/www/goldapp-backend/`

### Option B: Using Git (if your code is on GitHub)

```bash
cd /var/www
git clone https://github.com/your-username/your-repo.git goldapp-backend
cd goldapp-backend
```

**✅ Backend code uploaded!**

---

## ✅ STEP 4: Configure Backend

```bash
# Go to backend folder
cd /var/www/goldapp-backend

# Install dependencies
npm install --production
```

```bash
# Create .env file
nano .env
```

**Paste this (replace with YOUR values):**

```env
# MongoDB Connection (replace with your actual connection string)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gold-silver-app?retryWrites=true&w=majority

# JWT Secret (generate one below)
JWT_SECRET=CHANGE_THIS

# Server Port
PORT=3001

# Environment
NODE_ENV=production

# Allowed Origins
ALLOWED_ORIGINS=http://srv1226397.hstgr.cloud,https://srv1226397.hstgr.cloud
```

**To save:**
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

**Generate JWT Secret:**

```bash
openssl rand -base64 32
```

**Copy the output, then edit .env again:**

```bash
nano .env
```

**Replace `JWT_SECRET=CHANGE_THIS` with:**
```
JWT_SECRET=<paste the generated string here>
```

**Save:** `Ctrl + X`, `Y`, `Enter`

**Create logs directory:**

```bash
mkdir -p logs
chmod 755 logs
```

---

## ✅ STEP 5: Start Backend

```bash
# Start with PM2
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

**Check if it's running:**

```bash
pm2 status
# Should show "goldapp-backend" as "online" (green)
```

**Test the API:**

```bash
curl http://localhost:3001/api/prices
# Should return JSON data
```

**✅ Backend is running!**

---

## ✅ STEP 6: Configure Firewall

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

## ✅ STEP 7: Configure Nginx

```bash
# Copy configuration file
cd /var/www/goldapp-backend
cp nginx/goldapp-temp-domain.conf /etc/nginx/sites-available/goldapp
```

```bash
# Edit configuration
nano /etc/nginx/sites-available/goldapp
```

**Find this line:**
```
server_name srv1226397.hstgr.cloud;
```

**Make sure it says `srv1226397.hstgr.cloud` (or your actual temporary domain)**

**Save:** `Ctrl + X`, `Y`, `Enter`

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
# Should say: "syntax is ok" and "test is successful"
```

```bash
# Reload Nginx
systemctl reload nginx
```

**✅ Nginx configured!**

---

## ✅ STEP 8: Upload and Configure Frontend

### Upload Frontend Code:

**Using FileZilla:**
- Connect to: `sftp://93.127.206.164`
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

**Paste:**

```env
NEXT_PUBLIC_API_URL=http://srv1226397.hstgr.cloud/api
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

**Check status:**

```bash
pm2 status
# Should show both "goldapp-backend" and "goldapp-frontend" as online
```

**✅ Frontend is running!**

---

## ✅ STEP 9: Test Your App

### Test Backend:
- Open browser: `http://srv1226397.hstgr.cloud/api/prices`
- Should see JSON data (not error page)

### Test Frontend:
- Open browser: `http://srv1226397.hstgr.cloud`
- Should see your website

**✅ Your app is live!**

---

## 🎉 Deployment Complete!

Your GoldApp is now:
- ✅ Running on: `http://srv1226397.hstgr.cloud`
- ✅ Backend API: `http://srv1226397.hstgr.cloud/api`
- ✅ Auto-restarting if it crashes
- ✅ Accessible from anywhere!

---

## 📋 Quick Commands Reference

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

## 🐛 Troubleshooting

### Backend Not Running?

```bash
pm2 restart goldapp-backend
pm2 logs goldapp-backend
```

### Can't Access Website?

```bash
# Check Nginx
systemctl status nginx
nginx -t

# Check PM2
pm2 status
```

### MongoDB Connection Failed?

- Check MongoDB Atlas IP whitelist includes: `93.127.206.164`
- Verify connection string in `.env` file
- Check password is correct

---

## ✅ Next Steps

1. **Test everything thoroughly**
2. **Update mobile app API URLs** (when ready)
3. **Switch to final domain** (when ready, use `switch-domain.sh` script)

---

**🎉 Congratulations! Your app is deployed and live!**

