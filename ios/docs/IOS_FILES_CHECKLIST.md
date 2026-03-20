# ✅ iOS Project Files Verification Checklist

This checklist verifies that all required files exist in the iOS folder for the project to run properly.

## 📁 Required Files & Folders

### ✅ Core Configuration Files

- [x] `package.json` - Node.js dependencies and scripts
- [x] `app.json` - Expo configuration
- [x] `babel.config.js` - Babel transpiler configuration
- [x] `metro.config.js` - Metro bundler configuration
- [x] `tsconfig.json` - TypeScript configuration
- [x] `index.js` - Entry point for the app
- [x] `App.tsx` - Main React component
- [x] `Podfile` - CocoaPods dependencies configuration

### ✅ Xcode Project Files

- [x] `goldsilverappios.xcodeproj/` - Xcode project directory
  - [x] `project.pbxproj` - Xcode project file
  - [x] `xcshareddata/` - Shared Xcode data
  
- [x] `goldsilverappios.xcworkspace/` - Xcode workspace (created after `pod install`)
  - [x] `contents.xml` - Workspace contents
  - [x] `xcshareddata/` - Shared workspace data

### ✅ Native iOS Files

- [x] `goldsilverappios/` - Native iOS app folder
  - [x] `AppDelegate.h` - App delegate header
  - [x] `AppDelegate.m` - App delegate implementation
  - [x] `Info.plist` - iOS app configuration
  - [x] `main.m` - App entry point
  - [x] `LaunchScreen.storyboard` - Launch screen
  - [x] `Images.xcassets/` - Image assets catalog
    - [x] `AppIcon.appiconset/` - App icon set
    - [x] `Contents.json` - Assets catalog configuration

### ✅ Source Code Files

- [x] `src/` - Source code directory
  - [x] `api/` - API client files
  - [x] `components/` - React components
  - [x] `screens/` - Screen components
  - [x] `store/` - State management
  - [x] `types/` - TypeScript types
  - [x] `utils/` - Utility functions

### ✅ Assets (Optional but Recommended)

- [ ] `assets/` - Asset files
  - [ ] `icon.png` - App icon (1024x1024)
  - [ ] `splash.png` - Splash screen
  - [ ] `favicon.png` - Web favicon

**Note**: Assets are optional for development. Expo will use default icons if not provided.

### ✅ Documentation

- [x] `README.md` - Project documentation
- [x] `VERIFICATION.md` - Verification document
- [x] `IOS_MAC_SETUP_GUIDE.md` - Setup guide for Mac
- [x] `IOS_FILES_CHECKLIST.md` - This file

### ✅ Configuration Files

- [x] `.gitignore` - Git ignore rules

## 🔧 Files Created by Build Process

These files are generated automatically and should NOT be committed:

- `Pods/` - CocoaPods dependencies (created by `pod install`)
- `Podfile.lock` - CocoaPods lock file (created by `pod install`)
- `node_modules/` - Node.js dependencies (created by `npm install`)
- `build/` - Build artifacts (created by Xcode)
- `.expo/` - Expo cache (created by Expo)

## ✅ Verification Commands

Run these commands to verify your setup:

```bash
# 1. Check if all core files exist
ls -la ios/package.json ios/app.json ios/babel.config.js ios/metro.config.js

# 2. Check Xcode project
ls -d ios/goldsilverappios.xcodeproj ios/goldsilverappios.xcworkspace

# 3. Check native files
ls -la ios/goldsilverappios/AppDelegate.* ios/goldsilverappios/Info.plist

# 4. Check if Pods are installed
ls -d ios/Pods 2>/dev/null || echo "Pods not installed - run 'pod install'"

# 5. Check if node_modules exist
ls -d ios/node_modules 2>/dev/null || echo "node_modules not installed - run 'npm install'"
```

## 🚀 Setup Verification Steps

1. **Install Node Dependencies:**
   ```bash
   cd ios
   npm install
   ```
   ✅ Verify: `node_modules/` folder exists

2. **Install CocoaPods Dependencies:**
   ```bash
   cd ios
   pod install
   ```
   ✅ Verify: `Pods/` folder exists
   ✅ Verify: `goldsilverappios.xcworkspace` is updated

3. **Verify Xcode Project Opens:**
   ```bash
   open ios/goldsilverappios.xcworkspace
   ```
   ✅ Verify: Xcode opens without errors
   ✅ Verify: Project builds successfully

4. **Start Expo:**
   ```bash
   cd ios
   npm start
   ```
   ✅ Verify: Expo dev server starts
   ✅ Verify: QR code appears

## ⚠️ Common Issues

### Issue: "Podfile not found"
- **Solution**: Ensure you're in the `ios/` directory
- **Check**: `ls Podfile` should show the file

### Issue: "No such module 'ExpoModulesCore'"
- **Solution**: Run `pod install` in the `ios/` directory
- **Check**: `ls Pods/` should show Expo modules

### Issue: "Cannot open xcworkspace"
- **Solution**: 
  1. Ensure `pod install` has been run
  2. Open `goldsilverappios.xcworkspace` NOT `goldsilverappios.xcodeproj`

### Issue: "Assets not found"
- **Solution**: Assets are optional. Expo will use defaults if missing.
- **Optional**: Create `assets/` folder and add icon/splash images

### Issue: "Metro bundler errors"
- **Solution**: 
  ```bash
  cd ios
  rm -rf node_modules
  npm install
  npx expo start -c
  ```

## 📋 Final Checklist Before Running

Before running the iOS app, ensure:

- [ ] Node.js v16+ installed
- [ ] npm dependencies installed (`npm install`)
- [ ] CocoaPods installed (`sudo gem install cocoapods`)
- [ ] Pods installed (`pod install`)
- [ ] Xcode installed and opened at least once
- [ ] Xcode Command Line Tools installed
- [ ] Backend server running on port 3001
- [ ] All files from checklist above exist
- [ ] Ready to run `npm start` or `npm run ios`

## ✅ All Files Present!

If all files are checked, your iOS project structure is complete and ready to run!

**Next Steps:**
1. Follow `IOS_MAC_SETUP_GUIDE.md` for detailed setup instructions
2. Run `npm install` and `pod install`
3. Start the app with `npm run ios`

---

**Last Updated**: Checked all files exist in the project structure
**Status**: ✅ All required files are present

