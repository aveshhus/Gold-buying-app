import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const DRAWER_WIDTH = 280;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface InfoDrawerProps {
  visible: boolean;
  onClose: () => void;
  activeTab?: string;
  onNavigateTab?: (tabName: string) => void;
}

export default function InfoDrawer({ visible, onClose, activeTab, onNavigateTab }: InfoDrawerProps) {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const translateX = React.useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayOpacity = React.useRef(new Animated.Value(0)).current;
  const isClosingRef = React.useRef(false);

  // Get current tab from navigation state
  const getCurrentTab = () => {
    if (activeTab) return activeTab;
    const state = navigation.getState();
    if (state) {
      const dashboardRoute = state.routes.find((r: any) => r.name === 'Dashboard');
      if (dashboardRoute?.state) {
        const tabState = dashboardRoute.state;
        const currentTab = tabState.routes[tabState.index]?.name;
        return currentTab;
      }
    }
    return route.name;
  };

  // Main dashboard menu items
  const dashboardMenuItems = [
    { id: 'Portfolio', label: 'Portfolio', icon: '📊', screen: null },
    { id: 'Purchase', label: 'Buy Gold/Silver', icon: '🛒', screen: null },
    { id: 'Payments', label: 'Payments', icon: '💳', screen: null },
    { id: 'Deliveries', label: 'Deliveries', icon: '📦', screen: null },
    { id: 'Analytics', label: 'Analytics', icon: '📈', screen: null },
    { id: 'Security', label: 'Security', icon: '🔒', screen: null },
    { id: 'Notifications', label: 'Notifications', icon: '🔔', screen: null },
    { id: 'Profile', label: 'Profile', icon: '👤', screen: null },
  ];

  // Information pages menu items
  const infoMenuItems = [
    { id: 'AboutUs', label: 'About Us', icon: 'ℹ️', screen: 'AboutUs' },
    { id: 'ContactUs', label: 'Contact Us', icon: '📞', screen: 'ContactUs' },
    { id: 'Address', label: 'Address', icon: '📍', screen: 'Address' },
    { id: 'Terms', label: 'Terms & Conditions', icon: '📜', screen: 'Terms' },
    { id: 'RefundPolicy', label: 'Refund Policy', icon: '↩️', screen: 'RefundPolicy' },
    { id: 'ChargeBack', label: 'Chargeback Policy', icon: '⚠️', screen: 'ChargeBack' },
  ];

  const allMenuItems = [...dashboardMenuItems, ...infoMenuItems];

  // Pan responder for swipe gestures
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          const newX = Math.max(-DRAWER_WIDTH, gestureState.dx);
          translateX.setValue(newX);
          const progress = Math.abs(newX) / DRAWER_WIDTH;
          overlayOpacity.setValue(0.6 * (1 - progress));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const shouldClose = gestureState.dx < -DRAWER_WIDTH / 3 || gestureState.vx < -0.5;
        if (shouldClose) {
          closeDrawer();
        } else {
          openDrawer();
        }
      },
    })
  ).current;

  const openDrawer = () => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0.6,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDrawer = () => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: -DRAWER_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      isClosingRef.current = false;
      onClose();
    });
  };

  // Open/close drawer based on visible prop
  React.useEffect(() => {
    if (visible) {
      isClosingRef.current = false;
      Animated.parallel([
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0.6,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (!isClosingRef.current) {
      closeDrawer();
    }
  }, [visible]);

  const handlePress = (item: any) => {
    // Close drawer first
    closeDrawer();
    
    // Small delay to ensure drawer closes smoothly before navigation
    setTimeout(() => {
      if (item.screen) {
        // Navigate to info screen (stack navigation - parent navigator)
        try {
          // Get parent navigator (Stack Navigator) which contains Dashboard and info screens
          const parentNavigator = navigation.getParent();
          if (parentNavigator) {
            parentNavigator.navigate(item.screen);
          } else {
            // Fallback: try direct navigation
            navigation.navigate(item.screen);
          }
        } catch (error) {
          console.error('Navigation error:', error);
        }
      } else {
        // Switch tab in dashboard (Tab Navigator)
        // The navigation object from useNavigation in DashboardScreen context IS the Tab Navigator
        if (onNavigateTab) {
          // Use callback from parent (DashboardScreen)
          onNavigateTab(item.id);
        } else {
          // Fallback: try to navigate directly
          // In DashboardScreen context, navigation IS the Tab Navigator
          try {
            navigation.navigate(item.id);
          } catch (error) {
            console.error('Tab navigation error:', error);
            // Try parent as fallback
            const parent = navigation.getParent();
            if (parent) {
              parent.navigate(item.id);
            }
          }
        }
      }
    }, 150);
  };

  const isActive = (itemId: string) => {
    const currentTab = getCurrentTab();
    return currentTab === itemId;
  };

  const drawerStyle = {
    transform: [{ translateX }],
  };

  const overlayStyle = {
    opacity: overlayOpacity,
  };

  if (!visible) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Overlay */}
      <Animated.View style={[styles.overlay, overlayStyle]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={closeDrawer}
        />
      </Animated.View>

      {/* Drawer */}
      <Animated.View
        style={[styles.drawer, drawerStyle]}
        {...panResponder.panHandlers}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>shri omji saraf</Text>
              <Text style={styles.logoDiamond}>💎</Text>
            </View>
            <TouchableOpacity onPress={closeDrawer} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerSubtitle}>Manage your investments</Text>
          </View>

          {/* Menu Items */}
          <ScrollView
            style={styles.menu}
            contentContainerStyle={styles.menuContent}
            showsVerticalScrollIndicator={true}
            bounces={false}
          >
            {allMenuItems.map((item) => {
              const active = isActive(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.menuItem,
                    active && styles.menuItemActive,
                  ]}
                  onPress={() => handlePress(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemContent}>
                    <View style={styles.iconContainer}>
                      <Text style={[
                        styles.menuIcon,
                        active && styles.menuIconActive,
                      ]}>
                        {item.icon}
                      </Text>
                    </View>
                    <Text style={[
                      styles.menuLabel,
                      active && styles.menuLabelActive,
                    ]}>
                      {item.label}
                    </Text>
                  </View>
                  {active && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  drawer: {
    width: DRAWER_WIDTH,
    height: '100%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 15,
  },
  safeArea: {
    flex: 1,
  },
  logoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#681412',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 6,
    shadowColor: '#681412',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  logoText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E79A66',
    textTransform: 'lowercase',
    letterSpacing: 0.5,
  },
  logoDiamond: {
    fontSize: 12,
    marginLeft: 4,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  header: {
    padding: 20,
    paddingTop: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#681412',
    marginBottom: 5,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  menu: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menuContent: {
    paddingTop: 8,
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 12,
    marginVertical: 3,
    borderRadius: 10,
    backgroundColor: 'transparent',
    minHeight: 50,
  },
  menuItemActive: {
    backgroundColor: '#681412',
    shadowColor: '#681412',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIcon: {
    fontSize: 20,
    color: '#681412',
  },
  menuIconActive: {
    color: '#fff',
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    marginLeft: 12,
  },
  menuLabelActive: {
    color: '#fff',
    fontWeight: '600',
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginLeft: 8,
  },
});
