# Step-by-Step Deployment Guide for shreeomjisaraf.com

## ✅ Step 1: Fix Nginx Configuration (Remove SSL Temporarily)

**You're already SSH'd into the server. Run these commands:**

```bash
# Backup current config
cp /etc/nginx/sites-available/goldapp /etc/nginx/sites-available/goldapp.backup

# Create HTTP-only config (SSL will be added after DNS propagates)
cat > /etc/nginx/sites-available/goldapp << 'EOF'
# HTTP Server (SSL will be added after DNS propagates)
server {
    listen 80;
    server_name shreeomjisaraf.com www.shreeomjisaraf.com;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Logging
    access_log /var/log/nginx/goldapp-access.log;
    error_log /var/log/nginx/goldapp-error.log;

    # Client body size limit
    client_max_body_size 10M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Backend API - Must come BEFORE frontend location
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Frontend (Next.js)
    location / {
        proxy_pass http://localhost:3003;
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
EOF

# Test Nginx configuration
nginx -t
```

**If test passes, reload Nginx:**
```bash
systemctl reload nginx
systemctl status nginx
```

---

## ✅ Step 2: Update Backend Environment Variables

```bash
# Navigate to backend directory
cd /var/www/backend

# Edit .env file
nano .env
```

**Find the line with `ALLOWED_ORIGINS` and update it to:**
```env
ALLOWED_ORIGINS=http://shreeomjisaraf.com,http://www.shreeomjisaraf.com,https://shreeomjisaraf.com,https://www.shreeomjisaraf.com
```

**Save:** Press `Ctrl + X`, then `Y`, then `Enter`

**Restart backend:**
```bash
pm2 restart goldapp-backend
pm2 logs goldapp-backend --lines 20
```

---

## ✅ Step 3: Update Frontend Environment Variables

```bash
# Navigate to frontend directory
cd /var/www/frontend

# Edit .env.production file
nano .env.production
```

**Add or update this line:**
```env
NEXT_PUBLIC_API_URL=https://shreeomjisaraf.com/api
```

**Save:** Press `Ctrl + X`, then `Y`, then `Enter`

---

## ✅ Step 4: Rebuild and Restart Frontend

```bash
# Still in /var/www/frontend directory
# Remove old build
rm -rf .next

# Rebuild with new environment variables
npm run build

# Restart frontend
pm2 restart goldapp-frontend

# Check logs
pm2 logs goldapp-frontend --lines 20
```

---

## ✅ Step 5: Verify Services Are Running

```bash
# Check PM2 status
pm2 status

# Check Nginx status
systemctl status nginx

# Test backend API (should work even before DNS propagates)
curl http://localhost:3001/api/prices

# Test frontend (should work even before DNS propagates)
curl http://localhost:3003
```

---

## ⏳ Step 6: Wait for DNS Propagation

**Check DNS propagation from your local computer (PowerShell):**
```powershell
nslookup shreeomjisaraf.com
```

**Wait until it shows:**
```
Address: 93.127.206.164
```

**This can take 15-60 minutes (sometimes up to 48 hours).**

**Check nameservers:**
```powershell
nslookup -type=NS shreeomjisaraf.com
```

**Should show:**
```
ns1.webscalers.co.in
ns2.webscalers.co.in
ns3.webscalers.co.in
ns4.webscalers.co.in
```

---

## ✅ Step 7: Test HTTP Site (Before SSL)

**Once DNS shows `93.127.206.164`, test from your browser:**
- Open: `http://shreeomjisaraf.com` (without https)
- Should see your frontend
- Test API: `http://shreeomjisaraf.com/api/prices`

---

## ✅ Step 8: Install SSL Certificate (After DNS Propagates)

**SSH into server and run:**

```bash
# Install Certbot if not already installed
apt update
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d shreeomjisaraf.com -d www.shreeomjisaraf.com
```

**Certbot will ask:**
1. **Email address:** Enter your email
2. **Terms of Service:** Type `A` and press Enter
3. **Share email:** Type `N` and press Enter
4. **Redirect HTTP to HTTPS:** Type `2` and press Enter

**✅ SSL certificate installed!**

**Test auto-renewal:**
```bash
certbot renew --dry-run
```

---

## ✅ Step 9: Update Backend CORS for HTTPS

**After SSL is installed, update backend .env:**

```bash
cd /var/www/backend
nano .env
```

**Update `ALLOWED_ORIGINS` to use HTTPS:**
```env
ALLOWED_ORIGINS=https://shreeomjisaraf.com,https://www.shreeomjisaraf.com
```

**Save and restart:**
```bash
pm2 restart goldapp-backend
```

---

## ✅ Step 10: Final Testing

**Test HTTPS site:**
1. Open: `https://shreeomjisaraf.com`
2. Check for padlock icon 🔒 (SSL working)
3. Test login/registration
4. Test API calls (check browser console for errors)

**Test API:**
```bash
curl https://shreeomjisaraf.com/api/prices
```

**Check logs if issues:**
```bash
# Backend logs
pm2 logs goldapp-backend --lines 50

# Frontend logs
pm2 logs goldapp-frontend --lines 50

# Nginx logs
tail -f /var/log/nginx/goldapp-error.log
```

---

## 🎉 Done!

Your site should now be live at `https://shreeomjisaraf.com`!

---

## 📝 Quick Reference Commands

**Check DNS:**
```powershell
nslookup shreeomjisaraf.com
```

**SSH to server:**
```bash
ssh root@93.127.206.164
```

**Check services:**
```bash
pm2 status
systemctl status nginx
```

**View logs:**
```bash
pm2 logs goldapp-backend
pm2 logs goldapp-frontend
tail -f /var/log/nginx/goldapp-error.log
```

