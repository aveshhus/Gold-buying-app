# API Documentation

This document provides comprehensive information about all APIs used in the Gold App project, including where they are used and why.

## Base URL Configuration

### Frontend (Next.js)
- **Development**: `/api` (proxied to `http://localhost:3001/api`)
- **Production**: Set via `NEXT_PUBLIC_API_URL` environment variable
- **File Location**: `frontend/lib/api.ts`

### Mobile (React Native)
- **Development**: 
  - Android: `http://192.168.31.233:3001/api` (configurable)
  - iOS Simulator: `http://localhost:3001/api`
- **Production**: Set via `PRODUCTION_API_URL` constant
- **File Location**: `mobile/src/api/client.ts`, `ios/src/api/client.ts`

### Backend Server
- **Port**: 3001 (default)
- **Base Path**: `/api`
- **File Location**: `backend/server.js`

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

Tokens are stored in:
- **Frontend**: `localStorage.getItem('token')`
- **Mobile**: `AsyncStorage.getItem('token')`

---

## API Endpoints

### 1. Authentication APIs

#### POST `/api/register`
**Purpose**: Register a new user account  
**Used In**: 
- `frontend/components/auth/login-modal.tsx` - Registration form
- `mobile/src/screens/RegisterScreen.tsx` - Mobile registration
- `ios/src/screens/RegisterScreen.tsx` - iOS registration
- `backend/public/js/auth.js` - Legacy web registration

**Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "pan": "string",
  "aadhaar": "string",
  "password": "string"
}
```

**Response**: `{ userId: string, message: string }`

**Why**: Creates user accounts with KYC information (PAN, Aadhaar) for regulatory compliance in gold/silver trading.

---

#### POST `/api/login`
**Purpose**: Authenticate user and get access token  
**Used In**: 
- `frontend/components/auth/login-modal.tsx` - Login form
- `mobile/src/screens/LoginScreen.tsx` - Mobile login
- `ios/src/screens/LoginScreen.tsx` - iOS login
- `backend/public/js/auth.js` - Legacy web login
- All platforms use this for user authentication

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response**: `{ token: string, user: any }`

**Why**: Secure authentication for accessing user-specific features like purchases, portfolio, and transactions.

---

#### POST `/api/auth/forgot-password`
**Purpose**: Initiate password reset by sending OTP to email  
**Used In**: 
- `frontend/components/auth/login-modal.tsx` - Forgot password flow
- `mobile/src/screens/ForgotPasswordScreen.tsx` - Mobile forgot password
- `ios/src/screens/ForgotPasswordScreen.tsx` - iOS forgot password

**Request Body**:
```json
{
  "email": "string"
}
```

**Response**: `{ message: string, otp?: string }`

**Why**: Allows users to recover their accounts by resetting passwords securely via OTP verification.

---

#### POST `/api/auth/recover-password`
**Purpose**: Alternative password recovery endpoint  
**Used In**: 
- `mobile/src/api/client.ts` - Mobile API client
- `ios/src/api/client.ts` - iOS API client

**Request Body**:
```json
{
  "email": "string"
}
```

**Response**: `{ message: string, password?: string }`

**Why**: Provides password recovery functionality for mobile platforms.

---

#### POST `/api/auth/reset-password`
**Purpose**: Reset password using OTP  
**Used In**: 
- `frontend/components/auth/login-modal.tsx` - Reset password form
- `mobile/src/screens/ResetPasswordScreen.tsx` - Mobile reset password
- `ios/src/screens/ResetPasswordScreen.tsx` - iOS reset password

**Request Body**:
```json
{
  "email": "string",
  "otp": "string",
  "newPassword": "string"
}
```

**Response**: `{ message: string }`

**Why**: Completes the password reset process after OTP verification.

---

### 2. User Profile APIs

#### GET `/api/user`
**Purpose**: Get current authenticated user's profile information  
**Used In**: 
- `frontend/components/dashboard/dashboard-layout.tsx` - Load user info for dashboard
- `frontend/components/dashboard/profile-view.tsx` - Display profile
- `frontend/components/admin/admin-layout.tsx` - Admin user info
- `mobile/src/components/ProfileView.tsx` - Mobile profile
- `mobile/src/components/PurchaseView.tsx` - Check user KYC status
- `ios/src/components/ProfileView.tsx` - iOS profile
- `ios/src/components/PurchaseView.tsx` - Check user KYC status
- `mobile/App.tsx` - Check authentication state
- `ios/App.tsx` - Check authentication state
- `backend/public/js/dashboard.js` - Legacy web dashboard

**Response**: User object with profile, KYC status, purchases, etc.

**Why**: Fetches user profile data including KYC verification status, which is required for making purchases.

---

#### POST `/api/user/profile-photo`
**Purpose**: Upload user profile photo  
**Used In**: 
- `frontend/components/dashboard/profile-view.tsx` - Upload profile picture
- `mobile/src/components/ProfileView.tsx` - Mobile profile photo upload
- `ios/src/components/ProfileView.tsx` - iOS profile photo upload

**Request**: FormData with `photo` file

**Response**: `{ message: string, user: any }`

**Why**: Allows users to personalize their profile with a profile picture.

---

#### DELETE `/api/user/profile-photo`
**Purpose**: Delete user's profile photo  
**Used In**: 
- `frontend/components/dashboard/profile-view.tsx` - Remove profile picture

**Response**: `{ message: string }`

**Why**: Allows users to remove their profile photo.

---

#### PUT `/api/user/kyc`
**Purpose**: Update user KYC information (PAN and Aadhaar)  
**Used In**: 
- `frontend/components/dashboard/profile-view.tsx` - Update KYC details
- `backend/public/js/dashboard.js` - Legacy web KYC update

**Request Body**:
```json
{
  "pan": "string",
  "aadhaar": "string"
}
```

**Response**: `{ message: string, user: any }`

**Why**: Required for compliance with Indian regulations for gold/silver trading. KYC verification is mandatory before purchases.

---

#### POST `/api/user/request-kyc-verification`
**Purpose**: Request admin to verify KYC documents  
**Used In**: 
- `mobile/src/components/PurchaseView.tsx` - Request KYC verification
- `ios/src/components/PurchaseView.tsx` - Request KYC verification

**Response**: `{ message: string, success: boolean }`

**Why**: Users can request admin verification after uploading KYC documents. Only verified users can make purchases.

---

#### PUT `/api/user/password`
**Purpose**: Change user password  
**Used In**: 
- `frontend/components/security/security-center.tsx` - Change password
- `mobile/src/components/SecurityView.tsx` - Mobile change password
- `ios/src/components/SecurityView.tsx` - iOS change password

**Request Body**:
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response**: `{ message: string }`

**Why**: Allows users to change their password for security purposes.

---

### 3. Prices APIs

#### GET `/api/prices`
**Purpose**: Get current gold and silver prices  
**Used In**: 
- `frontend/components/landing/landing-page.tsx` - Display prices on landing page
- `frontend/components/dashboard/dashboard-layout.tsx` - Show prices in dashboard
- `frontend/components/dashboard/purchase-view.tsx` - Calculate purchase amounts
- `frontend/components/admin/admin-layout.tsx` - Admin dashboard prices
- `mobile/src/screens/DashboardScreen.tsx` - Mobile dashboard prices
- `mobile/src/components/PurchaseView.tsx` - Calculate purchase amounts
- `mobile/src/components/PortfolioView.tsx` - Calculate portfolio value
- `mobile/src/screens/AdminScreen.tsx` - Admin prices
- `mobile/src/screens/LandingScreen.tsx` - Landing page prices
- `ios/src/screens/DashboardScreen.tsx` - iOS dashboard prices
- `ios/src/components/PurchaseView.tsx` - Calculate purchase amounts
- `ios/src/components/PortfolioView.tsx` - Calculate portfolio value
- `ios/src/screens/AdminScreen.tsx` - Admin prices
- `ios/src/components/admin/AdminDashboard.tsx` - Admin dashboard

**Response**:
```json
{
  "gold24k": number,
  "gold22k": number,
  "silver": number,
  "lastUpdated": string
}
```

**Why**: Critical for the app - provides real-time prices for gold (24K, 22K) and silver. Used for purchase calculations, portfolio valuation, and displaying current market rates. Prices are fetched every 30 seconds in most components.

---

### 4. Purchases APIs

#### POST `/api/purchases`
**Purpose**: Create a new gold/silver purchase order  
**Used In**: 
- `frontend/components/dashboard/purchase-view.tsx` - Submit purchase order
- `mobile/src/components/PurchaseView.tsx` - Mobile purchase submission
- `ios/src/components/PurchaseView.tsx` - iOS purchase submission
- `backend/public/js/dashboard.js` - Legacy web purchase

**Request Body**:
```json
{
  "type": "gold" | "silver",
  "purity": "24k" | "22k" | "999",
  "quantity": number,
  "pricePerGram": number,
  "totalAmount": number,
  "pan": "string" (optional),
  "aadhaar": "string" (optional),
  "couponCode": "string" (optional)
}
```

**Response**: Purchase object with ID, status, etc.

**Why**: Core functionality - allows users to purchase gold or silver. Validates KYC, applies coupons if provided, calculates amounts, and creates purchase records.

---

#### GET `/api/purchases`
**Purpose**: Get all purchases for the authenticated user  
**Used In**: 
- `frontend/components/dashboard/portfolio-view.tsx` - Display user's portfolio
- `frontend/components/dashboard/analytics-view.tsx` - Purchase analytics
- `frontend/components/dashboard/deliveries-view.tsx` - Match purchases with deliveries
- `frontend/components/transactions/transaction-ledger.tsx` - Transaction history
- `mobile/src/components/PortfolioView.tsx` - Mobile portfolio
- `mobile/src/components/AnalyticsView.tsx` - Mobile analytics
- `mobile/src/components/DeliveriesView.tsx` - Mobile deliveries
- `ios/src/components/PortfolioView.tsx` - iOS portfolio
- `ios/src/components/AnalyticsView.tsx` - iOS analytics
- `ios/src/components/DeliveriesView.tsx` - iOS deliveries

**Response**: Array of purchase objects

**Why**: Displays user's purchase history, portfolio holdings, and transaction records. Essential for portfolio tracking and delivery management.

---

### 5. Payments APIs

#### GET `/api/payments`
**Purpose**: Get all payments for the authenticated user  
**Used In**: 
- `frontend/components/dashboard/payments-view.tsx` - Display payment history
- `frontend/components/transactions/transaction-ledger.tsx` - Transaction records
- `mobile/src/components/PaymentsView.tsx` - Mobile payments
- `ios/src/components/PaymentsView.tsx` - iOS payments

**Response**: Array of payment objects

**Why**: Shows payment history including status, amounts, purchase associations, and payment methods.

---

#### PUT `/api/payments/:id`
**Purpose**: Update payment status  
**Used In**: 
- `frontend/components/dashboard/payments-view.tsx` - Mark payment as paid
- `backend/public/js/dashboard.js` - Legacy web payment update

**Request Body**:
```json
{
  "status": "pending" | "paid" | "failed"
}
```

**Response**: Updated payment object

**Why**: Allows users to update payment status (e.g., mark as paid after UPI/bank transfer).

---

### 6. Deliveries APIs

#### GET `/api/deliveries`
**Purpose**: Get all deliveries for the authenticated user  
**Used In**: 
- `frontend/components/dashboard/deliveries-view.tsx` - Display delivery list
- `mobile/src/components/DeliveriesView.tsx` - Mobile deliveries
- `ios/src/components/DeliveriesView.tsx` - iOS deliveries

**Response**: Array of delivery objects

**Why**: Shows delivery history and status for physical gold/silver pickups. Includes OTP verification details.

---

#### POST `/api/delivery/otp`
**Purpose**: Generate OTP for delivery verification  
**Used In**: 
- `frontend/components/dashboard/deliveries-view.tsx` - Generate OTP for pickup
- `backend/public/js/dashboard.js` - Legacy web OTP generation

**Request Body**:
```json
{
  "purchaseId": "string"
}
```

**Response**: `{ otp: string, message: string }`

**Why**: Security measure - generates OTP that must be verified when user picks up physical gold/silver from the store.

---

#### POST `/api/delivery/verify`
**Purpose**: Verify OTP and complete delivery  
**Used In**: 
- `frontend/components/dashboard/deliveries-view.tsx` - Verify OTP and complete delivery
- `backend/public/js/dashboard.js` - Legacy web OTP verification

**Request Body**:
```json
{
  "purchaseId": "string",
  "otp": "string"
}
```

**Response**: Updated delivery object

**Why**: Completes the delivery process after OTP verification, marking the purchase as delivered.

---

### 7. Admin APIs

#### GET `/api/admin/stats`
**Purpose**: Get admin dashboard statistics  
**Used In**: 
- `frontend/components/admin/admin-dashboard.tsx` - Admin dashboard stats
- `mobile/src/components/admin/AdminDashboard.tsx` - Mobile admin dashboard
- `ios/src/components/admin/AdminDashboard.tsx` - iOS admin dashboard
- `backend/public/js/admin.js` - Legacy web admin dashboard

**Response**: Statistics object with totals, counts, revenue, etc.

**Why**: Provides overview metrics for admin users including total purchases, users, revenue, and other key indicators.

---

#### GET `/api/admin/purchases`
**Purpose**: Get all purchases across all users (admin only)  
**Used In**: 
- `frontend/components/admin/admin-purchases.tsx` - Admin purchase management
- `mobile/src/components/admin/AdminPurchases.tsx` - Mobile admin purchases
- `ios/src/components/admin/AdminPurchases.tsx` - iOS admin purchases
- `backend/public/js/admin.js` - Legacy web admin purchases

**Response**: Array of all purchase objects

**Why**: Allows admins to view and manage all purchases in the system, including status updates.

---

#### PUT `/api/admin/purchases/:id`
**Purpose**: Update purchase status (admin only)  
**Used In**: 
- `frontend/components/admin/admin-purchases.tsx` - Update purchase status
- `mobile/src/components/admin/AdminPurchases.tsx` - Mobile purchase status update
- `ios/src/components/admin/AdminPurchases.tsx` - iOS purchase status update
- `backend/public/js/admin.js` - Legacy web purchase update

**Request Body**:
```json
{
  "status": "pending" | "paid" | "delivered" | "cancelled"
}
```

**Response**: Updated purchase object

**Why**: Admins can update purchase status (e.g., mark as paid, delivered, or cancelled) to manage order lifecycle.

---

#### GET `/api/admin/payments`
**Purpose**: Get all payments across all users (admin only)  
**Used In**: 
- `frontend/components/admin/admin-payments.tsx` - Admin payment management
- `mobile/src/components/admin/AdminPayments.tsx` - Mobile admin payments
- `ios/src/components/admin/AdminPayments.tsx` - iOS admin payments
- `backend/public/js/admin.js` - Legacy web admin payments

**Response**: Array of all payment objects

**Why**: Admins can view all payments to track revenue, payment status, and resolve payment issues.

---

#### GET `/api/admin/deliveries`
**Purpose**: Get all deliveries across all users (admin only)  
**Used In**: 
- `frontend/components/admin/admin-deliveries.tsx` - Admin delivery management
- `mobile/src/components/admin/AdminDeliveries.tsx` - Mobile admin deliveries
- `ios/src/components/admin/AdminDeliveries.tsx` - iOS admin deliveries

**Response**: Array of all delivery objects

**Why**: Admins can view all delivery requests and manage physical gold/silver pickups.

---

#### GET `/api/admin/users`
**Purpose**: Get all users (admin only)  
**Used In**: 
- `frontend/components/admin/admin-users.tsx` - Admin user management
- `mobile/src/components/admin/AdminUsers.tsx` - Mobile admin users
- `ios/src/components/admin/AdminUsers.tsx` - iOS admin users
- `backend/public/js/admin.js` - Legacy web admin users

**Response**: Array of all user objects

**Why**: Allows admins to view all registered users, their KYC status, purchase history, and manage user accounts.

---

#### DELETE `/api/admin/users/:id`
**Purpose**: Delete a user account (admin only)  
**Used In**: 
- `frontend/components/admin/admin-users.tsx` - Delete user
- `mobile/src/components/admin/AdminUsers.tsx` - Mobile delete user
- `ios/src/components/admin/AdminUsers.tsx` - iOS delete user

**Response**: `{ message: string, deletedData: any }`

**Why**: Allows admins to remove user accounts (e.g., for compliance, abuse, or account closure).

---

#### GET `/api/admin/kyc-queue`
**Purpose**: Get list of users pending KYC verification (admin only)  
**Used In**: 
- `frontend/components/admin/admin-kyc-verification.tsx` - KYC verification queue
- `mobile/src/components/admin/AdminKYC.tsx` - Mobile KYC queue
- `ios/src/components/admin/AdminKYC.tsx` - iOS KYC queue
- `backend/public/js/admin.js` - Legacy web KYC queue

**Response**: Array of users with pending KYC

**Why**: Shows admin which users need KYC verification before they can make purchases.

---

#### GET `/api/admin/kyc-stats`
**Purpose**: Get KYC statistics (admin only)  
**Used In**: 
- `frontend/components/admin/admin-kyc-verification.tsx` - KYC dashboard stats

**Response**:
```json
{
  "pendingVerification": number,
  "verificationRequired": number,
  "actionRequired": number,
  "totalWithKYC": number,
  "incompleteKYC": number,
  "verifiedKYC": number
}
```

**Why**: Provides overview of KYC status across all users for admin dashboard.

---

#### PUT `/api/admin/users/:id/verify-kyc`
**Purpose**: Verify or reject user KYC (admin only)  
**Used In**: 
- `frontend/components/admin/admin-kyc-verification.tsx` - Approve/reject KYC
- `backend/public/js/admin.js` - Legacy web KYC verification

**Request Body**:
```json
{
  "verified": boolean
}
```

**Response**: Updated user object

**Why**: Admins can verify user KYC documents, allowing users to make purchases. Critical for compliance.

---

### 8. Coupons APIs

#### GET `/api/coupons`
**Purpose**: Get available coupons for the authenticated user  
**Used In**: 
- `frontend/components/dashboard/purchase-view.tsx` - Display available coupons
- `mobile/src/components/PurchaseView.tsx` - Mobile coupon selection
- `ios/src/components/PurchaseView.tsx` - iOS coupon selection

**Response**: Array of available coupon objects

**Why**: Shows coupons that user can apply during purchase, including public coupons and user-specific assigned coupons. Filters out already-used coupons.

---

#### GET `/api/admin/coupons`
**Purpose**: Get all coupons (admin only)  
**Used In**: 
- `frontend/components/admin/admin-coupons.tsx` - Admin coupon management
- `frontend/components/admin/admin-users.tsx` - Get coupons for assignment
- `mobile/src/components/admin/AdminCoupons.tsx` - Mobile admin coupons
- `mobile/src/components/admin/AdminUsers.tsx` - Mobile coupon assignment
- `ios/src/components/admin/AdminCoupons.tsx` - iOS admin coupons
- `ios/src/components/admin/AdminUsers.tsx` - iOS coupon assignment

**Response**: Array of all coupon objects

**Why**: Allows admins to view, create, edit, and manage all coupons in the system.

---

#### POST `/api/admin/coupons`
**Purpose**: Create a new coupon (admin only)  
**Used In**: 
- `frontend/components/admin/admin-coupons.tsx` - Create coupon form
- `mobile/src/components/admin/AdminCoupons.tsx` - Mobile create coupon
- `ios/src/components/admin/AdminCoupons.tsx` - iOS create coupon

**Request Body**:
```json
{
  "code": "string",
  "description": "string",
  "discountType": "percentage" | "fixed",
  "discountValue": number,
  "applicableType": "gold" | "silver" | "both",
  "maxUses": number (optional),
  "expiryDate": "string" (optional)
}
```

**Response**: `{ message: string, coupon: object }`

**Why**: Admins can create discount coupons to promote sales. Coupons can be percentage or fixed discounts, applicable to gold, silver, or both.

---

#### POST `/api/admin/coupons/:id/assign`
**Purpose**: Assign coupon to specific users (admin only)  
**Used In**: 
- `frontend/components/admin/admin-coupons.tsx` - Assign coupon to users
- `frontend/components/admin/admin-users.tsx` - Assign coupon from user management
- `mobile/src/components/admin/AdminCoupons.tsx` - Mobile coupon assignment
- `mobile/src/components/admin/AdminUsers.tsx` - Mobile assign from user screen
- `ios/src/components/admin/AdminCoupons.tsx` - iOS coupon assignment
- `ios/src/components/admin/AdminUsers.tsx` - iOS assign from user screen

**Request Body**:
```json
{
  "userIds": ["string"]
}
```

**Response**: `{ message: string, coupon: object }`

**Why**: Allows admins to assign coupons to specific users, sending them notifications. Enables targeted marketing.

---

#### DELETE `/api/admin/coupons/:id`
**Purpose**: Deactivate a coupon (admin only)  
**Used In**: 
- `frontend/components/admin/admin-coupons.tsx` - Deactivate coupon
- `mobile/src/components/admin/AdminCoupons.tsx` - Mobile delete coupon
- `ios/src/components/admin/AdminCoupons.tsx` - iOS delete coupon

**Response**: `{ message: string }`

**Why**: Admins can deactivate coupons (sets isActive to false) to stop them from being used without deleting historical data.

---

### 9. Refunds APIs

#### GET `/api/refunds/calculate/:purchaseId`
**Purpose**: Calculate refund amount for a purchase  
**Used In**: 
- `frontend/components/dashboard/refund-requests-view.tsx` - Calculate refund before request
- `mobile/src/components/RefundRequestsView.tsx` - Mobile refund calculation
- `ios/src/components/RefundRequestsView.tsx` - iOS refund calculation

**Response**: Refund calculation object with eligible amount, fees, etc.

**Why**: Shows users how much refund they would receive before submitting a refund request. Includes refund policy rules (e.g., within 24 hours, deduction policies).

---

#### POST `/api/refunds/request`
**Purpose**: Submit a refund request  
**Used In**: 
- `frontend/components/dashboard/refund-requests-view.tsx` - Submit refund request
- `mobile/src/components/RefundRequestsView.tsx` - Mobile refund request
- `ios/src/components/RefundRequestsView.tsx` - iOS refund request

**Request Body**:
```json
{
  "purchaseId": "string",
  "supportChannel": "string",
  "supportReference": "string" (optional)
}
```

**Response**: Refund request object

**Why**: Allows users to request refunds for purchases. Includes support channel and reference for customer service tracking.

---

#### GET `/api/refunds`
**Purpose**: Get all refund requests for the authenticated user  
**Used In**: 
- `frontend/components/dashboard/refund-requests-view.tsx` - Display user refunds
- `mobile/src/components/RefundRequestsView.tsx` - Mobile refund list
- `ios/src/components/RefundRequestsView.tsx` - iOS refund list

**Response**: Array of refund request objects

**Why**: Shows user's refund request history with status (pending, approved, rejected, processed).

---

#### GET `/api/refunds/:id`
**Purpose**: Get details of a specific refund request  
**Used In**: 
- `frontend/components/dashboard/refund-requests-view.tsx` - View refund details
- `mobile/src/components/RefundRequestsView.tsx` - Mobile refund details
- `ios/src/components/RefundRequestsView.tsx` - iOS refund details

**Response**: Refund request object with full details

**Why**: Shows detailed information about a specific refund request including status, amounts, admin notes, etc.

---

#### GET `/api/admin/refunds`
**Purpose**: Get all refund requests across all users (admin only)  
**Used In**: 
- `frontend/components/admin/admin-refunds.tsx` - Admin refund management
- `mobile/src/components/admin/AdminRefunds.tsx` - Mobile admin refunds
- `ios/src/components/admin/AdminRefunds.tsx` - iOS admin refunds

**Response**: Array of all refund request objects

**Why**: Allows admins to view and manage all refund requests, approve/reject/process them.

---

#### POST `/api/admin/refunds/:id/approve`
**Purpose**: Approve a refund request (admin only)  
**Used In**: 
- `frontend/components/admin/admin-refunds.tsx` - Approve refund
- `mobile/src/components/admin/AdminRefunds.tsx` - Mobile approve refund
- `ios/src/components/admin/AdminRefunds.tsx` - iOS approve refund

**Request Body**:
```json
{
  "adminNotes": "string" (optional)
}
```

**Response**: Updated refund request object

**Why**: Admins can approve refund requests after verification. Updates refund status and allows processing.

---

#### POST `/api/admin/refunds/:id/reject`
**Purpose**: Reject a refund request (admin only)  
**Used In**: 
- `frontend/components/admin/admin-refunds.tsx` - Reject refund
- `mobile/src/components/admin/AdminRefunds.tsx` - Mobile reject refund
- `ios/src/components/admin/AdminRefunds.tsx` - iOS reject refund

**Request Body**:
```json
{
  "adminNotes": "string" (optional)
}
```

**Response**: Updated refund request object

**Why**: Admins can reject refund requests that don't meet refund policy criteria, with notes explaining the reason.

---

#### POST `/api/admin/refunds/:id/process`
**Purpose**: Process an approved refund (admin only)  
**Used In**: 
- `frontend/components/admin/admin-refunds.tsx` - Process refund
- `mobile/src/components/admin/AdminRefunds.tsx` - Mobile process refund
- `ios/src/components/admin/AdminRefunds.tsx` - iOS process refund

**Request Body**:
```json
{
  "refundTransactionId": "string" (optional),
  "adminNotes": "string" (optional)
}
```

**Response**: Updated refund request object

**Why**: Marks refund as processed after the actual refund transaction is completed (e.g., bank transfer, payment gateway refund).

---

### 10. Notifications APIs

#### GET `/api/notifications`
**Purpose**: Get notifications for the authenticated user  
**Used In**: 
- `frontend/components/dashboard/notifications-view.tsx` - Display notifications
- `mobile/src/components/NotificationsView.tsx` - Mobile notifications
- `ios/src/components/NotificationsView.tsx` - iOS notifications

**Response**: `{ notifications: array, unreadCount: number }`

**Why**: Shows user notifications including offers, purchase updates, KYC status, and system messages. Includes unread count for badges.

---

#### PUT `/api/notifications/:id/read`
**Purpose**: Mark a notification as read  
**Used In**: 
- `frontend/components/dashboard/notifications-view.tsx` - Mark notification read
- `mobile/src/components/NotificationsView.tsx` - Mobile mark read
- `ios/src/components/NotificationsView.tsx` - iOS mark read

**Response**: Updated notification object

**Why**: Marks individual notifications as read to update unread count.

---

#### PUT `/api/notifications/read-all`
**Purpose**: Mark all notifications as read  
**Used In**: 
- `frontend/components/dashboard/notifications-view.tsx` - Mark all read
- `mobile/src/components/NotificationsView.tsx` - Mobile mark all read
- `ios/src/components/NotificationsView.tsx` - iOS mark all read

**Response**: `{ message: string }`

**Why**: Convenience feature to mark all notifications as read at once.

---

#### DELETE `/api/notifications/:id`
**Purpose**: Delete a notification  
**Used In**: 
- `frontend/components/dashboard/notifications-view.tsx` - Delete notification
- `mobile/src/components/NotificationsView.tsx` - Mobile delete notification
- `ios/src/components/NotificationsView.tsx` - iOS delete notification

**Response**: `{ message: string }`

**Why**: Allows users to remove notifications they no longer need.

---

#### GET `/api/notifications/unread-count`
**Purpose**: Get count of unread notifications  
**Used In**: 
- `frontend/components/dashboard/dashboard-layout.tsx` - Show unread badge
- `mobile/src/screens/DashboardScreen.tsx` - Mobile unread badge
- `ios/src/screens/DashboardScreen.tsx` - iOS unread badge

**Response**: `{ count: number }`

**Why**: Provides unread count for notification badges in navigation/header without loading all notifications.

---

#### POST `/api/admin/notifications`
**Purpose**: Create a notification (admin only)  
**Used In**: 
- `frontend/components/admin/admin-notifications.tsx` - Create notification
- `mobile/src/components/admin/AdminNotifications.tsx` - Mobile create notification
- `ios/src/components/admin/AdminNotifications.tsx` - iOS create notification

**Request Body**:
```json
{
  "userId": "string" (optional),
  "type": "string" (optional),
  "title": "string",
  "message": "string",
  "isOffer": boolean (optional),
  "offerDetails": object (optional),
  "link": "string" (optional)
}
```

**Response**: Created notification object

**Why**: Admins can send notifications to specific users or all users. Useful for announcements, offers, and important updates.

---

#### GET `/api/admin/notifications`
**Purpose**: Get all notifications (admin only)  
**Used In**: 
- `frontend/components/admin/admin-notifications.tsx` - Admin notification management
- `mobile/src/components/admin/AdminNotifications.tsx` - Mobile admin notifications
- `ios/src/components/admin/AdminNotifications.tsx` - iOS admin notifications

**Query Parameters**: `userId`, `type`, `isOffer`, `limit`

**Response**: `{ notifications: array }`

**Why**: Allows admins to view all notifications sent to users, filter by user/type, and manage notification history.

---

#### DELETE `/api/admin/notifications/:id`
**Purpose**: Delete a notification (admin only)  
**Used In**: 
- `frontend/components/admin/admin-notifications.tsx` - Delete notification
- `mobile/src/components/admin/AdminNotifications.tsx` - Mobile delete notification
- `ios/src/components/admin/AdminNotifications.tsx` - iOS delete notification

**Response**: `{ message: string }`

**Why**: Admins can remove notifications from the system.

---

### 11. Security & Activity APIs

#### GET `/api/user/activity`
**Purpose**: Get user activity log  
**Used In**: 
- `frontend/components/security/security-center.tsx` - Display activity log
- `mobile/src/components/SecurityView.tsx` - Mobile activity log
- `ios/src/components/SecurityView.tsx` - iOS activity log

**Query Parameters**: `limit` (optional)

**Response**: Array of activity objects

**Why**: Shows user's account activity history including logins, purchases, profile changes, etc. for security monitoring.

---

#### GET `/api/user/sessions`
**Purpose**: Get active user sessions  
**Used In**: 
- `frontend/components/security/security-center.tsx` - Display active sessions
- `mobile/src/components/SecurityView.tsx` - Mobile active sessions
- `ios/src/components/SecurityView.tsx` - iOS active sessions

**Response**: Array of session objects

**Why**: Shows all active login sessions across devices/platforms. Users can see where they're logged in.

---

#### DELETE `/api/user/sessions/:sessionId`
**Purpose**: End a specific session (logout from device)  
**Used In**: 
- `frontend/components/security/security-center.tsx` - End session
- `mobile/src/components/SecurityView.tsx` - Mobile end session
- `ios/src/components/SecurityView.tsx` - iOS end session

**Response**: `{ message: string }`

**Why**: Allows users to log out from specific devices/sessions for security (e.g., if device is lost or compromised).

---

#### GET `/api/user/security-summary`
**Purpose**: Get security summary including sessions, activity, password changes  
**Used In**: 
- `frontend/components/security/security-center.tsx` - Display security overview

**Response**:
```json
{
  "activeSessions": number,
  "sessions": array,
  "recentActivities": array,
  "passwordChangeCount": number,
  "lastPasswordChange": string | null
}
```

**Why**: Provides comprehensive security overview for the security center dashboard.

---

### 12. Static Pages APIs

#### GET `/api/pages/:pageId`
**Purpose**: Get content for static/informational pages  
**Used In**: 
- `frontend/app/about-us/page.tsx` - About Us page
- `frontend/app/contact-us/page.tsx` - Contact Us page
- `frontend/app/terms/page.tsx` - Terms & Conditions page
- `frontend/app/refund-policy/page.tsx` - Refund Policy page
- `frontend/app/charge-back/page.tsx` - Chargeback Policy page
- `frontend/app/address/page.tsx` - Registered Address page
- `mobile/src/screens/AboutUsScreen.tsx` - Mobile About Us
- `mobile/src/screens/ContactUsScreen.tsx` - Mobile Contact Us
- `mobile/src/screens/TermsScreen.tsx` - Mobile Terms
- `mobile/src/screens/RefundPolicyScreen.tsx` - Mobile Refund Policy
- `mobile/src/screens/ChargeBackScreen.tsx` - Mobile Chargeback Policy
- `mobile/src/screens/AddressScreen.tsx` - Mobile Address
- `mobile/src/screens/DeliveryPolicyScreen.tsx` - Mobile Delivery Policy
- `ios/src/screens/AboutUsScreen.tsx` - iOS About Us
- `ios/src/screens/ContactUsScreen.tsx` - iOS Contact Us
- `ios/src/screens/TermsScreen.tsx` - iOS Terms
- `ios/src/screens/RefundPolicyScreen.tsx` - iOS Refund Policy
- `ios/src/screens/ChargeBackScreen.tsx` - iOS Chargeback Policy
- `ios/src/screens/AddressScreen.tsx` - iOS Address
- `ios/src/screens/DeliveryPolicyScreen.tsx` - iOS Delivery Policy

**Query Parameters**: `pageId` (in URL path)

**Supported pageIds**: `about-us`, `contact-us`, `terms`, `refund-policy`, `chargeback-policy`, `delivery-policy`, `address`

**Response**:
```json
{
  "title": "string",
  "content": object
}
```

**Why**: Centralized content management for static pages. Allows updating page content across all platforms (web, mobile, iOS) from one place without code changes.

---

### 13. Health & Debug APIs

#### GET `/api/health`
**Purpose**: Check if backend server is running  
**Used In**: Backend health checks, monitoring

**Response**: `{ status: "ok" }`

**Why**: Simple health check endpoint for monitoring and debugging server availability.

---

#### GET `/api/debug/routes`
**Purpose**: Debug endpoint to list all available routes  
**Used In**: Backend debugging

**Response**: Array of route definitions

**Why**: Helps developers see all available API endpoints for debugging and documentation.

---

## API Client Implementation

### Frontend API Client (`frontend/lib/api.ts`)
- Uses `fetch` API
- Stores token in `localStorage`
- Handles JSON responses
- Includes error handling and logging
- Supports file uploads via FormData

### Mobile API Client (`mobile/src/api/client.ts`, `ios/src/api/client.ts`)
- Uses `fetch` API (React Native compatible)
- Stores token in `AsyncStorage`
- Platform-specific URL configuration
- Handles JSON responses
- Includes error handling

### Common Features
- Automatic token injection in Authorization header
- JSON request/response handling
- Error response parsing
- Request/response logging
- TypeScript type definitions for request/response types

---

## Error Handling

All API methods return an object with this structure:
```typescript
{
  data?: T,           // Success response data
  error?: string,     // Error message
  message?: string,   // Additional message
  validationError?: string,  // Validation error details
  missingFields?: string[],  // Missing required fields
  details?: any       // Additional error details
}
```

Components should check for `response.error` before using `response.data`.

---

## Authentication Flow

1. User registers/login → receives JWT token
2. Token stored in localStorage (web) or AsyncStorage (mobile)
3. Token automatically included in `Authorization: Bearer <token>` header for all authenticated requests
4. Backend validates token via `authenticateToken` middleware
5. If token invalid/expired, returns 401 Unauthorized
6. Frontend redirects to login on 401 errors

---

## Rate Limiting & Performance

- Prices API is called every 30 seconds in most components to keep prices current
- Caching strategies should be implemented for prices to reduce server load
- Consider implementing request throttling for high-frequency endpoints

---

## Notes

- All timestamps are in ISO 8601 format
- Currency amounts are in Indian Rupees (₹)
- Weight measurements are in grams
- All IDs are string UUIDs
- Date fields accept ISO 8601 strings
- File uploads use multipart/form-data
- All other requests use application/json

---

## Environment Variables

Required backend environment variables:
- `PORT` - Server port (default: 3001)
- `JWT_SECRET` - Secret key for JWT tokens
- `MONGODB_URI` - MongoDB connection string (if using MongoDB)
- Email configuration for OTP/password reset

Frontend environment variables:
- `NEXT_PUBLIC_API_URL` - API base URL (optional, defaults to `/api`)

---

## Additional Resources

- Backend server file: `backend/server.js`
- Frontend API client: `frontend/lib/api.ts`
- Mobile API client: `mobile/src/api/client.ts`
- iOS API client: `ios/src/api/client.ts`

