# 🚀 Deploy Footer Update to Server

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
   - Go to: `/var/www/frontend/components/landing/`

4. **Upload the file:**
   - Find `landing-page.tsx` in your local folder:
     - `C:\Users\Admin\Desktop\Goldapp dpl\Goldapp 2\frontend\components\landing\landing-page.tsx`
   - Drag and drop it to `/var/www/frontend/components/landing/`
   - **Replace** the existing file when prompted

---

### Option B: Using SCP (Command Line)

Open PowerShell in your project folder and run:

```powershell
scp "C:\Users\Admin\Desktop\Goldapp dpl\Goldapp 2\frontend\components\landing\landing-page.tsx" root@93.127.206.164:/var/www/frontend/components/landing/
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

## **Step 4: Rebuild Frontend**

```bash
npm run build
```

**Wait for build to complete** - This may take 2-5 minutes. You should see:
```
✓ Compiled successfully
```

---

## **Step 5: Restart Frontend with PM2**

```bash
pm2 restart goldapp-frontend
```

---

## **Step 6: Check Status**

```bash
pm2 status
```

You should see `goldapp-frontend` showing as `online` ✅

---

## **Step 7: View Logs (Optional)**

```bash
pm2 logs goldapp-frontend --lines 20
```

Check for any errors. If you see "Build completed successfully" or similar, you're good!

---

## **Step 8: Test on Live Website**

1. Open your browser
2. Visit: `http://srv1226397.hstgr.cloud`
3. Scroll down to the footer
4. **Verify:**
   - ✅ 6 columns are visible
   - ✅ All sections are properly aligned
   - ✅ Contact details are correct
   - ✅ Links work properly

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
```

---

## 📋 Quick Command Summary

```bash
# 1. SSH into server
ssh root@93.127.206.164

# 2. Navigate to frontend
cd /var/www/frontend

# 3. Rebuild
npm run build

# 4. Restart
pm2 restart goldapp-frontend

# 5. Check status
pm2 status
```

---

## ✅ Checklist

- [ ] Uploaded `landing-page.tsx` to server
- [ ] SSH into server
- [ ] Navigated to `/var/www/frontend`
- [ ] Ran `npm run build` (successful)
- [ ] Ran `pm2 restart goldapp-frontend`
- [ ] Checked `pm2 status` (shows online)
- [ ] Tested website - footer shows 6 columns
- [ ] Verified all links work

---

**Ready to deploy? Start with Step 1!** 🚀

