# 📱 Complete Step-by-Step Guide: Build Android APK (No Account Yet)

## 🎯 Overview
This guide will take you from zero to having an APK file ready to install on your Android device.

**Total Time:** ~30 minutes (most of it waiting for the build)

---

## ✅ Step 1: Create Expo Account (5 minutes)

### 1.1 Open Browser
Go to: **https://expo.dev**

### 1.2 Sign Up
- Click **"Sign Up"** or **"Get Started"** button
- You can sign up with:
  - **GitHub** (recommended - fastest)
  - **Google** account
  - **Email** address

### 1.3 Verify Email (if using email)
- Check your email inbox
- Click the verification link
- Account is now ready!

**✅ Checkpoint:** You should now be logged into expo.dev in your browser

---

## ✅ Step 2: Install EAS CLI (2 minutes)

### 2.1 Open PowerShell/Terminal
- Press `Windows Key + X`
- Select **"Windows PowerShell"** or **"Terminal"**

### 2.2 Navigate to Mobile Folder
```powershell
cd "C:\Users\Admin\Desktop\Goldapp 2\mobile"
```

### 2.3 Install EAS CLI
```powershell
npm install -g eas-cli
```

**Wait for installation to complete** (takes 1-2 minutes)

**✅ Checkpoint:** You should see "added X packages" message

---

## ✅ Step 3: Login to Expo (1 minute)

### 3.1 Login Command
```powershell
eas login
```

### 3.2 Choose Login Method
You'll see options like:
```
? How would you like to authenticate?
❯ Use an existing Expo account
  Create a new Expo account
```

### 3.3 Enter Credentials
- If you chose "Use existing account":
  - Enter your **email** and **password**
- If you chose "Create new account":
  - Follow the prompts to create account

### 3.4 Verify Login
After successful login, you'll see:
```
✅ Logged in as [your-email]
```

**✅ Checkpoint:** You should see "Logged in as..." message

---

## ✅ Step 4: Update API URL (Important!) (2 minutes)

### 4.1 Open API Config File
Open: `mobile/src/api/client.ts`

### 4.2 Find This Line (around line 8):
```typescript
const API_BASE_URL = 'http://192.168.31.233:3001/api';
```

### 4.3 Update for Your Needs

**Option A: Testing on Same Network (Local)**
- Keep the current IP if it's your computer's IP
- Or find your IP: Open PowerShell and run `ipconfig`
- Look for "IPv4 Address" (e.g., 192.168.1.100)
- Update to: `const API_BASE_URL = 'http://YOUR_IP:3001/api';`

**Option B: Production (If you have a server)**
```typescript
const API_BASE_URL = 'https://your-domain.com/api';
```

**Option C: Keep Current (If it works)**
- Leave it as is if the IP is correct

**✅ Checkpoint:** API URL is set correctly

---

## ✅ Step 5: Start Backend Server (Important!) (1 minute)

### 5.1 Open New PowerShell Window
- Keep the mobile folder terminal open
- Open a **NEW** PowerShell window

### 5.2 Navigate to Backend
```powershell
cd "C:\Users\Admin\Desktop\Goldapp 2\backend"
```

### 5.3 Start Server
```powershell
npm start
```

**✅ Checkpoint:** You should see "Server running on port 3001" or similar

**Keep this window open!** The backend must be running for the app to work.

---

## ✅ Step 6: Build the APK (15-20 minutes)

### 6.1 Go Back to Mobile Terminal
Switch to the PowerShell window where you logged into Expo

### 6.2 Make Sure You're in Mobile Folder
```powershell
cd "C:\Users\Admin\Desktop\Goldapp 2\mobile"
```

### 6.3 Start Build
```powershell
eas build --platform android --profile preview
```

### 6.4 Answer Prompts

**First time building, you might see:**
```
? This project is not configured for EAS Build. Would you like to set it up now?
```
- Type: **Y** and press Enter

**You might see:**
```
? Would you like to create a new Android Keystore?
```
- Type: **Y** and press Enter (this is for signing the app)

### 6.5 Build Process Starts
You'll see:
```
✔ Created Android Keystore
✔ Build started, it may take a few minutes to complete.
✔ You can check the status of the build at https://expo.dev/...
```

**✅ Checkpoint:** Build is queued and processing

### 6.6 Wait for Build
- **Time:** 10-20 minutes
- You can:
  - Check status at the URL shown
  - Or wait for email notification
  - Or check: https://expo.dev/accounts/[your-account]/builds

**✅ Checkpoint:** Build completes (you'll see "Build finished" or get email)

---

## ✅ Step 7: Download APK (2 minutes)

### 7.1 Get Download Link

**Option A: From Terminal**
- When build finishes, you'll see a download link
- Copy the link

**Option B: From Email**
- Check your email for "Build finished" notification
- Click the download link

**Option C: From Expo Dashboard**
- Go to: https://expo.dev/accounts/[your-account]/builds
- Find your latest build
- Click "Download" button

### 7.2 Download APK
- Click the download link
- APK file will download (usually 30-50 MB)
- Save it somewhere easy to find (like Desktop)

**✅ Checkpoint:** APK file is downloaded on your computer

---

## ✅ Step 8: Install APK on Android Device (3 minutes)

### 8.1 Transfer APK to Phone

**Method A: USB Cable**
1. Connect phone to computer via USB
2. Copy APK file to phone's Downloads folder
3. Disconnect phone

**Method B: Email/Cloud**
1. Email APK to yourself
2. Open email on phone
3. Download APK

**Method C: Google Drive/Dropbox**
1. Upload APK to cloud storage
2. Download on phone

### 8.2 Enable Unknown Sources
1. On Android phone, go to **Settings**
2. Go to **Security** (or **Apps** → **Special Access**)
3. Enable **"Install Unknown Apps"** or **"Unknown Sources"**
4. Select the app you'll use to install (Files, Email, etc.)

### 8.3 Install APK
1. Open **Files** app on phone
2. Navigate to **Downloads** folder
3. Tap the APK file
4. Tap **"Install"**
5. Wait for installation
6. Tap **"Open"** when done

**✅ Checkpoint:** App is installed and opens on your phone!

---

## 🎉 Success! Your App is Ready!

You should now see your Gold Silver App on your Android device!

---

## 🔧 Troubleshooting

### "eas: command not found"
**Solution:** EAS CLI not installed
```powershell
npm install -g eas-cli
```

### "Not logged in"
**Solution:** Login first
```powershell
eas login
```

### "Build failed"
**Common causes:**
- API URL incorrect → Check `src/api/client.ts`
- Backend not running → Start backend server
- Network issues → Check internet connection

**Solution:** Check build logs at expo.dev dashboard

### "APK won't install"
**Solution:**
- Enable "Install from Unknown Sources" in Android settings
- Make sure APK downloaded completely
- Try downloading again

### "App can't connect to backend"
**Solution:**
- Make sure backend is running on port 3001
- Check API URL in `src/api/client.ts`
- Ensure phone and computer are on same network (for local IP)
- Check firewall settings

---

## 📝 Quick Command Reference

```powershell
# Navigate to mobile folder
cd "C:\Users\Admin\Desktop\Goldapp 2\mobile"

# Login to Expo
eas login

# Build APK
eas build --platform android --profile preview

# Check build status
eas build:list

# Start backend (in separate terminal)
cd "C:\Users\Admin\Desktop\Goldapp 2\backend"
npm start
```

---

## 🎯 Next Steps After First Build

1. **Test all features** in the app
2. **Update API URL** if needed for production
3. **Rebuild** if you make changes:
   ```powershell
   eas build --platform android --profile preview
   ```
4. **For Play Store:** Use production profile:
   ```powershell
   eas build --platform android --profile production
   ```

---

**Ready to start? Begin with Step 1!** 🚀





