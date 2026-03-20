# Android Development Fix Guide

This guide helps you resolve the ADB (Android Debug Bridge) connection errors when running the Android app.

## Issues Fixed

1. ✅ **Package Version Mismatches**: Updated packages to match Expo 50 requirements
   - `@react-native-async-storage/async-storage`: Fixed to `1.21.0`
   - `expo-image-picker`: Downgraded to `~14.7.1` (from `15.0.0`)
   - `expo-linear-gradient`: Downgraded to `~12.7.2` (from `13.0.2`)
   - `react-native`: Updated to `0.73.6` (from `0.73.0`)

2. ✅ **ADB Connection Errors**: Created scripts to automatically fix ADB issues
3. ✅ **Better Error Handling**: Improved Android launch script with automatic ADB checks

## Quick Start

### 1. Install Updated Dependencies

First, reinstall packages with the corrected versions:

```bash
cd mobile
npm install
```

### 2. Fix ADB Issues (if needed)

If you encounter ADB errors, run the fix script:

**PowerShell (recommended):**
```powershell
npm run fix-adb
```

**Or manually:**
```powershell
.\fix-adb.ps1
```

**CMD/Batch:**
```cmd
fix-adb.bat
```

This script will:
- Stop any running ADB server instances
- Restart the ADB server cleanly
- Check for connected devices/emulators

### 3. Install Expo Go (if not already installed)

Before running the app, make sure Expo Go is installed on your device/emulator:

```bash
npm run install-expo-go
```

This will:
- Check connected devices
- Verify if Expo Go is installed
- Open Play Store to install it if missing

**Or manually:**
- Open Play Store on your Android device/emulator
- Search for "Expo Go"
- Install the official Expo Go app

### 4. Start Android Development

**New improved method (recommended):**
```bash
npm run android
```

This will:
- Automatically check if ADB is installed
- Restart ADB server to fix connection issues
- Check for connected devices and wait for them to be ready
- Automatically retry with tunnel mode if initial connection fails
- Start Expo with Android support

**Direct method (bypasses ADB checks):**
```bash
npm run android:direct
```

## Troubleshooting

### Error: "Can't find service: package" (ADB Error Code 20)

This error occurs when Expo tries to check if Expo Go is installed but ADB can't access the device's package manager.

**Solutions (try in order):**

1. **Wait for device to fully boot:**
   - Make sure your emulator/device is fully booted (lock screen should be visible)
   - Wait 30-60 seconds after emulator starts before running the command

2. **Install Expo Go on your device:**
   ```bash
   npm run install-expo-go
   ```
   This will open Play Store on your device. Install "Expo Go" app.

3. **Use tunnel mode (bypasses some ADB issues):**
   ```bash
   npm run android:tunnel
   ```

4. **Start without device connection:**
   ```bash
   npm run android:no-device
   ```
   Then connect your device later - Expo will auto-detect it.

5. **Manual ADB fix:**
   ```bash
   npm run fix-adb
   ```

### Error: "ADB not found"

**Solution:**
1. Install Android SDK Platform-Tools
   - Download from: https://developer.android.com/studio/releases/platform-tools
   - Or install via Android Studio: SDK Manager → SDK Tools → Android SDK Platform-Tools

2. Add to PATH (optional but recommended):
   - Default location: `C:\Users\<YourUser>\AppData\Local\Android\Sdk\platform-tools`
   - Add this to your system PATH environment variable

### No Devices Detected

**If using an emulator:**
```bash
# List available emulators
emulator -list-avds

# Start an emulator
emulator -avd <avd_name>
```

**If using a physical device:**
1. Enable Developer Options on your Android device
2. Enable USB Debugging
3. Connect device via USB
4. Accept the USB debugging prompt on your device
5. Run `npm run fix-adb` to refresh connections

### Package Version Warnings

If you still see package version warnings after running `npm install`:

1. Delete `node_modules` and `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   ```

2. Reinstall:
   ```bash
   npm install
   ```

## Scripts Available

- `npm run android` - Start with automatic ADB checks and retry logic (recommended)
- `npm run android:tunnel` - Start using tunnel mode (slower but more reliable)
- `npm run android:no-device` - Start without device connection
- `npm run android:direct` - Start directly without ADB checks (bypasses all checks)
- `npm run install-expo-go` - Install Expo Go app on connected device/emulator
- `npm run fix-adb` - Fix ADB connection issues
- `npm start` - Start Expo development server
- `npm run start:clear` - Start Expo with cleared cache

## What Changed

### Files Modified:
- `package.json` - Fixed package versions, added new scripts
- `start-android.js` - Improved Android launcher with:
  - Device boot status checking
  - Automatic retry with tunnel mode on failure
  - Better error handling for ADB error code 20
  - Fixed Node.js deprecation warnings

### Files Created:
- `fix-adb.ps1` - PowerShell script to fix ADB issues
- `fix-adb.bat` - Batch script to fix ADB issues
- `install-expo-go.js` - Script to install Expo Go on devices
- `ANDROID_FIX_README.md` - This file

## Need More Help?

1. Check that Android SDK is properly installed
2. Verify emulator is running or device is connected
3. Try restarting your computer (ADB sometimes needs a full restart)
4. Check Expo documentation: https://docs.expo.dev/

