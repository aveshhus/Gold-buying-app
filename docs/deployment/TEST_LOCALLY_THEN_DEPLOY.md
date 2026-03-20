# 📝 Test Locally Then Deploy to Server

## ✅ Step 1: Test Locally First

### 1.1 Navigate to Frontend Folder
```bash
cd frontend
```

### 1.2 Install Dependencies (if needed)
```bash
npm install
```

### 1.3 Start Development Server
```bash
npm run dev
```

### 1.4 Open Browser
- Open: `http://localhost:3000` (or the port shown in terminal)
- Check the welcome page:
  - ✅ Hero section with updated business description
  - ✅ "Our Story" section
  - ✅ "Our Craftsmanship" section
  - ✅ "Our Values" section (Quality, Integrity, Innovation)
  - ✅ "Why Choose Us" section (Authenticity, Customer Service, Heritage)
  - ✅ "Our Collections" section (Gold, Silver, Diamond)
  - ✅ Footer with:
    - Updated business description
    - Address: Vaishali Nagar, Jaipur
    - Phone: +91 97990 89292
    - Email: shreeomjisaraf@gmail.com
    - Website: www.shreeomjisaraf.com
    - Social media links

### 1.5 Test All Sections
- Scroll through entire page
- Check all links (phone, email, website, social media)
- Verify text formatting and layout
- Test on different screen sizes (responsive design)

---

## 🚀 Step 2: Deploy to Server (After Local Testing)

### 2.1 Upload Updated File to Server

**Option A: Using FileZilla (SFTP)**
1. Open FileZilla
2. Connect to your server: `93.127.206.164`
3. Navigate to: `/var/www/frontend/components/landing/`
4. Upload: `landing-page.tsx` (replace existing file)

**Option B: Using Git (if you have a repository)**
```bash
git add frontend/components/landing/landing-page.tsx
git commit -m "Update welcome page with business details"
git push
# Then on server: git pull
```

**Option C: Using SCP (from your local machine)**
```bash
scp frontend/components/landing/landing-page.tsx root@93.127.206.164:/var/www/frontend/components/landing/
```

---

### 2.2 SSH into Server
```bash
ssh root@93.127.206.164
```

---

### 2.3 Navigate to Frontend Directory
```bash
cd /var/www/frontend
```

---

### 2.4 Rebuild Frontend
```bash
# Make sure you're in the frontend directory
cd /var/www/frontend

# Rebuild the Next.js application
npm run build
```

**Note:** This may take a few minutes. Wait for "Build completed successfully"

---

### 2.5 Restart Frontend with PM2
```bash
# Restart the frontend process
pm2 restart goldapp-frontend

# Check status
pm2 status

# View logs to ensure no errors
pm2 logs goldapp-frontend --lines 20
```

---

### 2.6 Test on Server
1. Open browser
2. Visit: `http://srv1226397.hstgr.cloud`
3. Verify all changes are visible:
   - ✅ New sections appear
   - ✅ Footer has correct contact details
   - ✅ All links work properly

---

## 🔍 Troubleshooting

### If Build Fails:
```bash
# Check for errors
npm run build

# If TypeScript/ESLint errors, they should be ignored (already configured)
# If other errors, check the error message
```

### If Frontend Doesn't Start:
```bash
# Check PM2 logs
pm2 logs goldapp-frontend --lines 50

# Restart PM2
pm2 restart goldapp-frontend

# Check if port 3003 is in use
netstat -tulpn | grep 3003
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

## 📋 Quick Checklist

**Local Testing:**
- [ ] Run `npm run dev` in frontend folder
- [ ] Open `http://localhost:3000`
- [ ] Verify all new sections appear
- [ ] Check footer contact details
- [ ] Test all links
- [ ] Check responsive design

**Server Deployment:**
- [ ] Upload `landing-page.tsx` to server
- [ ] SSH into server
- [ ] Navigate to `/var/www/frontend`
- [ ] Run `npm run build`
- [ ] Run `pm2 restart goldapp-frontend`
- [ ] Test on `http://srv1226397.hstgr.cloud`
- [ ] Verify all changes are live

---

## 🎯 Summary

1. **Test Locally First** → `npm run dev` in `frontend` folder
2. **Upload File** → Upload `landing-page.tsx` to server
3. **Rebuild** → `npm run build` on server
4. **Restart** → `pm2 restart goldapp-frontend`
5. **Test** → Visit your website and verify changes

---

**Ready to test locally? Start with Step 1!** 🚀

