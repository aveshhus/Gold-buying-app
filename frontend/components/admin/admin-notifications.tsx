'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { 
  Bell, 
  Gift, 
  Plus, 
  Trash2, 
  Users, 
  User,
  Calendar,
  Tag,
  DollarSign
} from 'lucide-react';
import { Notification } from '@/types';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [users, setUsers] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'general' as Notification['type'],
    isOffer: false,
    offerDetails: {
      discount: 0,
      validUntil: '',
      minPurchase: 0,
      code: '',
    },
    link: '',
  });

  useEffect(() => {
    loadNotifications();
    loadUsers();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAdminNotifications({ limit: 100 });
      if (response.data) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await api.getAdminUsers();
      if (response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleCreateNotification = async () => {
    if (!formData.title || !formData.message) {
      toast.error('Title and message are required');
      return;
    }

    try {
      const notificationData: any = {
        title: formData.title,
        message: formData.message,
        type: formData.type,
        isOffer: formData.isOffer,
      };

      if (selectedUser !== 'all') {
        notificationData.userId = selectedUser;
      } else {
        notificationData.userId = 'all';
      }

      if (formData.isOffer && formData.offerDetails) {
        notificationData.offerDetails = {
          discount: formData.offerDetails.discount || undefined,
          validUntil: formData.offerDetails.validUntil || undefined,
          minPurchase: formData.offerDetails.minPurchase || undefined,
          code: formData.offerDetails.code || undefined,
        };
      }

      if (formData.link) {
        notificationData.link = formData.link;
      }

      const response = await api.createNotification(notificationData);
      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success(
        selectedUser === 'all'
          ? `Notification sent to all users`
          : 'Notification created successfully'
      );
      setIsCreateModalOpen(false);
      resetForm();
      loadNotifications();
    } catch (error: any) {
      console.error('Error creating notification:', error);
      toast.error(error?.error || 'Failed to create notification');
    }
  };

  const handleDelete = async (notificationId: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) {
      return;
    }

    try {
      const response = await api.deleteAdminNotification(notificationId);
      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success('Notification deleted');
      loadNotifications();
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      toast.error(error?.error || 'Failed to delete notification');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'general',
      isOffer: false,
      offerDetails: {
        discount: 0,
        validUntil: '',
        minPurchase: 0,
        code: '',
      },
      link: '',
    });
    setSelectedUser('all');
  };

  const getNotificationIcon = (type: Notification['type'], isOffer: boolean) => {
    if (isOffer) return Gift;
    switch (type) {
      case 'purchase':
        return Bell;
      case 'payment':
        return DollarSign;
      case 'delivery':
        return Bell;
      case 'kyc':
        return Bell;
      case 'offer':
        return Tag;
      default:
        return Bell;
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - then.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return then.toLocaleDateString();
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-[#681412]">Notifications & Offers</h2>
          <p className="text-sm md:text-base text-muted-foreground">Manage notifications and create offers for users</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)} 
          className="bg-[#7a1a18] hover:bg-[#681412] min-h-[44px] touch-manipulation w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Notification
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-[#92422B] text-white border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Total Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{notifications.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-[#92422B] text-white border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Active Offers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {notifications.filter(n => n.isOffer).length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#92422B] text-white border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users Notified
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {new Set(notifications.map(n => n.userId)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type, notification.isOffer);
                const user = users.find(u => u.id === notification.userId);
                
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        notification.isOffer 
                          ? 'bg-[#E79A66]/10 text-[#E79A66]' 
                          : 'bg-[#681412]/10 text-[#681412]'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-sm">{notification.title}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(notification.id)}
                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                        {notification.isOffer && notification.offerDetails && (
                          <div className="mb-2 p-2 bg-[#E79A66]/10 rounded border border-[#E79A66]/20">
                            <div className="text-xs text-[#92422B] font-medium">
                              {notification.offerDetails.discount && (
                                <span className="mr-2">{notification.offerDetails.discount}% OFF</span>
                              )}
                              {notification.offerDetails.code && (
                                <span className="font-mono">Code: {notification.offerDetails.code}</span>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {notification.userId === 'all' ? (
                              <>
                                <Users className="h-3 w-3" />
                                All Users
                              </>
                            ) : (
                              <>
                                <User className="h-3 w-3" />
                                {user?.name || notification.userId}
                              </>
                            )}
                          </span>
                          <span>{formatTimeAgo(notification.createdAt)}</span>
                          {notification.isOffer && (
                            <span className="px-2 py-0.5 bg-[#E79A66]/20 text-[#92422B] rounded">
                              Offer
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Notification Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Notification / Offer</DialogTitle>
            <DialogDescription>
              Create a notification for specific user or all users. Enable offer mode to create special offers.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Send To</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="all">All Users</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as Notification['type'] })}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="general">General</option>
                <option value="offer">Offer</option>
                <option value="purchase">Purchase</option>
                <option value="payment">Payment</option>
                <option value="delivery">Delivery</option>
                <option value="kyc">KYC</option>
                <option value="system">System</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isOffer"
                checked={formData.isOffer}
                onChange={(e) => setFormData({ ...formData, isOffer: e.target.checked })}
                className="h-4 w-4"
              />
              <label htmlFor="isOffer" className="text-sm font-medium">
                This is an offer/promotion
              </label>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter notification title"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Message *</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Enter notification message"
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            {formData.isOffer && (
              <div className="space-y-4 p-4 bg-[#E79A66]/10 rounded-lg border border-[#E79A66]/20">
                <h4 className="font-medium text-[#92422B]">Offer Details</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Discount (%)</label>
                    <Input
                      type="number"
                      value={formData.offerDetails.discount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          offerDetails: {
                            ...formData.offerDetails,
                            discount: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      placeholder="10"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Promo Code</label>
                    <Input
                      value={formData.offerDetails.code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          offerDetails: {
                            ...formData.offerDetails,
                            code: e.target.value,
                          },
                        })
                      }
                      placeholder="SUMMER2024"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Minimum Purchase (₹)</label>
                    <Input
                      type="number"
                      value={formData.offerDetails.minPurchase}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          offerDetails: {
                            ...formData.offerDetails,
                            minPurchase: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Valid Until</label>
                    <Input
                      type="date"
                      value={formData.offerDetails.validUntil}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          offerDetails: {
                            ...formData.offerDetails,
                            validUntil: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium mb-2 block">Link (Optional)</label>
              <Input
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="/dashboard/purchase"
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateNotification} className="bg-[#7a1a18] hover:bg-[#681412]">
                Create Notification
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

