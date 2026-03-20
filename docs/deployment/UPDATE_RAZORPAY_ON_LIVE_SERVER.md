# 🔄 Update Razorpay on Live Server (shreeomjisaraf.com)

Quick guide to add Razorpay payment gateway to your already running server.

## ⚡ Quick Update Steps

### Step 1: Connect to Your Server

```bash
ssh root@your-server-ip
# OR use your Hostinger SSH credentials
```

### Step 2: Navigate to Backend Directory

```bash
# Find your backend directory (usually one of these)
cd /var/www/goldapp-backend
# OR
cd /var/www/backend
# OR check where PM2 is running the app
pm2 list
pm2 info goldapp-backend
```

### Step 3: Update .env File

```bash
nano .env
```

**Add these lines at the end of the file:**

```env
# Razorpay Payment Gateway Configuration
RAZORPAY_KEY_ID=rzp_live_SConp1xSu8h69e
RAZORPAY_KEY_SECRET=yOR7LQmT9mU4mjnH0wKWRYCt
RAZORPAY_WEBHOOK_SECRET=
```

**Save:** `Ctrl + X`, then `Y`, then `Enter`

### Step 4: Restart Backend Service

```bash
# If using PM2 (most common)
pm2 restart goldapp-backend
# OR
pm2 restart all

# Check status
pm2 status

# View logs to verify
pm2 logs goldapp-backend --lines 30
```

**If using systemd:**
```bash
systemctl restart your-backend-service
```

**If using npm directly:**
```bash
# Stop current process (Ctrl+C)
# Then restart
npm start
```

### Step 5: Verify Razorpay is Working

```bash
# Check if Razorpay initialized (look for no errors)
pm2 logs goldapp-backend | grep -i razorpay

# Test from server
curl http://localhost:3001/api/prices
```

### Step 6: Test Payment Flow

1. **Visit your website:** https://shreeomjisaraf.com/
2. **Log in** to your account
3. **Create a purchase order**
4. **Payment gateway should open automatically**

---

## 🔐 Optional: Set Up Webhook

### Step 1: Configure Webhook in Razorpay Dashboard

1. Go to: https://dashboard.razorpay.com/
2. Navigate to: **Settings** → **Webhooks**
3. Click: **"Add New Webhook"**
4. Enter:
   - **Webhook URL:** `https://shreeomjisaraf.com/api/payments/webhook`
   - **Secret:** Generate a strong random string (save it!)
5. Select Events:
   - ✅ `payment.captured`
   - ✅ `payment.failed`
6. Click: **"Create Webhook"**

### Step 2: Add Webhook Secret to Server

```bash
nano .env
```

Update the webhook secret:
```env
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_from_dashboard
```

**Save and restart:**
```bash
pm2 restart goldapp-backend
```

---

## ✅ Verification Checklist

- [ ] Razorpay keys added to `.env` file
- [ ] Backend service restarted
- [ ] No errors in logs (`pm2 logs goldapp-backend`)
- [ ] Payment gateway opens when creating purchase
- [ ] Webhook configured (optional but recommended)

---

## 🐛 Troubleshooting

### If Payment Gateway Doesn't Open

**Check backend logs:**
```bash
pm2 logs goldapp-backend --lines 50
```

**Verify environment variables:**
```bash
cd /var/www/goldapp-backend  # or your backend path
grep RAZORPAY .env
```

**Check if Razorpay package is installed:**
```bash
cd /var/www/goldapp-backend
npm list razorpay
```

If not installed:
```bash
npm install razorpay
pm2 restart goldapp-backend
```

### If You Get CORS Errors

The CORS should already be configured for `shreeomjisaraf.com`. If you see errors:

```bash
# Check CORS configuration in server.js
grep -i "shreeomjisaraf\|ALLOWED_ORIGINS" server.js
```

---

## 📝 Quick Command Summary

```bash
# 1. Connect
ssh root@your-server-ip

# 2. Go to backend
cd /var/www/goldapp-backend

# 3. Edit .env
nano .env
# Add Razorpay keys, save

# 4. Restart
pm2 restart goldapp-backend

# 5. Check logs
pm2 logs goldapp-backend --lines 20
```

---

## 🎉 Done!

Your Razorpay payment gateway is now active on https://shreeomjisaraf.com/

**Test it:** Create a purchase order and the payment gateway should open automatically!

---

## 📞 Need Help?

- Check PM2 logs: `pm2 logs goldapp-backend`
- Verify .env file: `cat .env | grep RAZORPAY`
- Check Razorpay dashboard: https://dashboard.razorpay.com/

