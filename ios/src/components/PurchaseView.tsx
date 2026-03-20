import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { usePriceStore } from '../store/priceStore';
import { api } from '../api/client';
import { formatCurrency, validatePAN, validateAadhaar } from '../utils';
import Toast from 'react-native-toast-message';
import TaglineMarquee from './TaglineMarquee';

type PurchaseMode = 'quantity' | 'amount';

export default function PurchaseView() {
  const { prices, setPrices, isLoading, setLoading } = usePriceStore();
  const [purchaseMode, setPurchaseMode] = useState<PurchaseMode>('quantity');
  const [formData, setFormData] = useState({
    type: '',
    purity: '',
    quantity: '',
    amount: '',
    pan: '',
    aadhaar: '',
  });
  const [calculatedQuantity, setCalculatedQuantity] = useState(0);
  const [calculatedAmount, setCalculatedAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRequestingKYC, setIsRequestingKYC] = useState(false);
  const [userKYC, setUserKYC] = useState<{
    hasKYC: boolean;
    kycVerified: boolean;
  } | null>(null);

  useEffect(() => {
    loadPrices();
    loadUserKYC();
    const interval = setInterval(loadPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (purchaseMode === 'quantity') {
      calculateFromQuantity();
    } else {
      calculateFromAmount();
    }
  }, [formData.type, formData.purity, formData.quantity, formData.amount, purchaseMode, prices]);

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

  const loadUserKYC = async () => {
    try {
      const response = await api.getCurrentUser();
      if (response.data) {
        setUserKYC({
          hasKYC: response.data.hasKYC || false,
          kycVerified: response.data.kycVerified || false,
        });
      }
    } catch (error) {
      console.error('Error loading user KYC:', error);
    }
  };

  const handleRequestKYCVerification = async () => {
    setIsRequestingKYC(true);
    try {
      const response = await api.requestKYCVerification();
      if (response.error) {
        // Check if it's a 404 error (endpoint not found - server needs restart)
        if (response.error.includes('404') || response.error.includes('Not Found')) {
          Alert.alert(
            'Server Error',
            'The request endpoint was not found. Please restart the backend server and try again.\n\nIf you are a developer, restart the server with: node server.js',
            [{ text: 'OK' }]
          );
        } else {
          Toast.show({
            type: 'error',
            text1: 'Request Failed',
            text2: response.error,
          });
        }
        return;
      }

      Toast.show({
        type: 'success',
        text1: 'Request Sent',
        text2: response.data?.message || 'KYC verification request sent to admin successfully!',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to send KYC verification request. Please check your connection and try again.',
      });
    } finally {
      setIsRequestingKYC(false);
    }
  };

  const calculateFromQuantity = () => {
    // For silver, automatically set purity to '999'
    const purity = formData.type === 'silver' ? '999' : formData.purity;
    
    if (!prices || !formData.type || !purity || !formData.quantity) {
      setCalculatedAmount(0);
      return;
    }

    const quantity = parseFloat(formData.quantity) || 0;
    let pricePerGram = 0;

    if (formData.type === 'gold') {
      pricePerGram = purity === '24k' ? prices.gold24k : prices.gold22k;
    } else if (formData.type === 'silver') {
      pricePerGram = prices.silver;
    }

    const amount = Math.round(pricePerGram * quantity * 100) / 100;
    setCalculatedAmount(amount);
    setCalculatedQuantity(quantity);
  };

  const calculateFromAmount = () => {
    // For silver, automatically set purity to '999'
    const purity = formData.type === 'silver' ? '999' : formData.purity;
    
    if (!prices || !formData.type || !purity || !formData.amount) {
      setCalculatedQuantity(0);
      setCalculatedAmount(0);
      return;
    }

    const enteredAmount = parseFloat(formData.amount) || 0;
    let pricePerGram = 0;

    if (formData.type === 'gold') {
      pricePerGram = purity === '24k' ? prices.gold24k : prices.gold22k;
    } else if (formData.type === 'silver') {
      pricePerGram = prices.silver;
    }

    // Calculate quantity from entered amount (use more precision initially)
    const quantity = enteredAmount / pricePerGram;
    
    // Round quantity to 2 decimal places (matching backend precision)
    const roundedQuantity = Math.round(quantity * 100) / 100;
    
    // Recalculate amount from rounded quantity to match backend calculation exactly
    const recalculatedAmount = Math.round(pricePerGram * roundedQuantity * 100) / 100;
    
    setCalculatedQuantity(roundedQuantity);
    setCalculatedAmount(recalculatedAmount);
  };

  const handleSubmit = async () => {
    // For silver, automatically set purity to '999'
    const purity = formData.type === 'silver' ? '999' : formData.purity;
    
    // Validate based on purchase mode
    if (purchaseMode === 'quantity') {
      if (!formData.type || !purity || !formData.quantity) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please fill all required fields',
        });
        return;
      }
    } else {
      if (!formData.type || !purity || !formData.amount) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Please fill all required fields',
        });
        return;
      }
    }

    // Check KYC verification status before allowing purchase
    if (!userKYC?.hasKYC && (!formData.pan || !formData.aadhaar)) {
      Toast.show({
        type: 'error',
        text1: 'KYC Required',
        text2: 'Please provide PAN and Aadhaar card numbers',
      });
      return;
    }

    // IMPORTANT: Check if KYC is verified before allowing purchase
    if (userKYC?.hasKYC && !userKYC?.kycVerified) {
      Alert.alert(
        'KYC Verification Required',
        'Your KYC documents are pending admin verification. A request has been sent to the admin. Please wait for verification approval before making purchases.\n\nYou can check your KYC status in the Profile section.',
        [
          {
            text: 'OK',
            style: 'default',
          },
        ]
      );
      return;
    }

    if (formData.pan && !validatePAN(formData.pan)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid PAN',
        text2: 'Please enter a valid PAN card number',
      });
      return;
    }

    if (formData.aadhaar && !validateAadhaar(formData.aadhaar)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Aadhaar',
        text2: 'Please enter a valid Aadhaar card number',
      });
      return;
    }

    // ORDER VALIDATION RULES - Frontend validation before submission
    // Get final values for validation
    let finalQuantity: number;
    let finalAmountForValidation: number;

    if (purchaseMode === 'quantity') {
      finalQuantity = parseFloat(formData.quantity);
      finalAmountForValidation = calculatedAmount; // iOS doesn't have finalAmount, use calculatedAmount
    } else {
      finalQuantity = calculatedQuantity;
      finalAmountForValidation = calculatedAmount;
    }

    // Rule 1: Minimum Quantity Rules
    if (formData.type === 'gold' && finalQuantity < 0.15) {
      Toast.show({
        type: 'error',
        text1: 'Minimum Quantity Required',
        text2: 'Minimum quantity for Gold is 0.15 grams. Your order quantity is ' + finalQuantity.toFixed(2) + ' grams. Please increase your quantity.',
      });
      return;
    }

    if (formData.type === 'silver' && finalQuantity < 10) {
      Toast.show({
        type: 'error',
        text1: 'Minimum Quantity Required',
        text2: 'Minimum quantity for Silver is 10 grams. Your order quantity is ' + finalQuantity.toFixed(2) + ' grams. Please increase your quantity.',
      });
      return;
    }

    // Rule 2: Minimum Order Value - ₹2000 (check final amount after discount)
    if (finalAmountForValidation < 2000) {
      Toast.show({
        type: 'error',
        text1: 'Minimum Order Value Required',
        text2: 'Minimum order value is ₹2000. Your order amount is ₹' + finalAmountForValidation.toFixed(2) + '. Please increase your order amount.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // For silver, automatically set purity to '999'
      const finalPurity = formData.type === 'silver' ? '999' : formData.purity;

      let pricePerGram = 0;
      if (formData.type === 'gold') {
        pricePerGram = finalPurity === '24k' ? prices!.gold24k : prices!.gold22k;
      } else {
        pricePerGram = prices!.silver;
      }

      // Round pricePerGram to 2 decimal places to match backend precision
      const roundedPricePerGram = Math.round(pricePerGram * 100) / 100;

      // Get final values based on purchase mode
      let finalQuantity: number;
      let finalAmount: number;

      if (purchaseMode === 'quantity') {
        // Quantity mode: use entered quantity, calculate amount
        finalQuantity = parseFloat(formData.quantity);
        // Round quantity to 2 decimal places first
        finalQuantity = Math.round(finalQuantity * 100) / 100;
        // Calculate amount from rounded quantity using rounded price
        finalAmount = Math.round(roundedPricePerGram * finalQuantity * 100) / 100;
      } else {
        // Amount mode: calculate quantity, then recalculate amount to ensure consistency with backend
        const enteredAmount = parseFloat(formData.amount);
        // Calculate quantity from amount using rounded price
        const calculatedQuantity = enteredAmount / roundedPricePerGram;
        // Round quantity to 2 decimal places (backend expects this precision)
        finalQuantity = Math.round(calculatedQuantity * 100) / 100;
        // IMPORTANT: Recalculate amount from rounded quantity to match backend calculation exactly
        finalAmount = Math.round(roundedPricePerGram * finalQuantity * 100) / 100;
      }

      // Verify calculation matches backend expectation
      const expectedTotal = Math.round(roundedPricePerGram * finalQuantity * 100) / 100;
      if (Math.abs(finalAmount - expectedTotal) > 0.01) {
        console.error('Calculation mismatch detected:', {
          pricePerGram: roundedPricePerGram,
          quantity: finalQuantity,
          calculatedAmount: finalAmount,
          expectedTotal: expectedTotal,
        });
        // Use expected total to ensure match
        finalAmount = expectedTotal;
      }

      // ============================================
      // Frontend Sync Fix - Strip unused fields, ensure numbers are numbers
      // ============================================
      // Build clean purchase data with ONLY required fields
      const purchaseData: any = {
        type: formData.type,
        purity: finalPurity,
        quantity: finalQuantity, // Ensure it's a number
        pricePerGram: roundedPricePerGram, // Ensure it's a number
        totalAmount: finalAmount, // Ensure it's a number - backend will recalculate as source of truth
      };
      
      // Only add optional fields if they have valid values
      if (formData.pan && formData.pan.trim().length > 0) {
        purchaseData.pan = formData.pan.trim().toUpperCase();
      }
      if (formData.aadhaar && formData.aadhaar.trim().length > 0) {
        purchaseData.aadhaar = formData.aadhaar.trim();
      }
      
      console.log('[FRONTEND] Purchase data being sent:', {
        ...purchaseData,
        pan: purchaseData.pan ? '***' : undefined,
        aadhaar: purchaseData.aadhaar ? '***' : undefined
      });
      
      const response = await api.createPurchase(purchaseData);

      if (response.error) {
        // Check if error is related to KYC verification
        if (response.error.includes('KYC verification required') || response.error.includes('pending admin verification')) {
          Alert.alert(
            'KYC Verification Required',
            response.error + '\n\nYou can check your KYC status in the Profile section.',
            [
              {
                text: 'Go to Profile',
                onPress: () => {
                  // Navigation will be handled by parent component if needed
                },
                style: 'default',
              },
              {
                text: 'OK',
                style: 'cancel',
              },
            ]
          );
        } else {
          // Show exact backend error message with validation details if available
          const errorMessage = response.error || 'Purchase creation failed. Please try again.';
          const errorDetails = response.missingFields 
            ? `Missing: ${response.missingFields.join(', ')}`
            : response.details 
            ? response.details 
            : null;
          
          Toast.show({
            type: 'error',
            text1: 'Purchase Failed',
            text2: errorDetails ? `${errorMessage}\n${errorDetails}` : errorMessage,
          });
        }
        return;
      }

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Purchase created successfully!',
      });

      // Reset form
      setFormData({
        type: '',
        purity: '',
        quantity: '',
        amount: '',
        pan: '',
        aadhaar: '',
      });
      setCalculatedAmount(0);
      setCalculatedQuantity(0);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TaglineMarquee />

      {/* KYC Status Warning */}
      {userKYC && (
        <>
          {!userKYC.hasKYC && (
            <View style={styles.kycWarningCard}>
              <Text style={styles.kycWarningTitle}>⚠️ KYC Required</Text>
              <Text style={styles.kycWarningText}>
                Please provide your PAN and Aadhaar card numbers below to make purchases.
              </Text>
            </View>
          )}
          {userKYC.hasKYC && !userKYC.kycVerified && (
            <View style={styles.kycPendingCard}>
              <Text style={styles.kycPendingTitle}>⏳ KYC Verification Pending</Text>
              <Text style={styles.kycPendingText}>
                Your KYC documents are pending admin verification. You cannot make purchases until your KYC is verified by the admin. Please check your Profile for updates.
              </Text>
              <TouchableOpacity
                style={styles.requestButton}
                onPress={handleRequestKYCVerification}
                disabled={isRequestingKYC}
              >
                {isRequestingKYC ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.requestButtonText}>📨 Request Verification Again</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
          {userKYC.hasKYC && userKYC.kycVerified && (
            <View style={styles.kycVerifiedCard}>
              <Text style={styles.kycVerifiedTitle}>✅ KYC Verified</Text>
              <Text style={styles.kycVerifiedText}>
                Your KYC is verified. You can proceed with your purchase.
              </Text>
            </View>
          )}
        </>
      )}

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Type *</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                formData.type === 'gold' && styles.typeButtonActive,
              ]}
              onPress={() => setFormData({ ...formData, type: 'gold' })}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  formData.type === 'gold' && styles.typeButtonTextActive,
                ]}
              >
                Gold
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                formData.type === 'silver' && styles.typeButtonActive,
              ]}
              onPress={() => setFormData({ ...formData, type: 'silver', purity: '999' })}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  formData.type === 'silver' && styles.typeButtonTextActive,
                ]}
              >
                Silver
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {formData.type === 'gold' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Purity *</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.purityButton,
                  formData.purity === '24k' && styles.purityButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, purity: '24k' })}
              >
                <Text
                  style={[
                    styles.purityButtonText,
                    formData.purity === '24k' && styles.purityButtonTextActive,
                  ]}
                >
                  24K
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.purityButton,
                  formData.purity === '22k' && styles.purityButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, purity: '22k' })}
              >
                <Text
                  style={[
                    styles.purityButtonText,
                    formData.purity === '22k' && styles.purityButtonTextActive,
                  ]}
                >
                  22K
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.purityBadge}>
              <Text style={styles.purityPercentage}>Gold Purity: 995</Text>
            </View>
          </View>
        )}

        {formData.type === 'silver' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Purity</Text>
            <Text style={styles.purityInfo}>999 (Pure Silver)</Text>
            <View style={styles.purityBadge}>
              <Text style={styles.purityPercentage}>Silver Purity: 995</Text>
            </View>
          </View>
        )}

        {/* Purchase Mode Toggle */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Purchase Mode *</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                purchaseMode === 'quantity' && styles.modeButtonActive,
              ]}
              onPress={() => {
                setPurchaseMode('quantity');
                setFormData({ ...formData, amount: '' });
              }}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  purchaseMode === 'quantity' && styles.modeButtonTextActive,
                ]}
              >
                By Quantity
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                purchaseMode === 'amount' && styles.modeButtonActive,
              ]}
              onPress={() => {
                setPurchaseMode('amount');
                setFormData({ ...formData, quantity: '' });
              }}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  purchaseMode === 'amount' && styles.modeButtonTextActive,
                ]}
              >
                By Amount
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quantity-wise Input */}
        {purchaseMode === 'quantity' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Quantity (grams) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter quantity in grams"
              value={formData.quantity}
              onChangeText={(text) => setFormData({ ...formData, quantity: text.replace(/[^0-9.]/g, '') })}
              keyboardType="decimal-pad"
            />
            {calculatedAmount > 0 && (
              <Text style={styles.calculatedText}>
                Total Amount: {formatCurrency(calculatedAmount)}
              </Text>
            )}
          </View>
        )}

        {/* Amount-wise Input */}
        {purchaseMode === 'amount' && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Amount (₹) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount in rupees"
              value={formData.amount}
              onChangeText={(text) => setFormData({ ...formData, amount: text.replace(/[^0-9.]/g, '') })}
              keyboardType="decimal-pad"
            />
            {calculatedQuantity > 0 && (
              <Text style={styles.calculatedText}>
                You will get: {calculatedQuantity.toFixed(4)} grams
              </Text>
            )}
          </View>
        )}

        {!userKYC?.hasKYC && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>PAN Card *</Text>
              <TextInput
                style={styles.input}
                placeholder="ABCDE1234F"
                value={formData.pan}
                onChangeText={(text) => setFormData({ ...formData, pan: text.toUpperCase().slice(0, 10) })}
                maxLength={10}
                autoCapitalize="characters"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Aadhaar Card *</Text>
              <TextInput
                style={styles.input}
                placeholder="123456789012"
                value={formData.aadhaar}
                onChangeText={(text) => setFormData({ ...formData, aadhaar: text.replace(/\D/g, '').slice(0, 12) })}
                keyboardType="number-pad"
                maxLength={12}
              />
            </View>
          </>
        )}

        {((purchaseMode === 'quantity' && calculatedAmount > 0) || (purchaseMode === 'amount' && calculatedQuantity > 0)) && (
          <View style={styles.totalCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Quantity:</Text>
              <Text style={styles.totalValue}>{calculatedQuantity.toFixed(4)} grams</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalValue}>{formatCurrency(calculatedAmount)}</Text>
            </View>
          </View>
        )}

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting || isLoading}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Create Purchase</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D5BAA7',
  },
  header: {
    backgroundColor: '#681412',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  priceInfo: {
    marginTop: 8,
  },
  priceText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
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
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E79A66',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: '#681412',
    borderColor: '#681412',
  },
  typeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#681412',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  purityButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E79A66',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  purityButtonActive: {
    backgroundColor: '#681412',
    borderColor: '#681412',
  },
  purityButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#681412',
  },
  purityButtonTextActive: {
    color: '#fff',
  },
  purityInfo: {
    fontSize: 14,
    color: '#92422B',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  purityBadge: {
    backgroundColor: '#F5E6D3',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E79A66',
  },
  purityPercentage: {
    fontSize: 14,
    color: '#681412',
    fontWeight: '700',
    textAlign: 'center',
  },
  modeButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E79A66',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#681412',
    borderColor: '#681412',
  },
  modeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#681412',
  },
  modeButtonTextActive: {
    color: '#fff',
  },
  calculatedText: {
    fontSize: 14,
    color: '#92422B',
    marginTop: 8,
    fontWeight: '500',
  },
  adjustedAmountText: {
    fontSize: 12,
    color: '#92422B',
    marginTop: 4,
    fontStyle: 'italic',
  },
  totalCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: '#92422B',
    fontWeight: '500',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#681412',
  },
  submitButton: {
    backgroundColor: '#681412',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  kycWarningCard: {
    backgroundColor: '#FFF3CD',
    borderWidth: 1,
    borderColor: '#FFC107',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    marginBottom: 8,
  },
  kycWarningTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#856404',
    marginBottom: 8,
  },
  kycWarningText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
  kycPendingCard: {
    backgroundColor: '#FFF3CD',
    borderWidth: 1,
    borderColor: '#FF9800',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    marginBottom: 8,
  },
  kycPendingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#E65100',
    marginBottom: 8,
  },
  kycPendingText: {
    fontSize: 14,
    color: '#E65100',
    lineHeight: 20,
    marginBottom: 12,
  },
  requestButton: {
    backgroundColor: '#681412',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  requestButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  kycVerifiedCard: {
    backgroundColor: '#D4EDDA',
    borderWidth: 1,
    borderColor: '#28A745',
    borderRadius: 8,
    padding: 16,
    margin: 16,
    marginBottom: 8,
  },
  kycVerifiedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#155724',
    marginBottom: 8,
  },
  kycVerifiedText: {
    fontSize: 14,
    color: '#155724',
    lineHeight: 20,
  },
});

