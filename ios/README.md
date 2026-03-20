# Gold Silver App - iOS

This is the iOS version of the Gold & Silver trading platform app. It has the same functionality as the Android app but is configured specifically for iOS devices.

## Features

- **Authentication**: Login and Registration with KYC verification
- **Portfolio Management**: Track your gold and silver holdings
- **Real-time Pricing**: Live gold and silver prices updated every 30 seconds
- **Purchase Management**: Buy gold/silver by quantity or amount
- **Payment Tracking**: View and manage payments
- **Delivery Management**: Track deliveries with OTP verification
- **Analytics**: View purchase statistics and analytics
- **Security Center**: Manage passwords, sessions, and activity logs
- **Profile Management**: Update profile, KYC information, and profile photo
- **Admin Panel**: Complete admin dashboard for managing users, purchases, payments, deliveries, and KYC verification

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (via Xcode) or physical iOS device
- Backend server running on port 3001

### Installation

1. Navigate to the iOS folder:
   ```bash
   cd ios
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npm start
   # or
   npm run ios
   ```

4. For iOS Simulator:
   - Press `i` in the terminal to open iOS Simulator
   - Or use `npm run ios` to directly open in simulator

5. For physical iOS device:
   - Install Expo Go app from App Store
   - Scan the QR code shown in terminal
   - Make sure your device and computer are on the same network

### Configuration

#### API Base URL

The app is configured to connect to `http://localhost:3001/api` for iOS simulator. 

For physical iOS device, you need to update the API base URL in `src/api/client.ts`:

```typescript
const API_BASE_URL = __DEV__
  ? Platform.OS === 'ios'
    ? 'http://YOUR_COMPUTER_IP:3001/api' // Change to your PC IP for physical device
    : 'http://localhost:3001/api'
  : 'http://localhost:3001/api'; // Production URL
```

To find your computer's IP address:
- Windows: Run `ipconfig` in Command Prompt and look for IPv4 Address
- Mac/Linux: Run `ifconfig` or `ip addr` and look for your network interface IP

#### Bundle Identifier

The bundle identifier is set to `com.goldapp.ios` in `app.json`. You can change it if needed.

## Project Structure

```
ios/
├── src/
│   ├── api/           # API client and endpoints
│   ├── components/     # Reusable components
│   │   └── admin/     # Admin-specific components
│   ├── screens/        # Screen components
│   ├── store/         # State management (Zustand)
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── App.tsx            # Main app component
├── app.json           # Expo configuration
├── package.json       # Dependencies
└── README.md          # This file
```

## Available Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Start and open in iOS Simulator
- `npm run start:clear` - Start with cleared cache

## Backend Connection

Make sure your backend server is running on port 3001. The app expects the backend API to be available at:
- iOS Simulator: `http://localhost:3001/api`
- Physical Device: `http://YOUR_COMPUTER_IP:3001/api`

## Troubleshooting

### Connection Issues

If you're having trouble connecting to the backend:

1. **iOS Simulator**: Make sure the backend is running and accessible at `localhost:3001`
2. **Physical Device**: 
   - Ensure your device and computer are on the same Wi-Fi network
   - Update the API base URL in `src/api/client.ts` with your computer's IP address
   - Check firewall settings to allow connections on port 3001

### Build Issues

If you encounter build errors:

1. Clear cache: `npm run start:clear`
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Clear Expo cache: `expo start -c`

### Metro Bundler Issues

If Metro bundler has issues:

1. Stop the server (Ctrl+C)
2. Clear watchman: `watchman watch-del-all`
3. Restart: `npm start`

## Notes

- This iOS app uses the same codebase as the Android app but is configured for iOS
- All functionality is identical between Android and iOS versions
- The app uses Expo for cross-platform development
- For production builds, you'll need to configure app signing and build settings in Expo

## Support

For issues or questions, please refer to the main project README or contact the development team.










