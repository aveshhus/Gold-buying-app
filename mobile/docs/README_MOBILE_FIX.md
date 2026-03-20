# Fix for Windows node:sea Error

## Problem
Expo tries to create a directory `node:sea` which contains a colon (`:`) - invalid on Windows.

## Solution

### Option 1: Use PowerShell Script (Recommended)
```powershell
cd mobile
.\start-expo.ps1
```

### Option 2: Set Environment Variables Manually
```powershell
cd mobile
$env:EXPO_NO_METRO_LAZY = "1"
$env:NODE_OPTIONS = "--no-experimental-fetch"
npx expo start --clear
```

### Option 3: Use Batch File
```cmd
cd mobile
start-expo.bat
```

### Option 4: Temporary Workaround - Create Directory Manually
If the above don't work, try creating the directory structure manually:
```powershell
cd mobile
New-Item -ItemType Directory -Force -Path ".expo\metro\externals\node_sea"
```

Then try:
```powershell
npx expo start
```

## If Still Not Working

Try downgrading Expo to SDK 49:
```bash
npm install expo@~49.0.0
npm install react-native@0.72.0
```

