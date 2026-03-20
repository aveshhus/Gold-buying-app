# 📱 Build Android APK - Complete Guide

## ✅ Prerequisites

1. **Node.js** installed (v18 or higher)
2. **Expo CLI** installed globally
3. **Android Studio** installed (for Android SDK)
4. **Java JDK** (version 17 recommended)

## 🚀 Method 1: Using Expo Application Services (EAS) - RECOMMENDED

### Step 1: Install EAS CLI
```bash
npm install -g eas-cli
```

### Step 2: Login to Expo
```bash
eas login
```
(If you don't have an account, create one at https://expo.dev)

### Step 3: Configure EAS Build
```bash
cd mobile
eas build:configure
```

### Step 4: Build APK
```bash
# Build APK for testing (no Google Play signing)
eas build --platform android --profile preview

# Or build AAB for Google Play Store
eas build --platform android --profile production
```

### Step 5: Download APK
- EAS will build your app in the cloud
- You'll get a download link when it's done
- Download and install on your Android device

---

## 🛠️ Method 2: Build Locally (Advanced)

### Step 1: Generate Android Native Project
```bash
cd mobile
npx expo prebuild --platform android
```

### Step 2: Build APK with Gradle
```bash
cd android
./gradlew assembleRelease
```

The APK will be at: `android/app/build/outputs/apk/release/app-release.apk`

### Step 3: Sign APK (Optional, for production)
```bash
# Generate keystore
keytool -genkeypair -v -storetype PKCS12 -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000

# Sign APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore app-release-unsigned.apk my-key-alias
```

---

## ⚡ Quick Build Script

I'll create a build script for you. Run:

```bash
cd mobile
npm run build:android
```

---

## 📝 Notes

- **APK Size**: First build might be large (~50-100MB) due to bundled assets
- **Testing**: Install APK on device using `adb install app-release.apk`
- **Updates**: For OTA updates, use Expo Updates service
- **Backend URL**: Make sure your API URL in `src/api/client.ts` is accessible from devices

---

## 🔧 Troubleshooting

### "Command not found: eas"
```bash
npm install -g eas-cli
```

### "Android SDK not found"
- Install Android Studio
- Set ANDROID_HOME environment variable
- Add platform-tools to PATH

### "Build failed"
- Check `app.json` configuration
- Ensure all dependencies are installed
- Check Expo SDK version compatibility

