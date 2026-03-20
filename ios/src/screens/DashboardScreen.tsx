import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { usePriceStore } from '../store/priceStore';
import { api } from '../api/client';
import { formatCurrency } from '../utils';
import { useDrawer } from '../context/DrawerContext';
import PortfolioView from '../components/PortfolioView';
import PurchaseView from '../components/PurchaseView';
import PaymentsView from '../components/PaymentsView';
import DeliveriesView from '../components/DeliveriesView';
import ProfileView from '../components/ProfileView';
import AnalyticsView from '../components/AnalyticsView';
import SecurityView from '../components/SecurityView';
import NotificationsView from '../components/NotificationsView';
import RefundRequestsView from '../components/RefundRequestsView';
import InfoDrawer from '../components/InfoDrawer';

const Tab = createBottomTabNavigator();

export default function DashboardScreen() {
  const { user, clearAuth } = useAuthStore();
  const { prices, setPrices, setLoading } = usePriceStore();
  const [refreshing, setRefreshing] = useState(false);
  const { drawerVisible, setDrawerVisible } = useDrawer();
  const route = useRoute();
  const navigation = useNavigation<any>();

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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPrices();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    await clearAuth();
  };

  const handleNavigateTab = React.useCallback((tabName: string) => {
    // Navigate to the specified tab
    // Since DashboardScreen contains the Tab Navigator, we need to navigate within it
    // The Tab Navigator is a child navigator, so we use nested navigation
    try {
      // Try nested navigation syntax for child navigators
      navigation.navigate('Dashboard', { screen: tabName });
    } catch (error) {
      // Fallback: direct navigation (might work if Tab Navigator is the current navigator)
      try {
        navigation.navigate(tabName);
      } catch (fallbackError) {
        console.error('Error navigating to tab:', fallbackError);
      }
    }
  }, [navigation]);

  // Reusable header left component with hamburger menu
  const renderHeaderLeft = () => (
    <TouchableOpacity
      onPress={() => setDrawerVisible(true)}
      style={styles.menuButton}
    >
      <Text style={styles.menuIcon}>☰</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Tab.Navigator
        tabBar={() => null}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#681412',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
          tabBarActiveTintColor: '#681412',
          tabBarInactiveTintColor: '#92422B',
        }}
      >
      <Tab.Screen
        name="Portfolio"
        component={PortfolioView}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📊</Text>,
          headerTitle: () => (
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                Shree Omji Saraf
              </Text>
              <Text style={styles.headerSubtitle} numberOfLines={1}>
                Gold & Silver Platform
              </Text>
            </View>
          ),
          headerLeft: renderHeaderLeft,
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Tab.Screen
        name="Purchase"
        component={PurchaseView}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🛒</Text>,
          headerLeft: renderHeaderLeft,
        }}
      />
      <Tab.Screen
        name="Payments"
        component={PaymentsView}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>💳</Text>,
          headerLeft: renderHeaderLeft,
        }}
      />
      <Tab.Screen
        name="Deliveries"
        component={DeliveriesView}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📦</Text>,
          headerLeft: renderHeaderLeft,
        }}
      />
      <Tab.Screen
        name="Refunds"
        component={RefundRequestsView}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>💰</Text>,
          headerTitle: 'Refund Requests',
          headerLeft: renderHeaderLeft,
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsView}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📈</Text>,
          headerLeft: renderHeaderLeft,
        }}
      />
      <Tab.Screen
        name="Security"
        component={SecurityView}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🔒</Text>,
          headerLeft: renderHeaderLeft,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsView}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🔔</Text>,
          headerTitle: 'Notifications',
          headerLeft: renderHeaderLeft,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileView}
        options={{
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>👤</Text>,
          headerLeft: renderHeaderLeft,
        }}
      />
    </Tab.Navigator>
    <InfoDrawer 
      visible={drawerVisible} 
      onClose={() => setDrawerVisible(false)}
      activeTab={route.name}
      onNavigateTab={handleNavigateTab}
    />
    </>
  );
}

const styles = StyleSheet.create({
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#E79A66',
    fontSize: 10,
    fontWeight: '500',
    marginTop: -2,
    textAlign: 'center',
  },
  logoutButton: {
    padding: 8,
    marginRight: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  menuButton: {
    padding: 8,
    marginLeft: 10,
  },
  menuIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

