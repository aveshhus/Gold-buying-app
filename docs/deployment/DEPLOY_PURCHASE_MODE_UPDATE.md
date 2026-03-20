# Deploy Purchase Mode Update (Buy by Quantity/Amount)

This guide will help you update the purchase view component on your server to add the new "Buy by Quantity" and "Buy by Amount" options.

## Step 1: Upload the Updated File

### Option A: Using FileZilla (Recommended)

1. **Open FileZilla** and connect to your server:
   - Host: `93.127.206.164`
   - Username: `root`
   - Password: Your server password
   - Port: (leave empty or use 22 for SFTP)

2. **Navigate to the correct remote directory:**
   - Remote path: `/var/www/frontend/components/dashboard/`
   - ⚠️ **IMPORTANT:** Make sure you're in `/var/www/` NOT `/root/var/www/`

3. **Upload the file:**
   - Local file: `frontend/components/dashboard/purchase-view.tsx`
   - Remote path: `/var/www/frontend/components/dashboard/purchase-view.tsx`
   - Drag and drop the file from your local machine to the server

4. **Verify the upload:**
   - Check that the file size matches
   - Check the "Last modified" timestamp is recent

### Option B: Using SCP (Command Line)

```bash
# From your local machine (in the project root)
scp frontend/components/dashboard/purchase-view.tsx root@93.127.206.164:/var/www/frontend/components/dashboard/purchase-view.tsx
```

---

## Step 2: SSH into Your Server

```bash
ssh root@93.127.206.164
```

---

## Step 3: Verify the File is Updated

```bash
# Check if the file exists in the correct location
ls -la /var/www/frontend/components/dashboard/purchase-view.tsx

# Verify the new code is present (should show "PurchaseMode")
grep -i "PurchaseMode" /var/www/frontend/components/dashboard/purchase-view.tsx

# Verify the toggle buttons are present
grep -i "Buy by Quantity" /var/www/frontend/components/dashboard/purchase-view.tsx
grep -i "Buy by Amount" /var/www/frontend/components/dashboard/purchase-view.tsx
```

---

## Step 4: Rebuild the Frontend

```bash
# Navigate to frontend directory
cd /var/www/frontend

# Stop the frontend process
pm2 stop goldapp-frontend

# Remove old build
rm -rf .next

# Install dependencies (if needed - usually not required for code changes)
# npm install

# Build the frontend
npm run build

# Check if build was successful
# You should see "✓ Compiled successfully" at the end
```

---

## Step 5: Restart PM2

```bash
# Restart the frontend
pm2 restart goldapp-frontend

# Check status
pm2 status

# View logs to ensure no errors
pm2 logs goldapp-frontend --lines 50
```

---

## Step 6: Verify the Update

1. **Open your website** in a browser (use incognito/private mode to avoid cache)
2. **Navigate to** the "Buy Gold & Silver" section
3. **Check for:**
   - Two toggle buttons: "Buy by Quantity" and "Buy by Amount"
   - When "Buy by Quantity" is selected, you see a "Quantity (grams)" input
   - When "Buy by Amount" is selected, you see an "Amount (₹)" input
   - Calculations work correctly in both modes

---

## Troubleshooting

### Issue: Changes not showing

**Solution:**
```bash
# Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
# Or clear browser cache
# Or use incognito mode
```

### Issue: Build fails

**Solution:**
```bash
# Check for errors in the build output
cd /var/www/frontend
npm run build

# If there are TypeScript errors, check the error messages
# Common issues:
# - Missing imports
# - Type errors
# - Syntax errors
```

### Issue: File not found

**Solution:**
```bash
# Check if file is in the wrong location
find /var/www -name "purchase-view.tsx"

# If it's in /root/var/www/, move it:
mv /root/var/www/frontend/components/dashboard/purchase-view.tsx /var/www/frontend/components/dashboard/purchase-view.tsx
```

### Issue: PM2 not restarting

**Solution:**
```bash
# Check PM2 status
pm2 status

# If frontend is stopped, start it:
pm2 start goldapp-frontend

# If there are errors, check logs:
pm2 logs goldapp-frontend --err
```

---

## Quick Command Summary

```bash
# SSH into server
ssh root@93.127.206.164

# Verify file
grep -i "PurchaseMode" /var/www/frontend/components/dashboard/purchase-view.tsx

# Rebuild
cd /var/www/frontend
pm2 stop goldapp-frontend
rm -rf .next
npm run build
pm2 restart goldapp-frontend
pm2 status
```

---

## Expected Result

After deployment, users will see:
- ✅ Two toggle buttons: "Buy by Quantity" and "Buy by Amount"
- ✅ Quantity input field when "Buy by Quantity" is selected
- ✅ Amount input field when "Buy by Amount" is selected
- ✅ Real-time calculation showing the opposite value (amount when entering quantity, quantity when entering amount)
- ✅ All existing features (coupons, KYC, validation) working in both modes

---

**Note:** Make sure to upload the file to `/var/www/frontend/` NOT `/root/var/www/frontend/`!

