# 🚀 Hostinger Backend Deployment Guide

Complete guide to deploy your Node.js backend to Hostinger VPS or Shared Hosting.

## 📋 Prerequisites

1. **Hostinger Account** with VPS or Shared Hosting
2. **SSH Access** (for VPS) or **File Manager** (for Shared Hosting)
3. **Domain Name** (optional but recommended)
4. **MongoDB Atlas Account** (free cloud database)

---

## 🎯 Option 1: Hostinger VPS (Recommended)

VPS gives you full control and is best for Node.js applications.

### Step 1: Access Your VPS via SSH

**Windows (using PowerShell or PuTTY):**
```powershell
ssh root@your-server-ip
# OR
ssh root@your-domain.com
```

**Mac/Linux:**
```bash
ssh root@your-server-ip
```

### Step 2: Update System

```bash
# Update package list
apt update && apt upgrade -y

# Install Node.js (v18 or v20 recommended)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 (Process Manager)
npm install -g pm2

# Install Git
apt install -y git
```

### Step 3: Upload Your Backend Code

**Option A: Using Git (Recommended)**
```bash
# Create app directory
mkdir -p /var/www/goldapp-backend
cd /var/www/goldapp-backend

# Clone your repository (if using Git)
git clone https://github.com/your-username/your-repo.git .

# OR upload files manually via SFTP/SCP
```

**Option B: Using SFTP/SCP (FileZilla, WinSCP)**
1. Connect to your server via SFTP
2. Upload entire `backend` folder to `/var/www/goldapp-backend`

### Step 4: Install Dependencies

```bash
cd /var/www/goldapp-backend
npm install --production
```

### Step 5: Configure Environment Variables

```bash
# Create .env file
nano .env
```

Add your configuration:
```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gold-silver-app?retryWrites=true&w=majority

# JWT Secret (generate a strong random string)
JWT_SECRET=your-very-strong-random-secret-key-minimum-32-characters

# Server Port (use 3001 or let Hostinger assign)
PORT=3001

# Email Configuration (optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

**Save:** `Ctrl+X`, then `Y`, then `Enter`

### Step 6: Set Up MongoDB Atlas (Free Cloud Database)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a free cluster (M0)
4. Create database user
5. Whitelist your server IP (or `0.0.0.0/0` for all)
6. Get connection string
7. Update `MONGODB_URI` in `.env`

### Step 7: Configure Nginx (Reverse Proxy)

```bash
# Install Nginx
apt install -y nginx

# Create Nginx configuration
nano /etc/nginx/sites-available/goldapp-backend
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Enable the site:**
```bash
ln -s /etc/nginx/sites-available/goldapp-backend /etc/nginx/sites-enabled/
nginx -t  # Test configuration
systemctl restart nginx
```

### Step 8: Start Backend with PM2

```bash
cd /var/www/goldapp-backend

# Start the application
pm2 start server.js --name goldapp-backend

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
# Follow the command it outputs
```

### Step 9: Set Up SSL Certificate (HTTPS)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your-domain.com -d www.your-domain.com

# Certbot will automatically configure Nginx for HTTPS
```

### Step 10: Verify Deployment

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs goldapp-backend

# Test API
curl http://localhost:3001/api
```

Visit: `https://your-domain.com` (should show your backend)

---

## 🎯 Option 2: Hostinger Shared Hosting

If you have shared hosting, you may need to use a different approach.

### Limitations:
- May not support Node.js directly
- May need to use PHP proxy or Cloudflare Workers
- Better to upgrade to VPS

### Alternative: Use Hostinger + Railway/Render

1. Keep frontend on Hostinger
2. Deploy backend to Railway/Render (free tier)
3. Update mobile app to use Railway/Render URL

---

## 🔧 PM2 Commands (Process Management)

```bash
# View all processes
pm2 list

# View logs
pm2 logs goldapp-backend

# Restart application
pm2 restart goldapp-backend

# Stop application
pm2 stop goldapp-backend

# Delete application
pm2 delete goldapp-backend

# Monitor (real-time)
pm2 monit
```

---

## 📝 Update Mobile App After Deployment

Once backend is live, update `mobile/src/api/client.ts`:

```typescript
// Change this:
const PRODUCTION_API_URL = 'https://your-domain.com/api';

// To your actual Hostinger domain:
const PRODUCTION_API_URL = 'https://your-domain.com/api';
// OR if using IP:
const PRODUCTION_API_URL = 'http://your-server-ip:3001/api';
```

Then rebuild APK:
```bash
cd mobile
npm run build:android:production
```

---

## 🔒 Security Checklist

- [ ] Strong JWT_SECRET (32+ characters, random)
- [ ] MongoDB Atlas with authentication
- [ ] HTTPS enabled (SSL certificate)
- [ ] Firewall configured (only allow necessary ports)
- [ ] Regular system updates
- [ ] PM2 process manager (auto-restart)
- [ ] Environment variables secured (not in Git)

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

### Can't Access from Internet

1. **Check Firewall:**
   ```bash
   ufw status
   ufw allow 80
   ufw allow 443
   ufw allow 3001  # If accessing directly
   ```

2. **Check Nginx:**
   ```bash
   systemctl status nginx
   nginx -t
   ```

3. **Check Domain DNS:**
   - Ensure A record points to your server IP
   - Wait for DNS propagation (up to 48 hours)

### MongoDB Connection Failed

1. Check MongoDB Atlas:
   - Whitelist your server IP
   - Verify connection string
   - Check database user credentials

2. Test connection:
   ```bash
   node -e "require('./config/database')().then(() => console.log('Connected!')).catch(e => console.error(e))"
   ```

### Port Already in Use

```bash
# Find process using port 3001
lsof -i :3001
# OR
netstat -tulpn | grep 3001

# Kill the process
kill -9 <PID>
```

---

## 📊 Monitoring & Maintenance

### View Real-time Logs
```bash
pm2 logs goldapp-backend --lines 100
```

### Monitor Resources
```bash
pm2 monit
```

### Auto-restart on Crash
PM2 automatically restarts crashed processes (already configured)

### Update Application
```bash
cd /var/www/goldapp-backend
git pull  # If using Git
# OR upload new files via SFTP

npm install --production
pm2 restart goldapp-backend
```

---

## 🌐 Domain Configuration

### If Using Hostinger Domain:

1. **Point Domain to Server:**
   - In Hostinger control panel
   - DNS Settings → A Record
   - Point to your VPS IP address

2. **Subdomain (Optional):**
   - Create `api.yourdomain.com`
   - Point to same IP
   - Update Nginx config accordingly

---

## 📞 Hostinger-Specific Notes

1. **Control Panel Access:**
   - Log in to Hostinger hPanel
   - Access VPS via SSH credentials provided

2. **IP Address:**
   - Your VPS has a dedicated IP
   - Use this IP or your domain name

3. **Resource Limits:**
   - Check your VPS plan limits
   - Monitor CPU/RAM usage: `htop` or `pm2 monit`

4. **Support:**
   - Hostinger support can help with VPS setup
   - Contact them if you need assistance

---

## ✅ Deployment Checklist

- [ ] VPS/Server access configured
- [ ] Node.js installed
- [ ] PM2 installed
- [ ] Backend code uploaded
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file configured
- [ ] MongoDB Atlas set up
- [ ] Nginx configured
- [ ] SSL certificate installed
- [ ] PM2 process running
- [ ] Backend accessible via domain/IP
- [ ] Mobile app API URL updated
- [ ] APK rebuilt with production URL

---

## 🎯 Quick Start Commands

```bash
# 1. Connect to server
ssh root@your-server-ip

# 2. Install Node.js and PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2

# 3. Upload backend code (via SFTP or Git)

# 4. Install dependencies
cd /var/www/goldapp-backend
npm install --production

# 5. Configure .env file
nano .env

# 6. Start with PM2
pm2 start server.js --name goldapp-backend
pm2 save
pm2 startup

# 7. Configure Nginx (see Step 7 above)

# 8. Install SSL
certbot --nginx -d your-domain.com
```

---

## 💡 Pro Tips

1. **Use Git for Updates:**
   - Push code to GitHub/GitLab
   - Pull on server for updates

2. **Backup Regularly:**
   - MongoDB Atlas has automatic backups
   - Backup `.env` file securely

3. **Monitor Performance:**
   - Use `pm2 monit` to watch resources
   - Set up alerts if needed

4. **Keep Updated:**
   ```bash
   apt update && apt upgrade -y
   npm update
   ```

---

**Your backend will be live and accessible from anywhere!** 🌍

Once deployed, update your mobile app's `PRODUCTION_API_URL` and rebuild the APK.




