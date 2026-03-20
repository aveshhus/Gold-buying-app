# Gold & Silver Platform - Modern Frontend

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on **http://localhost:3001**

### Backend Setup

Make sure the Express backend is running on **http://localhost:3000**

```bash
# From project root
npm start
```

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home/login page
│   ├── dashboard/          # User dashboard
│   └── admin/              # Admin panel
├── components/             # React components
│   ├── ui/                 # ShadCN/UI components
│   ├── auth/               # Authentication components
│   ├── dashboard/          # Dashboard components
│   ├── admin/              # Admin components
│   └── kyc/                # KYC components
├── lib/                    # Utilities
│   ├── api.ts              # API client
│   └── utils.ts            # Helper functions
├── store/                  # Zustand stores
│   ├── useAuthStore.ts     # Authentication state
│   └── usePriceStore.ts    # Price state
└── types/                  # TypeScript types
    └── index.ts            # Type definitions
```

## 🎨 Features

- ✅ Modern React/Next.js 14 with TypeScript
- ✅ Tailwind CSS + ShadCN/UI components
- ✅ Framer Motion animations
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Zustand state management
- ✅ Real-time price updates
- ✅ KYC verification
- ✅ Purchase flow
- ✅ Portfolio tracking
- ✅ Payment management
- ✅ Delivery system with OTP

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: ShadCN/UI (Radix UI)
- **Animations**: Framer Motion
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Notifications**: Sonner

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🔧 Configuration

### API URL

Edit `lib/api.ts` to change the backend URL:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
```

### Port

Edit `package.json` to change the port:

```json
"dev": "next dev -p 3001"
```

## 🎯 Key Components

### Authentication
- Login/Register with KYC validation
- JWT token management
- Protected routes

### Dashboard
- Portfolio view with holdings
- Purchase form with live prices
- Payment history
- Delivery management
- Profile view

### Admin Panel
- Statistics dashboard
- Purchase management
- Payment tracking
- Delivery records
- User management

## 🚧 Development Notes

- The frontend proxies API requests to the Express backend
- All API calls are handled through `lib/api.ts`
- State is managed with Zustand stores
- Components follow atomic design principles
- Dark mode is implemented with `next-themes`

## 📚 Documentation

- [Research Report](../docs/RESEARCH_REPORT.md)
- [Design System](../docs/DESIGN_SYSTEM.md)
- [Upgrade Guide](../UPGRADE_GUIDE.md)

## 🐛 Troubleshooting

### Port Already in Use
Change the port in `package.json`:
```json
"dev": "next dev -p 3002"
```

### API Connection Issues
Ensure the backend is running on port 3000 and CORS is enabled.

### TypeScript Errors
Run type checking:
```bash
npm run type-check
```

## 📄 License

ISC
