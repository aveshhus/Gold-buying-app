# Deploy Minimum Order Validation Improvements to Server

This guide will help you deploy the enhanced minimum order validation with clear error messages and visual warnings.

## Files to Upload

### Backend Files:
1. `backend/server.js` (UPDATED)

### Frontend Files:
2. `frontend/components/dashboard/purchase-view.tsx` (UPDATED)

---

## Step 1: Upload Backend File

### Option A: Using FileZilla (Recommended)

1. **Open FileZilla** and connect to your server:
   - Host: `93.127.206.164`
   - Username: `root`
   - Password: Your server password
   - Port: (leave empty or use 22 for SFTP)

2. **Upload Updated server.js:**
   - Local: `backend/server.js`
   - Remote: `/var/www/backend/server.js`
   - Replace the existing file
   - ⚠️ **IMPORTANT:** Make sure you're in `/var/www/` NOT `/root/var/www/`

### Option B: Using SCP (Command Line)

```bash
# Upload updated server.js
scp backend/server.js root@93.127.206.164:/var/www/backend/server.js
```

---

## Step 2: Upload Frontend File

### Using FileZilla:

1. **Upload Updated purchase-view.tsx:**
   - Local: `frontend/components/dashboard/purchase-view.tsx`
   - Remote: `/var/www/frontend/components/dashboard/purchase-view.tsx`
   - Replace the existing file

### Using SCP:

```bash
# Upload frontend file
scp frontend/components/dashboard/purchase-view.tsx root@93.127.206.164:/var/www/frontend/components/dashboard/purchase-view.tsx
```

---

## Step 3: SSH into Server

```bash
ssh root@93.127.206.164
```

---

## Step 4: Verify Files are Uploaded Correctly

```bash
# Check backend file
ls -la /var/www/backend/server.js

# Check frontend file
ls -la /var/www/frontend/components/dashboard/purchase-view.tsx

# Verify enhanced error messages are present
grep -i "Order Not Placed" /var/www/backend/server.js
grep -i "Order Not Placed" /var/www/frontend/components/dashboard/purchase-view.tsx

# Verify warning section exists
grep -i "Minimum Order Requirements" /var/www/frontend/components/dashboard/purchase-view.tsx
```

---

## Step 5: Restart Backend

```bash
# Navigate to backend directory
cd /var/www/backend

# Restart backend with PM2
pm2 restart goldapp-backend

# Check status
pm2 status

# View logs to ensure no errors
pm2 logs goldapp-backend --lines 30
```

**Expected Output:**
- Should restart successfully
- No errors about syntax or missing imports

---

## Step 6: Rebuild Frontend

```bash
# Navigate to frontend directory
cd /var/www/frontend

# Stop frontend process
pm2 stop goldapp-frontend

# Remove old build
rm -rf .next

# Build the frontend
npm run build

# Check if build was successful
# You should see "✓ Compiled successfully" at the end
```

---

## Step 7: Restart Frontend

```bash
# Restart frontend
pm2 restart goldapp-frontend

# Check status
pm2 status

# View logs to ensure no errors
pm2 logs goldapp-frontend --lines 30
```

---

## Step 8: Verify the Feature

1. **Open your website** in a browser (use incognito/private mode to avoid cache)
2. **Login as a user** (not admin)
3. **Navigate to "Buy Gold & Silver" section**
4. **Check for:**
   - Yellow warning card showing "Minimum Order Requirements"
   - Real-time validation showing if your order meets requirements
   - Clear error messages when order is rejected

---

## Step 9: Test the Feature

### Test 1: Visual Warning Display
- Go to "Buy Gold & Silver"
- Select Gold or Silver
- Enter a quantity/amount
- **Verify:** Yellow warning card appears showing minimum requirements
- **Verify:** Real-time status shows if order meets requirements (green/red)

### Test 2: Minimum Quantity Validation (Gold)
- Select Gold, 24K
- Enter quantity: 0.10 grams (below 0.15 minimum)
- Click "Create Purchase"
- **Verify:** Error message appears: "❌ Order Not Placed: Minimum Quantity Not Met"
- **Verify:** Message explains: "For Gold purchases, the minimum quantity is 0.15 grams..."

### Test 3: Minimum Quantity Validation (Silver)
- Select Silver
- Enter quantity: 5 grams (below 10 minimum)
- Click "Create Purchase"
- **Verify:** Error message appears: "❌ Order Not Placed: Minimum Quantity Not Met"
- **Verify:** Message explains: "For Silver purchases, the minimum quantity is 10 grams..."

### Test 4: Minimum Order Value Validation
- Select any metal
- Enter quantity/amount that results in less than ₹2,000
- Click "Create Purchase"
- **Verify:** Error message appears: "❌ Order Not Placed: Minimum Order Value Not Met"
- **Verify:** Message explains: "The minimum order value is ₹2,000. Orders below ₹2,000 will be automatically rejected."

### Test 5: Successful Order
- Enter quantity/amount that meets all requirements:
  - Gold: ≥ 0.15g AND ≥ ₹2,000
  - Silver: ≥ 10g AND ≥ ₹2,000
- Click "Create Purchase"
- **Verify:** Order is created successfully
- **Verify:** Success message appears

---

## Troubleshooting

### Issue: Warning card not showing

**Solution:**
```bash
# Verify the file was uploaded correctly
grep -i "Minimum Order Requirements" /var/www/frontend/components/dashboard/purchase-view.tsx

# Rebuild frontend
cd /var/www/frontend
rm -rf .next
npm run build
pm2 restart goldapp-frontend
```

### Issue: Error messages not showing correctly

**Solution:**
```bash
# Check backend error messages
grep -i "Order Not Placed" /var/www/backend/server.js

# Check frontend error handling
grep -i "toast.error" /var/www/frontend/components/dashboard/purchase-view.tsx

# Restart both services
pm2 restart goldapp-backend goldapp-frontend
```

### Issue: Real-time validation not updating

**Solution:**
```bash
# Verify displayQuantity and displayAmount states exist
grep -i "displayQuantity\|displayAmount" /var/www/frontend/components/dashboard/purchase-view.tsx

# Clear browser cache and hard refresh (Ctrl+Shift+R)
# Or use incognito mode
```

### Issue: Changes not showing

**Solution:**
```bash
# Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
# Or clear browser cache
# Or use incognito mode

# Verify files are in correct location
ls -la /var/www/backend/server.js
ls -la /var/www/frontend/components/dashboard/purchase-view.tsx
```

---

## Quick Command Summary

```bash
# SSH into server
ssh root@93.127.206.164

# Verify files
grep -i "Order Not Placed" /var/www/backend/server.js
grep -i "Minimum Order Requirements" /var/www/frontend/components/dashboard/purchase-view.tsx

# Restart backend
cd /var/www/backend
pm2 restart goldapp-backend
pm2 logs goldapp-backend --lines 20

# Rebuild frontend
cd /var/www/frontend
pm2 stop goldapp-frontend
rm -rf .next
npm run build
pm2 restart goldapp-frontend
pm2 status
```

---

## Expected Result

After deployment:
- ✅ Yellow warning card appears showing minimum requirements
- ✅ Real-time validation shows if order meets requirements (green/red indicators)
- ✅ Clear error messages when order is rejected:
  - "❌ Order Not Placed: Minimum Quantity Not Met" (with detailed explanation)
  - "❌ Order Not Placed: Minimum Order Value Not Met" (with detailed explanation)
- ✅ Error messages explain:
  - What the requirement is
  - What the user entered
  - What they need to do to fix it
- ✅ Orders that meet all requirements are accepted successfully

---

## Important Notes

1. **File Locations:** Always upload to `/var/www/` NOT `/root/var/www/`
2. **Browser Cache:** Use incognito mode or hard refresh (Ctrl+Shift+R) to see changes
3. **Validation:** Both frontend and backend validate, so users get immediate feedback
4. **User Experience:** Users now see requirements before submitting and get clear explanations if rejected

---

**Ready to deploy!** Follow the steps above to get the enhanced validation feature live on your server.

