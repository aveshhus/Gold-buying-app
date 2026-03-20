# 🔧 Fix Modal Scroll Not Working on Server

## Troubleshooting Steps

---

## **Step 1: Verify File Was Uploaded Correctly**

SSH into server and check:

```bash
ssh root@93.127.206.164
cd /var/www/frontend/components/auth

# Check file modification time
ls -la login-modal.tsx

# Verify the scroll fix code is in the file
grep "overflow-y-auto" login-modal.tsx
```

**Expected:** Should show the line with `overflow-y-auto`

**If not found:** File wasn't uploaded correctly - re-upload it.

---

## **Step 2: Check if Build Includes the Changes**

```bash
cd /var/www/frontend

# Check if .next directory exists
ls -la .next

# Search for the scroll fix in built files
grep -r "overflow-y-auto" .next/ 2>/dev/null | head -5
```

**Expected:** Should find matches in the built files.

**If not found:** Build didn't include the changes - rebuild needed.

---

## **Step 3: Complete Rebuild Process**

```bash
cd /var/www/frontend

# Stop PM2
pm2 stop goldapp-frontend

# Remove all caches
rm -rf .next
rm -rf node_modules/.cache

# Rebuild
npm run build

# Wait for "✓ Compiled successfully"
```

**Wait for build to complete** - This is critical!

---

## **Step 4: Restart PM2 Completely**

```bash
# Delete the process
pm2 delete goldapp-frontend

# Navigate to frontend
cd /var/www/frontend

# Start fresh
pm2 start npm --name "goldapp-frontend" -- start

# Check status
pm2 status

# Check logs
pm2 logs goldapp-frontend --lines 20
```

---

## **Step 5: Clear Browser Cache**

**This is VERY important!** Your browser might be showing cached version.

### Chrome/Edge:
1. Press `Ctrl + Shift + Delete`
2. Select "Cached images and files"
3. Time range: "All time"
4. Click "Clear data"
5. Or press `Ctrl + F5` to hard refresh

### Firefox:
1. Press `Ctrl + Shift + Delete`
2. Select "Cache"
3. Time range: "Everything"
4. Click "Clear Now"
5. Or press `Ctrl + F5`

### Mobile:
- Clear browser cache in settings
- Or use incognito/private mode

---

## **Step 6: Test in Incognito/Private Mode**

1. Open browser in incognito/private mode
2. Visit: `http://srv1226397.hstgr.cloud`
3. Test the modal scrolling

This bypasses cache completely.

---

## **Step 7: Verify File Content on Server**

Check if the file actually has the correct code:

```bash
cd /var/www/frontend/components/auth
cat login-modal.tsx | grep -A 2 "overflow-y-auto"
```

Should show:
```tsx
className="space-y-4 flex-1 overflow-y-auto pr-2 -mr-2 pb-2">
```

---

## **Step 8: Force Re-upload File**

If file wasn't uploaded correctly:

### Using FileZilla:
1. Make sure you're uploading to: `/var/www/frontend/components/auth/`
2. **NOT** `/root/var/www/` or any other location
3. Upload the file and **overwrite** when prompted
4. Verify file size matches your local file

### Using SCP:
```bash
# From your local machine (PowerShell)
scp "C:\Users\Admin\Desktop\Goldapp dpl\Goldapp 2\frontend\components\auth\login-modal.tsx" root@93.127.206.164:/var/www/frontend/components/auth/login-modal.tsx
```

---

## **Step 9: Complete Fix - Full Process**

Run these commands in order:

```bash
# 1. SSH into server
ssh root@93.127.206.164

# 2. Go to frontend
cd /var/www/frontend

# 3. Verify file
grep "overflow-y-auto" components/auth/login-modal.tsx

# 4. Stop PM2
pm2 stop goldapp-frontend

# 5. Remove cache
rm -rf .next
rm -rf node_modules/.cache

# 6. Rebuild
npm run build

# 7. Wait for build to complete (2-5 minutes)
# Look for: "✓ Compiled successfully"

# 8. Restart PM2
pm2 delete goldapp-frontend
pm2 start npm --name "goldapp-frontend" -- start

# 9. Check status
pm2 status

# 10. Check logs
pm2 logs goldapp-frontend --lines 10
```

---

## **Step 10: Check Nginx (if using reverse proxy)**

```bash
# Reload Nginx
nginx -t
systemctl reload nginx
```

---

## 🔍 Diagnostic Commands

Run these to diagnose:

```bash
# Check file modification time
stat /var/www/frontend/components/auth/login-modal.tsx

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

Then **clear your browser cache** (Ctrl + Shift + Delete) and reload the page.

---

## 📝 Still Not Working?

1. **Verify file was uploaded:**
   ```bash
   cat /var/www/frontend/components/auth/login-modal.tsx | grep "overflow-y-auto"
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

**Start with Step 1 (verify file) and Step 3 (rebuild) - this fixes 90% of cases!**

