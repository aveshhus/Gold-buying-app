import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from './src/store/authStore';
import { api } from './src/api/client';
import { DrawerProvider, useDrawer } from './src/context/DrawerContext';

// Screens
import LandingScreen from './src/screens/LandingScreen';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AdminScreen from './src/screens/AdminScreen';

// Info Screens
import RefundPolicyScreen from './src/screens/RefundPolicyScreen';
import ChargeBackScreen from './src/screens/ChargeBackScreen';
import TermsScreen from './src/screens/TermsScreen';
import AboutUsScreen from './src/screens/AboutUsScreen';
import ContactUsScreen from './src/screens/ContactUsScreen';
import AddressScreen from './src/screens/AddressScreen';

const Stack = createStackNavigator();

// Header left component with hamburger menu for info screens
function InfoScreenHeaderLeft() {
  const { openDrawer } = useDrawer();
  const navigation = useNavigation();
  
  const handlePress = () => {
    try {
      if (navigation) {
        navigation.navigate('Dashboard' as never);
        setTimeout(() => {
          openDrawer();
        }, 100);
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      style={styles.menuButton}
    >
      <Text style={styles.menuIcon}>☰</Text>
    </TouchableOpacity>
  );
}

function AppNavigator() {
  const { isAuthenticated, user, setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await api.getCurrentUser();
          if (response.data && !response.error) {
            await setAuth(response.data, token);
          } else {
            await AsyncStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        await AsyncStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#D5BAA7' }}>
          <ActivityIndicator size="large" color="#681412" />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: '#D5BAA7' },
          }}
        >
          {!isAuthenticated ? (
            <>
              <Stack.Screen name="Landing" component={LandingScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
            </>
          ) : user?.role === 'admin' ? (
            <Stack.Screen name="Admin" component={AdminScreen} />
          ) : (
            <>
              <Stack.Screen name="Dashboard" component={DashboardScreen} />
              <Stack.Screen 
                name="RefundPolicy" 
                component={RefundPolicyScreen} 
                options={{ 
                  headerShown: true, 
                  title: 'Refund Policy', 
                  headerStyle: { backgroundColor: '#681412' }, 
                  headerTintColor: '#fff',
                  headerLeft: () => <InfoScreenHeaderLeft />
                }} 
              />
              <Stack.Screen 
                name="ChargeBack" 
                component={ChargeBackScreen} 
                options={{ 
                  headerShown: true, 
                  title: 'Chargeback Policy', 
                  headerStyle: { backgroundColor: '#681412' }, 
                  headerTintColor: '#fff',
                  headerLeft: () => <InfoScreenHeaderLeft />
                }} 
              />
              <Stack.Screen 
                name="Terms" 
                component={TermsScreen} 
                options={{ 
                  headerShown: true, 
                  title: 'Terms & Conditions', 
                  headerStyle: { backgroundColor: '#681412' }, 
                  headerTintColor: '#fff',
                  headerLeft: () => <InfoScreenHeaderLeft />
                }} 
              />
              <Stack.Screen 
                name="AboutUs" 
                component={AboutUsScreen} 
                options={{ 
                  headerShown: true, 
                  title: 'About Us', 
                  headerStyle: { backgroundColor: '#681412' }, 
                  headerTintColor: '#fff',
                  headerLeft: () => <InfoScreenHeaderLeft />
                }} 
              />
              <Stack.Screen 
                name="ContactUs" 
                component={ContactUsScreen} 
                options={{ 
                  headerShown: true, 
                  title: 'Contact Us', 
                  headerStyle: { backgroundColor: '#681412' }, 
                  headerTintColor: '#fff',
                  headerLeft: () => <InfoScreenHeaderLeft />
                }} 
              />
              <Stack.Screen 
                name="Address" 
                component={AddressScreen} 
                options={{ 
                  headerShown: true, 
                  title: 'Registered Address', 
                  headerStyle: { backgroundColor: '#681412' }, 
                  headerTintColor: '#fff',
                  headerLeft: () => <InfoScreenHeaderLeft />
                }} 
              />
            </>
          )}
        </Stack.Navigator>
        <Toast />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
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

export default function App() {
  return (
    <DrawerProvider>
      <AppNavigator />
    </DrawerProvider>
  );
}

