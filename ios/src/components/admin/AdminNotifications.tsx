import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { api } from '../../api/client';
import { Notification } from '../../types';
import Toast from 'react-native-toast-message';
import { formatRelativeTime, formatDate, formatCurrency } from '../../utils';
import { usePriceStore } from '../../store/priceStore';

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'purchase': return '🛒';
    case 'offer': return '🎁';
    case 'delivery': return '📦';
    case 'payment': return '💳';
    case 'kyc': return '📄';
    case 'system': return '⚙️';
    default: return '🔔';
  }
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { prices } = usePriceStore();

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAdminNotifications({ limit: 100 });
      if (response.data) {
        setNotifications(Array.isArray(response.data.notifications) ? response.data.notifications : []);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load notifications' });
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await api.markNotificationRead(notificationId);
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.deleteAdminNotification(notificationId);
              setNotifications(prev => prev.filter(n => n.id !== notificationId));
              Toast.show({ type: 'success', text1: 'Success', text2: 'Notification deleted' });
            } catch (error) {
              console.error('Error deleting notification:', error);
              Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to delete notification' });
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    // Optionally navigate to a specific screen based on notification.link
    if (notification.link) {
      console.log('Navigate to:', notification.link);
    }
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#681412" />
      </View>
    );
  }

  return (
    <View style={styles.fullScreenContainer}>
      {prices && (
        <View style={styles.priceHeader}>
          <Text style={styles.priceText}>
            24K: {formatCurrency(prices.gold24k)} | 22K: {formatCurrency(prices.gold22k)} | Silver: {formatCurrency(prices.silver)}
          </Text>
        </View>
      )}
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubtext}>We'll let you know when something new happens!</Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[styles.notificationCard, !notification.isRead && styles.unreadCard]}
              onPress={() => handleNotificationPress(notification)}
            >
              <View style={styles.notificationIconContainer}>
                <Text style={styles.notificationIcon}>{getNotificationIcon(notification.type)}</Text>
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                <Text style={styles.notificationTime}>
                  {formatRelativeTime(notification.createdAt)}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(notification.id)} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#D5BAA7', // Light beige background
  },
  priceHeader: {
    backgroundColor: '#681412',
    padding: 16,
    paddingHorizontal: 20,
  },
  priceText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D5BAA7',
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#681412', // Highlight unread notifications
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#E79A66', // Light brown square
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#681412',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 13,
    color: '#92422B',
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 11,
    color: '#A0A0A0',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 10,
  },
  deleteButtonText: {
    fontSize: 18,
    color: '#dc2626', // Red color for delete
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#92422B',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#92422B',
    textAlign: 'center',
  },
});

