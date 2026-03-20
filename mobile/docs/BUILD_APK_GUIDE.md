# 📱 Complete Guide: Build Android APK

## 🎯 Quick Start (Easiest Method - Recommended)

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

### Step 2: Login to Expo
```bash
cd mobile
eas login
```
(If you don't have an account, create one at https://expo.dev - it's free!)

### Step 3: Build APK
```bash
eas build --platform android --profile preview
```

### Step 4: Download APK
- The build will run in the cloud (takes 10-20 minutes)
- You'll get a download link via email or in the terminal
- Download the APK and install on your Android device

**That's it!** 🎉

---

## 📋 Detailed Steps

### Prerequisites Check

1. **Node.js** (v18+)
   ```bash
   node --version
   ```

2. **Expo Account** (free at https://expo.dev)

3. **Backend Server Running**
   - Make sure your backend is running on port 3001
   - For production, update API URL in `src/api/client.ts`

### Method 1: EAS Build (Cloud - Easiest) ⭐

**Advantages:**
- ✅ No Android Studio needed
- ✅ No local setup required
- ✅ Works on any OS (Windows/Mac/Linux)
- ✅ Automatic signing

**Steps:**

1. **Navigate to mobile folder:**
   ```bash
   cd mobile
   ```

2. **Install EAS CLI globally:**
   ```bash
   npm install -g eas-cli
   ```

3. **Login to Expo:**
   ```bash
   eas login
   ```
   Enter your Expo account credentials (create one if needed)

4. **Build APK:**
   ```bash
   # For testing (APK file)
   eas build --platform android --profile preview
   
   # For production (AAB file for Play Store)
   eas build --platform android --profile production
   ```

5. **Wait for build:**
   - Build takes 10-20 minutes
   - You'll see progress in terminal
   - You'll receive email when done

6. **Download APK:**
   - Click the download link in terminal/email
   - Or visit: https://expo.dev/accounts/[your-account]/builds

7. **Install on device:**
   - Transfer APK to Android device
   - Enable "Install from Unknown Sources" in settings
   - Tap APK to install

---

### Method 2: Local Build (Advanced)

**Requirements:**
- Android Studio installed
- Java JDK 17
- Android SDK configured

**Steps:**

1. **Generate Android native project:**
   ```bash
   cd mobile
   npx expo prebuild --platform android
   ```

2. **Build APK:**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

3. **Find APK:**
   ```
   android/app/build/outputs/apk/release/app-release.apk
   ```

---

## ⚙️ Important Configuration

### Update API URL for Production

Before building, update the API URL in `mobile/src/api/client.ts`:

**For Production:**
```typescript
const API_BASE_URL = 'https://your-production-domain.com/api';
```

**For Testing (Local Network):**
```typescript
const API_BASE_URL = 'http://YOUR_COMPUTER_IP:3001/api';
// Example: 'http://192.168.1.100:3001/api'
```

**To find your computer's IP:**
- Windows: `ipconfig` (look for IPv4 Address)
- Mac/Linux: `ifconfig` or `ip addr`

---

## 🚀 Using Build Scripts

You can also use the npm scripts:

```bash
cd mobile

# Build APK using EAS (cloud)
npm run build:android

# Build production AAB
npm run build:android:production

# Build locally (requires Android Studio)
npm run build:android:local
```

---

## 📝 Build Profiles Explained

Your `eas.json` has 3 profiles:

1. **preview** - APK for testing, no signing required
2. **production** - AAB for Play Store, requires signing
3. **development** - Development build with dev client

---

## 🔧 Troubleshooting

### "Command not found: eas"
```bash
npm install -g eas-cli
```

### "Not logged in"
```bash
eas login
```

### "Build failed"
- Check `app.json` configuration
- Ensure all dependencies are installed: `npm install`
- Check Expo SDK version compatibility

### "API connection failed"
- Update API URL in `src/api/client.ts`
- Ensure backend server is running
- Check firewall settings

### "APK won't install"
- Enable "Install from Unknown Sources" in Android settings
- Check if APK is corrupted (re-download)

---

## 📦 APK File Location

**EAS Build:**
- Download from Expo dashboard or email link
- Or use: `eas build:list` to see all builds

**Local Build:**
- `mobile/android/app/build/outputs/apk/release/app-release.apk`

---

## 🎯 Next Steps After Building

1. **Test the APK** on a real device
2. **Update API URL** if needed for production
3. **Test all features** (login, purchases, payments, etc.)
4. **For Play Store:** Build AAB with production profile

---

## 💡 Tips

- **First build takes longer** (15-20 min), subsequent builds are faster
- **Keep backend running** during testing
- **Use preview profile** for testing, production for release
- **APK size** will be ~30-50MB (includes all assets)

---

## 📞 Need Help?

- Expo Docs: https://docs.expo.dev/build/introduction/
- EAS Build: https://docs.expo.dev/build/building-on-ci/
- Check build status: https://expo.dev/accounts/[your-account]/builds

---

**Ready to build?** Start with Step 1 above! 🚀





