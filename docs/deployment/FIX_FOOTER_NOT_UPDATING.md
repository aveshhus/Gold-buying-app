# 🔧 Fix Footer Not Updating on Server

## Quick Fix Steps

---

## **Step 1: Verify File Was Uploaded**

SSH into server and check if the file was updated:

```bash
ssh root@93.127.206.164
cd /var/www/frontend/components/landing
ls -la landing-page.tsx
```

Check the file modification time - it should be recent.

---

## **Step 2: Clear Next.js Cache and Rebuild**

```bash
cd /var/www/frontend

# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

Wait for build to complete successfully.

---

## **Step 3: Restart PM2**

```bash
# Stop frontend
pm2 stop goldapp-frontend

# Delete the process
pm2 delete goldapp-frontend

# Navigate to frontend directory
cd /var/www/frontend

# Start fresh
pm2 start npm --name "goldapp-frontend" -- start

# Or if you have ecosystem config:
pm2 start ecosystem.config.js --only goldapp-frontend
```

---

## **Step 4: Check PM2 Status**

```bash
pm2 status
pm2 logs goldapp-frontend --lines 30
```

Make sure it shows `online` and no errors.

---

## **Step 5: Clear Browser Cache**

**Important:** Your browser might be showing cached version!

### Chrome/Edge:
1. Press `Ctrl + Shift + Delete`
2. Select "Cached images and files"
3. Click "Clear data"
4. Or press `Ctrl + F5` to hard refresh

### Firefox:
1. Press `Ctrl + Shift + Delete`
2. Select "Cache"
3. Click "Clear Now"
4. Or press `Ctrl + F5` to hard refresh

### Mobile:
- Clear browser cache in settings
- Or use incognito/private mode

---

## **Step 6: Verify File Content on Server**

Check if the footer code is actually on the server:

```bash
cd /var/www/frontend/components/landing
grep -n "6 Columns" landing-page.tsx
# Or check for "lg:grid-cols-6"
grep -n "lg:grid-cols-6" landing-page.tsx
```

If this doesn't show results, the file wasn't uploaded correctly.

---

## **Step 7: Force Re-upload File**

### Using FileZilla:
1. Make sure you're uploading to: `/var/www/frontend/components/landing/`
2. **NOT** `/root/var/www/` or any other location
3. Upload the file and **overwrite** when prompted
4. Verify file size matches your local file

### Using SCP:
```bash
# From your local machine (PowerShell)
scp "C:\Users\Admin\Desktop\Goldapp dpl\Goldapp 2\frontend\components\landing\landing-page.tsx" root@93.127.206.164:/var/www/frontend/components/landing/landing-page.tsx
```

---

## **Step 8: Complete Rebuild Process**

```bash
# SSH into server
ssh root@93.127.206.164

# Go to frontend
cd /var/www/frontend

# Remove cache
rm -rf .next
rm -rf node_modules/.cache

# Rebuild
npm run build

# Check if build succeeded
echo $?

# Restart PM2
pm2 restart goldapp-frontend

# Check logs
pm2 logs goldapp-frontend --lines 50
```

---

## **Step 9: Check Nginx (if using reverse proxy)**

```bash
# Reload Nginx
nginx -t
systemctl reload nginx
```

---

## **Step 10: Verify Build Output**

Check if the build actually includes your changes:

```bash
cd /var/www/frontend
grep -r "lg:grid-cols-6" .next/
```

If found, the build has your changes.

---

## 🔍 Diagnostic Commands

Run these to diagnose:

```bash
# Check file modification time
stat /var/www/frontend/components/landing/landing-page.tsx

# Check if PM2 is running
pm2 list

# Check frontend port
netstat -tulpn | grep 3003

# Check build directory
ls -la /var/www/frontend/.next/

# Check for errors
pm2 logs goldapp-frontend --err --lines 50
```

---

## ✅ Most Common Fix

**Try this first:**

```bash
cd /var/www/frontend
rm -rf .next
npm run build
pm2 restart goldapp-frontend
```

Then **clear your browser cache** (Ctrl + F5) and reload the page.

---

## 📝 Still Not Working?

1. **Verify file was uploaded:**
   ```bash
   cat /var/www/frontend/components/landing/landing-page.tsx | grep "lg:grid-cols-6"
   ```

2. **Check build output:**
   ```bash
   cd /var/www/frontend
   npm run build 2>&1 | tail -20
   ```

3. **Check PM2 is serving new build:**
   ```bash
   pm2 logs goldapp-frontend --lines 100
   ```

4. **Try accessing directly:**
   - `http://srv1226397.hstgr.cloud:3003` (if port is open)
   - Or check Nginx is proxying correctly

---

**Start with Step 2 (Clear cache and rebuild) - this fixes 90% of cases!**

