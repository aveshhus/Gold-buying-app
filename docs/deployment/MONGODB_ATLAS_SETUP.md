# 🗄️ Complete MongoDB Atlas Setup Guide

## 📋 Step-by-Step Process

---

## ✅ STEP 1: Create MongoDB Atlas Account

### 1.1 Go to MongoDB Atlas

1. **Open your browser**
2. **Go to:** https://www.mongodb.com/cloud/atlas
3. **Click:** "Try Free" or "Sign Up" button (top right)

### 1.2 Sign Up

1. **Choose sign-up method:**
   - **Option A:** Sign up with Google (easiest)
   - **Option B:** Sign up with email
     - Enter your email
     - Create a password
     - Click "Sign Up"

2. **Verify your email** (check your inbox)
3. **Complete your profile** (optional, can skip)

**✅ Account created!**

---

## ✅ STEP 2: Create Free Cluster

### 2.1 Start Building Database

1. **After login, you'll see:** "Build a Database" button
2. **Click:** "Build a Database"

### 2.2 Choose Plan

1. **Select:** "FREE" (M0 Shared) - It's free forever!
2. **Click:** "Create" button

### 2.3 Choose Cloud Provider & Region

1. **Cloud Provider:** 
   - Choose **AWS** (recommended)
   - Or **Google Cloud** or **Azure**

2. **Region:**
   - **For India:** Choose **Mumbai (ap-south-1)** or **Singapore**
   - **For US:** Choose closest to you
   - **For Europe:** Choose closest to you

3. **Cluster Name:** 
   - Leave default: `Cluster0` (or change if you want)

4. **Click:** "Create Cluster" button

### 2.4 Wait for Cluster Creation

- **Wait 3-5 minutes** for cluster to be created
- You'll see: "Your cluster is being created..."
- **Don't close the page!**

**✅ Cluster created!**

---

## ✅ STEP 3: Create Database User

### 3.1 Go to Database Access

1. **Look at left sidebar**
2. **Click:** "Database Access" (under Security)

### 3.2 Add New User

1. **Click:** "Add New Database User" button (green button)

### 3.3 Configure User

1. **Authentication Method:**
   - Choose: **"Password"** (selected by default)

2. **Username:**
   - Enter: `goldapp` (or any name you want)
   - Example: `goldapp`, `admin`, `myuser`

3. **Password:**
   - **Option A:** Click "Autogenerate Secure Password" (recommended)
     - **IMPORTANT:** Copy this password immediately!
     - Save it somewhere safe (you'll need it!)
   - **Option B:** Create your own password
     - Make it strong (at least 8 characters, mix of letters, numbers, symbols)

4. **Database User Privileges:**
   - Leave default: **"Atlas admin"** (full access)

5. **Click:** "Add User" button

**✅ Database user created!**

**⚠️ IMPORTANT:** Save your username and password! You'll need them!

---

## ✅ STEP 4: Whitelist Your Server IP

### 4.1 Go to Network Access

1. **Look at left sidebar**
2. **Click:** "Network Access" (under Security)

### 4.2 Add IP Address

1. **Click:** "Add IP Address" button (green button)

### 4.3 Choose IP Access

**You have 3 options:**

#### Option A: Allow from Anywhere (Easiest - Less Secure)

1. **Click:** "Allow Access from Anywhere"
2. **IP Address:** Will show `0.0.0.0/0`
3. **Comment:** (optional) "Allow all IPs"
4. **Click:** "Confirm"

**✅ Done!** (Works from anywhere, but less secure)

#### Option B: Add Your Server IP (Recommended)

1. **Click:** "Add IP Address"
2. **IP Address:** Enter `93.127.206.164` (your VPS IP)
3. **Comment:** (optional) "My VPS Server"
4. **Click:** "Confirm"

**✅ Done!** (More secure, only your server can access)

#### Option C: Add Current IP (For Testing)

1. **Click:** "Add Current IP Address"
2. **IP Address:** Will auto-fill your current IP
3. **Click:** "Confirm"

**✅ Done!** (Only your current computer can access)

**Recommendation:** Use **Option B** (your server IP: `93.127.206.164`)

---

## ✅ STEP 5: Get Connection String

### 5.1 Go to Database

1. **Look at left sidebar**
2. **Click:** "Database" (top of sidebar)

### 5.2 Connect to Cluster

1. **You'll see your cluster:** `Cluster0` (or your cluster name)
2. **Click:** "Connect" button (green button)

### 5.3 Choose Connection Method

1. **You'll see options:**
   - "Connect your application"
   - "Connect using MongoDB Compass"
   - "Connect using VS Code"
   - etc.

2. **Click:** "Connect your application"

### 5.4 Get Connection String

1. **Driver:** Should show "Node.js" (if not, select it)
2. **Version:** Should show "5.5 or later" (if not, select it)
3. **You'll see a connection string like:**
   ```
   mongodb+srv://goldapp:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

4. **Click the "Copy" button** (next to the connection string)

**✅ Connection string copied!**

---

## ✅ STEP 6: Update Connection String

### 6.1 Replace Password

**Your connection string looks like:**
```
mongodb+srv://goldapp:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Replace `<password>` with your actual password:**

**Example:**
- If your password is: `MyPassword123`
- Change: `mongodb+srv://goldapp:<password>@...`
- To: `mongodb+srv://goldapp:MyPassword123@...`

### 6.2 Add Database Name

**Add `/gold-silver-app` before `?retryWrites`:**

**Before:**
```
mongodb+srv://goldapp:MyPassword123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**After:**
```
mongodb+srv://goldapp:MyPassword123@cluster0.xxxxx.mongodb.net/gold-silver-app?retryWrites=true&w=majority
```

**Notice:** Added `/gold-silver-app` before `?`

**✅ Final connection string ready!**

---

## ✅ STEP 7: Update Your .env File

### 7.1 Connect to Your Server

```bash
ssh root@93.127.206.164
```

### 7.2 Go to Backend Folder

```bash
cd /var/www/backend
```

### 7.3 Edit .env File

```bash
nano .env
```

### 7.4 Update MONGODB_URI

**Find this line:**
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gold-silver-app?retryWrites=true&w=majority
```

**Replace it with your actual connection string:**
```
MONGODB_URI=mongodb+srv://goldapp:YourPassword@cluster0.xxxxx.mongodb.net/gold-silver-app?retryWrites=true&w=majority
```

**Make sure to:**
- Replace `goldapp` with your actual username
- Replace `YourPassword` with your actual password
- Replace `cluster0.xxxxx` with your actual cluster address

### 7.5 Save File

1. **Press:** `Ctrl + X`
2. **Press:** `Y`
3. **Press:** `Enter`

**✅ MongoDB connection configured!**

---

## ✅ STEP 8: Test Connection

### 8.1 Generate JWT Secret (if not done)

```bash
openssl rand -base64 32
```

**Copy the output and update JWT_SECRET in .env:**

```bash
nano .env
```

**Find:** `JWT_SECRET=CHANGE_THIS`
**Replace with:** `JWT_SECRET=<paste generated string>`

**Save:** `Ctrl + X`, `Y`, `Enter`

### 8.2 Start Backend

```bash
pm2 start ecosystem.config.js --env production
```

### 8.3 Check Logs

```bash
pm2 logs goldapp-backend
```

**Look for:**
- ✅ `MongoDB Connected: cluster0.xxxxx.mongodb.net`
- ❌ If you see errors, check your connection string

**✅ Connection working!**

---

## 📝 Complete Example

### Your Final .env File Should Look Like:

```env
MONGODB_URI=mongodb+srv://goldapp:MySecurePassword123@cluster0.abc123.mongodb.net/gold-silver-app?retryWrites=true&w=majority
JWT_SECRET=your-generated-jwt-secret-here-32-characters-long
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=http://srv1226397.hstgr.cloud,https://srv1226397.hstgr.cloud
```

---

## 🐛 Troubleshooting

### Problem: "Authentication failed"

**Solution:**
- Check username and password are correct
- Make sure you replaced `<password>` with actual password
- Verify database user exists in MongoDB Atlas

### Problem: "IP not whitelisted"

**Solution:**
- Go to Network Access in MongoDB Atlas
- Add your server IP: `93.127.206.164`
- Or use `0.0.0.0/0` to allow all IPs

### Problem: "Connection timeout"

**Solution:**
- Check your internet connection
- Verify cluster is running (not paused)
- Check firewall settings

### Problem: "Database name not found"

**Solution:**
- MongoDB Atlas creates database automatically when you first write to it
- Make sure connection string has `/gold-silver-app` before `?`

---

## ✅ Checklist

- [ ] MongoDB Atlas account created
- [ ] Free cluster created
- [ ] Database user created (username + password saved)
- [ ] Server IP whitelisted (`93.127.206.164`)
- [ ] Connection string copied
- [ ] Password replaced in connection string
- [ ] Database name added (`/gold-silver-app`)
- [ ] .env file updated
- [ ] Backend started and connected successfully

---

## 🎯 Summary

**8 Steps:**
1. ✅ Create account
2. ✅ Create cluster
3. ✅ Create database user
4. ✅ Whitelist IP
5. ✅ Get connection string
6. ✅ Update connection string
7. ✅ Update .env file
8. ✅ Test connection

**Time:** About 10-15 minutes

**Cost:** FREE forever!

---

**🎉 You're done! Your MongoDB Atlas is ready to use!**



