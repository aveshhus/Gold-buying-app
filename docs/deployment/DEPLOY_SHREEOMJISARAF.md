# Deploy GoldApp to shreeomjisaraf.com

## Your Domain Details
- **Domain:** `shreeomjisaraf.com`
- **Domain Provider:** WEBZONE INFOTECH (stackdomains.myorderbox.com)
- **VPS Server:** Hostinger.com
- **Server IP:** `93.127.206.164`

---

## Step 1: Configure DNS Records at WEBZONE INFOTECH

### Access Your Domain Panel:
1. Go to: https://stackdomains.myorderbox.com/
2. Login with: `shreeomjisaraf@gmail.com`
3. Navigate to **DNS Management** or **Domain Management**

### Add DNS Records:

**You need to add these A records:**

1. **Main Domain (Root):**
   - **Type:** A
   - **Name:** `@` (or leave blank, or `shreeomjisaraf.com`)
   - **Value/Points To:** `93.127.206.164`
   - **TTL:** `3600` (or default)

2. **WWW Subdomain:**
   - **Type:** A
   - **Name:** `www`
   - **Value/Points To:** `93.127.206.164`
   - **TTL:** `3600` (or default)

**Note:** If you see nameservers like `ns1.webscalers.co.in`, you may need to:
- Either change nameservers to point to Hostinger, OR
- Add A records in the current DNS panel

**Save the DNS records and wait 5-30 minutes for propagation.**

---

## Step 2: Verify DNS Propagation

**On your local machine, test DNS:**
```powershell
# Test DNS
ping shreeomjisaraf.com
nslookup shreeomjisaraf.com
```

**Should show:** `93.127.206.164`

**Or use online tool:** https://dnschecker.org/
- Enter: `shreeomjisaraf.com`
- Should show: `93.127.206.164` globally

---

## Step 3: Update Backend Environment Variables

**SSH into your server:**
```bash
ssh root@93.127.206.164
```

**Edit backend .env:**
```bash
cd /var/www/backend
nano .env
```

**Add/Update this line:**
```env
ALLOWED_ORIGINS=https://shreeomjisaraf.com,https://www.shreeomjisaraf.com
```

**Save:** `Ctrl + X`, `Y`, `Enter`

**Restart backend:**
```bash
pm2 restart goldapp-backend
pm2 logs goldapp-backend --lines 20
```

---

## Step 4: Update Frontend Environment Variables

**Edit frontend .env.production:**
```bash
cd /var/www/frontend
nano .env.production
```

**Add/Update:**
```env
NEXT_PUBLIC_API_URL=https://shreeomjisaraf.com/api
```

**Save:** `Ctrl + X`, `Y`, `Enter`

**Rebuild frontend:**
```bash
rm -rf .next
npm run build
pm2 restart goldapp-frontend
pm2 logs goldapp-frontend --lines 20
```

---

## Step 5: Update Nginx Configuration

**Create/Edit Nginx config:**
```bash
nano /etc/nginx/sites-available/shreeomjisaraf
```

**Paste this configuration:**

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name shreeomjisaraf.com www.shreeomjisaraf.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name shreeomjisaraf.com www.shreeomjisaraf.com;

    # SSL Configuration (will be updated by Certbot)
    ssl_certificate /etc/letsencrypt/live/shreeomjisaraf.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/shreeomjisaraf.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Logging
    access_log /var/log/nginx/shreeomjisaraf-access.log;
    error_log /var/log/nginx/shreeomjisaraf-error.log;

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
```

**Save:** `Ctrl + X`, `Y`, `Enter`

**Enable site:**
```bash
# Remove old configs
rm /etc/nginx/sites-enabled/goldapp 2>/dev/null
rm /etc/nginx/sites-enabled/default 2>/dev/null

# Create symlink
ln -s /etc/nginx/sites-available/shreeomjisaraf /etc/nginx/sites-enabled/

# Test configuration
nginx -t
```

**If test passes, reload Nginx:**
```bash
systemctl reload nginx
```

---

## Step 6: Install SSL Certificate

**Install Certbot (if not already installed):**
```bash
apt update
apt install certbot python3-certbot-nginx -y
```

**Get SSL certificate:**
```bash
certbot --nginx -d shreeomjisaraf.com -d www.shreeomjisaraf.com
```

**It will ask:**
1. **Email address:** Enter `shreeomjisaraf@gmail.com` (or your email)
2. **Terms of Service:** Type `A` and press Enter
3. **Share email:** Type `N` and press Enter
4. **Redirect HTTP to HTTPS:** Type `2` and press Enter

**✅ SSL certificate installed!**

**Test auto-renewal:**
```bash
certbot renew --dry-run
```

---

## Step 7: Final Verification

### Test Backend API:
```bash
curl https://shreeomjisaraf.com/api/prices
```

### Test in Browser:
1. Open: `https://shreeomjisaraf.com`
2. Check for padlock icon 🔒 (SSL working)
3. Test login/registration
4. Check browser console (F12) for any errors

### Check Services:
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs goldapp-backend --lines 20
pm2 logs goldapp-frontend --lines 20

# Check Nginx
systemctl status nginx
tail -f /var/log/nginx/shreeomjisaraf-error.log
```

---

## Quick Command Summary

**Copy-paste these commands in order:**

```bash
# 1. Update backend
cd /var/www/backend
nano .env
# Add: ALLOWED_ORIGINS=https://shreeomjisaraf.com,https://www.shreeomjisaraf.com
pm2 restart goldapp-backend

# 2. Update frontend
cd /var/www/frontend
nano .env.production
# Add: NEXT_PUBLIC_API_URL=https://shreeomjisaraf.com/api
rm -rf .next
npm run build
pm2 restart goldapp-frontend

# 3. Setup Nginx
nano /etc/nginx/sites-available/shreeomjisaraf
# Paste the config above
ln -s /etc/nginx/sites-available/shreeomjisaraf /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# 4. Install SSL
certbot --nginx -d shreeomjisaraf.com -d www.shreeomjisaraf.com

# 5. Verify
pm2 status
curl https://shreeomjisaraf.com/api/prices
```

---

## Troubleshooting

### DNS Not Working?
- Wait 5-30 minutes after adding DNS records
- Check DNS propagation: https://dnschecker.org/#A/shreeomjisaraf.com
- Verify A records point to: `93.127.206.164`

### Can't Access Domain Panel?
- Login at: https://stackdomains.myorderbox.com/
- Email: `shreeomjisaraf@gmail.com`
- Look for "DNS Management" or "Domain Settings"

### SSL Certificate Failed?
- Make sure DNS is working first
- Check if port 80 is open: `ufw status`
- Try: `certbot certonly --nginx -d shreeomjisaraf.com -d www.shreeomjisaraf.com`

### 502 Bad Gateway?
```bash
# Check if services are running
pm2 status

# Restart all
pm2 restart all

# Check ports
netstat -tulpn | grep -E '3001|3003'
```

### CORS Errors?
- Verify backend `.env` has: `ALLOWED_ORIGINS=https://shreeomjisaraf.com,https://www.shreeomjisaraf.com`
- Restart backend: `pm2 restart goldapp-backend`
- Check browser console for exact error

---

## Important Notes

1. **DNS Propagation:** Can take 5-30 minutes (sometimes up to 48 hours)
2. **SSL Certificate:** Certbot auto-renews (no action needed)
3. **Environment Variables:** Changes require service restart
4. **Frontend Build:** Takes 2-5 minutes
5. **HTTPS Only:** HTTP automatically redirects to HTTPS

---

## Your Final URLs

- **Frontend:** https://shreeomjisaraf.com
- **Backend API:** https://shreeomjisaraf.com/api
- **WWW:** https://www.shreeomjisaraf.com (redirects to main)

---

## Support

If you encounter issues:
1. Check DNS: https://dnschecker.org/#A/shreeomjisaraf.com
2. Check PM2: `pm2 logs`
3. Check Nginx: `tail -f /var/log/nginx/shreeomjisaraf-error.log`
4. Test API: `curl https://shreeomjisaraf.com/api/prices`

