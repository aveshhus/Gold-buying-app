# React Native Conversion - Complete Guide

This document outlines the complete conversion of the Gold & Silver web app to React Native Android app.

## Conversion Status

### ✅ Completed
- API Client (configured for Android)
- Auth Store (Zustand with AsyncStorage)
- Price Store
- Basic Landing Screen
- Basic Login Screen
- Basic Dashboard Structure
- Basic Admin Structure
- Core Components (Portfolio, Purchase, Payments, Deliveries, Profile, Analytics, Security)

### 🔄 In Progress
- Enhanced Landing Page (matching web exactly)
- Complete Dashboard Navigation (matching web sidebar)
- Missing Dashboard Sections (Charts, Alerts, Transactions, Support)
- Enhanced all existing components

### ❌ To Do
- Admin Notifications component
- Enhanced UI components matching web design
- Notification system
- Price Charts component
- Price Alerts component
- Transaction Ledger component
- Help & Support component

## Key Differences from Web

1. **Navigation**: React Native uses React Navigation instead of Next.js routing
2. **Styling**: React Native StyleSheet instead of Tailwind CSS
3. **Storage**: AsyncStorage instead of localStorage
4. **API Base URL**: 
   - Android Emulator: `http://10.0.2.2:3001/api`
   - Physical Device: Use your PC's IP address (e.g., `http://192.168.1.100:3001/api`)
5. **Images**: React Native Image component instead of Next.js Image

## Running the App

1. Make sure backend is running on port 3001
2. For Android Emulator:
   ```bash
   cd mobile
   npm install
   npm run android
   ```
3. For Physical Device:
   - Update `API_BASE_URL` in `mobile/src/api/client.ts` to your PC's IP
   - Connect device and run: `npm run android`

## Backend Connection

The backend remains unchanged. The mobile app connects to the same Express.js backend on port 3001.

