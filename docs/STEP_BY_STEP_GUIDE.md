# 🎯 Step-by-Step Setup Guide - Visual Walkthrough

## 📋 Overview

This is a **beginner-friendly, visual guide** that explains each step in detail with examples and screenshots descriptions.

---

## STEP 1: Create `.env` File 📝

### **What is this?**
Think of `.env` as a **settings file** that tells your app where to find the database.

### **Where to create it?**
In the **root folder** of your project (same folder where `server.js` is).

```
API test/
├── server.js          ← Your main server file
├── package.json
├── .env               ← CREATE THIS FILE HERE
├── config/
├── models/
└── ...
```

### **How to create it?**

#### **Method 1: Using VS Code (Easiest)**

1. **Open VS Code** in your project folder
2. **Right-click** in the file explorer (left side)
3. **Click "New File"**
4. **Type exactly:** `.env` (with the dot at the beginning)
5. **Press Enter**
6. **Copy and paste this:**

```env
MONGODB_URI=mongodb://localhost:27017/gold-silver-app
JWT_SECRET=your-secret-key-change-in-production
PORT=3001
```

7. **Save** (Ctrl+S)

#### **Method 2: Using Notepad**

1. **Open Notepad**
2. **Paste this:**

```env
MONGODB_URI=mongodb://localhost:27017/gold-silver-app
JWT_SECRET=your-secret-key-change-in-production
PORT=3001
```

3. **Click "File" → "Save As"**
4. **Navigate to your project folder:** `C:\Users\Admin\Desktop\API test`
5. **File name:** Type `.env` (with the dot!)
6. **Save as type:** Select "All Files (*.*)"
7. **Click "Save"**

⚠️ **Important:** The file must be named `.env` (with the dot), not `env.txt` or `env`

### **What each line means:**

- `MONGODB_URI=...` → Where your database is located
- `JWT_SECRET=...` → Secret key for authentication (change this!)
- `PORT=3001` → Port number for your server

---

## STEP 2: Install MongoDB 🗄️

You have **2 choices**. I recommend **Option A (Atlas)** for beginners.

---

### **OPTION A: MongoDB Atlas (Cloud) ☁️ - RECOMMENDED**

**Why choose this?**
- ✅ No installation needed
- ✅ Free tier available
- ✅ Works immediately
- ✅ Automatic backups

#### **Detailed Steps:**

**Step 2.1: Create Account**

1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Click the big **"Try Free"** button
3. Fill in:
   - First Name
   - Last Name
   - Email (use a real one - you'll need to verify)
   - Password (make it strong!)
4. Click **"Create your Atlas account"**
5. Check your email and verify your account

**Step 2.2: Create a Cluster**

1. After login, you'll see a screen saying **"Create a Deployment"**
2. You'll see 3 options:
   - **M0 FREE** ← Choose this one!
   - M10 (paid)
   - M30 (paid)
3. Click **"M0 FREE"**
4. Choose a **Cloud Provider**:
   - AWS (recommended)
   - Google Cloud
   - Azure
5. Choose a **Region** (closest to you):
   - For India: `Mumbai` or `Singapore`
   - For USA: `N. Virginia` or `Oregon`
   - For Europe: `Ireland` or `Frankfurt`
6. Click **"Create Deployment"**
7. **Wait 3-5 minutes** while it creates (you'll see a progress bar)

**Step 2.3: Create Database User**

1. You'll see a screen: **"Create Database User"**
2. **Username:** Type something like `goldappuser` or `myuser`
3. **Password:** 
   - Click **"Autogenerate Secure Password"** (recommended)
   - **OR** create your own (must be strong!)
4. **⚠️ IMPORTANT:** Copy the password! You won't see it again.
   - Click the **copy icon** next to the password
   - Save it somewhere safe (like a text file)
5. Click **"Create User"**

**Step 2.4: Allow Network Access**

1. You'll see: **"Where would you like to connect from?"**
2. For development/testing, click **"Add My Current IP Address"**
   - This allows your computer to connect
3. **OR** click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ Less secure, but easier for development
4. Click **"Finish and Close"**

**Step 2.5: Get Connection String**

1. You'll see your cluster dashboard
2. Click the big green **"Connect"** button
3. A popup appears with options:
   - Connect using MongoDB Compass
   - Connect your application ← **Click this one!**
   - Connect using MongoDB Shell
4. Select **"Connect your application"**
5. Choose:
   - **Driver:** Node.js
   - **Version:** 5.5 or later
6. You'll see a connection string like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. **Copy this string** (click the copy icon)

**Step 2.6: Update Your `.env` File**

1. **Open your `.env` file** in VS Code or Notepad
2. **Replace** the connection string:
   - Take the string you copied
   - Replace `<username>` with your database username (e.g., `goldappuser`)
   - Replace `<password>` with your database password
   - Add `/gold-silver-app` before the `?` (this is your database name)
   
   **Example:**
   ```
   Before: mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   
   After:  mongodb+srv://goldappuser:MyPassword123@cluster0.xxxxx.mongodb.net/gold-silver-app?retryWrites=true&w=majority
   ```

3. **Update your `.env` file:**
   ```env
   MONGODB_URI=mongodb+srv://goldappuser:MyPassword123@cluster0.xxxxx.mongodb.net/gold-silver-app?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key-change-in-production
   PORT=3001
   ```
4. **Save the file**

✅ **Atlas Setup Complete!**

---

### **OPTION B: Local MongoDB (On Your Computer) 💻**

**Why choose this?**
- ✅ Full control
- ✅ No internet needed
- ✅ Good for offline development

#### **Detailed Steps:**

**Step 2.1: Download MongoDB**

1. Go to: **https://www.mongodb.com/try/download/community**
2. You'll see a form:
   - **Version:** Select latest (e.g., 7.0)
   - **Platform:** Windows
   - **Package:** MSI
3. Click **"Download"**
4. Wait for download to complete (file is ~200MB)

**Step 2.2: Install MongoDB**

1. **Run the downloaded file** (e.g., `mongodb-windows-x86_64-7.0.x-signed.msi`)
2. Click **"Next"** on the welcome screen
3. Accept the license agreement, click **"Next"**
4. Choose **"Complete"** installation, click **"Next"**
5. **Important:** Check **"Install MongoDB as a Service"**
6. Check **"Install MongoDB Compass"** (helpful GUI tool)
7. Click **"Install"**
8. Wait 2-3 minutes for installation
9. Click **"Finish"**

**Step 2.3: Verify Installation**

1. **Open PowerShell** (as Administrator):
   - Press `Win + X`
   - Click "Windows PowerShell (Admin)"
2. **Check if MongoDB is running:**
   ```powershell
   Get-Service MongoDB
   ```
3. **You should see:**
   ```
   Status   Name               DisplayName
   ------   ----               -----------
   Running  MongoDB            MongoDB Server
   ```
4. **If it says "Stopped", start it:**
   ```powershell
   net start MongoDB
   ```

**Step 2.4: Test Connection**

1. **Open PowerShell** (regular, not admin)
2. **Type:**
   ```powershell
   mongosh
   ```
3. **If it works, you'll see:**
   ```
   Current Mongosh Log ID: ...
   Connecting to: mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000
   Using MongoDB: 7.0.x
   Using Mongosh: ...
   
   test>
   ```
4. **Type `exit` and press Enter** to quit

**Step 2.5: Your `.env` File is Already Correct!**

For local MongoDB, your `.env` should have:
```env
MONGODB_URI=mongodb://localhost:27017/gold-silver-app
```

This is already correct! No changes needed.

✅ **Local MongoDB Setup Complete!**

---

## STEP 3: Migrate Existing Data (Optional) 📦

### **Do I need this step?**

**YES, if:**
- ✅ You have existing users in `database/users.json`
- ✅ You have purchases, payments, deliveries
- ✅ You want to keep your current data

**NO, if:**
- ❌ Starting fresh
- ❌ No important data to keep
- ❌ Just testing

### **How to Migrate:**

**Step 3.1: Check Your Data**

1. **Open** `database/users.json` in VS Code
2. **Check if it has data** (not just `[]`)
3. If it has users like:
   ```json
   [
     {
       "id": "admin001",
       "name": "Admin",
       ...
     }
   ]
   ```
   Then you should migrate!

**Step 3.2: Make Sure MongoDB is Running**

- **Atlas:** Already running (it's in the cloud)
- **Local:** Check:
  ```powershell
  Get-Service MongoDB
  ```
  Should say "Running"

**Step 3.3: Run Migration Script**

1. **Open PowerShell** in your project folder:
   ```powershell
   cd "C:\Users\Admin\Desktop\API test"
   ```

2. **Run the migration:**
   ```powershell
   node scripts/migrate-to-mongodb.js
   ```

3. **What you'll see:**
   ```
   🔄 Connecting to MongoDB...
   ✅ Connected to MongoDB
   🗑️  Clearing existing collections...
   ✅ Collections cleared
   📦 Migrating users...
   ✅ Migrated 5 users
   📦 Migrating purchases...
   ✅ Migrated 10 purchases
   📦 Migrating payments...
   ✅ Migrated 8 payments
   📦 Migrating deliveries...
   ✅ Migrated 3 deliveries
   📦 Migrating OTP store...
   ✅ Migrated 0 OTP entries
   
   ✅ Migration completed successfully!
   
   📊 Summary:
      Users: 5
      Purchases: 10
      Payments: 8
      Deliveries: 3
      OTP Entries: 0
   
   🔌 MongoDB connection closed
   ```

**Step 3.4: Verify Migration**

- **Atlas:** Go to your cluster → Browse Collections → Check `users` collection
- **Local:** Open MongoDB Compass → Connect → Browse Collections

✅ **Migration Complete!**

---

## STEP 4: Start Your Server 🚀

### **Before Starting - Checklist:**

- [ ] `.env` file created and saved
- [ ] MongoDB running (Atlas or Local)
- [ ] Migration completed (if you had data)
- [ ] Dependencies installed (`npm install`)

### **How to Start:**

**Step 4.1: Open PowerShell**

1. **Press `Win + R`**
2. **Type:** `powershell`
3. **Press Enter**

**Step 4.2: Navigate to Project**

```powershell
cd "C:\Users\Admin\Desktop\API test"
```

**Step 4.3: Install Dependencies (if not done)**

```powershell
npm install
```

Wait for it to finish (may take 1-2 minutes)

**Step 4.4: Start Server**

```powershell
npm start
```

**Step 4.5: What You Should See**

```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
✅ Default admin user created
✅ Database initialized successfully
Server running on http://localhost:3001
```

**If you see this, SUCCESS! 🎉**

### **Common Errors & Fixes:**

**Error: "Cannot find module 'mongoose'"**
```powershell
# Solution:
npm install
```

**Error: "MongoServerError: Authentication failed"**
- Check your `.env` file
- Verify username and password in connection string
- For Atlas: Make sure IP is whitelisted

**Error: "connect ECONNREFUSED"**
- **Local:** Start MongoDB:
  ```powershell
  net start MongoDB
  ```
- **Atlas:** Check internet connection

**Error: "EADDRINUSE: address already in use"**
- Port 3001 is busy
- Kill the process or change PORT in `.env`

---

## STEP 5: Verify Everything Works ✅

### **Test 1: Check Website**

1. **Open browser**
2. **Go to:** http://localhost:3001
3. **You should see:** Login page with "Gold & Silver App"

✅ **If you see this, server is running!**

### **Test 2: Test Login**

1. **On the login page:**
   - Email: `admin@goldapp.com`
   - Password: `admin123`
2. **Click "Login"**
3. **You should be redirected** to dashboard

✅ **If login works, database connection is good!**

### **Test 3: Test Registration**

1. **Click "Register" tab**
2. **Fill in the form:**
   - Name: Test User
   - Email: test@test.com
   - Password: test123
   - Phone: 1234567890
   - PAN: ABCDE1234F
   - Aadhaar: 234567890123
3. **Click "Register"**
4. **You should see:** "User registered successfully"

✅ **If registration works, MongoDB is working perfectly!**

### **Test 4: Check MongoDB (Optional)**

**For Atlas:**
1. Go to https://cloud.mongodb.com
2. Click your cluster
3. Click "Browse Collections"
4. Select `gold-silver-app` database
5. Click `users` collection
6. You should see your registered users!

**For Local (MongoDB Compass):**
1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Select `gold-silver-app` database
4. Click `users` collection
5. You should see your users!

---

## 🎉 Success!

If all tests pass, **you're all set!** Your backend is now using MongoDB.

**What's Next?**
- Create more users
- Make purchases
- Test all features
- Enjoy the improved performance!

---

## 📞 Need Help?

If something doesn't work:
1. Check the error message
2. Read the "Common Errors" section above
3. Verify each step was completed correctly
4. Check MongoDB is running
5. Verify `.env` file is correct

---

*Good luck! You've got this! 🚀*

