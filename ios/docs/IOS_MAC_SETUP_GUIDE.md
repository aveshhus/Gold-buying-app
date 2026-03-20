# 📱 iOS App Setup Guide for Mac

Complete step-by-step guide to run the iOS app on macOS.

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

1. **Xcode** (Latest version recommended)
   - Download from Mac App Store: https://apps.apple.com/us/app/xcode/id497799835
   - This includes iOS Simulator and development tools
   - **Note**: Xcode is large (10GB+), ensure you have enough disk space

2. **Xcode Command Line Tools**
   ```bash
   xcode-select --install
   ```
   - This will prompt you to install if not already installed

3. **Node.js** (v16 or higher)
   - Check if installed: `node --version`
   - Download from: https://nodejs.org/
   - Recommended: Install via Homebrew: `brew install node`

4. **Homebrew** (Package manager for Mac - optional but recommended)
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

5. **CocoaPods** (iOS dependency manager)
   ```bash
   sudo gem install cocoapods
   ```
   - Or via Homebrew: `brew install cocoapods`

6. **Expo CLI** (Global installation)
   ```bash
   npm install -g expo-cli
   ```
   - Or use npx (no global install needed): `npx expo start`

7. **Watchman** (File watcher - recommended)
   ```bash
   brew install watchman
   ```

### System Requirements

- macOS 10.15 (Catalina) or later
- At least 8GB RAM (16GB recommended)
- At least 20GB free disk space
- Backend server running on port 3001

---

## 🚀 Step-by-Step Setup

### Step 1: Verify Prerequisites

Check that everything is installed:

```bash
# Check Node.js
node --version  # Should be v16 or higher

# Check npm
npm --version

# Check Xcode
xcode-select -p  # Should show Xcode path

# Check CocoaPods
pod --version

# Check Expo CLI
expo --version
```

### Step 2: Navigate to iOS Project

```bash
cd /path/to/Goldapp/ios
```

Or if you're in the project root:
```bash
cd ios
```

### Step 3: Install Node Dependencies

```bash
npm install
```

This will install all JavaScript dependencies listed in `package.json`.

**If you encounter errors:**
- Delete `node_modules` and `package-lock.json`, then reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

### Step 4: Install CocoaPods Dependencies

iOS native dependencies need to be installed via CocoaPods:

```bash
cd ios  # Make sure you're in the ios directory
pod install
```

**Important Notes:**
- This step is crucial for native iOS dependencies
- If `pod install` fails, try updating CocoaPods:
  ```bash
  sudo gem install cocoapods
  pod repo update
  pod install
  ```

### Step 5: Start the Backend Server

Make sure your backend server is running on port 3001:

```bash
# From the project root directory
cd ..  # Go back to project root if you're in ios folder
npm start
# or
node server.js
```

Keep this terminal running. The backend should be accessible at `http://localhost:3001`

### Step 6: Start Expo Development Server

**Option A: Using npm scripts (Recommended)**
```bash
cd ios
npm start
```

**Option B: Direct Expo command**
```bash
cd ios
expo start --ios
```

**Option C: Using npx (no global install needed)**
```bash
cd ios
npx expo start --ios
```

### Step 7: Open iOS Simulator

Once Expo starts, you'll see a QR code and menu options:

**Method 1: Automatic Launch**
- If you used `npm run ios` or `expo start --ios`, the simulator should open automatically

**Method 2: Manual Launch**
- Press `i` in the terminal where Expo is running
- Or open Simulator manually:
  ```bash
  open -a Simulator
  ```

**Method 3: From Xcode**
- Open Xcode
- Go to `Xcode > Open Developer Tool > Simulator`

---

## 📱 Running on Physical iOS Device

To run on a physical iPhone/iPad:

### Step 1: Install Expo Go

Install the **Expo Go** app from the App Store on your iOS device:
- Search for "Expo Go"
- Install the official Expo Go app

### Step 2: Connect to Same Network

- Ensure your Mac and iOS device are on the same Wi-Fi network
- Both devices must be able to communicate with each other

### Step 3: Update API URL (If Needed)

For physical devices, you may need to update the API base URL:

**Find your Mac's IP address:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Update API URL in `ios/src/api/client.ts`:**
```typescript
const API_BASE_URL = __DEV__
  ? Platform.OS === 'ios'
    ? 'http://YOUR_MAC_IP:3001/api'  // Replace YOUR_MAC_IP with your actual IP
    : 'http://localhost:3001/api'
  : 'http://localhost:3001/api';
```

### Step 4: Scan QR Code

1. Start Expo server: `npm start` or `expo start`
2. Open Expo Go app on your iOS device
3. Scan the QR code shown in the terminal
4. The app will load on your device

---

## 🛠️ Available Commands

### Development Commands

```bash
# Start Expo development server
npm start

# Start and open in iOS Simulator
npm run ios

# Start with cleared cache
npm run start:clear

# Start web version
npm run web
```

### Troubleshooting Commands

```bash
# Clear Expo cache
expo start -c

# Clear watchman cache
watchman watch-del-all

# Reset Metro bundler cache
rm -rf node_modules/.cache

# Clean install
rm -rf node_modules package-lock.json
npm install
```

### iOS Native Commands

```bash
# Install CocoaPods dependencies
pod install

# Update CocoaPods dependencies
pod update

# Clean Xcode build
cd ios
xcodebuild clean
```

---

## 🔧 Common Issues & Solutions

### Issue 1: "Command not found: expo"

**Solution:**
```bash
# Install Expo CLI globally
npm install -g expo-cli

# Or use npx (no install needed)
npx expo start --ios
```

### Issue 2: "CocoaPods not found"

**Solution:**
```bash
# Install CocoaPods
sudo gem install cocoapods

# Or via Homebrew
brew install cocoapods

# Verify installation
pod --version
```

### Issue 3: "No simulator available" or "Simulator won't start"

**Solution:**
```bash
# List available simulators
xcrun simctl list devices

# Boot a specific simulator
xcrun simctl boot "iPhone 14 Pro"

# Or open Simulator app
open -a Simulator
```

### Issue 4: "Metro bundler connection issues"

**Solution:**
```bash
# Clear all caches
watchman watch-del-all
rm -rf node_modules/.cache
expo start -c
```

### Issue 5: "Build errors in Xcode"

**Solution:**
```bash
cd ios
pod deintegrate
pod install
cd ..
npm start
```

### Issue 6: "Port 8081 already in use"

**Solution:**
```bash
# Find and kill the process using port 8081
lsof -ti:8081 | xargs kill -9

# Or use a different port
expo start --port 8082
```

### Issue 7: "Cannot connect to backend"

**Solutions:**
1. **For iOS Simulator**: Backend should be at `http://localhost:3001`
2. **For Physical Device**: Update API URL to your Mac's IP address
3. **Check backend is running**: `curl http://localhost:3001/api/health`
4. **Check firewall**: Allow connections on port 3001

### Issue 8: "Expo Go app won't load"

**Solutions:**
- Ensure device and Mac are on same Wi-Fi network
- Check firewall settings
- Try tunnel mode: `expo start --tunnel`
- Use iOS Simulator instead for testing

---

## 📋 Quick Start Checklist

Use this checklist to ensure everything is set up correctly:

- [ ] Xcode installed and opened at least once
- [ ] Xcode Command Line Tools installed
- [ ] Node.js v16+ installed
- [ ] CocoaPods installed
- [ ] Expo CLI installed (or using npx)
- [ ] Navigated to `ios` directory
- [ ] Ran `npm install`
- [ ] Ran `pod install`
- [ ] Backend server running on port 3001
- [ ] iOS Simulator or Expo Go app ready
- [ ] Ready to run `npm start` or `npm run ios`

---

## 🎯 Recommended Development Workflow

1. **Start Backend** (in Terminal 1):
   ```bash
   cd /path/to/Goldapp
   npm start
   ```

2. **Start Expo** (in Terminal 2):
   ```bash
   cd /path/to/Goldapp/ios
   npm run ios
   ```

3. **Watch for Changes**:
   - Expo will hot-reload when you make changes
   - Shake device/simulator to open developer menu
   - Press `r` in terminal to reload manually

---

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native iOS Setup](https://reactnative.dev/docs/environment-setup)
- [Xcode Documentation](https://developer.apple.com/xcode/)
- [CocoaPods Guide](https://guides.cocoapods.org/)

---

## 🆘 Getting Help

If you encounter issues not covered here:

1. Check the main project README
2. Review `ios/README.md` for project-specific notes
3. Check Expo logs in terminal for detailed error messages
4. Check Xcode console for native iOS errors
5. Search Expo/React Native forums and GitHub issues

---

## ✅ Success!

Once everything is set up, you should see:
- Expo development server running
- iOS Simulator open with your app
- App connected to backend at `localhost:3001`
- Hot reload working when you make code changes

Happy coding! 🚀

