# 🔧 Fix Modal Scroll Not Working on Server (But Works Locally)

## Complete Fix Steps

---

## **Step 1: Verify File Was Uploaded Correctly**

SSH into server and check:

```bash
ssh root@93.127.206.164
cd /var/www/frontend/components/auth

# Check file modification time (should be recent)
ls -la login-modal.tsx

# Verify the scroll fix code is in the file
grep "overflow-y-auto" login-modal.tsx
grep "maxHeight" login-modal.tsx
```

**Expected:** Should show both `overflow-y-auto` and `maxHeight`

**If not found:** File wasn't uploaded correctly - re-upload it.

---

## **Step 2: Check if Build Includes the Changes**

```bash
cd /var/www/frontend

# Check if .next directory exists
ls -la .next

# Search for the scroll fix in built files
grep -r "overflow-y-auto" .next/ 2>/dev/null | head -5
grep -r "maxHeight" .next/ 2>/dev/null | head -5
```

**Expected:** Should find matches in the built files.

**If not found:** Build didn't include the changes - need to rebuild.

---

## **Step 3: Complete Clean Rebuild**

```bash
cd /var/www/frontend

# Stop PM2
pm2 stop goldapp-frontend

# Remove ALL caches
rm -rf .next
rm -rf node_modules/.cache
rm -rf .next/cache

# Rebuild (THIS IS CRITICAL - wait for completion!)
npm run build
```

**Wait for:** `✓ Compiled successfully`

**This may take 2-5 minutes. DO NOT interrupt it!**

---

## **Step 4: Verify Build Output**

After build completes:

```bash
# Check if build was created
ls -la .next

# Should see: BUILD_ID, server/, static/, etc.

# Verify scroll fix is in built files
grep -r "overflow-y-auto" .next/server/ 2>/dev/null | head -3
```

---

## **Step 5: Restart PM2 Completely**

```bash
# Delete the process
pm2 delete goldapp-frontend

# Navigate to frontend
cd /var/www/frontend

# Start fresh
pm2 start npm --name "goldapp-frontend" -- start

# Check status
pm2 status

# Check logs (should show no errors)
pm2 logs goldapp-frontend --lines 20
```

---

## **Step 6: Force Browser Cache Clear**

Even in incognito, try:

1. **Hard refresh:**
   - Chrome/Edge: `Ctrl + Shift + R` or `Ctrl + F5`
   - Firefox: `Ctrl + Shift + R` or `Ctrl + F5`

2. **Clear site data:**
   - Open DevTools (F12)
   - Right-click refresh button
   - Select "Empty Cache and Hard Reload"

3. **Try different browser:**
   - Test in Chrome, Firefox, Edge separately

4. **Check network tab:**
   - Open DevTools → Network tab
   - Check if files are loading from cache
   - Look for "from disk cache" - if you see this, cache is the issue

---

## **Step 7: Verify File Content Matches Local**

Compare server file with local file:

```bash
# On server
cat /var/www/frontend/components/auth/login-modal.tsx | grep -A 5 "overflow-y-auto"
```

Should show:
```tsx
<TabsContent value="register" className="mt-6 flex-1 min-h-0 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 250px)' }}>
```

If it doesn't match, the file wasn't uploaded correctly.

---

## **Step 8: Complete Fix - Full Process**

Run these commands in order:

```bash
# 1. SSH into server
ssh root@93.127.206.164

# 2. Go to frontend
cd /var/www/frontend

# 3. Verify file
grep "overflow-y-auto" components/auth/login-modal.tsx
grep "maxHeight" components/auth/login-modal.tsx

# 4. Stop PM2
pm2 stop goldapp-frontend

# 5. Remove ALL caches
rm -rf .next
rm -rf node_modules/.cache

# 6. Rebuild
npm run build

# 7. Wait for "✓ Compiled successfully" (2-5 minutes)

# 8. Verify build
ls -la .next

# 9. Restart PM2
pm2 delete goldapp-frontend
pm2 start npm --name "goldapp-frontend" -- start

# 10. Check status
pm2 status
pm2 logs goldapp-frontend --lines 10
```

---

## **Step 9: Check Nginx Cache (if using reverse proxy)**

```bash
# Reload Nginx
nginx -t
systemctl reload nginx

# Check Nginx config for caching
grep -i cache /etc/nginx/sites-available/goldapp
```

If Nginx is caching, you might need to disable it temporarily.

---

## **Step 10: Test Direct Port Access**

Bypass Nginx and test directly:

```bash
# Check if port 3003 is accessible
netstat -tulpn | grep 3003

# Try accessing: http://srv1226397.hstgr.cloud:3003
# (If port is open in firewall)
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

# Check build directory size
du -sh /var/www/frontend/.next

# Check for errors
pm2 logs goldapp-frontend --err --lines 50

# Check file content
head -300 /var/www/frontend/components/auth/login-modal.tsx | tail -50
```

---

## ✅ Most Likely Fix

**The file wasn't uploaded or build didn't include changes:**

```bash
# 1. Re-upload the file using FileZilla or SCP
# 2. Then on server:
cd /var/www/frontend
rm -rf .next
npm run build
pm2 restart goldapp-frontend
```

---

## 📝 Still Not Working?

1. **Compare file sizes:**
   ```bash
   # On server
   ls -lh /var/www/frontend/components/auth/login-modal.tsx
   
   # Compare with local file size
   ```

2. **Check build output for errors:**
   ```bash
   cd /var/www/frontend
   npm run build 2>&1 | tee build.log
   ```

3. **Check if CSS is being generated:**
   ```bash
   grep -r "overflow-y-auto" /var/www/frontend/.next/static/
   ```

4. **Try accessing the built file directly:**
   - Check browser DevTools → Network tab
   - See which files are loading
   - Check if they have the correct content

---

**Start with Step 1 (verify file) and Step 3 (rebuild) - this fixes 95% of cases!**

