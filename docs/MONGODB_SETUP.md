# 🗄️ MongoDB Setup Guide

## ✅ What's Been Done

Your backend has been successfully migrated from JSON files to MongoDB! Here's what was implemented:

1. ✅ **MongoDB Connection** - `config/database.js`
2. ✅ **Mongoose Models** - All data models created:
   - `User` - User accounts and KYC
   - `Purchase` - Gold/Silver purchases
   - `Payment` - Payment records
   - `Delivery` - Delivery tracking
   - `OTPStore` - OTP verification (auto-expires)
3. ✅ **All API Endpoints Updated** - Now using MongoDB instead of JSON files
4. ✅ **Migration Script** - To move existing data from JSON to MongoDB

---

## 🚀 Quick Start

### **Step 1: Install MongoDB**

**Option A: Local MongoDB**
```powershell
# Download and install MongoDB Community Server
# https://www.mongodb.com/try/download/community

# Or use Chocolatey (if installed)
choco install mongodb
```

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster (free tier available)
4. Get your connection string

---

### **Step 2: Configure Connection**

Create a `.env` file in the root directory:

```env
# For Local MongoDB
MONGODB_URI=mongodb://localhost:27017/gold-silver-app

# For MongoDB Atlas (replace with your connection string)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gold-silver-app?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your-secret-key-change-in-production

# Server Port
PORT=3001
```

---

### **Step 3: Start MongoDB (Local Only)**

If using local MongoDB:

```powershell
# Start MongoDB service
net start MongoDB

# Or if installed as a service, it should start automatically
```

---

### **Step 4: Migrate Existing Data (Optional)**

If you have existing data in JSON files, migrate it:

```powershell
node scripts/migrate-to-mongodb.js
```

This will:
- Connect to MongoDB
- Clear existing collections (optional - can be commented out)
- Migrate all data from JSON files
- Show summary of migrated records

---

### **Step 5: Start Your Server**

```powershell
npm start
```

The server will:
1. Connect to MongoDB
2. Create default admin user (if doesn't exist)
3. Start on port 3001

---

## 📋 MongoDB Connection Options

### **Local MongoDB**

**Default Connection:**
```
mongodb://localhost:27017/gold-silver-app
```

**With Authentication:**
```
mongodb://username:password@localhost:27017/gold-silver-app
```

---

### **MongoDB Atlas (Cloud)**

**Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/gold-silver-app?retryWrites=true&w=majority
```

**Steps:**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster (free tier: M0)
3. Create database user
4. Whitelist your IP (or 0.0.0.0/0 for all)
5. Get connection string
6. Update `.env` file

---

## 🔍 Verify Connection

### **Check MongoDB is Running (Local)**

```powershell
# Check if MongoDB service is running
Get-Service MongoDB

# Or connect via MongoDB shell
mongosh
```

### **Test Connection in Node.js**

```powershell
node -e "require('./config/database')().then(() => console.log('✅ Connected!')).catch(e => console.error('❌ Error:', e))"
```

---

## 📊 Database Structure

### **Collections Created:**

1. **users** - User accounts
   - Fields: id, name, email, password, phone, pan, aadhaar, kycVerified, role, createdAt

2. **purchases** - Purchase records
   - Fields: id, userId, type, purity, quantity, pricePerGram, totalAmount, pan, aadhaar, status, createdAt

3. **payments** - Payment records
   - Fields: id, purchaseId, userId, amount, status, paymentMethod, transactionId, createdAt

4. **deliveries** - Delivery records
   - Fields: id, purchaseId, userId, type, purity, quantity, status, deliveryMethod, address, otp, otpVerified, trackingNumber, deliveredAt

5. **otpstores** - OTP verification (auto-expires)
   - Fields: key, otp, purpose, expiresAt, verified, createdAt

---

## 🛠️ Migration Script

### **Run Migration:**

```powershell
node scripts/migrate-to-mongodb.js
```

### **What It Does:**

1. Connects to MongoDB
2. Clears existing collections (can be disabled)
3. Reads JSON files from `database/` folder
4. Migrates all data to MongoDB
5. Shows summary

### **To Keep Existing Data:**

Edit `scripts/migrate-to-mongodb.js` and comment out:
```javascript
// await User.deleteMany({});
// await Purchase.deleteMany({});
// etc.
```

---

## 🔧 Troubleshooting

### **"MongoServerError: connect ECONNREFUSED"**

**Problem:** MongoDB is not running or connection string is wrong

**Solution:**
1. Check MongoDB is running: `Get-Service MongoDB`
2. Verify connection string in `.env`
3. Check firewall settings

---

### **"MongooseError: Operation users.findOne() buffering timed out"**

**Problem:** MongoDB connection not established before queries

**Solution:**
- The `initDatabase()` function connects before starting server
- Make sure MongoDB is running before starting server

---

### **"E11000 duplicate key error"**

**Problem:** Trying to create duplicate unique fields (email, PAN, Aadhaar)

**Solution:**
- This is expected behavior - prevents duplicate registrations
- Check if user already exists before creating

---

### **"Cannot find module './config/database'"**

**Problem:** Missing files or wrong path

**Solution:**
- Make sure `config/database.js` exists
- Make sure `models/` folder exists with all model files

---

## 📝 Environment Variables

Create `.env` file:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/gold-silver-app

# JWT Secret (change in production!)
JWT_SECRET=your-secret-key-change-in-production

# Server Port
PORT=3001

# Email (optional)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

## ✅ Benefits of MongoDB

1. **Scalability** - Handle millions of records
2. **Performance** - Indexed queries are fast
3. **Flexibility** - Easy to add new fields
4. **Reliability** - ACID transactions
5. **Auto-expiration** - OTPs auto-delete when expired
6. **Aggregations** - Complex queries for analytics

---

## 🎯 Next Steps

1. ✅ Create `.env` file with MongoDB connection
2. ✅ Start MongoDB (local or Atlas)
3. ✅ Run migration script (if you have existing data)
4. ✅ Start server: `npm start`
5. ✅ Test login and registration

---

## 📚 MongoDB Resources

- **MongoDB Docs:** https://docs.mongodb.com/
- **Mongoose Docs:** https://mongoosejs.com/docs/
- **MongoDB Atlas:** https://www.mongodb.com/cloud/atlas

---

*Your backend is now using MongoDB! 🎉*

