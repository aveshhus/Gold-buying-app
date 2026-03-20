# 📚 MongoDB Setup - Detailed Step-by-Step Guide

## 🎯 Overview

This guide will walk you through setting up MongoDB for your Gold & Silver app. We'll cover everything from installation to verification.

---

## 📝 Step 1: Create `.env` File

### **What is a `.env` file?**
A `.env` file stores environment variables (configuration settings) that your application needs. It's like a settings file that keeps sensitive information separate from your code.

### **Why do we need it?**
- Keeps database connection strings secure
- Makes it easy to change settings without editing code
- Required for MongoDB connection

### **How to Create It:**

#### **Method 1: Using VS Code / Your Editor**

1. **Open your project folder** in VS Code (or your editor)
2. **Right-click** in the root folder (where `server.js` is located)
3. **Select "New File"**
4. **Name it exactly:** `.env` (with the dot at the beginning)
5. **Add this content:**

```env
# MongoDB Connection String
# For local MongoDB (if installed on your computer)
MONGODB_URI=mongodb://localhost:27017/gold-silver-app

# For MongoDB Atlas (cloud database - recommended)
# Uncomment and replace with your Atlas connection string:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gold-silver-app?retryWrites=true&w=majority

# JWT Secret Key (for authentication tokens)
# Change this to a random string in production!
JWT_SECRET=your-secret-key-change-in-production

# Server Port
PORT=3001
```

6. **Save the file** (Ctrl+S or Cmd+S)

#### **Method 2: Using PowerShell/Command Prompt**

```powershell
# Navigate to your project folder
cd "C:\Users\Admin\Desktop\API test"

# Create .env file
@"
MONGODB_URI=mongodb://localhost:27017/gold-silver-app
JWT_SECRET=your-secret-key-change-in-production
PORT=3001
"@ | Out-File -FilePath .env -Encoding utf8
```

### **Important Notes:**
- ✅ The file must be named exactly `.env` (with the dot)
- ✅ It should be in the **root folder** (same folder as `server.js`)
- ✅ Don't commit this file to Git (it contains sensitive info)
- ✅ For local MongoDB, use: `mongodb://localhost:27017/gold-silver-app`
- ✅ For MongoDB Atlas, use the connection string from Atlas dashboard

---

## 🗄️ Step 2: Install MongoDB

You have **two options**: Local MongoDB or MongoDB Atlas (cloud). I recommend **MongoDB Atlas** for beginners as it's easier to set up.

---

### **Option A: MongoDB Atlas (Cloud - RECOMMENDED) 🌟**

**Why choose Atlas?**
- ✅ Free tier available (512MB storage)
- ✅ No installation needed
- ✅ Automatic backups
- ✅ Accessible from anywhere
- ✅ Easy to set up

#### **Step-by-Step Atlas Setup:**

**1. Create Account:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Click "Try Free"
   - Fill in your details (name, email, password)
   - Click "Create your Atlas account"

**2. Create a Cluster:**
   - After login, you'll see "Create a Deployment"
   - Select **"M0 FREE"** (Free tier)
   - Choose a **Cloud Provider** (AWS, Google Cloud, or Azure)
   - Choose a **Region** (closest to you)
   - Click **"Create Deployment"**
   - Wait 3-5 minutes for cluster to be created

**3. Create Database User:**
   - You'll see "Create Database User" screen
   - **Username:** Enter a username (e.g., `goldappuser`)
   - **Password:** Click "Autogenerate Secure Password" or create your own
   - **IMPORTANT:** Copy the password! You won't see it again.
   - Click **"Create User"**

**4. Set Network Access:**
   - Click **"Add My Current IP Address"** (allows your computer to connect)
   - Or click **"Allow Access from Anywhere"** (0.0.0.0/0) for development
   - Click **"Finish and Close"**

**5. Get Connection String:**
   - Click **"Connect"** button on your cluster
   - Select **"Connect your application"**
   - Choose **"Node.js"** and version **"5.5 or later"**
   - Copy the connection string (looks like):
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - **Replace `<username>`** with your database username
   - **Replace `<password>`** with your database password
   - **Add database name** at the end: `/gold-silver-app`

**6. Update `.env` File:**
   - Open your `.env` file
   - Replace `MONGODB_URI` with your connection string:
     ```env
     MONGODB_URI=mongodb+srv://goldappuser:yourpassword@cluster0.xxxxx.mongodb.net/gold-silver-app?retryWrites=true&w=majority
     ```
   - Save the file

**✅ Atlas Setup Complete!**

---

### **Option B: Local MongoDB (On Your Computer)**

**Why choose Local?**
- ✅ Full control over your database
- ✅ No internet required
- ✅ Good for development
- ❌ Requires installation
- ❌ You manage backups

#### **Step-by-Step Local MongoDB Setup:**

**1. Download MongoDB:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select:
     - **Version:** Latest (e.g., 7.0)
     - **Platform:** Windows
     - **Package:** MSI
   - Click **"Download"**

**2. Install MongoDB:**
   - Run the downloaded `.msi` file
   - Click **"Next"** through the setup
   - Choose **"Complete"** installation
   - Check **"Install MongoDB as a Service"**
   - Check **"Install MongoDB Compass"** (GUI tool - optional but helpful)
   - Click **"Install"**
   - Wait for installation to complete
   - Click **"Finish"**

**3. Verify Installation:**
   - Open PowerShell (as Administrator)
   - Run:
     ```powershell
     Get-Service MongoDB
     ```
   - You should see MongoDB service running
   - If not running, start it:
     ```powershell
     net start MongoDB
     ```

**4. Test Connection:**
   - Open PowerShell
   - Run:
     ```powershell
     mongosh
     ```
   - If it connects, you'll see: `test>`
   - Type `exit` to quit

**5. Update `.env` File:**
   - Your `.env` should already have:
     ```env
     MONGODB_URI=mongodb://localhost:27017/gold-silver-app
     ```
   - This is correct for local MongoDB!

**✅ Local MongoDB Setup Complete!**

---

## 📦 Step 3: Migrate Existing Data (Optional)

### **When to Migrate:**
- ✅ You have existing users, purchases, payments in JSON files
- ✅ You want to keep your current data
- ✅ You're switching from JSON files to MongoDB

### **When to Skip:**
- ❌ Starting fresh (no existing data)
- ❌ Testing the setup first
- ❌ You don't need old data

### **How to Migrate:**

**1. Make sure MongoDB is running:**
   - **Atlas:** Already running (cloud)
   - **Local:** Check service is running:
     ```powershell
     Get-Service MongoDB
     ```

**2. Run Migration Script:**
   ```powershell
   node scripts/migrate-to-mongodb.js
   ```

**3. What Happens:**
   - Script connects to MongoDB
   - Reads JSON files from `database/` folder:
     - `users.json`
     - `purchases.json`
     - `payments.json`
     - `deliveries.json`
     - `otp_store.json`
   - Migrates all data to MongoDB
   - Shows summary:
     ```
     ✅ Migrated 5 users
     ✅ Migrated 10 purchases
     ✅ Migrated 8 payments
     ✅ Migrated 3 deliveries
     ```

**4. Verify Migration:**
   - Check MongoDB Compass (if installed) or Atlas dashboard
   - You should see collections: `users`, `purchases`, `payments`, `deliveries`, `otpstores`

### **Important Notes:**
- ⚠️ **The script clears existing MongoDB data** before migrating
- ⚠️ **Backup your JSON files** before running (they won't be deleted)
- ⚠️ **Run only once** unless you want to re-migrate

### **To Keep Existing MongoDB Data:**
Edit `scripts/migrate-to-mongodb.js` and comment out the delete lines:
```javascript
// await User.deleteMany({});
// await Purchase.deleteMany({});
// etc.
```

---

## 🚀 Step 4: Start Your Server

### **Before Starting:**
1. ✅ `.env` file created and configured
2. ✅ MongoDB running (Atlas or Local)
3. ✅ Migration completed (if needed)

### **Start the Server:**

**1. Open PowerShell/Terminal:**
   - Navigate to your project folder:
     ```powershell
     cd "C:\Users\Admin\Desktop\API test"
     ```

**2. Start the Server:**
   ```powershell
   npm start
   ```

**3. What You Should See:**
   ```
   ✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
   ✅ Default admin user created (or already exists)
   ✅ Database initialized successfully
   Server running on http://localhost:3001
   ```

### **If You See Errors:**

**Error: "Cannot find module 'mongoose'"**
```powershell
# Solution: Install dependencies
npm install
```

**Error: "MongoServerError: Authentication failed"**
- Check your MongoDB connection string in `.env`
- Verify username and password are correct
- For Atlas: Make sure IP is whitelisted

**Error: "connect ECONNREFUSED"**
- **Local MongoDB:** Make sure service is running:
  ```powershell
  net start MongoDB
  ```
- **Atlas:** Check your internet connection

**Error: "EADDRINUSE: address already in use :::3001"**
- Port 3001 is already in use
- Kill the process or change PORT in `.env`

---

## ✅ Step 5: Verify Everything Works

### **Test 1: Check Server is Running**
- Open browser: http://localhost:3001
- You should see the login page

### **Test 2: Test API Endpoints**

**Test Login (using PowerShell):**
```powershell
$body = @{
    email = "admin@goldapp.com"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3001/api/login" -Method POST -Body $body -ContentType "application/json"
Write-Host "✅ Login successful! Token: $($response.token.Substring(0, 20))..."
```

**Expected Output:**
```
✅ Login successful! Token: eyJhbGciOiJIUzI1NiIs...
```

### **Test 3: Check MongoDB Connection**

**Using MongoDB Compass (Local):**
1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. You should see database: `gold-silver-app`
4. Check collections: `users`, `purchases`, etc.

**Using Atlas Dashboard:**
1. Go to https://cloud.mongodb.com
2. Click on your cluster
3. Click "Browse Collections"
4. Select database: `gold-silver-app`
5. You should see collections

### **Test 4: Test Registration**
- Go to: http://localhost:3001
- Click "Register" tab
- Fill in the form
- Submit
- Check MongoDB - new user should appear

---

## 🎯 Quick Checklist

Before you start, make sure:

- [ ] `.env` file created in root folder
- [ ] `MONGODB_URI` set correctly in `.env`
- [ ] MongoDB running (Atlas or Local)
- [ ] Dependencies installed (`npm install`)
- [ ] Migration run (if you have existing data)
- [ ] Server starts without errors
- [ ] Can access http://localhost:3001
- [ ] Can login with admin credentials

---

## 🔧 Common Issues & Solutions

### **Issue 1: "Cannot find module './config/database'"**

**Problem:** Missing files or wrong path

**Solution:**
```powershell
# Check files exist
Test-Path config/database.js
Test-Path models/User.js

# If missing, they should be in your project
# Make sure you're in the correct directory
```

---

### **Issue 2: "MongooseError: Operation buffering timed out"**

**Problem:** MongoDB not accessible

**Solution:**
- **Atlas:** Check IP whitelist, verify connection string
- **Local:** Check MongoDB service is running:
  ```powershell
  Get-Service MongoDB
  net start MongoDB
  ```

---

### **Issue 3: "E11000 duplicate key error"**

**Problem:** Trying to create duplicate email/PAN/Aadhaar

**Solution:**
- This is **normal behavior** - prevents duplicates
- Check if user already exists before creating

---

### **Issue 4: ".env file not loading"**

**Problem:** Environment variables not being read

**Solution:**
- Make sure file is named exactly `.env` (with dot)
- Make sure it's in root folder (same as `server.js`)
- Restart server after changing `.env`

---

## 📚 Additional Resources

- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/
- **Mongoose Docs:** https://mongoosejs.com/docs/
- **Node.js Environment Variables:** https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs

---

## 🎉 Success!

If you've completed all steps and your server is running, you're all set! Your backend is now using MongoDB instead of JSON files.

**Next:** Test your app, create users, make purchases, and enjoy the improved performance!

---

*Need help? Check the error messages and refer to the troubleshooting section above.*

