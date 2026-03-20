# 🚀 Deploy Modal Scroll Fix to Server

## Step-by-Step Deployment Guide

---

## **Step 1: Upload Updated File to Server**

### Option A: Using FileZilla (SFTP) - Recommended

1. **Open FileZilla**
2. **Connect to your server:**
   - Host: `sftp://93.127.206.164`
   - Username: `root`
   - Password: (your server password)
   - Port: `22`

3. **Navigate to frontend folder:**
   - Go to: `/var/www/frontend/components/auth/`

4. **Upload the file:**
   - Find `login-modal.tsx` in your local folder:
     - `C:\Users\Admin\Desktop\Goldapp dpl\Goldapp 2\frontend\components\auth\login-modal.tsx`
   - Drag and drop it to `/var/www/frontend/components/auth/`
   - **Replace** the existing file when prompted

---

### Option B: Using SCP (Command Line)

Open PowerShell in your project folder and run:

```powershell
scp "C:\Users\Admin\Desktop\Goldapp dpl\Goldapp 2\frontend\components\auth\login-modal.tsx" root@93.127.206.164:/var/www/frontend/components/auth/
```

Enter your password when prompted.

---

## **Step 2: SSH into Server**

```bash
ssh root@93.127.206.164
```

Enter your password when prompted.

---

## **Step 3: Navigate to Frontend Directory**

```bash
cd /var/www/frontend
```

---

## **Step 4: Verify File Was Uploaded**

```bash
# Check if file exists and has recent modification time
ls -la /var/www/frontend/components/auth/login-modal.tsx

# Check if it contains the scroll fix code
grep "overflow-y-auto" /var/www/frontend/components/auth/login-modal.tsx
```

If the grep shows results, the file was uploaded correctly.

---

## **Step 5: Clear Next.js Cache and Rebuild**

```bash
# Clear Next.js cache
rm -rf .next

# Rebuild the application
npm run build
```

**Wait for build to complete** - This may take 2-5 minutes. You should see:
```
✓ Compiled successfully
```

---

## **Step 6: Restart Frontend with PM2**

```bash
# Stop frontend first
pm2 stop goldapp-frontend

# Restart it
pm2 restart goldapp-frontend

# Check status
pm2 status
```

You should see `goldapp-frontend` showing as `online` ✅

---

## **Step 7: View Logs (Optional)**

```bash
pm2 logs goldapp-frontend --lines 20
```

Check for any errors. If you see "Ready" or "Compiled successfully", you're good!

---

## **Step 8: Test on Live Website**

1. Open your browser
2. Visit: `http://srv1226397.hstgr.cloud`
3. Click "Get Started" or "Sign In" button
4. Click the "Register" tab
5. **Test scrolling:**
   - ✅ Scroll through all form fields
   - ✅ Header and tabs stay fixed at top
   - ✅ Form scrolls smoothly
   - ✅ "Create Account" button is visible after scrolling

---

## 🔧 Troubleshooting

### If Build Fails:

```bash
# Check for errors
npm run build

# If there are dependency issues
npm install

# Then rebuild
npm run build
```

### If Frontend Doesn't Start:

```bash
# Check PM2 logs
pm2 logs goldapp-frontend --lines 50

# Delete and restart
pm2 delete goldapp-frontend
cd /var/www/frontend
pm2 start npm --name "goldapp-frontend" -- start
```

### If Changes Don't Appear:

```bash
# Clear Next.js cache
rm -rf /var/www/frontend/.next

# Rebuild
npm run build

# Restart
pm2 restart goldapp-frontend

# Clear browser cache (Ctrl + Shift + Delete)
```

---

## 📋 Quick Command Summary

```bash
# 1. SSH into server
ssh root@93.127.206.164

# 2. Navigate to frontend
cd /var/www/frontend

# 3. Verify file uploaded
grep "overflow-y-auto" /var/www/frontend/components/auth/login-modal.tsx

# 4. Clear cache and rebuild
rm -rf .next
npm run build

# 5. Restart
pm2 stop goldapp-frontend
pm2 restart goldapp-frontend

# 6. Check status
pm2 status
```

---

## ✅ Checklist

- [ ] Uploaded `login-modal.tsx` to server
- [ ] Verified file was uploaded (grep check)
- [ ] SSH into server
- [ ] Navigated to `/var/www/frontend`
- [ ] Ran `rm -rf .next`
- [ ] Ran `npm run build` (successful)
- [ ] Ran `pm2 restart goldapp-frontend`
- [ ] Checked `pm2 status` (shows online)
- [ ] Tested website - modal scrolls correctly
- [ ] Verified all form fields are accessible

---

**Ready to deploy? Start with Step 1!** 🚀

