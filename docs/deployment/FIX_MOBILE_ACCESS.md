# 📱 Fix Mobile Access Issues

## 🔍 Problem
Website works on desktop but not on mobile.

---

## 🛠️ Solutions

### **Solution 1: Update Backend CORS Configuration**

The backend needs to allow your domain in production mode.

#### Step 1: Check current backend .env

```bash
cat /var/www/backend/.env | grep ALLOWED_ORIGINS
```

#### Step 2: Update backend .env

```bash
nano /var/www/backend/.env
```

Add or update this line:
```bash
ALLOWED_ORIGINS=http://srv1226397.hstgr.cloud,https://srv1226397.hstgr.cloud
NODE_ENV=production
```

Save: `Ctrl + X`, `Y`, `Enter`

#### Step 3: Restart backend

```bash
pm2 restart goldapp-backend
pm2 logs goldapp-backend --lines 10
```

---

### **Solution 2: Check Mobile Browser Issues**

#### Issue: Mobile tries HTTPS instead of HTTP

**Fix:** Make sure you're using `http://` not `https://`

- ✅ Correct: `http://srv1226397.hstgr.cloud`
- ❌ Wrong: `https://srv1226397.hstgr.cloud`

#### Issue: Mobile browser cache

**Fix:** Clear browser cache on mobile:
1. Open browser settings
2. Clear cache and cookies
3. Try again

---

### **Solution 3: Check Mobile Network**

#### Test 1: Try different network

- Try on WiFi
- Try on mobile data
- Try on different WiFi network

#### Test 2: Check if mobile can reach server

On mobile, open browser and try:
```
http://srv1226397.hstgr.cloud/api/prices
```

Should return JSON data.

---

### **Solution 4: Update Nginx for Mobile Headers**

Mobile browsers sometimes send different headers.

#### Update Nginx config:

```bash
nano /etc/nginx/sites-available/goldapp
```

Make sure these headers are set:

```nginx
location / {
    proxy_pass http://localhost:3003;
    proxy_http_version 1.1;
    
    # Headers for mobile compatibility
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-Host $server_name;
    proxy_set_header User-Agent $http_user_agent;
    
    # Important for mobile
    proxy_set_header Accept-Encoding "";
    
    # Cache bypass
    proxy_cache_bypass $http_upgrade;
    
    # Timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
```

Save and reload:
```bash
nginx -t
systemctl reload nginx
```

---

### **Solution 5: Check Firewall**

#### Check if firewall is blocking mobile IPs

```bash
# Check UFW status
ufw status

# If active, allow HTTP
ufw allow 80/tcp
ufw allow 443/tcp
```

---

### **Solution 6: Test from Mobile Terminal**

If you have SSH access from mobile, test:

```bash
curl -v http://srv1226397.hstgr.cloud
```

Or use mobile browser developer tools (if available).

---

## 🔍 Diagnostic Steps

### Step 1: Check backend logs

```bash
pm2 logs goldapp-backend --lines 50
```

Look for CORS errors or blocked requests.

### Step 2: Check Nginx logs

```bash
tail -f /var/log/nginx/goldapp-access.log
tail -f /var/log/nginx/goldapp-error.log
```

### Step 3: Test API directly from mobile

Open on mobile browser:
```
http://srv1226397.hstgr.cloud/api/prices
```

Should return JSON.

---

## ✅ Quick Fix Checklist

- [ ] Update `ALLOWED_ORIGINS` in backend `.env`
- [ ] Restart backend: `pm2 restart goldapp-backend`
- [ ] Use `http://` not `https://` on mobile
- [ ] Clear mobile browser cache
- [ ] Check Nginx config has mobile-friendly headers
- [ ] Reload Nginx: `systemctl reload nginx`
- [ ] Test on different mobile network
- [ ] Check firewall: `ufw status`

---

## 🎯 Most Likely Fix

**Update backend .env with ALLOWED_ORIGINS:**

```bash
nano /var/www/backend/.env
```

Add:
```bash
ALLOWED_ORIGINS=http://srv1226397.hstgr.cloud
NODE_ENV=production
```

Then:
```bash
pm2 restart goldapp-backend
```

---

## 📝 Test Commands

```bash
# Check backend .env
cat /var/www/backend/.env | grep ALLOWED_ORIGINS

# Update .env
nano /var/www/backend/.env

# Restart backend
pm2 restart goldapp-backend

# Check logs
pm2 logs goldapp-backend --lines 20

# Test Nginx
nginx -t
systemctl reload nginx
```

---

**Try Solution 1 first - it's the most common fix!**

