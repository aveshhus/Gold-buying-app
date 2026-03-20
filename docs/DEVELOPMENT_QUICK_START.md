# 🚀 Quick Start Guide

Get your Gold & Silver app running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your MongoDB connection:
   ```env
   MONGODB_URI=mongodb://localhost:27017/gold-silver-app
   JWT_SECRET=your-secret-key-change-in-production
   PORT=3001
   ```

## Step 3: Start MongoDB

**Option A: MongoDB Atlas (Cloud)**
- Create account at https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string
- Update `MONGODB_URI` in `.env`

**Option B: Local MongoDB**
- Install MongoDB Community Server
- Start MongoDB service
- Use: `mongodb://localhost:27017/gold-silver-app`

## Step 4: Migrate Data (Optional)

If you have existing JSON data:
```bash
npm run migrate
```

## Step 5: Start Server

```bash
npm start
```

## Step 6: Open Browser

Go to: **http://localhost:3001**

## Login

**Admin:**
- Email: `admin@goldapp.com`
- Password: `admin123`

---

**That's it! Your app is running! 🎉**

For detailed setup, see `docs/MONGODB_SETUP.md`










