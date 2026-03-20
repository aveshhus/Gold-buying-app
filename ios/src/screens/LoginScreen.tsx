import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import { api } from '../api/client';
import { validatePAN, validateAadhaar } from '../utils';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { setAuth } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    pan: '',
    aadhaar: '',
    password: '',
    confirmPassword: '',
  });

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill all fields',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.login(loginEmail, loginPassword);
      
      if (response.error) {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: response.error,
        });
        return;
      }

      if (response.data) {
        await setAuth(response.data.user, response.data.token);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Login successful!',
        });
        // Navigation will be handled by App.tsx based on auth state
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerData.name || !registerData.email || !registerData.phone || 
        !registerData.pan || !registerData.aadhaar || !registerData.password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill all fields',
      });
      return;
    }

    if (!validatePAN(registerData.pan)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid PAN',
        text2: 'Please enter a valid PAN card number',
      });
      return;
    }

    if (!validateAadhaar(registerData.aadhaar)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Aadhaar',
        text2: 'Please enter a valid Aadhaar card number',
      });
      return;
    }

    if (registerData.password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Weak Password',
        text2: 'Password must be at least 6 characters long',
      });
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Password Mismatch',
        text2: 'Passwords do not match',
      });
      return;
    }

    setIsLoading(true);
    try {
      const { confirmPassword, ...registerPayload } = registerData;
      const response = await api.register(registerPayload);
      
      if (response.error) {
        Toast.show({
          type: 'error',
          text1: 'Registration Failed',
          text2: response.error,
        });
        return;
      }

      if (response.data) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Registration successful! Please login.',
        });
        setActiveTab('login');
        setLoginEmail(registerData.email);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your email address',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.recoverPassword(forgotPasswordEmail);
      
      if (response.error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.error,
        });
        return;
      }

      if (response.data) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: response.data.message || 'A new password has been sent to your email address.',
        });
        
        // In development, show password if available
        if (response.data.password) {
          Alert.alert(
            'Development Mode',
            `New Password: ${response.data.password}\n\nThis is only shown in development. In production, check your email.`,
            [{ text: 'OK' }]
          );
        }
        
        setShowForgotPassword(false);
        setForgotPasswordEmail('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Shree Omji Saraf</Text>
        <Text style={styles.subtitle}>Gold & Silver Platform</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'login' && styles.tabActive]}
          onPress={() => setActiveTab('login')}
        >
          <Text style={[styles.tabText, activeTab === 'login' && styles.tabTextActive]}>
            Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'register' && styles.tabActive]}
          onPress={() => setActiveTab('register')}
        >
          <Text style={[styles.tabText, activeTab === 'register' && styles.tabTextActive]}>
            Register
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        {activeTab === 'login' ? (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                value={loginEmail}
                onChangeText={setLoginEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChangeText={setLoginPassword}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                setForgotPasswordEmail(loginEmail);
                setShowForgotPassword(true);
              }}
              style={styles.forgotPasswordLink}
              disabled={isLoading}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                value={registerData.name}
                onChangeText={(text) => setRegisterData({ ...registerData, name: text })}
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                value={registerData.email}
                onChangeText={(text) => setRegisterData({ ...registerData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="+91 1234567890"
                value={registerData.phone}
                onChangeText={(text) => setRegisterData({ ...registerData, phone: text })}
                keyboardType="phone-pad"
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>PAN Card</Text>
              <TextInput
                style={styles.input}
                placeholder="ABCDE1234F"
                value={registerData.pan}
                onChangeText={(text) => setRegisterData({ ...registerData, pan: text.toUpperCase() })}
                autoCapitalize="characters"
                maxLength={10}
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Aadhaar Card</Text>
              <TextInput
                style={styles.input}
                placeholder="123456789012"
                value={registerData.aadhaar}
                onChangeText={(text) => setRegisterData({ ...registerData, aadhaar: text.replace(/\D/g, '').slice(0, 12) })}
                keyboardType="number-pad"
                maxLength={12}
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  value={registerData.password}
                  onChangeText={(text) => setRegisterData({ ...registerData, password: text })}
                  secureTextEntry={!showPassword}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={registerData.confirmPassword}
                onChangeText={(text) => setRegisterData({ ...registerData, confirmPassword: text })}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
            </View>
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Forgot Password Modal */}
      <Modal
        visible={showForgotPassword}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowForgotPassword(false);
          setForgotPasswordEmail('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Forgot Password</Text>
            <Text style={styles.modalSubtitle}>
              Enter your registered email address and we'll send you a new password.
            </Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                value={forgotPasswordEmail}
                onChangeText={setForgotPasswordEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowForgotPassword(false);
                  setForgotPasswordEmail('');
                }}
                disabled={isLoading}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary, isLoading && styles.buttonDisabled]}
                onPress={handleForgotPassword}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>Send Password</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D5BAA7',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#681412',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#92422B',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#681412',
  },
  tabText: {
    fontSize: 16,
    color: '#681412',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#fff',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#681412',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E79A66',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E79A66',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeButton: {
    padding: 12,
  },
  eyeText: {
    fontSize: 20,
  },
  button: {
    backgroundColor: '#681412',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: '#681412',
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#681412',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#E79A66',
  },
  modalButtonPrimary: {
    backgroundColor: '#681412',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextCancel: {
    color: '#681412',
    fontSize: 16,
    fontWeight: '600',
  },
});

