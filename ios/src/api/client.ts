// React Native API Client - Converted from frontend/lib/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// For iOS simulator, use localhost
// For physical iOS device, use your computer's IP address (e.g., http://192.168.1.100:3001/api)
// Change this to match your setup
const API_BASE_URL = __DEV__
  ? Platform.OS === 'ios'
    ? 'http://localhost:3001/api' // iOS simulator - change to your PC IP for physical device
    : 'http://localhost:3001/api'
  : 'http://localhost:3001/api'; // Production - update with your production URL

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  validationError?: string;
  missingFields?: string[];
  details?: any;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = await AsyncStorage.getItem('token');

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const url = `${this.baseURL}${endpoint}`;
    console.log(`API Request: ${options.method || 'GET'} ${url}`);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log(`API Response: ${response.status} ${response.statusText}`);

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          return {
            error: `Server returned ${response.status}: ${response.statusText}. Expected JSON but received ${contentType || 'unknown format'}.`,
          };
        }
      }

      if (!response.ok) {
        // Return comprehensive error information including validationError
        return {
          error: data.error || `Server error: ${response.status} ${response.statusText}`,
          message: data.message,
          validationError: data.validationError,
          missingFields: data.missingFields,
          details: data.details,
        };
      }

      return { data };
    } catch (error) {
      console.error('API request error:', error);
      return {
        error: error instanceof Error 
          ? `Network error: ${error.message}. Please check if the backend server is running on port 3001.` 
          : 'Network error. Please check if the backend server is running on port 3001.',
      };
    }
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    name: string;
    email: string;
    phone: string;
    pan: string;
    aadhaar: string;
    password: string;
  }) {
    return this.request<{ userId: string; message: string }>('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request<any>('/user');
  }

  async forgotPassword(email: string) {
    return this.request<{ message: string; otp?: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async recoverPassword(email: string) {
    return this.request<{ message: string; password?: string }>('/auth/recover-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(email: string, otp: string, newPassword: string) {
    return this.request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    });
  }

  async updateKYC(pan: string, aadhaar: string) {
    return this.request<{ message: string; user: any }>('/user/kyc', {
      method: 'PUT',
      body: JSON.stringify({ pan, aadhaar }),
    });
  }

  async uploadProfilePhoto(uri: string) {
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();
    
    // Extract filename from URI
    const filename = uri.split('/').pop() || 'photo.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('photo', {
      uri,
      name: filename,
      type,
    } as any);

    const uploadURL = `${this.baseURL}/user/profile-photo`;

    try {
      const response = await fetch(uploadURL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          return { error: `Invalid response from server: ${text.substring(0, 200)}` };
        }
      }

      if (!response.ok) {
        return { error: data.error || `Upload failed: ${response.status}` };
      }

      return { data };
    } catch (error) {
      return { 
        error: error instanceof Error 
          ? `Network error: ${error.message}` 
          : 'Failed to upload photo',
      };
    }
  }

  async deleteProfilePhoto() {
    return this.request<{ message: string }>('/user/profile-photo', {
      method: 'DELETE',
    });
  }

  // Prices
  async getPrices() {
    return this.request<{
      gold24k: number;
      gold22k: number;
      silver: number;
      lastUpdated: string;
    }>('/prices');
  }

  // Purchases
  async createPurchase(purchaseData: {
    type: string;
    purity: string;
    quantity: number;
    pricePerGram: number;
    totalAmount: number;
    pan?: string;
    aadhaar?: string;
    couponCode?: string;
  }) {
    // Filter out undefined values to ensure they're not sent to backend
    const cleanedData: any = {
      type: purchaseData.type,
      purity: purchaseData.purity,
      quantity: purchaseData.quantity,
      pricePerGram: purchaseData.pricePerGram,
      totalAmount: purchaseData.totalAmount,
    };
    
    // Only include optional fields if they have valid values
    if (purchaseData.pan) cleanedData.pan = purchaseData.pan;
    if (purchaseData.aadhaar) cleanedData.aadhaar = purchaseData.aadhaar;
    // CRITICAL: Only include couponCode if it's a valid non-empty string
    // AGGRESSIVE check: Ensure couponCode is NEVER sent unless explicitly valid
    if (purchaseData.couponCode !== undefined && 
        purchaseData.couponCode !== null &&
        typeof purchaseData.couponCode === 'string' && 
        purchaseData.couponCode.trim().length > 0) {
      cleanedData.couponCode = purchaseData.couponCode.trim();
    } else {
      // AGGRESSIVE: Explicitly ensure couponCode is NOT in cleanedData
      delete cleanedData.couponCode;
    }
    
    // DEBUG: Log what we're sending
    console.log('API Client - Purchase data being sent:', {
      hasCouponCode: 'couponCode' in cleanedData,
      couponCodeValue: cleanedData.couponCode,
      allKeys: Object.keys(cleanedData)
    });
    
    return this.request<any>('/purchases', {
      method: 'POST',
      body: JSON.stringify(cleanedData),
    });
  }

  async getPurchases() {
    return this.request<any[]>('/purchases');
  }

  // Payments
  async getPayments() {
    return this.request<any[]>('/payments');
  }

  async updatePayment(paymentId: string, status: string) {
    return this.request<any>(`/payments/${paymentId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Deliveries
  async getDeliveries() {
    return this.request<any[]>('/deliveries');
  }

  async generateOTP(purchaseId: string) {
    return this.request<{ otp: string; message: string }>('/delivery/otp', {
      method: 'POST',
      body: JSON.stringify({ purchaseId }),
    });
  }

  async verifyOTP(purchaseId: string, otp: string) {
    return this.request<any>('/delivery/verify', {
      method: 'POST',
      body: JSON.stringify({ purchaseId, otp }),
    });
  }

  // Admin
  async getAdminStats() {
    return this.request<any>('/admin/stats');
  }

  async getAdminPurchases() {
    return this.request<any[]>('/admin/purchases');
  }

  async getAdminPayments() {
    return this.request<any[]>('/admin/payments');
  }

  async getAdminDeliveries() {
    return this.request<any[]>('/admin/deliveries');
  }

  async getAdminUsers() {
    return this.request<any[]>('/admin/users');
  }

  async deleteUser(userId: string) {
    return this.request<{ message: string; deletedData: any }>(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async getKYCQueue() {
    return this.request<any[]>('/admin/kyc-queue');
  }

  async getKYCStats() {
    return this.request<{
      pendingVerification: number;
      verificationRequired: number;
      actionRequired: number;
      totalWithKYC: number;
      incompleteKYC: number;
      verifiedKYC: number;
    }>('/admin/kyc-stats');
  }

  async verifyKYC(userId: string, verified: boolean) {
    return this.request<any>(`/admin/users/${userId}/verify-kyc`, {
      method: 'PUT',
      body: JSON.stringify({ verified }),
    });
  }

  // Coupons
  async getCoupons() {
    return this.request<any[]>('/coupons');
  }

  async getAdminCoupons() {
    return this.request<any[]>('/admin/coupons');
  }

  async createCoupon(couponData: {
    code: string;
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    applicableType?: 'gold' | 'silver' | 'both';
    maxUses?: number | null;
    expiryDate?: string | null;
  }) {
    return this.request<any>('/admin/coupons', {
      method: 'POST',
      body: JSON.stringify(couponData),
    });
  }

  async assignCoupon(couponId: string, userIds: string[]) {
    return this.request<any>(`/admin/coupons/${couponId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ userIds }),
    });
  }

  async deleteCoupon(couponId: string) {
    return this.request<any>(`/admin/coupons/${couponId}`, {
      method: 'DELETE',
    });
  }

  async requestKYCVerification() {
    return this.request<{ message: string; success: boolean }>('/user/request-kyc-verification', {
      method: 'POST',
    });
  }

  async updatePurchaseStatus(purchaseId: string, status: string) {
    return this.request<any>(`/admin/purchases/${purchaseId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Refunds
  async calculateRefund(purchaseId: string) {
    return this.request<any>(`/refunds/calculate/${purchaseId}`);
  }

  async submitRefundRequest(purchaseId: string, supportChannel: string, supportReference?: string) {
    return this.request<any>('/refunds/request', {
      method: 'POST',
      body: JSON.stringify({ purchaseId, supportChannel, supportReference }),
    });
  }

  async getRefunds() {
    return this.request<any[]>('/refunds');
  }

  async getRefund(refundId: string) {
    return this.request<any>(`/refunds/${refundId}`);
  }

  // Admin Refunds
  async getAdminRefunds() {
    return this.request<any[]>('/admin/refunds');
  }

  async approveRefund(refundId: string, adminNotes?: string) {
    return this.request<any>(`/admin/refunds/${refundId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ adminNotes }),
    });
  }

  async rejectRefund(refundId: string, adminNotes?: string) {
    return this.request<any>(`/admin/refunds/${refundId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ adminNotes }),
    });
  }

  async processRefund(refundId: string, refundTransactionId?: string, adminNotes?: string) {
    return this.request<any>(`/admin/refunds/${refundId}/process`, {
      method: 'POST',
      body: JSON.stringify({ refundTransactionId, adminNotes }),
    });
  }

  // Notifications
  async getNotifications() {
    return this.request<{ notifications: any[]; unreadCount: number }>('/notifications');
  }

  async markNotificationRead(notificationId: string) {
    return this.request<any>(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsRead() {
    return this.request<any>('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async deleteNotification(notificationId: string) {
    return this.request<any>(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  }

  async getUnreadCount() {
    return this.request<{ count: number }>('/notifications/unread-count');
  }

  // Admin Notifications
  async createNotification(notificationData: {
    userId?: string;
    type?: string;
    title: string;
    message: string;
    isOffer?: boolean;
    offerDetails?: {
      discount?: number;
      validUntil?: string;
      minPurchase?: number;
      code?: string;
    };
    link?: string;
  }) {
    return this.request<any>('/admin/notifications', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  }

  async getAdminNotifications(filters?: {
    userId?: string;
    type?: string;
    isOffer?: boolean;
    limit?: number;
  }) {
    const params = new URLSearchParams();
    if (filters?.userId) params.append('userId', filters.userId);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.isOffer !== undefined) params.append('isOffer', String(filters.isOffer));
    if (filters?.limit) params.append('limit', String(filters.limit));

    return this.request<{ notifications: any[] }>(`/admin/notifications?${params.toString()}`);
  }

  async deleteAdminNotification(notificationId: string) {
    return this.request<any>(`/admin/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  }

  // Security Center
  async getActivityLog(limit?: number) {
    const params = limit ? `?limit=${limit}` : '';
    return this.request<any[]>(`/user/activity${params}`);
  }

  async getSessions() {
    return this.request<any[]>('/user/sessions');
  }

  async endSession(sessionId: string) {
    return this.request<any>(`/user/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<{ message: string }>('/user/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async getSecuritySummary() {
    return this.request<{
      activeSessions: number;
      sessions: any[];
      recentActivities: any[];
      passwordChangeCount: number;
      lastPasswordChange: string | null;
    }>('/user/security-summary');
  }

  // Static Pages
  async getPageContent(pageId: string) {
    return this.request<{
      title: string;
      content: any;
    }>(`/pages/${pageId}`);
  }
}

export const api = new ApiClient(API_BASE_URL);

