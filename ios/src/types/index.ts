// React Native Types - Reused from frontend/types/index.ts
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  pan?: string;
  aadhaar?: string;
  kycVerified?: boolean;
  createdAt: string;
  profilePhoto?: string;
}

export interface Purchase {
  id: string;
  userId: string;
  type: 'gold' | 'silver';
  purity: '24k' | '22k' | '999';
  quantity: number;
  pricePerGram: number;
  totalAmount: number;
  finalAmount?: number;
  couponCode?: string;
  discountAmount?: number;
  pan?: string;
  aadhaar?: string;
  kycVerified: boolean;
  status: 'pending' | 'paid' | 'delivered' | 'refunded';
  createdAt: string;
  deliveredAt?: string;
}

export interface Payment {
  id: string;
  purchaseId: string;
  userId: string;
  amount: number;
  status: 'pending' | 'completed';
  createdAt: string;
  updatedAt?: string;
}

export interface Delivery {
  id: string;
  purchaseId: string;
  userId: string;
  quantity: number;
  type: 'gold' | 'silver';
  purity: string;
  deliveredAt: string;
}

export interface Prices {
  gold24k: number;
  gold22k: number;
  silver: number;
  lastUpdated: string;
  source?: string;
  note?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalPurchases: number;
  totalRevenue: number;
  pendingPurchases: number;
  deliveredPurchases: number;
  totalGold24k: number;
  totalGold22k: number;
  totalSilver: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'offer' | 'purchase' | 'payment' | 'delivery' | 'kyc' | 'system' | 'general';
  title: string;
  message: string;
  isRead: boolean;
  isOffer: boolean;
  offerDetails?: {
    discount?: number;
    validUntil?: string;
    minPurchase?: number;
    code?: string;
  };
  link?: string;
  createdAt: string;
  readAt?: string;
}










