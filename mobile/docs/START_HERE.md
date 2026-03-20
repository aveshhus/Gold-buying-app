# 🚀 START HERE: Build Android APK - Complete Guide

## 📋 Quick Checklist

Follow these steps in order:

- [ ] Step 1: Create Expo Account
- [ ] Step 2: Login to Expo in Terminal
- [ ] Step 3: Update API URL (if needed)
- [ ] Step 4: Start Backend Server
- [ ] Step 5: Build APK
- [ ] Step 6: Download APK
- [ ] Step 7: Install on Android Device

---

## ✅ STEP 1: Create Expo Account

1. **Open your web browser**
2. **Go to:** https://expo.dev
3. **Click:** "Sign Up" or "Get Started" button
4. **Choose one:**
   - ✅ Sign up with **GitHub** (fastest - recommended)
   - ✅ Sign up with **Google** account
   - ✅ Sign up with **Email** address

5. **Complete the signup process**
   - If using email, check your inbox and verify email

**✅ DONE:** You now have an Expo account!

---

## ✅ STEP 2: Login to Expo in Terminal

1. **Open PowerShell** (Windows Key + X, then select PowerShell)

2. **Navigate to mobile folder:**
   ```powershell
   cd "C:\Users\Admin\Desktop\Goldapp 2\mobile"
   ```

3. **Login to Expo:**
   ```powershell
   eas login
   ```

4. **Enter your credentials:**
   - Email and password you just created
   - Or choose "Create new account" if you want to create it from terminal

5. **You should see:**
   ```
   ✅ Logged in as your-email@example.com
   ```

**✅ DONE:** You're logged in!

---

## ✅ STEP 3: Update API URL (Important!)

1. **Open file:** `mobile/src/api/client.ts`

2. **Find line 8** (looks like this):
   ```typescript
   const API_BASE_URL = 'http://192.168.31.233:3001/api';
   ```

3. **Update it based on your needs:**

   **Option A: Testing on same network (local)**
   - Find your computer's IP address:
     - Open PowerShell
     - Run: `ipconfig`
     - Look for "IPv4 Address" (e.g., 192.168.1.100)
   - Update to: `const API_BASE_URL = 'http://YOUR_IP:3001/api';`

   **Option B: Production server**
   - Update to: `const API_BASE_URL = 'https://your-domain.com/api';`

   **Option C: Keep current (if IP is correct)**
   - Leave it as is

4. **Save the file**

**✅ DONE:** API URL is configured!

---

## ✅ STEP 4: Start Backend Server

**IMPORTANT:** The backend must be running for the app to work!

1. **Open a NEW PowerShell window** (keep the mobile one open)

2. **Navigate to backend:**
   ```powershell
   cd "C:\Users\Admin\Desktop\Goldapp 2\backend"
   ```

3. **Start the server:**
   ```powershell
   npm start
   ```

4. **You should see:**
   ```
   Server running on port 3001
   MongoDB Connected: ...
   ```

5. **Keep this window open!** Don't close it.

**✅ DONE:** Backend is running!

---

## ✅ STEP 5: Build the APK

1. **Go back to the PowerShell window** where you logged into Expo

2. **Make sure you're in mobile folder:**
   ```powershell
   cd "C:\Users\Admin\Desktop\Goldapp 2\mobile"
   ```

3. **Start the build:**
   ```powershell
   eas build --platform android --profile preview
   ```

4. **Answer the prompts:**

   **First time, you might see:**
   ```
   ? This project is not configured for EAS Build. Would you like to set it up now?
   ```
   - Type: **Y** and press Enter

   **You might see:**
   ```
   ? Would you like to create a new Android Keystore?
   ```
   - Type: **Y** and press Enter

5. **Build starts:**
   ```
   ✔ Build started, it may take a few minutes to complete.
   ✔ You can check the status at https://expo.dev/...
   ```

6. **Wait 10-20 minutes:**
   - Build happens in the cloud
   - You can check status at the URL shown
   - Or wait for email notification

**✅ DONE:** Build is complete when you see "Build finished" or get email!

---

## ✅ STEP 6: Download APK

1. **Get download link:**

   **Option A:** From terminal - copy the download link shown

   **Option B:** From email - check your email for "Build finished" notification

   **Option C:** From website:
   - Go to: https://expo.dev/accounts/[your-account]/builds
   - Find your latest build
   - Click "Download" button

2. **Download the APK:**
   - Click the download link
   - File will download (usually 30-50 MB)
   - Save it somewhere easy to find (like Desktop)

**✅ DONE:** APK file is on your computer!

---

## ✅ STEP 7: Install on Android Device

1. **Transfer APK to phone:**

   **Method A: USB Cable**
   - Connect phone to computer
   - Copy APK to phone's Downloads folder
   - Disconnect

   **Method B: Email**
   - Email APK to yourself
   - Open email on phone
   - Download APK

   **Method C: Google Drive/Dropbox**
   - Upload APK to cloud
   - Download on phone

2. **Enable Unknown Sources:**
   - On Android phone: Settings → Security
   - Enable "Install Unknown Apps" or "Unknown Sources"
   - Select the app you'll use (Files, Email, etc.)

3. **Install APK:**
   - Open Files app on phone
   - Go to Downloads folder
   - Tap the APK file
   - Tap "Install"
   - Wait for installation
   - Tap "Open"

**✅ DONE:** App is installed and ready to use!

---

## 🎉 Success!

Your Android APK is built and installed! The app should now work on your device.

---

## 🔧 Troubleshooting

### "eas: command not found"
**Fix:**
```powershell
npm install -g eas-cli
```

### "Not logged in"
**Fix:**
```powershell
eas login
```

### "Build failed"
**Check:**
- API URL is correct in `src/api/client.ts`
- Backend server is running
- Internet connection is working

### "App can't connect to backend"
**Fix:**
- Make sure backend is running (Step 4)
- Check API URL matches your computer's IP
- Ensure phone and computer are on same network

---

## 📝 Quick Commands Reference

```powershell
# Navigate to mobile
cd "C:\Users\Admin\Desktop\Goldapp 2\mobile"

# Login
eas login

# Build APK
eas build --platform android --profile preview

# Start backend (separate terminal)
cd "C:\Users\Admin\Desktop\Goldapp 2\backend"
npm start
```

---

**Ready? Start with Step 1!** 🚀

