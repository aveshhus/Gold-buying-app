# 🔧 Fix Razorpay on Live Server

## Common Issues & Solutions

### Issue 1: Backend Not Updated

**Check if Razorpay is installed on server:**
```bash
ssh root@93.127.206.164
cd /var/www/backend
npm list razorpay
```

**If not installed:**
```bash
npm install razorpay
pm2 restart goldapp-backend
```

---

### Issue 2: Environment Variables Not Set

**Check .env file:**
```bash
ssh root@93.127.206.164
cd /var/www/backend
cat .env | grep RAZORPAY
```

**If missing, add:**
```bash
nano .env
```

Add these lines:
```env
RAZORPAY_KEY_ID=rzp_live_SConp1xSu8h69e
RAZORPAY_KEY_SECRET=yOR7LQmT9mU4mjnH0wKWRYCt
RAZORPAY_WEBHOOK_SECRET=
```

Save and restart:
```bash
pm2 restart goldapp-backend
```

---

### Issue 3: Frontend Not Updated

**Check if frontend has Razorpay files:**
```bash
ssh root@93.127.206.164
ls /var/www/frontend/lib/razorpay.ts
ls /var/www/frontend/components/dashboard/purchase-view.tsx
```

**Upload frontend files:**
```powershell
# From your local machine
scp "Goldapp 2\frontend\lib\razorpay.ts" root@93.127.206.164:/var/www/frontend/lib/razorpay.ts
scp "Goldapp 2\frontend\lib\api.ts" root@93.127.206.164:/var/www/frontend/lib/api.ts
scp "Goldapp 2\frontend\components\dashboard\purchase-view.tsx" root@93.127.206.164:/var/www/frontend/components/dashboard/purchase-view.tsx
```

**Rebuild frontend:**
```bash
ssh root@93.127.206.164
cd /var/www/frontend
npm run build
pm2 restart goldapp-frontend
```

---

### Issue 4: Check Backend Logs

**View errors:**
```bash
ssh root@93.127.206.164
pm2 logs goldapp-backend --lines 50 | grep -i "razorpay\|error\|payment"
```

**Check if Razorpay initialized:**
```bash
pm2 logs goldapp-backend | grep -i "razorpay"
```

---

### Issue 5: Browser Console Errors

**Check browser console (F12) on https://shreeomjisaraf.com/**
- Look for errors related to Razorpay
- Check if `window.Razorpay` is defined
- Check network tab for failed API calls

---

## 🔍 Complete Diagnostic Script

Run this on server to check everything:

```bash
ssh root@93.127.206.164 << 'ENDSSH'
echo "=== Checking Razorpay Setup ==="
echo ""

cd /var/www/backend

echo "1. Checking Razorpay package:"
npm list razorpay 2>/dev/null || echo "❌ Razorpay not installed"

echo ""
echo "2. Checking .env file:"
if grep -q "RAZORPAY_KEY_ID" .env; then
    echo "✅ RAZORPAY_KEY_ID found"
    grep "RAZORPAY_KEY_ID" .env | head -1
else
    echo "❌ RAZORPAY_KEY_ID missing"
fi

if grep -q "RAZORPAY_KEY_SECRET" .env; then
    echo "✅ RAZORPAY_KEY_SECRET found"
else
    echo "❌ RAZORPAY_KEY_SECRET missing"
fi

echo ""
echo "3. Checking backend files:"
if grep -q "razorpay" server.js; then
    echo "✅ Razorpay code found in server.js"
else
    echo "❌ Razorpay code missing in server.js"
fi

echo ""
echo "4. Checking PM2 status:"
pm2 status

echo ""
echo "5. Recent logs (last 20 lines):"
pm2 logs goldapp-backend --lines 20 --nostream

echo ""
echo "=== Frontend Check ==="
cd /var/www/frontend

if [ -f "lib/razorpay.ts" ]; then
    echo "✅ razorpay.ts exists"
else
    echo "❌ razorpay.ts missing"
fi

if grep -q "razorpay" "lib/api.ts" 2>/dev/null; then
    echo "✅ Razorpay API methods found"
else
    echo "❌ Razorpay API methods missing"
fi

ENDSSH
```

---

## 🚀 Quick Fix (All-in-One)

**Run this to fix everything:**

```bash
ssh root@93.127.206.164 << 'ENDSSH'
cd /var/www/backend

# Install Razorpay
npm install razorpay

# Add to .env if missing
if ! grep -q "RAZORPAY_KEY_ID" .env; then
    echo "" >> .env
    echo "RAZORPAY_KEY_ID=rzp_live_SConp1xSu8h69e" >> .env
    echo "RAZORPAY_KEY_SECRET=yOR7LQmT9mU4mjnH0wKWRYCt" >> .env
    echo "RAZORPAY_WEBHOOK_SECRET=" >> .env
fi

# Restart backend
pm2 restart goldapp-backend

# Check status
pm2 logs goldapp-backend --lines 10 --nostream

ENDSSH
```

---

## 📤 Upload All Files Script

**From your local machine, upload everything:**

```powershell
# Backend files
scp "Goldapp 2\backend\server.js" root@93.127.206.164:/var/www/backend/server.js
scp "Goldapp 2\backend\models\Payment.js" root@93.127.206.164:/var/www/backend/models/Payment.js
scp "Goldapp 2\backend\package.json" root@93.127.206.164:/var/www/backend/package.json

# Frontend files
scp "Goldapp 2\frontend\lib\razorpay.ts" root@93.127.206.164:/var/www/frontend/lib/razorpay.ts
scp "Goldapp 2\frontend\lib\api.ts" root@93.127.206.164:/var/www/frontend/lib/api.ts
scp "Goldapp 2\frontend\components\dashboard\purchase-view.tsx" root@93.127.206.164:/var/www/frontend/components/dashboard/purchase-view.tsx

# Then run on server
ssh root@93.127.206.164 "cd /var/www/backend && npm install razorpay && pm2 restart goldapp-backend && cd /var/www/frontend && npm run build && pm2 restart goldapp-frontend"
```

---

## ✅ Test After Fix

1. **Clear browser cache** (Ctrl+Shift+Delete)
2. **Visit:** https://shreeomjisaraf.com/
3. **Open browser console** (F12)
4. **Create purchase order**
5. **Check console for errors**

---

## 🐛 Still Not Working?

**Check these:**

1. **Browser console errors** - Share the error message
2. **Network tab** - Check if API calls are failing
3. **Backend logs** - `pm2 logs goldapp-backend`
4. **Razorpay dashboard** - Check if orders are being created

**Common error messages:**

- `Razorpay script not loaded` → Frontend not updated
- `Payment gateway not configured` → Backend .env missing keys
- `CORS error` → Check ALLOWED_ORIGINS in backend .env
- `Order creation failed` → Check Razorpay keys are correct

