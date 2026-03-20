import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuthStore } from '../store/authStore';
import { usePriceStore } from '../store/priceStore';
import { api } from '../api/client';
import { formatCurrency } from '../utils';
import Toast from 'react-native-toast-message';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminUsers from '../components/admin/AdminUsers';
import AdminPurchases from '../components/admin/AdminPurchases';
import AdminPayments from '../components/admin/AdminPayments';
import AdminDeliveries from '../components/admin/AdminDeliveries';
import AdminKYC from '../components/admin/AdminKYC';
import AdminCoupons from '../components/admin/AdminCoupons';
import AdminNotifications from '../components/admin/AdminNotifications';
import AdminRefunds from '../components/admin/AdminRefunds';

const Tab = createBottomTabNavigator();

export default function AdminScreen() {
  const { user, clearAuth } = useAuthStore();
  const { prices, setPrices, setLoading } = usePriceStore();

  useEffect(() => {
    loadPrices();
    const interval = setInterval(loadPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadPrices = async () => {
    setLoading(true);
    try {
      const response = await api.getPrices();
      if (response.data) {
        setPrices(response.data);
      }
    } catch (error) {
      console.error('Error loading prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await clearAuth();
    Toast.show({
      type: 'success',
      text1: 'Logged Out',
      text2: 'You have been logged out successfully',
    });
  };

  // Header component with logout button for all admin tabs
  const renderHeaderRight = (showPrices: boolean = true) => (
    <View style={styles.headerRight}>
      {showPrices && prices && (
        <View style={styles.priceHeader}>
          <Text style={styles.priceText}>
            24K: {formatCurrency(prices.gold24k)}
          </Text>
          <Text style={styles.priceText}>
            22K: {formatCurrency(prices.gold22k)}
          </Text>
        </View>
      )}
      {user && (
        <Text style={styles.userName} numberOfLines={1}>
          {user.name}
        </Text>
      )}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#681412',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerRight: () => renderHeaderRight(),
        tabBarActiveTintColor: '#681412',
        tabBarInactiveTintColor: '#92422B',
        tabBarStyle: {
          backgroundColor: '#fff',
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={AdminDashboard}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📊</Text>,
          headerTitle: 'Admin Dashboard',
          headerTitleStyle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: '#fff',
            flexShrink: 1,
          },
          headerRight: () => renderHeaderRight(false), // Don't show prices in header for Dashboard
        }}
      />
      <Tab.Screen
        name="Users"
        component={AdminUsers}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>👥</Text>,
        }}
      />
      <Tab.Screen
        name="Purchases"
        component={AdminPurchases}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🛒</Text>,
        }}
      />
      <Tab.Screen
        name="Payments"
        component={AdminPayments}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>💳</Text>,
        }}
      />
      <Tab.Screen
        name="Deliveries"
        component={AdminDeliveries}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📦</Text>,
        }}
      />
      <Tab.Screen
        name="KYC"
        component={AdminKYC}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>✅</Text>,
        }}
      />
      <Tab.Screen
        name="Coupons"
        component={AdminCoupons}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🎟️</Text>,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={AdminNotifications}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🔔</Text>,
          headerRight: () => renderHeaderRight(false), // Don't show prices in header for Notifications
        }}
      />
      <Tab.Screen
        name="Refunds"
        component={AdminRefunds}
        options={{
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>💰</Text>,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    gap: 12,
  },
  priceHeader: {
    flexDirection: 'row',
    gap: 8,
    flexShrink: 0, // Prevent prices from shrinking
  },
  priceText: {
    color: '#fff',
    fontSize: 9, // Smaller font size
    lineHeight: 12, // Adjust line height
  },
  userName: {
    color: '#fff',
    fontSize: 12,
    maxWidth: 100,
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
