# Deploy GoldApp to Your Real Domain

## Prerequisites
- Your real domain name (e.g., `yourdomain.com`)
- Domain DNS access (where you manage your domain)
- Server IP: `93.127.206.164`
- SSH access to server

---

## Step 1: Configure DNS Records

**Go to your domain registrar (where you bought your domain) and add these DNS records:**

### Option A: Same Domain (Recommended)
If you want both frontend and backend on the same domain:
- Frontend: `https://yourdomain.com`
- Backend API: `https://yourdomain.com/api`

**DNS Records:**
```
Type: A
Name: @ (or leave blank)
Value: 93.127.206.164
TTL: 3600

Type: A
Name: www
Value: 93.127.206.164
TTL: 3600
```

### Option B: Subdomain
If you want backend on a subdomain:
- Frontend: `https://yourdomain.com`
- Backend API: `https://api.yourdomain.com`

**DNS Records:**
```
Type: A
Name: @ (or leave blank)
Value: 93.127.206.164
TTL: 3600

Type: A
Name: www
Value: 93.127.206.164
TTL: 3600

Type: A
Name: api
Value: 93.127.206.164
TTL: 3600
```

**Wait 5-30 minutes for DNS to propagate.**
**Test DNS:** `ping yourdomain.com` (should show `93.127.206.164`)

---

## Step 2: Update Backend Environment Variables

**SSH into your server:**
```bash
ssh root@93.127.206.164
```

**Edit backend .env file:**
```bash
cd /var/www/backend
nano .env
```

**Update these variables (replace `yourdomain.com` with YOUR domain):**

```env
# If using same domain:
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# OR if using subdomain:
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://api.yourdomain.com

# Keep other variables as they are (MONGODB_URI, JWT_SECRET, etc.)
```

**Save:** `Ctrl + X`, `Y`, `Enter`

---

## Step 3: Update Frontend Environment Variables

**Edit frontend .env.production file:**
```bash
cd /var/www/frontend
nano .env.production
```

**Add/Update (replace `yourdomain.com` with YOUR domain):**

```env
# If using same domain:
NEXT_PUBLIC_API_URL=https://yourdomain.com/api

# OR if using subdomain:
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
```

**Save:** `Ctrl + X`, `Y`, `Enter`

---

## Step 4: Update Nginx Configuration

### Option A: Same Domain Setup (Recommended)

**Create/Edit Nginx config:**
```bash
nano /etc/nginx/sites-available/goldapp
```

**Paste this configuration (replace `yourdomain.com` with YOUR domain):**

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration (will be updated by Certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

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
```

**Save:** `Ctrl + X`, `Y`, `Enter`

**Enable site:**
```bash
# Remove old config if exists
rm /etc/nginx/sites-enabled/goldapp 2>/dev/null
rm /etc/nginx/sites-enabled/default 2>/dev/null

# Create symlink
ln -s /etc/nginx/sites-available/goldapp /etc/nginx/sites-enabled/

# Test configuration
nginx -t
```

**If test passes, reload Nginx:**
```bash
systemctl reload nginx
```

---

## Step 5: Install SSL Certificate

**Install Certbot (if not already installed):**
```bash
apt update
apt install certbot python3-certbot-nginx -y
```

**Get SSL certificate (replace `yourdomain.com` with YOUR domain):**
```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

**It will ask:**
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

## Step 6: Restart Services

**Restart backend:**
```bash
cd /var/www/backend
pm2 restart goldapp-backend
pm2 logs goldapp-backend --lines 20
```

**Rebuild and restart frontend:**
```bash
cd /var/www/frontend
rm -rf .next
npm run build
pm2 restart goldapp-frontend
pm2 logs goldapp-frontend --lines 20
```

**Check status:**
```bash
pm2 status
```

---

## Step 7: Verify Deployment

### Test Backend:
```bash
# Test API endpoint
curl https://yourdomain.com/api/prices
# OR if using subdomain:
curl https://api.yourdomain.com/api/prices
```

### Test Frontend:
1. Open browser: `https://yourdomain.com`
2. Check for padlock icon 🔒 (SSL working)
3. Test login/registration
4. Test API calls (check browser console for errors)

### Check Logs:
```bash
# Backend logs
pm2 logs goldapp-backend --lines 50

# Frontend logs
pm2 logs goldapp-frontend --lines 50

# Nginx logs
tail -f /var/log/nginx/goldapp-error.log
```

---

## Step 8: Update CORS in Backend (If Needed)

**If you get CORS errors, verify backend .env has correct ALLOWED_ORIGINS:**
```bash
cd /var/www/backend
cat .env | grep ALLOWED_ORIGINS
```

**Should show:**
```
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**If incorrect, edit and restart:**
```bash
nano .env
# Update ALLOWED_ORIGINS
pm2 restart goldapp-backend
```

---

## Troubleshooting

### DNS Not Working?
```bash
# Check DNS propagation
nslookup yourdomain.com
dig yourdomain.com

# Wait longer (can take up to 48 hours, usually 5-30 minutes)
```

### SSL Certificate Issues?
```bash
# Check certificate
certbot certificates

# Renew manually if needed
certbot renew
```

### 502 Bad Gateway?
```bash
# Check if services are running
pm2 status

# Check ports
netstat -tulpn | grep -E '3001|3003'

# Restart services
pm2 restart all
```

### CORS Errors?
- Verify `ALLOWED_ORIGINS` in backend `.env`
- Check browser console for exact error
- Ensure frontend URL matches exactly (with/without www, http/https)

### Frontend Not Loading?
```bash
# Check frontend build
cd /var/www/frontend
ls -la .next

# Rebuild if needed
rm -rf .next
npm run build
pm2 restart goldapp-frontend
```

---

## Final Checklist

- [ ] DNS records configured and propagated
- [ ] Backend `.env` updated with `ALLOWED_ORIGINS`
- [ ] Frontend `.env.production` updated with `NEXT_PUBLIC_API_URL`
- [ ] Nginx configuration updated
- [ ] SSL certificate installed
- [ ] Backend restarted
- [ ] Frontend rebuilt and restarted
- [ ] Website accessible at `https://yourdomain.com`
- [ ] SSL padlock icon visible
- [ ] API calls working
- [ ] No CORS errors in browser console

---

## Important Notes

1. **DNS Propagation:** Can take 5-30 minutes (sometimes up to 48 hours)
2. **SSL Certificate:** Certbot auto-renews certificates (no action needed)
3. **Environment Variables:** Changes require service restart
4. **Frontend Build:** Takes 2-5 minutes depending on server resources
5. **HTTPS Only:** HTTP automatically redirects to HTTPS

---

## Support

If you encounter issues:
1. Check PM2 logs: `pm2 logs`
2. Check Nginx logs: `tail -f /var/log/nginx/goldapp-error.log`
3. Check browser console for frontend errors
4. Verify DNS: `nslookup yourdomain.com`
5. Test API directly: `curl https://yourdomain.com/api/prices`

---

## Quick Reference Commands

```bash
# Restart all services
pm2 restart all

# Check status
pm2 status

# View logs
pm2 logs

# Test Nginx config
nginx -t

# Reload Nginx
systemctl reload nginx

# Check SSL certificate
certbot certificates

# Renew SSL
certbot renew
```

