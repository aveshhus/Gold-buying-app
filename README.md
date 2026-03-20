# 💎 Gold & Silver Purchase Application

A complete full-stack web application for purchasing gold and silver with admin panel, user dashboard, portfolio management, payment tracking, and OTP-based delivery system.

## ✨ Features

### 👤 User Features
- User registration and login with KYC verification (PAN & Aadhaar)
- Real-time gold and silver prices (24K, 22K)
- Purchase gold and silver with KYC validation
- Portfolio tracking (total gold/silver owned)
- Payment history and tracking
- Delivery system with OTP authentication
- Purchase history and analytics

### 🔐 Admin Features
- Admin dashboard with comprehensive statistics
- View and manage all purchases
- Update purchase and payment status
- View all users with masked KYC information
- Track total revenue and deliveries
- Manage delivery status

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd "API test"
   ```

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   # Create .env file in backend folder
   cd backend
   # Edit .env and add your MongoDB connection string
   MONGODB_URI=mongodb://localhost:27017/gold-silver-app
   JWT_SECRET=your-secret-key-change-in-production
   PORT=3001
   ```

4. **Start MongoDB:**
   - **Local:** Make sure MongoDB service is running
   - **Atlas:** Your connection string is already configured

5. **Migrate existing data (optional):**
   ```bash
   cd backend
   node scripts/migrate-to-mongodb.js
   ```

6. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```

7. **Start the frontend (optional):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

8. **Open your browser:**
   ```
   Frontend: http://localhost:3000
   Backend API: http://localhost:3001
   ```

## 🔑 Default Credentials

### Admin Login
- **Email:** `admin@goldapp.com`
- **Password:** `admin123`

## 📁 Project Structure

```
.
├── backend/             # Backend API Server
│   ├── config/          # Configuration files
│   │   └── database.js   # MongoDB connection
│   ├── models/           # Mongoose models
│   ├── scripts/          # Utility scripts
│   ├── public/           # Legacy HTML/CSS/JS frontend
│   ├── uploads/          # User uploaded files
│   ├── database/         # JSON database files (legacy)
│   ├── server.js         # Express server & API
│   └── package.json
├── frontend/             # Next.js Web Frontend
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── lib/              # Utilities and API client
│   └── package.json
├── ios/                  # React Native iOS App
│   ├── src/              # Source code
│   ├── goldsilverappios/ # iOS native files
│   └── package.json
├── mobile/               # React Native Android App
│   ├── src/              # Source code
│   └── package.json
└── docs/                 # Documentation
```

## 🗄️ Database

The application uses **MongoDB** for data storage.

### Setup MongoDB

**Option 1: MongoDB Atlas (Cloud - Recommended)**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

**Option 2: Local MongoDB**
1. Download from https://www.mongodb.com/try/download/community
2. Install and start MongoDB service
3. Use: `mongodb://localhost:27017/gold-silver-app`

See `docs/MONGODB_SETUP.md` for detailed setup instructions.

## 📡 API Endpoints

### Authentication
- `POST /api/register` - Register new user (requires PAN & Aadhaar)
- `POST /api/login` - Login user/admin
- `GET /api/user` - Get current user info

### Purchases
- `POST /api/purchases` - Create new purchase (requires KYC)
- `GET /api/purchases` - Get user purchases
- `GET /api/admin/purchases` - Get all purchases (admin)
- `PUT /api/admin/purchases/:id` - Update purchase status (admin)

### Payments
- `GET /api/payments` - Get user payments
- `GET /api/admin/payments` - Get all payments (admin)
- `PUT /api/payments/:id` - Update payment status

### Deliveries
- `POST /api/delivery/otp` - Generate OTP for delivery
- `POST /api/delivery/verify` - Verify OTP and complete delivery
- `GET /api/deliveries` - Get user deliveries
- `GET /api/admin/deliveries` - Get all deliveries (admin)

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get dashboard statistics

### Prices
- `GET /api/prices` - Get current gold/silver prices (real-time)

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ KYC verification (PAN & Aadhaar)
- ✅ Masked sensitive data in responses
- ✅ Token expiration (24 hours)
- ✅ User verification in database
- ✅ Input validation

## 🛠️ Development

### Run in Development Mode

**Backend:**
```bash
cd backend
npm run dev
```
(Uses nodemon for auto-reload)

**Frontend:**
```bash
cd frontend
npm run dev
```

**Mobile Apps:**
```bash
# iOS
cd ios
npm install
npm start

# Android
cd mobile
npm install
npm start
```

### Environment Variables
Create a `.env` file in the `backend/` folder with:
```env
MONGODB_URI=mongodb://localhost:27017/gold-silver-app
JWT_SECRET=your-secret-key-change-in-production
PORT=3001
```

## 📚 Documentation

- **Quick Start:** `QUICK_START.md`
- **MongoDB Setup:** `docs/MONGODB_SETUP.md`
- **Detailed MongoDB Guide:** `docs/MONGODB_DETAILED_SETUP.md`
- **Step-by-Step Guide:** `docs/STEP_BY_STEP_GUIDE.md`
- **Design System:** `docs/DESIGN_SYSTEM.md`
- **Project Structure:** `PROJECT_STRUCTURE.md`
- **API Info:** `docs/GOLD_SILVER_API_INFO.md`

## 🎯 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt (Password hashing)

### Frontend
- HTML5/CSS3/JavaScript
- Next.js (optional modern frontend)
- Tailwind CSS
- React (Next.js frontend)

## 🚧 Future Enhancements

- [ ] SMS integration for OTP
- [ ] Email notifications
- [ ] Payment gateway integration
- [ ] Advanced analytics
- [ ] Mobile app support
- [ ] Multi-language support

## 📝 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please check the documentation or create an issue.

---

**Built with ❤️ for gold and silver trading**
