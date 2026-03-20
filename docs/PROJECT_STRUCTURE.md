# 📁 Project Structure

```
Goldapp 2/
├── 📄 README.md                    # Main project documentation
├── 📄 .gitignore                   # Git ignore file
│
├── 📁 backend/                     # Backend API Server
│   ├── 📁 config/                  # Configuration files
│   │   └── database.js             # MongoDB connection
│   ├── 📁 models/                  # Mongoose models
│   │   ├── User.js
│   │   ├── Purchase.js
│   │   ├── Payment.js
│   │   ├── Delivery.js
│   │   └── ...
│   ├── 📁 scripts/                 # Utility scripts
│   │   └── migrate-to-mongodb.js
│   ├── 📁 public/                  # Legacy HTML/CSS/JS frontend
│   │   ├── index.html
│   │   ├── dashboard.html
│   │   ├── admin.html
│   │   ├── css/
│   │   └── js/
│   ├── 📁 database/                # JSON database files (legacy)
│   ├── 📁 uploads/                 # User uploaded files
│   ├── 📄 server.js                # Express server & API
│   ├── 📄 package.json
│   └── 📄 package-lock.json
│
├── 📁 frontend/                    # Next.js Web Frontend
│   ├── 📁 app/                     # Next.js app directory
│   ├── 📁 components/              # React components
│   ├── 📁 lib/                     # Utilities and API client
│   ├── 📁 store/                   # State management
│   ├── 📁 types/                   # TypeScript types
│   ├── 📁 public/                  # Static assets
│   ├── 📄 package.json
│   └── 📄 package-lock.json
│
├── 📁 ios/                         # React Native iOS App
│   ├── 📁 src/                     # Source code
│   │   ├── api/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── store/
│   │   └── utils/
│   ├── 📁 goldsilverappios/        # iOS native files
│   ├── 📄 App.tsx
│   ├── 📄 package.json
│   └── 📄 package-lock.json
│
├── 📁 mobile/                      # React Native Android App
│   ├── 📁 src/                     # Source code
│   │   ├── api/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── store/
│   │   └── utils/
│   ├── 📁 assets/                  # App assets
│   ├── 📄 App.tsx
│   ├── 📄 package.json
│   └── 📄 package-lock.json
│
└── 📁 docs/                        # Documentation
    ├── MONGODB_SETUP.md
    ├── DESIGN_SYSTEM.md
    ├── PROJECT_STRUCTURE.md
    └── ...
```

