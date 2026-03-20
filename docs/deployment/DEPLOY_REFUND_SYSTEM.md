# Deploy Refund System Updates to Live Server

## Summary of Changes
This deployment includes all fixes and improvements for the refund system:
- Fixed notification validation errors
- Improved toast notifications for status updates
- Added "Refund Requested" badge in user panel
- Instant status updates in admin panel
- Better error handling and user feedback

---

## Files Changed

### Backend Files:
1. **`backend/models/Notification.js`**
   - Added 'refund' to the type enum

2. **`backend/server.js`**
   - Added `createNotification()` helper function (line ~151)
   - Updated refund request submission notification (line ~2686)
   - Updated refund processed notification (line ~2772)
   - Updated refund approved notification (line ~2827)
   - Updated refund rejected notification (line ~2880)

### Frontend Files:
3. **`frontend/types/index.ts`**
   - Added `RefundRequest` interface
   - Updated `Notification` type to include 'refund'

4. **`frontend/components/dashboard/portfolio-view.tsx`**
   - Added refund requests state and fetching
   - Added `getRefundRequestForPurchase()` function
   - Updated refund button to show "Refund Requested" badge
   - Improved toast notification timing
   - Added console logging for debugging

5. **`frontend/components/admin/admin-refunds.tsx`**
   - Implemented optimistic UI updates
   - Improved toast notification timing
   - Added functional state updates
   - Added console logging for debugging

6. **`frontend/app/layout.tsx`**
   - Enhanced Toaster configuration with `expand` and `duration` props

---

## Deployment Steps

### Step 1: Backup Current Files (IMPORTANT!)
```bash
# SSH into your server
ssh root@your-server-ip

# Navigate to project directory
cd /var/www

# Create backup
mkdir -p ~/backup_$(date +%Y%m%d_%H%M%S)
cp -r backend ~/backup_$(date +%Y%m%d_%H%M%S)/
cp -r frontend ~/backup_$(date +%Y%m%d_%H%M%S)/
```

### Step 2: Upload Backend Files

#### Option A: Using SCP (from your local machine)
```bash
# From your local machine (Windows PowerShell)
cd "C:\Users\Admin\Desktop\Goldapp dpl\Goldapp 2"

# Upload backend files
scp backend/models/Notification.js root@your-server-ip:/var/www/backend/models/
scp backend/server.js root@your-server-ip:/var/www/backend/
```

#### Option B: Using FileZilla
1. Connect to your server via FileZilla
2. Navigate to `/var/www/backend/models/`
3. Upload `Notification.js`
4. Navigate to `/var/www/backend/`
5. Upload `server.js` (overwrite existing)

### Step 3: Upload Frontend Files

#### Option A: Using SCP
```bash
# From your local machine
scp frontend/types/index.ts root@your-server-ip:/var/www/frontend/types/
scp frontend/components/dashboard/portfolio-view.tsx root@your-server-ip:/var/www/frontend/components/dashboard/
scp frontend/components/admin/admin-refunds.tsx root@your-server-ip:/var/www/frontend/components/admin/
scp frontend/app/layout.tsx root@your-server-ip:/var/www/frontend/app/
```

#### Option B: Using FileZilla
1. Upload `frontend/types/index.ts`
2. Upload `frontend/components/dashboard/portfolio-view.tsx`
3. Upload `frontend/components/admin/admin-refunds.tsx`
4. Upload `frontend/app/layout.tsx`

### Step 4: Restart Backend Server

```bash
# SSH into server
ssh root@your-server-ip

# Navigate to backend
cd /var/www/backend

# Restart PM2 process
pm2 restart backend

# Check status
pm2 status
pm2 logs backend --lines 50
```

### Step 5: Rebuild Frontend

```bash
# Navigate to frontend
cd /var/www/frontend

# Remove old build
rm -rf .next

# Install dependencies (if needed)
npm install

# Build frontend
npm run build

# Restart PM2 process
pm2 restart frontend

# Check status
pm2 status
pm2 logs frontend --lines 50
```

### Step 6: Verify Deployment

1. **Check Backend:**
   ```bash
   # Check if server is running
   curl http://localhost:3001/api/health
   
   # Check PM2 logs for errors
   pm2 logs backend --lines 100
   ```

2. **Check Frontend:**
   ```bash
   # Check if frontend is running
   curl http://localhost:3003
   
   # Check PM2 logs for errors
   pm2 logs frontend --lines 100
   ```

3. **Test in Browser:**
   - Open your website
   - Test refund request submission (user panel)
   - Test refund approval/rejection/processing (admin panel)
   - Verify toast notifications appear
   - Check browser console for any errors

---

## Verification Checklist

- [ ] Backend server restarted successfully
- [ ] Frontend built without errors
- [ ] Frontend server restarted successfully
- [ ] No errors in PM2 logs
- [ ] User can submit refund request
- [ ] Toast notification appears after refund submission
- [ ] "Refund Requested" badge appears in user portfolio
- [ ] Admin can approve/reject/process refunds
- [ ] Toast notification appears after admin actions
- [ ] Status updates instantly without page refresh
- [ ] No notification validation errors in console

---

## Rollback Plan (If Something Goes Wrong)

```bash
# SSH into server
ssh root@your-server-ip

# Stop PM2 processes
pm2 stop backend
pm2 stop frontend

# Restore from backup
cd ~
BACKUP_DIR=$(ls -t | grep backup | head -1)
cp -r $BACKUP_DIR/backend /var/www/
cp -r $BACKUP_DIR/frontend /var/www/

# Restart services
cd /var/www/backend
pm2 restart backend

cd /var/www/frontend
pm2 restart frontend
```

---

## Important Notes

1. **Server Restart Required:** The Notification model change requires a backend restart to take effect.

2. **Build Time:** Frontend build may take 2-5 minutes depending on server resources.

3. **Zero Downtime:** PM2 will handle graceful restarts, but there may be a brief moment (1-2 seconds) where requests fail.

4. **Browser Cache:** Users may need to do a hard refresh (Ctrl+F5) to see frontend changes.

5. **Console Logs:** Console logs are added for debugging. You can remove them later if needed.

---

## Support

If you encounter any issues:
1. Check PM2 logs: `pm2 logs`
2. Check browser console for errors
3. Verify all files were uploaded correctly
4. Ensure server has enough resources (memory, disk space)
5. Check Nginx logs if using reverse proxy: `tail -f /var/log/nginx/error.log`

---

## Files Summary

**Backend (2 files):**
- `backend/models/Notification.js`
- `backend/server.js`

**Frontend (4 files):**
- `frontend/types/index.ts`
- `frontend/components/dashboard/portfolio-view.tsx`
- `frontend/components/admin/admin-refunds.tsx`
- `frontend/app/layout.tsx`

**Total: 6 files to deploy**

