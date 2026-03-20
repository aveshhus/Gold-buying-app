# Gold & Silver App - React Native Android

This is the React Native Android version of the Gold & Silver purchase application. The mobile app connects to the same Express.js backend as the web application.

## 🚀 Quick Start

### Prerequisites
1. **Backend Server**: Make sure the backend is running on port 3001
   ```bash
   # From project root
   npm start
   ```

2. **Node.js**: Node.js v14 or higher

3. **Android Studio**: For Android development

4. **Android Emulator or Physical Device**: 
   - Emulator: Use Android Studio's emulator
   - Physical Device: Enable USB debugging

### Installation

```bash
cd mobile
npm install
```

### Configuration

**For Android Emulator** (default):
- API Base URL: `http://10.0.2.2:3001/api` (already configured)

**For Physical Device**:
1. Find your computer's IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr`
2. Update `mobile/src/api/client.ts`:
   ```typescript
   const API_BASE_URL = 'http://YOUR_IP_ADDRESS:3001/api';
   ```
   Example: `http://192.168.1.100:3001/api`

### Run the App

```bash
npm run android
```

Or use Expo:
```bash
npm start
# Then press 'a' for Android
```

## 📱 App Structure

```
mobile/
├── src/
│   ├── api/
│   │   └── client.ts          # API client (configured for Android)
│   ├── components/
│   │   ├── admin/             # Admin components
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminPurchases.tsx
│   │   │   ├── AdminPayments.tsx
│   │   │   ├── AdminDeliveries.tsx
│   │   │   ├── AdminUsers.tsx
│   │   │   └── AdminKYC.tsx
│   │   ├── PortfolioView.tsx
│   │   ├── PurchaseView.tsx
│   │   ├── PaymentsView.tsx
│   │   ├── DeliveriesView.tsx
│   │   ├── ProfileView.tsx
│   │   ├── AnalyticsView.tsx
│   │   └── SecurityView.tsx
│   ├── screens/
│   │   ├── LandingScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   └── AdminScreen.tsx
│   ├── store/
│   │   ├── authStore.ts       # Authentication state (Zustand)
│   │   └── priceStore.ts      # Price state (Zustand)
│   ├── types/
│   │   └── index.ts           # TypeScript types
│   └── utils/
│       └── index.ts           # Utility functions
├── App.tsx                     # Main app component
└── package.json
```

## 🔑 Features

### User Features
- ✅ User registration and login with KYC verification
- ✅ Real-time gold and silver prices
- ✅ Purchase gold and silver with KYC validation
- ✅ Portfolio tracking
- ✅ Payment history
- ✅ Delivery system with OTP
- ✅ Purchase history and analytics
- ✅ Profile management
- ✅ Security center

### Admin Features
- ✅ Admin dashboard with statistics
- ✅ View and manage all purchases
- ✅ Update purchase and payment status
- ✅ View all users
- ✅ Track revenue and deliveries
- ✅ Manage delivery status
- ✅ KYC verification

## 📋 Current Status

### ✅ Completed
- Core infrastructure (API, stores, types)
- Basic screens (Landing, Login, Dashboard, Admin)
- Core components (Portfolio, Purchase, Payments, etc.)
- Authentication flow
- Price updates
- Basic navigation

### 🔄 Needs Enhancement
- Landing page (add all sections from web)
- Dashboard navigation (match web sidebar structure)
- Missing sections: Price Charts, Price Alerts, Transactions, Support
- Missing admin: Notifications management
- UI polish to match web exactly

See `CONVERSION_SUMMARY.md` for detailed status.

## 🔧 Development

### Project Structure
The mobile app uses:
- **React Native** with **Expo** for development
- **React Navigation** for navigation
- **Zustand** for state management
- **AsyncStorage** for local storage

### Key Dependencies
- `@react-navigation/native` - Navigation
- `@react-navigation/bottom-tabs` - Tab navigation
- `@react-navigation/stack` - Stack navigation
- `zustand` - State management
- `@react-native-async-storage/async-storage` - Local storage
- `react-native-toast-message` - Toast notifications
- `expo-image-picker` - Image picker

## 🌐 Backend Connection

The mobile app connects to the same backend as the web app:
- **Backend URL**: `http://localhost:3001` (or your server URL)
- **API Endpoints**: Same as web app (`/api/*`)
- **Authentication**: JWT tokens stored in AsyncStorage
- **CORS**: Backend must allow requests from mobile app

### Testing Backend Connection

1. Make sure backend is running:
   ```bash
   cd ..  # Go to root
   npm start
   ```

2. Test API connection in mobile app:
   - Login should work
   - Prices should load
   - Dashboard should show data

## 🐛 Troubleshooting

### App won't connect to backend
- **Emulator**: Check that `10.0.2.2:3001` is accessible
- **Physical Device**: Update IP address in `api/client.ts`
- **Both**: Make sure backend is running and CORS is configured

### Build errors
```bash
cd mobile
rm -rf node_modules
npm install
npm start -- --reset-cache
```

### Metro bundler issues
```bash
npm start -- --clear
```

### Android emulator not starting
- Open Android Studio
- Go to Tools > Device Manager
- Create/start an emulator

## 📝 Notes

- The app uses the same backend API as the web version
- All functionality from the web app can be replicated
- Authentication is shared (same JWT tokens work)
- Data is synced between web and mobile

## 🎯 Next Steps

1. Enhance landing page to match web exactly
2. Improve dashboard navigation (drawer/sidebar)
3. Add missing sections (Charts, Alerts, Transactions, Support)
4. Add admin notifications
5. Polish UI to match web design

## 📚 Documentation

- `CONVERSION_SUMMARY.md` - Detailed conversion status
- `REACT_NATIVE_CONVERSION.md` - Technical conversion guide
- Web app README: `../README.md`

## 🤝 Support

For issues or questions:
1. Check backend is running
2. Verify API URL configuration
3. Check network connectivity
4. Review error logs in console

---

**Backend must be running on port 3001 for the mobile app to work!**
