# 🔧 Fix: Razorpay "Amount Exceeds Maximum" Error

## Problem

Error in logs:
```
Error creating Razorpay order: {
  code: 'BAD_REQUEST_ERROR',
  description: 'Amount exceeds maximum amount allowed.'
}
```

## Root Cause

Razorpay accounts have transaction limits based on:
- Account verification status (KYC)
- Account type (individual/business)
- Account age

**Common Limits:**
- **New/Unverified Accounts:** ₹1,00,000 per transaction
- **Verified Individual:** ₹10,00,000 per transaction  
- **Verified Business:** Higher limits (varies)

## Solution

### Option 1: Increase Razorpay Account Limits (Recommended)

1. **Log in to Razorpay Dashboard:** https://dashboard.razorpay.com/
2. **Go to:** Settings → Account & Settings
3. **Complete KYC Verification:**
   - Upload business documents
   - Complete bank account verification
   - Submit required documents
4. **Request Limit Increase:**
   - Contact Razorpay support
   - Request higher transaction limits
   - Provide business details

### Option 2: Add Amount Validation (Already Fixed)

The code now validates amounts before creating orders. Update the server with the fix:

```bash
# Upload fixed server.js
scp "Goldapp 2\backend\server.js" root@93.127.206.164:/var/www/backend/server.js

# Restart backend
ssh root@93.127.206.164 "pm2 restart goldapp-backend"
```

### Option 3: Split Large Payments

For amounts exceeding limits, implement payment splitting:
- Split into multiple smaller transactions
- Or use alternative payment methods for large amounts

## Check Your Current Limits

1. **Razorpay Dashboard:** https://dashboard.razorpay.com/
2. **Go to:** Settings → Account & Settings → Limits
3. **Check:** Maximum transaction amount

## Quick Fix Applied

The code now:
- ✅ Validates minimum amount (₹1)
- ✅ Validates maximum amount (configurable)
- ✅ Shows clear error messages
- ✅ Prevents invalid orders

## Update Server

```powershell
# Upload fixed file
scp "Goldapp 2\backend\server.js" root@93.127.206.164:/var/www/backend/server.js

# Restart
ssh root@93.127.206.164 "pm2 restart goldapp-backend"
```

## Test

After updating:
1. Try a small amount (₹100-₹1000) - should work
2. Try a large amount - will show clear error if exceeds limit
3. Check Razorpay dashboard for your actual limits

## Next Steps

1. **Complete Razorpay KYC** to increase limits
2. **Contact Razorpay Support** if you need higher limits
3. **Update MAX_AMOUNT_PAISE** in server.js based on your account limits

---

**Note:** The error message will now be clearer, showing the maximum allowed amount.

