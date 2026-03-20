# ⚡ Quick Update Razorpay - One Command

## Windows (PowerShell)

```powershell
# Run this from project root
.\upload-razorpay-to-server.ps1
```

## Linux/Mac (Bash)

```bash
# Run this from project root
chmod +x upload-razorpay-to-server.sh
./upload-razorpay-to-server.sh
```

---

## Manual Commands (If Script Doesn't Work)

### Step 1: Upload Files

```powershell
# Windows PowerShell
scp "Goldapp 2\backend\server.js" root@93.127.206.164:/var/www/backend/server.js
scp "Goldapp 2\backend\models\Payment.js" root@93.127.206.164:/var/www/backend/models/Payment.js
scp "Goldapp 2\backend\package.json" root@93.127.206.164:/var/www/backend/package.json
```

### Step 2: Update Server

```bash
ssh root@93.127.206.164
```

Then run:

```bash
cd /var/www/backend
npm install razorpay

# Add Razorpay keys
echo "" >> .env
echo "RAZORPAY_KEY_ID=rzp_live_SConp1xSu8h69e" >> .env
echo "RAZORPAY_KEY_SECRET=yOR7LQmT9mU4mjnH0wKWRYCt" >> .env
echo "RAZORPAY_WEBHOOK_SECRET=" >> .env

pm2 restart goldapp-backend
pm2 logs goldapp-backend --lines 20
```

---

## ✅ Done!

Payment gateway is now live!

