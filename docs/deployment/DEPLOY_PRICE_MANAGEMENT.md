# Deploy Price Management Feature to Server

This guide will help you deploy the new Price Management feature (Live API / Manual Price Toggle) to your server.

## Files to Upload

### Backend Files:
1. `backend/models/PriceSettings.js` (NEW FILE)
2. `backend/server.js` (UPDATED)

### Frontend Files:
3. `frontend/lib/api.ts` (UPDATED)
4. `frontend/components/admin/admin-prices.tsx` (NEW FILE)
5. `frontend/components/admin/admin-layout.tsx` (UPDATED)

---

## Step 1: Upload Backend Files

### Option A: Using FileZilla (Recommended)

1. **Open FileZilla** and connect to your server:
   - Host: `93.127.206.164`
   - Username: `root`
   - Password: Your server password
   - Port: (leave empty or use 22 for SFTP)

2. **Upload PriceSettings Model (NEW FILE):**
   - Local: `backend/models/PriceSettings.js`
   - Remote: `/var/www/backend/models/PriceSettings.js`
   - ⚠️ **IMPORTANT:** Make sure you're in `/var/www/` NOT `/root/var/www/`

3. **Upload Updated server.js:**
   - Local: `backend/server.js`
   - Remote: `/var/www/backend/server.js`
   - Replace the existing file

### Option B: Using SCP (Command Line)

```bash
# Upload PriceSettings model
scp backend/models/PriceSettings.js root@93.127.206.164:/var/www/backend/models/PriceSettings.js

# Upload updated server.js
scp backend/server.js root@93.127.206.164:/var/www/backend/server.js
```

---

## Step 2: Upload Frontend Files

### Using FileZilla:

1. **Upload Updated api.ts:**
   - Local: `frontend/lib/api.ts`
   - Remote: `/var/www/frontend/lib/api.ts`

2. **Upload New admin-prices.tsx:**
   - Local: `frontend/components/admin/admin-prices.tsx`
   - Remote: `/var/www/frontend/components/admin/admin-prices.tsx`

3. **Upload Updated admin-layout.tsx:**
   - Local: `frontend/components/admin/admin-layout.tsx`
   - Remote: `/var/www/frontend/components/admin/admin-layout.tsx`

### Using SCP:

```bash
# Upload frontend files
scp frontend/lib/api.ts root@93.127.206.164:/var/www/frontend/lib/api.ts
scp frontend/components/admin/admin-prices.tsx root@93.127.206.164:/var/www/frontend/components/admin/admin-prices.tsx
scp frontend/components/admin/admin-layout.tsx root@93.127.206.164:/var/www/frontend/components/admin/admin-layout.tsx
```

---

## Step 3: SSH into Server

```bash
ssh root@93.127.206.164
```

---

## Step 4: Verify Files are Uploaded Correctly

```bash
# Check backend files
ls -la /var/www/backend/models/PriceSettings.js
ls -la /var/www/backend/server.js

# Check frontend files
ls -la /var/www/frontend/lib/api.ts
ls -la /var/www/frontend/components/admin/admin-prices.tsx
ls -la /var/www/frontend/components/admin/admin-layout.tsx

# Verify PriceSettings model exists
grep -i "PriceSettings" /var/www/backend/server.js

# Verify admin prices component exists
grep -i "AdminPrices" /var/www/frontend/components/admin/admin-layout.tsx
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
pm2 logs goldapp-backend --lines 50
```

**Expected Output:**
- Should see "✅ Price settings updated" or similar messages if working
- No errors about PriceSettings model

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
pm2 logs goldapp-frontend --lines 50
```

---

## Step 8: Verify the Feature

1. **Open your website** in a browser (use incognito/private mode to avoid cache)
2. **Login as Admin**
3. **Navigate to Admin Panel**
4. **Check for "Price Management" in the menu** (should be between "Refunds" and "Notifications")
5. **Click on "Price Management"**
6. **You should see:**
   - Current market prices display
   - Toggle buttons: "Live API" and "Manual"
   - When "Manual" is selected, form fields for entering prices
   - "Save Settings" button

---

## Step 9: Test the Feature

### Test 1: Check Current Prices
- In Price Management, verify current prices are displayed
- Click "Refresh" to reload prices

### Test 2: Switch to Manual Mode
- Click "Manual" button
- Enter test prices (e.g., 10000, 9000, 100)
- Click "Save Settings"
- Should see success message

### Test 3: Verify Manual Prices Work
- Go to "Buy Gold & Silver" page (as regular user)
- Check if prices match the manual prices you set
- Prices should show the manual values

### Test 4: Switch Back to Live API
- Go back to Price Management
- Click "Live API" button
- Click "Save Settings"
- Go to "Buy Gold & Silver" page
- Prices should now come from API

---

## Troubleshooting

### Issue: Backend won't start / PriceSettings error

**Solution:**
```bash
# Check if PriceSettings.js exists
ls -la /var/www/backend/models/PriceSettings.js

# Check server.js imports
grep -i "PriceSettings" /var/www/backend/server.js

# Check PM2 logs for errors
pm2 logs goldapp-backend --err --lines 100
```

### Issue: Frontend build fails

**Solution:**
```bash
cd /var/www/frontend

# Check for TypeScript errors
npm run type-check

# Check for missing imports
grep -r "admin-prices" /var/www/frontend/components/admin/

# Try clean install
rm -rf node_modules .next
npm install
npm run build
```

### Issue: "Price Management" not showing in menu

**Solution:**
```bash
# Verify admin-layout.tsx has the import
grep -i "AdminPrices" /var/www/frontend/components/admin/admin-layout.tsx

# Verify the menu item exists
grep -i "Price Management" /var/www/frontend/components/admin/admin-layout.tsx

# Rebuild frontend
cd /var/www/frontend
rm -rf .next
npm run build
pm2 restart goldapp-frontend
```

### Issue: API endpoints not working

**Solution:**
```bash
# Test backend endpoints
curl -H "Authorization: Bearer YOUR_ADMIN_TOKEN" http://localhost:3001/api/admin/prices/settings

# Check if endpoints are registered
grep -i "/api/admin/prices" /var/www/backend/server.js

# Restart backend
pm2 restart goldapp-backend
pm2 logs goldapp-backend
```

### Issue: Changes not showing

**Solution:**
```bash
# Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
# Or clear browser cache
# Or use incognito mode

# Verify files are in correct location
find /var/www -name "PriceSettings.js"
find /var/www -name "admin-prices.tsx"
```

---

## Quick Command Summary

```bash
# SSH into server
ssh root@93.127.206.164

# Verify files
ls -la /var/www/backend/models/PriceSettings.js
ls -la /var/www/frontend/components/admin/admin-prices.tsx

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
- ✅ "Price Management" appears in admin menu
- ✅ Admin can toggle between "Live API" and "Manual" modes
- ✅ Admin can set manual prices for 24K Gold, 22K Gold, and Silver
- ✅ Manual prices are saved and displayed to users
- ✅ Admin can switch back to Live API mode anytime
- ✅ All existing features continue to work

---

## Important Notes

1. **File Locations:** Always upload to `/var/www/` NOT `/root/var/www/`
2. **Database:** The PriceSettings model will automatically create a document in MongoDB on first use
3. **Default Mode:** Initially, the system will be in "Live API" mode
4. **Manual Prices:** When switching to manual mode, if prices are 0, the system will copy current live prices
5. **Future API Update:** When you get a new paid API, we'll only need to update the API endpoint in `server.js`, the admin interface will work automatically

---

**Ready to deploy!** Follow the steps above to get the Price Management feature live on your server.

