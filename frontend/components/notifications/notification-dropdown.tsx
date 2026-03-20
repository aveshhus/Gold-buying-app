'use client';

import { Notification } from '@/types';
import { 
  X, 
  Check, 
  CheckCheck, 
  Trash2, 
  Gift, 
  ShoppingCart, 
  CreditCard, 
  Package, 
  Shield,
  Bell,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onNotificationClick: (notification: Notification) => void;
  onClose: () => void;
}

const getNotificationIcon = (type: Notification['type'], isOffer: boolean) => {
  if (isOffer) return Gift;
  switch (type) {
    case 'purchase':
      return ShoppingCart;
    case 'payment':
      return CreditCard;
    case 'delivery':
      return Package;
    case 'kyc':
      return Shield;
    case 'offer':
      return Tag;
    default:
      return Bell;
  }
};

const getNotificationColor = (type: Notification['type'], isOffer: boolean) => {
  if (isOffer) return 'text-[#E79A66] bg-[#E79A66]/10';
  switch (type) {
    case 'purchase':
      return 'text-[#92422B] bg-[#92422B]/10';
    case 'payment':
      return 'text-[#681412] bg-[#681412]/10';
    case 'delivery':
      return 'text-[#92422B] bg-[#92422B]/10';
    case 'kyc':
      return 'text-[#681412] bg-[#681412]/10';
    default:
      return 'text-[#681412] bg-[#681412]/10';
  }
};

export default function NotificationDropdown({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onNotificationClick,
  onClose,
}: NotificationDropdownProps) {
  return (
    <>
      {/* Mobile Overlay Background */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Notification Panel */}
      <div className="fixed md:absolute top-0 md:top-12 right-0 md:right-0 left-0 md:left-auto w-full md:w-96 max-w-full md:max-w-sm h-screen md:h-auto md:max-h-[600px] bg-white md:rounded-lg shadow-xl border-0 md:border border-gray-200 z-50 mobile-safe-area flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 md:px-6 md:py-5 border-b border-white/10 bg-gradient-to-r from-[#681412] via-[#7a1a18] to-[#681412] text-white md:rounded-t-lg flex-shrink-0 shadow-lg">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-white/15 rounded-lg backdrop-blur-sm">
            <Bell className="h-5 w-5 flex-shrink-0" />
          </div>
          <div className="flex items-center gap-2.5 min-w-0">
            <h3 className="font-bold text-lg md:text-xl tracking-tight truncate">Notifications</h3>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md flex-shrink-0 min-w-[24px] justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllAsRead}
              className="text-white hover:bg-white/20 active:bg-white/30 h-10 w-10 md:h-9 md:w-9 rounded-lg min-h-[44px] min-w-[44px] touch-manipulation transition-all duration-200"
              title="Mark all as read"
            >
              <CheckCheck className="h-5 w-5 md:h-4 md:w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 active:bg-white/30 h-10 w-10 md:h-9 md:w-9 rounded-lg p-0 min-h-[44px] min-w-[44px] touch-manipulation transition-all duration-200"
          >
            <X className="h-5 w-5 md:h-4 md:w-4" />
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <ScrollArea className="flex-1 md:h-[500px] bg-gray-50/30">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 sm:p-16 text-center">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <Bell className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
            </div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-700 mb-1.5">No notifications</h4>
            <p className="text-sm sm:text-base text-gray-500 max-w-xs">You're all caught up! New notifications will appear here.</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((notification) => {
              const Icon = getNotificationIcon(notification.type, notification.isOffer);
              const colorClass = getNotificationColor(notification.type, notification.isOffer);
              
              // Format time ago
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
              
              const timeAgo = formatTimeAgo(notification.createdAt);

              return (
                <div
                  key={notification.id}
                  className={`group relative px-4 sm:px-5 py-4 sm:py-5 hover:bg-white active:bg-gray-50 transition-all duration-200 cursor-pointer touch-manipulation border-b border-gray-100/80 ${
                    !notification.isRead ? 'bg-blue-50/40 hover:bg-blue-50/60' : 'bg-white'
                  }`}
                  onClick={() => onNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`p-2.5 sm:p-3 rounded-xl ${colorClass} flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow duration-200`}>
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <h4 className={`text-sm sm:text-base font-semibold break-words leading-snug ${
                            !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="h-2.5 w-2.5 rounded-full bg-blue-500 flex-shrink-0 mt-1 shadow-sm" />
                          )}
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2 break-words leading-relaxed">
                        {notification.message}
                      </p>
                      {notification.isOffer && notification.offerDetails && (
                        <div className="mb-3 p-3 bg-gradient-to-br from-[#E79A66]/10 to-[#E79A66]/5 rounded-lg border border-[#E79A66]/20 shadow-sm">
                          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#92422B] font-semibold">
                            {notification.offerDetails.discount && (
                              <span className="px-2.5 py-1 bg-[#E79A66]/20 rounded-md">
                                {notification.offerDetails.discount}% OFF
                              </span>
                            )}
                            {notification.offerDetails.code && (
                              <span className="px-2.5 py-1 bg-white/60 rounded-md font-mono text-xs break-all">
                                Code: {notification.offerDetails.code}
                              </span>
                            )}
                          </div>
                          {notification.offerDetails.validUntil && (
                            <div className="text-xs text-gray-500 mt-2 font-medium">
                              Valid until: {new Date(notification.offerDetails.validUntil).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs sm:text-sm text-gray-500 font-medium">{timeAgo}</span>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onMarkAsRead(notification.id);
                              }}
                              className="h-9 w-9 sm:h-8 sm:w-8 p-0 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 active:bg-gray-200 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 touch-manipulation transition-all duration-200"
                              title="Mark as read"
                            >
                              <Check className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(notification.id);
                            }}
                            className="h-9 w-9 sm:h-8 sm:w-8 p-0 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 active:bg-red-100 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 touch-manipulation transition-all duration-200"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
    </>
  );
}

