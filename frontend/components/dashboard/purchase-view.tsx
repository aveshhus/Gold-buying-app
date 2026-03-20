'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StatCard } from '@/components/ui/stat-card';
import { PageHeader } from '@/components/ui/page-header';
import { SectionHeader } from '@/components/ui/section-header';
import { InfoCard } from '@/components/ui/info-card';
import { api } from '@/lib/api';
import { usePriceStore } from '@/store/usePriceStore';
import { formatCurrency, validatePAN, validateAadhaar } from '@/lib/utils';
import { toast } from 'sonner';
import { loadRazorpayScript, openRazorpayCheckout } from '@/lib/razorpay';
import { KYCInput } from '@/components/kyc/kyc-input';
import { RefreshCw, Info, Calculator, TrendingUp, Shield, Clock, AlertCircle, Lightbulb, CheckCircle2, Coins, ShoppingCart, Tag, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { componentStyles, decorative, animations, gradients } from '@/lib/design-system';

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
  const [totalAmount, setTotalAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [displayQuantity, setDisplayQuantity] = useState(0);
  const [displayAmount, setDisplayAmount] = useState(0);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userKYC, setUserKYC] = useState<{
    hasKYC: boolean;
    kycVerified: boolean;
    hasPAN: boolean;
    hasAadhaar: boolean;
  } | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    loadPrices();
    loadUserKYC();
    loadCoupons();
    // CRITICAL: Clear coupon state on screen load to prevent stale state
    setSelectedCoupon(null);
    setDiscountAmount(0);
    setFinalAmount(0);
    const interval = setInterval(loadPrices, 30000); // Refresh every 30s
    
    // Load Razorpay script
    loadRazorpayScript().catch((error) => {
      console.error('Failed to load Razorpay script:', error);
    });
    
    return () => clearInterval(interval);
  }, []);

  const loadCoupons = async () => {
    try {
      const response = await api.getCoupons();
      if (response.data) {
        setCoupons(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error loading coupons:', error);
    }
  };

  const loadUserKYC = async () => {
    setLoadingUser(true);
    try {
      const response = await api.getCurrentUser();
      if (response.data) {
        setUserKYC({
          hasKYC: response.data.hasKYC || false,
          kycVerified: response.data.kycVerified || false,
          hasPAN: response.data.hasPAN || false,
          hasAadhaar: response.data.hasAadhaar || false,
        });
      }
    } catch (error) {
      console.error('Error loading user KYC:', error);
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    if (purchaseMode === 'quantity') {
      calculateFromQuantity();
    } else {
      calculateFromAmount();
    }
  }, [formData.type, formData.purity, formData.quantity, formData.amount, purchaseMode, prices, selectedCoupon]);

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

  const calculateDiscount = (amount: number) => {
    if (!selectedCoupon || !formData.type) {
      setDiscountAmount(0);
      setFinalAmount(amount);
      return;
    }

    // Check if coupon applies to this purchase type
    if (selectedCoupon.applicableType !== 'both' && selectedCoupon.applicableType !== formData.type) {
      setDiscountAmount(0);
      setFinalAmount(amount);
      return;
    }

    let discount = 0;
    if (selectedCoupon.discountType === 'percentage') {
      discount = Math.round((amount * selectedCoupon.discountValue / 100) * 100) / 100;
    } else if (selectedCoupon.discountType === 'fixed') {
      discount = Math.round(selectedCoupon.discountValue * 100) / 100;
      if (discount > amount) {
        discount = amount;
      }
    }

    setDiscountAmount(discount);
    const final = Math.round((amount - discount) * 100) / 100;
    setFinalAmount(final < 0 ? 0 : final);
    setDisplayAmount(final < 0 ? 0 : final);
  };

  const calculateFromQuantity = () => {
    // For silver, automatically set purity to '999'
    const purity = formData.type === 'silver' ? '999' : formData.purity;

    if (!prices || !formData.type || !purity || !formData.quantity) {
      setCalculatedAmount(0);
      setTotalAmount(0);
      setDiscountAmount(0);
      setFinalAmount(0);
      return;
    }

    const quantity = parseFloat(formData.quantity) || 0;
    let pricePerGram = 0;

    if (formData.type === 'gold') {
      pricePerGram = purity === '24k' ? prices.gold24k : prices.gold22k;
    } else if (formData.type === 'silver') {
      pricePerGram = prices.silver;
    }

    if (pricePerGram <= 0) {
      setCalculatedAmount(0);
      setTotalAmount(0);
      setDiscountAmount(0);
      setFinalAmount(0);
      return;
    }

    const amount = Math.round(pricePerGram * quantity * 100) / 100;

    if (!isFinite(amount)) {
      setCalculatedAmount(0);
      setTotalAmount(0);
      setDiscountAmount(0);
      setFinalAmount(0);
      return;
    }

    setCalculatedQuantity(quantity);
    setCalculatedAmount(amount);
    setTotalAmount(amount);
    setDisplayQuantity(quantity);
    calculateDiscount(amount);
  };

  const calculateFromAmount = () => {
    // For silver, automatically set purity to '999'
    const purity = formData.type === 'silver' ? '999' : formData.purity;

    if (!prices || !formData.type || !purity || !formData.amount) {
      setCalculatedQuantity(0);
      setCalculatedAmount(0);
      setTotalAmount(0);
      setDiscountAmount(0);
      setFinalAmount(0);
      setDisplayQuantity(0);
      setDisplayAmount(0);
      return;
    }

    const enteredAmount = parseFloat(formData.amount) || 0;
    let pricePerGram = 0;

    if (formData.type === 'gold') {
      pricePerGram = purity === '24k' ? prices.gold24k : prices.gold22k;
    } else if (formData.type === 'silver') {
      pricePerGram = prices.silver;
    }

    if (pricePerGram <= 0) {
      setCalculatedQuantity(0);
      setCalculatedAmount(0);
      setTotalAmount(0);
      setDiscountAmount(0);
      setFinalAmount(0);
      return;
    }

    // Calculate quantity from entered amount (use more precision initially)
    const quantity = enteredAmount / pricePerGram;

    // Round quantity to 2 decimal places (matching backend precision)
    const roundedQuantity = Math.round(quantity * 100) / 100;

    // Recalculate amount from rounded quantity to match backend calculation exactly
    const recalculatedAmount = Math.round(pricePerGram * roundedQuantity * 100) / 100;

    if (!isFinite(roundedQuantity) || !isFinite(recalculatedAmount)) {
      setCalculatedQuantity(0);
      setCalculatedAmount(0);
      setTotalAmount(0);
      setDiscountAmount(0);
      setFinalAmount(0);
      return;
    }

    setCalculatedQuantity(roundedQuantity);
    setCalculatedAmount(recalculatedAmount);
    setTotalAmount(recalculatedAmount);
    setDisplayQuantity(roundedQuantity);
    calculateDiscount(recalculatedAmount);
  };

  const handleApplyCoupon = (coupon: any) => {
    setSelectedCoupon(coupon);
  };

  const handleRemoveCoupon = () => {
    setSelectedCoupon(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only validate KYC if user doesn't have stored KYC
    if (!userKYC?.hasKYC) {
      if (!validatePAN(formData.pan)) {
        toast.error('Please enter a valid PAN card number');
        return;
      }

      if (!validateAadhaar(formData.aadhaar)) {
        toast.error('Please enter a valid Aadhaar card number');
        return;
      }
    }

    // ORDER VALIDATION RULES - Frontend validation before submission
    if (!prices) {
      toast.error('Price data not available. Please wait a moment and try again.');
      return;
    }

    // Validate based on purchase mode
    if (purchaseMode === 'quantity') {
      if (!formData.type || !formData.purity || !formData.quantity) {
        toast.error('Please fill all required fields');
        return;
      }
    } else {
      if (!formData.type || !formData.purity || !formData.amount) {
        toast.error('Please fill all required fields');
        return;
      }
    }

    // Calculate final values for validation
    let finalQuantity: number;
    let finalAmountForValidation: number;

    if (purchaseMode === 'quantity') {
      finalQuantity = parseFloat(formData.quantity) || 0;
      finalAmountForValidation = finalAmount || calculatedAmount || totalAmount;
    } else {
      finalQuantity = calculatedQuantity;
      finalAmountForValidation = finalAmount || calculatedAmount || totalAmount;
    }

    // Rule 1: Minimum Quantity Rules
    if (formData.type === 'gold' && finalQuantity < 0.15) {
      toast.error(
        `❌ Order Not Placed: Minimum Quantity Not Met`,
        {
          description: `For Gold purchases, the minimum quantity is 0.15 grams. Your current order is ${finalQuantity.toFixed(2)} grams. Please increase your quantity to at least 0.15 grams to proceed with the purchase.`,
          duration: 6000,
        }
      );
      return;
    }

    if (formData.type === 'silver' && finalQuantity < 10) {
      toast.error(
        `❌ Order Not Placed: Minimum Quantity Not Met`,
        {
          description: `For Silver purchases, the minimum quantity is 10 grams. Your current order is ${finalQuantity.toFixed(2)} grams. Please increase your quantity to at least 10 grams to proceed with the purchase.`,
          duration: 6000,
        }
      );
      return;
    }

    // Rule 2: Minimum Order Value - ₹2000 (check final amount after discount)
    if (finalAmountForValidation < 2000) {
      toast.error(
        `❌ Order Not Placed: Minimum Order Value Not Met`,
        {
          description: `The minimum order value is ₹2,000. Your current order amount is ₹${finalAmountForValidation.toFixed(2)}. Please increase your order amount to at least ₹2,000 to proceed with the purchase. Orders below ₹2,000 will be automatically rejected.`,
          duration: 6000,
        }
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // For silver, automatically set purity to '999'
      const finalPurity = formData.type === 'silver' ? '999' : formData.purity;

      // Get correct price per gram from prices (not calculated from total)
      let pricePerGram = 0;
      if (formData.type === 'gold') {
        pricePerGram = finalPurity === '24k' ? prices.gold24k : prices.gold22k;
      } else if (formData.type === 'silver') {
        pricePerGram = prices.silver;
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

      // Purchase data - PAN/Aadhaar are optional if user has stored KYC
      const purchaseData: any = {
        type: formData.type,
        purity: finalPurity,
        quantity: finalQuantity,
        pricePerGram: roundedPricePerGram, // Round to 2 decimal places for precision
        totalAmount: finalAmount, // Original amount before discount
      };

      // CRITICAL: Only add coupon code if a valid coupon is explicitly selected
      // Double-check selectedCoupon state before submission
      const validCouponCode = selectedCoupon && 
                               selectedCoupon.code && 
                               typeof selectedCoupon.code === 'string' && 
                               selectedCoupon.code.trim().length > 0 
                               ? selectedCoupon.code.trim() 
                               : null;

      // Only include couponCode in request if we have a valid code
      if (validCouponCode) {
        purchaseData.couponCode = validCouponCode;
      }
      // Explicitly DO NOT include couponCode if null/undefined/empty

      // Only include PAN/Aadhaar if user doesn't have stored KYC
      // If user has stored KYC, backend will use it automatically
      if (!userKYC?.hasKYC) {
        purchaseData.pan = formData.pan.toUpperCase();
        purchaseData.aadhaar = formData.aadhaar;
      }

      console.log('[FRONTEND] Purchase data being sent:', {
        ...purchaseData,
        pan: purchaseData.pan ? '***' : undefined,
        aadhaar: purchaseData.aadhaar ? '***' : undefined
      });
      
      const response = await api.createPurchase(purchaseData);

      if (response.error) {
        // Log backend error response for debugging
        console.error('[FRONTEND] Purchase failed - Backend error:', {
          error: response.error,
          validationError: (response as any).validationError,
          details: (response as any).details
        });
        
        // Show detailed error message with description
        const errorResponse = response as any;
        if (errorResponse.validationError) {
          // Show enhanced error message for validation errors
          toast.error(
            response.error || 'Order Not Placed',
            {
              description: errorResponse.message || 'Your order does not meet the minimum requirements. Please check the requirements and try again.',
              duration: 6000,
            }
          );
        } else {
          // Show standard error message
          toast.error(response.error || 'Purchase creation failed. Please try again.', {
            duration: 5000,
          });
        }
        
        // CRITICAL: Clear coupon state on purchase failure
        setSelectedCoupon(null);
        setDiscountAmount(0);
        setFinalAmount(0);
        return;
      }

      // Purchase created successfully - proceed with payment
      const purchaseResponse = response.data;
      const paymentId = purchaseResponse?.payment?.id;
      const paymentAmount = purchaseResponse?.payment?.amount || finalAmount;

      if (!paymentId) {
        toast.error('Payment ID not found. Please contact support.');
        return;
      }

      // Create Razorpay order
      try {
        const orderResponse = await api.createRazorpayOrder(paymentId, paymentAmount);
        
        if (orderResponse.error) {
          toast.error(orderResponse.error || 'Failed to create payment order');
          return;
        }

        const orderData = orderResponse.data!;
        
        // Get user info for prefill
        const userResponse = await api.getCurrentUser();
        const user = userResponse.data;

        // Open Razorpay checkout
        openRazorpayCheckout({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Gold & Silver App',
          description: `Payment for ${formData.type} purchase`,
          order_id: orderData.orderId,
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: user?.phone || '',
          },
          handler: async (razorpayResponse) => {
            // Verify payment
            try {
              const verifyResponse = await api.verifyRazorpayPayment(
                paymentId,
                razorpayResponse.razorpay_order_id,
                razorpayResponse.razorpay_payment_id,
                razorpayResponse.razorpay_signature
              );

              if (verifyResponse.error) {
                toast.error(verifyResponse.error || 'Payment verification failed');
                return;
              }

              toast.success('Payment successful! Your order has been confirmed.');
              
              // Reset form
              setFormData({
                type: '',
                purity: '',
                quantity: '',
                amount: '',
                pan: '',
                aadhaar: '',
              });
              setCalculatedQuantity(0);
              setCalculatedAmount(0);
              setTotalAmount(0);
              setDiscountAmount(0);
              setFinalAmount(0);
              setSelectedCoupon(null);
              await loadCoupons();
              await loadUserKYC();
            } catch (error) {
              console.error('Payment verification error:', error);
              toast.error('Payment verification failed. Please contact support.');
            }
          },
          modal: {
            ondismiss: () => {
              toast.info('Payment cancelled');
            },
          },
        });
      } catch (error) {
        console.error('Razorpay order creation error:', error);
        toast.error('Failed to initialize payment. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-10">
      <PageHeader
        title="Buy Gold & Silver"
        description="Purchase gold (22K/24K) or silver at live market prices. Secure, transparent, and trusted."
        badge={{
          label: 'Live Prices',
          value: prices ? 'Updated' : 'Loading...',
          icon: Coins,
        }}
      />

      {/* Quick Buying Guide */}
      <InfoCard
        title="Quick Buying Guide"
        icon={Lightbulb}
        items={[
          { text: 'Select metal type (Gold 24K/22K or Silver)' },
          { text: 'Choose purchase mode: Buy by Quantity (grams) or Buy by Amount (₹)' },
          { text: 'Enter quantity in grams or amount in ₹ based on your selection' },
          { text: 'Complete KYC verification (PAN & Aadhaar)' },
          { text: 'Review total and proceed to payment' },
        ]}
        delay={0.1}
        hoverDirection="left"
      />

      {/* Live Prices */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <SectionHeader title="Live Market Prices" />
          <Button
            variant="outline"
            size="sm"
            onClick={loadPrices}
            disabled={isLoading}
            className="bg-white/80 hover:bg-white border-[#92422B]/20 text-[#681412] min-h-[44px] touch-manipulation"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh Prices
          </Button>
        </div>
        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {prices && (
            <>
              <StatCard
                title="24K Gold"
                value={formatCurrency(prices.gold24k)}
                description="per gram"
                icon={Coins}
                index={0}
              />
              <StatCard
                title="22K Gold"
                value={formatCurrency(prices.gold22k)}
                description="per gram"
                icon={Coins}
                index={1}
              />
              <StatCard
                title="Silver"
                value={formatCurrency(prices.silver)}
                description="per gram"
                icon={Coins}
                index={2}
              />
            </>
          )}
        </div>
      </div>

      {/* Available Offers Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="h-1 w-8 sm:w-12 bg-gradient-to-r from-[#681412] to-[#92422B] rounded-full"></div>
            <h3 className="text-lg sm:text-xl font-bold text-[#681412] tracking-tight">🎁 Available Offers</h3>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-[#92422B]/30 via-[#92422B]/15 to-transparent hidden sm:block"></div>
          <Badge className="bg-gradient-to-r from-[#681412] to-[#92422B] text-white border-0 px-3 sm:px-4 py-1.5 text-xs font-semibold shadow-md self-start sm:self-auto">
            {coupons.length} Offers
          </Badge>
        </div>
        {coupons.length === 0 ? (
          <Card className="border border-[#92422B]/20 shadow-lg bg-white/60 backdrop-blur-sm mb-6">
            <CardContent className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#92422B]/20 to-[#681412]/20 mb-4">
                <Tag className="h-8 w-8 text-[#92422B]" />
              </div>
              <p className="text-gray-600 text-sm">No offers available. Check back later for special offers from admin.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            {coupons.map((coupon, index) => {
              const isExpired = coupon.expiryDate && new Date(coupon.expiryDate) < new Date();
              const isUsedUp = coupon.maxUses && coupon.usedCount >= coupon.maxUses;
              const isAvailable = !isExpired && !isUsedUp && coupon.isActive;

              return (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`border-2 shadow-lg transition-all cursor-pointer ${
                      isAvailable 
                        ? selectedCoupon?.id === coupon.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-[#E79A66] bg-gradient-to-br from-white to-[#F5E6D3]/30 hover:shadow-xl'
                        : 'border-gray-300 bg-gray-50 opacity-60 cursor-not-allowed'
                    }`}
                    onClick={() => {
                      if (isAvailable && (!selectedCoupon || selectedCoupon.id !== coupon.id)) {
                        handleApplyCoupon(coupon);
                        toast.success(`Coupon ${coupon.code} applied!`);
                      } else if (selectedCoupon?.id === coupon.id) {
                        handleRemoveCoupon();
                        toast.info('Coupon removed');
                      }
                    }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <code className="text-lg font-bold text-[#681412] font-mono">
                              {coupon.code}
                            </code>
                            {!isAvailable && (
                              <Badge variant="destructive" className="text-xs">
                                {isExpired ? 'Expired' : isUsedUp ? 'Used Up' : 'Inactive'}
                              </Badge>
                            )}
                            {selectedCoupon?.id === coupon.id && (
                              <Badge className="bg-green-600 text-white text-xs">
                                Applied ✓
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-2xl font-bold text-[#16A34A]">
                            {coupon.discountType === 'percentage'
                              ? `${coupon.discountValue}% OFF`
                              : `₹${coupon.discountValue} OFF`}
                          </CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 mb-4">{coupon.description}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Tag className="h-3 w-3" />
                          <span>Applicable: {coupon.applicableType === 'both' ? 'Gold & Silver' : coupon.applicableType}</span>
                        </div>
                        {coupon.maxUses && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Info className="h-3 w-3" />
                            <span>Uses: {coupon.usedCount} / {coupon.maxUses}</span>
                          </div>
                        )}
                        {coupon.expiryDate && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>Expires: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      {isAvailable && (
                        <div className={`border rounded-lg p-3 mt-4 ${
                          selectedCoupon?.id === coupon.id
                            ? 'bg-green-100 border-green-300'
                            : 'bg-green-50 border-green-200'
                        }`}>
                          <p className={`text-xs font-semibold text-center ${
                            selectedCoupon?.id === coupon.id ? 'text-green-900' : 'text-green-800'
                          }`}>
                            {selectedCoupon?.id === coupon.id
                              ? '✅ Applied - Click to remove'
                              : 'Click to apply this offer'}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Purchase Form */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <SectionHeader title="New Purchase" />
          <Badge className="bg-gradient-to-r from-[#681412] to-[#92422B] text-white border-0 px-4 py-1.5 text-xs font-semibold shadow-md flex items-center gap-1.5">
            <Shield className="h-3 w-3" />
            Secure Transaction
          </Badge>
        </div>
        <Card className="border border-[#92422B]/20 shadow-lg mobile-card-shadow-lg bg-white/60 backdrop-blur-sm overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <CardHeader className={`${componentStyles.table.header} px-4 sm:px-6 pt-4 sm:pt-6`}>
            <CardTitle className={`${componentStyles.table.headerTitle} text-sm sm:text-base`}>
              <div className="h-1 w-6 bg-gradient-to-r from-[#681412] to-[#92422B] rounded-full"></div>
              Fill in the details below to create a new purchase order
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6 pb-4 sm:pb-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-semibold text-[#681412]">
                  Type
                </label>
                <select
                  id="type"
                  className="flex h-12 sm:h-10 w-full rounded-lg border-2 border-input bg-background px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#681412] focus-visible:border-[#681412] transition-all touch-manipulation"
                  value={formData.type}
                  onChange={(e) => {
                    setFormData({ ...formData, type: e.target.value, purity: '' });
                  }}
                  required
                >
                  <option value="">Select Type</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="purity" className="text-sm font-semibold text-[#681412]">
                  Purity
                </label>
                <select
                  id="purity"
                  className="flex h-12 sm:h-10 w-full rounded-lg border-2 border-input bg-background px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#681412] focus-visible:border-[#681412] transition-all touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                  value={formData.purity}
                  onChange={(e) =>
                    setFormData({ ...formData, purity: e.target.value })
                  }
                  required
                  disabled={!formData.type}
                >
                  <option value="">Select Purity</option>
                  {formData.type === 'gold' && (
                    <>
                      <option value="24k">24k(995)</option>
                      <option value="22k">22k(916)</option>
                    </>
                  )}
                  {formData.type === 'silver' && (
                    <option value="999">995</option>
                  )}
                </select>
                {/* Purity Badge Display */}
                {formData.type === 'gold' && formData.purity && (
                  <div className="bg-[#F5E6D3] border border-[#E79A66] rounded-lg px-4 py-2 mt-2">
                    <p className="text-sm font-bold text-[#681412] text-center">
                      {formData.purity === '24k' ? '24k(995)' : formData.purity === '22k' ? '22k(916)' : 'Gold Purity: 995'}
                    </p>
                  </div>
                )}
                {formData.type === 'silver' && formData.purity && (
                  <div className="bg-[#F5E6D3] border border-[#E79A66] rounded-lg px-4 py-2 mt-2">
                    <p className="text-sm font-bold text-[#681412] text-center">
                      Silver Purity: 995
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Purchase Mode Toggle */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#681412]">
                Purchase Mode
              </label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={purchaseMode === 'quantity' ? 'default' : 'outline'}
                  onClick={() => {
                    setPurchaseMode('quantity');
                    setFormData({ ...formData, amount: '' });
                  }}
                  className={`flex-1 h-12 sm:h-10 ${
                    purchaseMode === 'quantity'
                      ? 'bg-gradient-to-r from-[#681412] to-[#92422B] text-white border-0'
                      : 'bg-white border-2 border-[#92422B]/30 text-[#681412] hover:bg-[#F5E6D3]'
                  }`}
                >
                  Buy by Quantity
                </Button>
                <Button
                  type="button"
                  variant={purchaseMode === 'amount' ? 'default' : 'outline'}
                  onClick={() => {
                    setPurchaseMode('amount');
                    setFormData({ ...formData, quantity: '' });
                  }}
                  className={`flex-1 h-12 sm:h-10 ${
                    purchaseMode === 'amount'
                      ? 'bg-gradient-to-r from-[#681412] to-[#92422B] text-white border-0'
                      : 'bg-white border-2 border-[#92422B]/30 text-[#681412] hover:bg-[#F5E6D3]'
                  }`}
                >
                  Buy by Amount
                </Button>
              </div>
            </div>

            {/* Quantity Input (shown when purchaseMode is 'quantity') */}
            {purchaseMode === 'quantity' && (
              <div className="space-y-2">
                <label htmlFor="quantity" className="text-sm font-semibold text-[#681412]">
                  Quantity (grams)
                </label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  required
                  className="h-12 sm:h-10 text-base sm:text-sm border-2 focus-visible:border-[#681412] focus-visible:ring-2 focus-visible:ring-[#681412] rounded-lg px-4"
                />
                {calculatedAmount > 0 && (
                  <p className="text-xs text-gray-600">
                    Amount: {formatCurrency(calculatedAmount)}
                  </p>
                )}
              </div>
            )}

            {/* Amount Input (shown when purchaseMode is 'amount') */}
            {purchaseMode === 'amount' && (
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-semibold text-[#681412]">
                  Amount (₹)
                </label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                  className="h-12 sm:h-10 text-base sm:text-sm border-2 focus-visible:border-[#681412] focus-visible:ring-2 focus-visible:ring-[#681412] rounded-lg px-4"
                />
                {calculatedQuantity > 0 && (
                  <p className="text-xs text-gray-600">
                    Quantity: {calculatedQuantity.toFixed(2)} grams
                  </p>
                )}
              </div>
            )}

            {/* Applied Coupon Display */}
            {selectedCoupon && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#681412]">Applied Offer</label>
                <Card className="p-3 bg-green-50 border-2 border-green-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-green-900">{selectedCoupon.code}</div>
                      <div className="text-sm text-green-700">{selectedCoupon.description}</div>
                      <div className="text-xs text-green-600 mt-1">
                        You'll save {selectedCoupon.discountType === 'percentage' 
                          ? `${selectedCoupon.discountValue}%`
                          : `₹${selectedCoupon.discountValue}`} on this purchase
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleRemoveCoupon} className="text-red-600 border-red-300">
                      Remove
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#681412]">Amount Details</label>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(totalAmount)}</span>
                </div>
                {discountAmount > 0 && (
                  <>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({selectedCoupon?.code}):</span>
                      <span className="font-medium">-{formatCurrency(discountAmount)}</span>
                    </div>
                    <div className="border-t pt-1 mt-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-semibold text-[#681412]">Total Amount:</span>
                        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#681412] to-[#92422B] bg-clip-text text-transparent">
                          {formatCurrency(finalAmount)}
                        </span>
                      </div>
                    </div>
                  </>
                )}
                {discountAmount === 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm font-semibold text-[#681412]">Total Amount:</span>
                    <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#681412] to-[#92422B] bg-clip-text text-transparent">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                )}
              </div>
              {totalAmount > 0 && discountAmount === 0 && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                  <Info className="h-3.5 w-3.5 sm:h-3 sm:w-3" />
                  <span>Includes all applicable charges</span>
                </div>
              )}
            </div>

            {/* Price Breakdown - Show when form is filled */}
            {formData.type && formData.purity && formData.quantity && totalAmount > 0 && (
              <Card className={`${componentStyles.statCard.base} ${componentStyles.statCard.hover}`}>
                <div className={decorative.overlayHover}></div>
                <div className={decorative.circleLarge}></div>
                <div className={decorative.circleSmall}></div>
                <CardContent className="pt-6 relative z-10">
                  <div className="flex items-start gap-4">
                    <div className={componentStyles.statCard.iconContainer}>
                      <Calculator className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-3 text-white">Price Breakdown</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs sm:text-sm text-white/80">Price per gram</p>
                          <p className="text-base sm:text-lg font-semibold text-white">
                            {prices && formData.type && formData.purity
                              ? formatCurrency(
                                  formData.type === 'gold'
                                    ? formData.purity === '24k'
                                      ? prices.gold24k
                                      : prices.gold22k
                                    : prices.silver
                                )
                              : '--'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-white/80">Quantity</p>
                          <p className="text-base sm:text-lg font-semibold text-white">
                            {purchaseMode === 'quantity' 
                              ? (formData.quantity || '0') 
                              : calculatedQuantity.toFixed(2)} g
                          </p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-white/80">Total Amount</p>
                          <p className="text-xl sm:text-2xl font-bold text-white">{formatCurrency(totalAmount)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Minimum Requirements Warning */}
            {formData.type && formData.purity && (
              <Card className="border-2 border-yellow-500 bg-yellow-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-yellow-900 mb-2">Minimum Order Requirements</h4>
                      <div className="space-y-2 text-sm text-yellow-800">
                        <div className="flex items-start gap-2">
                          <span className="font-semibold">• Minimum Order Value:</span>
                          <span>₹2,000 or more (orders below ₹2,000 will be automatically rejected)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="font-semibold">• Minimum Quantity:</span>
                          <span>
                            {formData.type === 'gold' 
                              ? '0.15 grams for Gold'
                              : '10 grams for Silver'}
                          </span>
                        </div>
                        {totalAmount > 0 && (
                          <div className="mt-3 pt-3 border-t border-yellow-300">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">Your Order:</span>
                              <div className="text-right">
                                <div className={displayAmount < 2000 ? 'text-red-600 font-bold' : 'text-green-700 font-semibold'}>
                                  Amount: {formatCurrency(displayAmount)}
                                  {displayAmount < 2000 && ' ⚠️ Below Minimum'}
                                </div>
                                <div className={formData.type === 'gold' && displayQuantity < 0.15 || formData.type === 'silver' && displayQuantity < 10 ? 'text-red-600 font-bold' : 'text-green-700 font-semibold'}>
                                  Quantity: {displayQuantity.toFixed(2)}g
                                  {(formData.type === 'gold' && displayQuantity < 0.15) || (formData.type === 'silver' && displayQuantity < 10) ? ' ⚠️ Below Minimum' : ''}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Purchase Benefits */}
            {totalAmount > 0 && (
              <InfoCard
                title="Why Invest Now?"
                icon={TrendingUp}
                items={[
                  { text: 'Live market prices - no hidden charges' },
                  { text: '99.9% purity guaranteed with certification' },
                  { text: 'Secure storage or physical delivery options' },
                  { text: 'KYC verified platform - fully compliant' },
                ]}
                delay={0.3}
                hoverDirection="right"
              />
            )}

            {/* KYC Input - Only show if user doesn't have stored KYC */}
            {loadingUser ? (
              <div className="text-center py-4 text-muted-foreground">
                Loading KYC status...
              </div>
            ) : userKYC?.hasKYC ? (
              <Card className={userKYC.kycVerified ? "bg-green-50 border-green-200" : "bg-blue-50 border-blue-200"}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className={`h-5 w-5 ${userKYC.kycVerified ? 'text-green-600' : 'text-blue-600'}`} />
                    <div>
                      <p className={`font-medium ${userKYC.kycVerified ? 'text-green-900' : 'text-blue-900'}`}>
                        {userKYC.kycVerified ? 'KYC Verified' : 'KYC On File'}
                      </p>
                      <p className={`text-sm ${userKYC.kycVerified ? 'text-green-700' : 'text-blue-700'}`}>
                        {userKYC.kycVerified 
                          ? 'Your KYC documents are verified. You can proceed with the purchase.'
                          : 'Your KYC documents are on file and will be used for this purchase. Admin verification is pending.'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-900">
                        KYC Verification Required
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Please provide your PAN and Aadhaar card numbers to proceed with the purchase. 
                        These will be saved to your profile for future purchases.
                      </p>
                    </div>
                  </div>
                </div>
                <KYCInput
                  pan={formData.pan}
                  aadhaar={formData.aadhaar}
                  onPanChange={(pan) => setFormData({ ...formData, pan })}
                  onAadhaarChange={(aadhaar) =>
                    setFormData({ ...formData, aadhaar })
                  }
                  disabled={isSubmitting}
                />
              </div>
            )}

             <Button
               type="submit"
               className={`w-full ${gradients.button} ${gradients.buttonHover} text-white shadow-lg min-h-[48px] touch-manipulation`}
               disabled={isSubmitting || totalAmount === 0}
             >
               {isSubmitting ? 'Creating Purchase...' : `Create Purchase${discountAmount > 0 ? ` - ${formatCurrency(finalAmount)}` : ''}`}
             </Button>
          </form>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}
