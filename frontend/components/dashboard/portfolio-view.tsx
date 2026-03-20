'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Purchase, RefundRequest } from '@/types';
import { Info, Lightbulb, TrendingUp as TrendingUpIcon, DollarSign, Package, Award, ArrowUpRight, Coins, Gem, CircleDollarSign, Sparkles, Trophy, Wallet, RotateCcw, AlertCircle, Clock, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function PortfolioView() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [refundCalculation, setRefundCalculation] = useState<any>(null);
  const [loadingRefundCalc, setLoadingRefundCalc] = useState(false);
  const [submittingRefund, setSubmittingRefund] = useState(false);
  const [supportChannel, setSupportChannel] = useState('');
  const [supportReference, setSupportReference] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Load purchases and refund requests in parallel
      const [purchasesResponse, refundsResponse] = await Promise.all([
        api.getPurchases(),
        api.getRefunds()
      ]);
      
      console.log('Portfolio API Response:', purchasesResponse);
      
      if (purchasesResponse.error) {
        console.error('Portfolio API Error:', purchasesResponse.error);
        setPurchases([]);
      } else if (purchasesResponse.data) {
        console.log('Setting purchases:', purchasesResponse.data);
        setPurchases(Array.isArray(purchasesResponse.data) ? purchasesResponse.data : []);
      } else {
        console.warn('No data in response, setting empty array');
        setPurchases([]);
      }

      // Load refund requests
      if (refundsResponse.error) {
        console.error('Refunds API Error:', refundsResponse.error);
        setRefundRequests([]);
      } else if (refundsResponse.data) {
        // Handle array responses
        const refundsData = Array.isArray(refundsResponse.data) 
          ? refundsResponse.data 
          : [];
        setRefundRequests(refundsData);
      } else {
        setRefundRequests([]);
      }
    } catch (error) {
      console.error('Error loading portfolio:', error);
      setPurchases([]);
      setRefundRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Check if a purchase has a refund request
  const getRefundRequestForPurchase = (purchaseId: string): RefundRequest | undefined => {
    return refundRequests.find(r => r.purchaseId === purchaseId);
  };

  const handleRequestRefund = async (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setSupportChannel('');
    setSupportReference('');
    setRefundCalculation(null);
    setRefundDialogOpen(true);
    
    // Calculate refund eligibility and amount
    setLoadingRefundCalc(true);
    try {
      const response = await api.calculateRefund(purchase.id);
      if (response.error) {
        toast.error(response.error || 'Failed to calculate refund');
        setRefundDialogOpen(false);
        return;
      }
      if (response.data) {
        setRefundCalculation(response.data);
      }
    } catch (error: any) {
      console.error('Error calculating refund:', error);
      toast.error(error.message || 'Failed to calculate refund');
      setRefundDialogOpen(false);
    } finally {
      setLoadingRefundCalc(false);
    }
  };

  const handleSubmitRefundRequest = async () => {
    if (!selectedPurchase || !supportChannel) {
      toast.error('Please select a support channel');
      return;
    }

    setSubmittingRefund(true);
    try {
      const response = await api.submitRefundRequest(
        selectedPurchase.id,
        supportChannel,
        supportReference || undefined
      );

      // Check for error first
      if (response.error) {
        console.error('Refund request error:', response.error);
        toast.error(response.error || 'Failed to submit refund request');
        setSubmittingRefund(false);
        return;
      }

      // Success - response.data contains the backend response
      console.log('Refund request success response:', response);
      
      if (response.data) {
        const successMessage = response.data.message || 'Refund request submitted successfully! Admin will review your request.';
        const refundAmount = response.data.refundRequest?.calculatedRefundAmount;
        
        console.log('Success message:', successMessage, 'Refund amount:', refundAmount);
        
        // Close dialog and clear state first
        setRefundDialogOpen(false);
        setSelectedPurchase(null);
        setSupportChannel('');
        setSupportReference('');
        setRefundCalculation(null);
        
        // Show success message after dialog closes (use double requestAnimationFrame to ensure dialog is fully closed)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            console.log('Showing success toast:', successMessage);
            toast.success(successMessage, {
              description: refundAmount 
                ? `Refund amount: ${formatCurrency(refundAmount)}. Your request is now under review.`
                : 'Your request is now under review. You can track its status in your portfolio.',
              duration: 5000,
            });
          });
        });
        
        // Reload data to show updated refund request status (in background)
        loadData().catch(err => {
          console.error('Error reloading data:', err);
        });
      } else {
        // Fallback: if no error and no data, still treat as success
        console.warn('Unexpected response format:', response);
        
        // Close dialog and clear state first
        setRefundDialogOpen(false);
        setSelectedPurchase(null);
        setSupportChannel('');
        setSupportReference('');
        setRefundCalculation(null);
        
        // Show success message after dialog closes
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            console.log('Showing fallback success toast');
            toast.success('Refund request submitted successfully!', {
              description: 'Admin will review your request. You can track its status in your portfolio.',
              duration: 5000,
            });
          });
        });
        
        // Reload data in background
        loadData().catch(err => {
          console.error('Error reloading data:', err);
        });
      }
    } catch (error: any) {
      console.error('Error submitting refund request:', error);
      toast.error(
        error.message || 'Failed to submit refund request. Please try again.',
        {
          duration: 5000,
        }
      );
    } finally {
      setSubmittingRefund(false);
    }
  };

  // Calculate totals - ALL purchases (digital gold)
  const allGoldPurchases = purchases.filter((p) => p.type === 'gold');
  const allSilverPurchases = purchases.filter((p) => p.type === 'silver');
  
  // Total quantity purchased (all statuses)
  const totalGoldPurchased = allGoldPurchases.reduce((sum, p) => sum + p.quantity, 0);
  const totalSilverPurchased = allSilverPurchases.reduce((sum, p) => sum + p.quantity, 0);
  const totalQuantityPurchased = totalGoldPurchased + totalSilverPurchased;

  // Total amount paid (only paid/delivered purchases)
  const paidPurchases = purchases.filter((p) => p.status === 'paid' || p.status === 'delivered');
  const totalAmountPaid = paidPurchases.reduce((sum, p) => sum + p.totalAmount, 0);

  // Total delivered quantity (only delivered purchases)
  const deliveredPurchases = purchases.filter((p) => p.status === 'delivered');
  const totalDeliveredGold = deliveredPurchases
    .filter((p) => p.type === 'gold')
    .reduce((sum, p) => sum + p.quantity, 0);
  const totalDeliveredSilver = deliveredPurchases
    .filter((p) => p.type === 'silver')
    .reduce((sum, p) => sum + p.quantity, 0);
  const totalDeliveredQuantity = totalDeliveredGold + totalDeliveredSilver;

  // Breakdown by purity
  const gold24kPurchased = allGoldPurchases
    .filter((p) => p.purity === '24k')
    .reduce((sum, p) => sum + p.quantity, 0);
  const gold22kPurchased = allGoldPurchases
    .filter((p) => p.purity === '22k')
    .reduce((sum, p) => sum + p.quantity, 0);
  
  const gold24kDelivered = deliveredPurchases
    .filter((p) => p.type === 'gold' && p.purity === '24k')
    .reduce((sum, p) => sum + p.quantity, 0);
  const gold22kDelivered = deliveredPurchases
    .filter((p) => p.type === 'gold' && p.purity === '22k')
    .reduce((sum, p) => sum + p.quantity, 0);
  const silverDelivered = totalDeliveredSilver;

  const portfolioCards = [
    {
      title: '24K Gold Purchased',
      quantity: gold24kPurchased,
      delivered: gold24kDelivered,
      icon: Coins,
    },
    {
      title: '22K Gold Purchased',
      quantity: gold22kPurchased,
      delivered: gold22kDelivered,
      icon: Coins,
    },
    {
      title: 'Silver Purchased',
      quantity: totalSilverPurchased,
      delivered: silverDelivered,
      icon: Coins,
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 pb-4 sm:pb-6 border-b-2 border-[#92422B]/20">
        <div className="flex-1">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="h-2 w-2 rounded-full bg-[#681412] animate-pulse flex-shrink-0"></div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-[#681412] to-[#92422B] bg-clip-text text-transparent">
              Your Gold & Silver Holdings
            </h2>
          </div>
          <p className="text-gray-700 text-sm sm:text-base font-medium ml-4 sm:ml-5">
            Track your digital gold & silver investments, payments, and deliveries
          </p>
        </div>
        <motion.div 
          className="hidden lg:flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-[#681412] to-[#92422B] rounded-xl text-white shadow-xl flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="p-1.5 bg-white/20 rounded-lg flex-shrink-0">
            <Package className="h-4 w-4" />
          </div>
          <div className="min-w-[100px]">
            <p className="text-xs text-white/80 font-medium leading-tight">Total Purchases</p>
            <p className="text-lg font-bold leading-tight mt-0.5">{purchases.length}</p>
          </div>
        </motion.div>
      </div>

      {/* Portfolio Summary Stats */}
      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer"
        >
          <Card className="bg-gradient-to-br from-[#92422B] via-[#7a1a18] to-[#92422B] text-white border-0 shadow-xl mobile-card-shadow-lg hover:shadow-[0_25px_60px_rgba(104,20,18,0.5)] transition-all duration-300 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-white/5 rounded-full -mr-16 sm:-mr-20 -mt-16 sm:-mt-20 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-full -ml-12 sm:-ml-16 -mb-12 sm:-mb-16"></div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse"></div>
            </div>
            <CardHeader className="pb-3 relative z-10 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="text-[10px] sm:text-xs font-semibold text-white/90 flex items-center gap-2 sm:gap-2.5 uppercase tracking-wider">
                <div className="p-1.5 sm:p-2 bg-white/15 rounded-lg backdrop-blur-sm shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                Total Gold Purchased
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 px-4 sm:px-6 pb-4 sm:pb-6">
              <motion.div 
                className="text-xl sm:text-2xl font-bold text-white mb-1.5 tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {totalGoldPurchased.toFixed(4)} g
              </motion.div>
              <p className="text-[10px] sm:text-xs text-white/80 font-medium">Digital gold (all purchases)</p>
              <div className="mt-2 pt-2 border-t border-white/10">
                <p className="text-[9px] sm:text-[10px] text-white/70 uppercase tracking-wider">All Status</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer"
        >
          <Card className="bg-gradient-to-br from-[#92422B] via-[#7a1a18] to-[#92422B] text-white border-0 shadow-xl mobile-card-shadow-lg hover:shadow-[0_25px_60px_rgba(104,20,18,0.5)] transition-all duration-300 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-white/5 rounded-full -mr-16 sm:-mr-20 -mt-16 sm:-mt-20 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-full -ml-12 sm:-ml-16 -mb-12 sm:-mb-16"></div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse"></div>
            </div>
            <CardHeader className="pb-3 relative z-10 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="text-[10px] sm:text-xs font-semibold text-white/90 flex items-center gap-2 sm:gap-2.5 uppercase tracking-wider">
                <div className="p-1.5 sm:p-2 bg-white/15 rounded-lg backdrop-blur-sm shadow-md group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                Total Amount Paid
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 px-4 sm:px-6 pb-4 sm:pb-6">
              <motion.div 
                className="text-xl sm:text-2xl font-bold text-white mb-1.5 tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {formatCurrency(totalAmountPaid)}
              </motion.div>
              <p className="text-[10px] sm:text-xs text-white/80 font-medium">Paid & delivered purchases</p>
              <div className="mt-2 pt-2 border-t border-white/10">
                <p className="text-[9px] sm:text-[10px] text-white/70 uppercase tracking-wider">{paidPurchases.length} Transactions</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer"
        >
          <Card className="bg-gradient-to-br from-[#92422B] via-[#7a1a18] to-[#92422B] text-white border-0 shadow-xl mobile-card-shadow-lg hover:shadow-[0_25px_60px_rgba(104,20,18,0.5)] transition-all duration-300 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-white/5 rounded-full -mr-16 sm:-mr-20 -mt-16 sm:-mt-20 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-full -ml-12 sm:-ml-16 -mb-12 sm:-mb-16"></div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-2 h-2 rounded-full bg-green-400/80 animate-pulse"></div>
            </div>
            <CardHeader className="pb-3 relative z-10 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="text-[10px] sm:text-xs font-semibold text-white/90 flex items-center gap-2 sm:gap-2.5 uppercase tracking-wider">
                <div className="p-1.5 sm:p-2 bg-white/15 rounded-lg backdrop-blur-sm shadow-md group-hover:scale-110 transition-transform duration-300">
                  <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                Total Delivered
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 px-4 sm:px-6 pb-4 sm:pb-6">
              <motion.div 
                className="text-xl sm:text-2xl font-bold text-white mb-1.5 tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {totalDeliveredQuantity.toFixed(4)} g
              </motion.div>
              <p className="text-[10px] sm:text-xs text-white/80 font-medium">Physical delivery received</p>
              <div className="mt-2 pt-2 border-t border-white/10">
                <p className="text-[9px] sm:text-[10px] text-white/70 uppercase tracking-wider">{deliveredPurchases.length} Items</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
          whileHover={{ y: -4, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer"
        >
          <Card className="bg-gradient-to-br from-[#92422B] via-[#7a1a18] to-[#92422B] text-white border-0 shadow-xl mobile-card-shadow-lg hover:shadow-[0_25px_60px_rgba(104,20,18,0.5)] transition-all duration-300 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-white/5 rounded-full -mr-16 sm:-mr-20 -mt-16 sm:-mt-20 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-full -ml-12 sm:-ml-16 -mb-12 sm:-mb-16"></div>
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse"></div>
            </div>
            <CardHeader className="pb-3 relative z-10 px-4 sm:px-6 pt-4 sm:pt-6">
              <CardTitle className="text-[10px] sm:text-xs font-semibold text-white/90 flex items-center gap-2 sm:gap-2.5 uppercase tracking-wider">
                <div className="p-1.5 sm:p-2 bg-white/15 rounded-lg backdrop-blur-sm shadow-md group-hover:scale-110 transition-transform duration-300">
                  <TrendingUpIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
                Total Quantity
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10 px-4 sm:px-6 pb-4 sm:pb-6">
              <motion.div 
                className="text-xl sm:text-2xl font-bold text-white mb-1.5 tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {totalQuantityPurchased.toFixed(4)} g
              </motion.div>
              <p className="text-[10px] sm:text-xs text-white/80 font-medium">Gold + Silver purchased</p>
              <div className="mt-2 pt-2 border-t border-white/10">
                <p className="text-[9px] sm:text-[10px] text-white/70 uppercase tracking-wider">{purchases.length} Total Orders</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Portfolio Cards - Purchased */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="h-1 w-8 sm:w-12 bg-gradient-to-r from-[#681412] to-[#92422B] rounded-full"></div>
            <h3 className="text-lg sm:text-xl font-bold text-[#681412] tracking-tight">Purchased Items</h3>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-[#92422B]/30 via-[#92422B]/15 to-transparent hidden sm:block"></div>
          <div className="px-3 py-1 bg-[#92422B]/10 rounded-full border border-[#92422B]/20 self-start sm:self-auto">
            <span className="text-xs font-semibold text-[#681412]">Digital Holdings</span>
          </div>
        </div>
        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {portfolioCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ y: -4, scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer"
            >
            <Card className="bg-gradient-to-br from-[#92422B] via-[#7a1a18] to-[#92422B] text-white border-0 shadow-lg mobile-card-shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-0 right-0 w-32 h-32 sm:w-36 sm:h-36 bg-white/5 rounded-full -mr-16 sm:-mr-18 -mt-16 sm:-mt-18 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-28 sm:h-28 bg-white/5 rounded-full -ml-12 sm:-ml-14 -mb-12 sm:-mb-14"></div>
              <CardHeader className="relative z-10 pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-white">
                  <div className="p-2 sm:p-3 bg-white/15 rounded-lg sm:rounded-xl backdrop-blur-sm shadow-md border border-white/10 group-hover:scale-110 transition-transform duration-300">
                    {React.createElement(card.icon, { className: "h-5 w-5 sm:h-6 sm:w-6 text-white" })}
                  </div>
                  <span className="text-sm sm:text-base font-bold tracking-tight leading-tight">{card.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10 px-4 sm:px-6 pb-4 sm:pb-6">
                <div className="space-y-2">
                  <motion.div 
                    className="text-xl sm:text-2xl font-bold text-white tracking-tight"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                  >
                    {card.quantity.toFixed(4)} g
                  </motion.div>
                  <div className="text-[10px] sm:text-xs text-white/85 font-semibold uppercase tracking-wide">
                    Total Purchased
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Delivery Cards - Separated by Type */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="h-1 w-8 sm:w-12 bg-gradient-to-r from-[#681412] to-[#92422B] rounded-full"></div>
            <h3 className="text-lg sm:text-xl font-bold text-[#681412] tracking-tight">Delivered Items</h3>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-[#92422B]/30 via-[#92422B]/15 to-transparent hidden sm:block"></div>
          <div className="px-3 py-1 bg-green-100 rounded-full border border-green-200 self-start sm:self-auto">
            <span className="text-xs font-semibold text-green-800">Physical Collection</span>
          </div>
        </div>
        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {/* 24K Gold Delivery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-[#92422B] via-[#7a1a18] to-[#92422B] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full -mr-18 -mt-18 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full -ml-14 -mb-14"></div>
              <div className="absolute top-4 right-4">
                <div className="w-2 h-2 rounded-full bg-green-400/80 animate-pulse"></div>
              </div>
              <CardHeader className="relative z-10 pb-3">
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="p-3 bg-white/15 rounded-xl backdrop-blur-sm shadow-md border border-white/10 group-hover:scale-110 transition-transform duration-300">
                    <Coins className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-base font-bold tracking-tight">24K Gold Delivered</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-2">
                  <motion.div 
                    className="text-2xl font-bold text-white tracking-tight"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {gold24kDelivered.toFixed(4)} g
                  </motion.div>
                  <div className="text-xs text-white/85 font-semibold uppercase tracking-wide">
                    Physical Delivery Received
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* 22K Gold Delivery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-[#92422B] via-[#7a1a18] to-[#92422B] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full -mr-18 -mt-18 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full -ml-14 -mb-14"></div>
              <div className="absolute top-4 right-4">
                <div className="w-2 h-2 rounded-full bg-green-400/80 animate-pulse"></div>
              </div>
              <CardHeader className="relative z-10 pb-3">
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="p-3 bg-white/15 rounded-xl backdrop-blur-sm shadow-md border border-white/10 group-hover:scale-110 transition-transform duration-300">
                    <Coins className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-base font-bold tracking-tight">22K Gold Delivered</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-2">
                  <motion.div 
                    className="text-2xl font-bold text-white tracking-tight"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {gold22kDelivered.toFixed(4)} g
                  </motion.div>
                  <div className="text-xs text-white/85 font-semibold uppercase tracking-wide">
                    Physical Delivery Received
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Silver Delivery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-[#92422B] via-[#7a1a18] to-[#92422B] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full -mr-18 -mt-18 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full -ml-14 -mb-14"></div>
              <div className="absolute top-4 right-4">
                <div className="w-2 h-2 rounded-full bg-green-400/80 animate-pulse"></div>
              </div>
              <CardHeader className="relative z-10 pb-3">
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="p-3 bg-white/15 rounded-xl backdrop-blur-sm shadow-md border border-white/10 group-hover:scale-110 transition-transform duration-300">
                    <Coins className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-base font-bold tracking-tight">Silver Delivered</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-2">
                  <motion.div 
                    className="text-2xl font-bold text-white tracking-tight"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {silverDelivered.toFixed(4)} g
                  </motion.div>
                  <div className="text-xs text-white/85 font-semibold uppercase tracking-wide">
                    Physical Delivery Received
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Quick Insights */}
      <div className="grid gap-5 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          whileHover={{ x: -5 }}
        >
          <Card className="bg-gradient-to-br from-[#92422B] via-[#7a1a18] to-[#92422B] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full -mr-18 -mt-18"></div>
            <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full -ml-14 -mb-14"></div>
            <CardContent className="pt-6 pb-6 px-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/15 rounded-xl backdrop-blur-sm shadow-md border border-white/10">
                  <Info className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-4 text-white tracking-tight">Portfolio Summary</h3>
                  <ul className="text-sm text-white/95 space-y-3 font-medium">
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-white/80 shadow-lg"></div>
                      <span>{purchases.length} total purchase{purchases.length !== 1 ? 's' : ''} made</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-white/80 shadow-lg"></div>
                      <span>{totalGoldPurchased.toFixed(4)} g gold purchased (digital)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-white/80 shadow-lg"></div>
                      <span>{totalDeliveredGold.toFixed(4)} g gold delivered (physical)</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-white/80 shadow-lg"></div>
                      <span>{totalAmountPaid > 0 ? formatCurrency(totalAmountPaid) : '₹0'} total amount paid</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-white/80 shadow-lg"></div>
                      <span>Visit our store to collect your physical gold</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
          whileHover={{ x: 5 }}
        >
          <Card className="bg-gradient-to-br from-[#92422B] via-[#7a1a18] to-[#92422B] text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full -mr-18 -mt-18"></div>
            <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full -ml-14 -mb-14"></div>
            <CardContent className="pt-6 pb-6 px-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/15 rounded-xl backdrop-blur-sm shadow-md border border-white/10">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-4 text-white tracking-tight">Delivery Information</h3>
                  <ul className="text-sm text-white/95 space-y-3 font-medium">
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-white/80 shadow-lg"></div>
                      <span>Your digital gold is stored securely</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-white/80 shadow-lg"></div>
                      <span>Visit our physical store to collect delivery</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-white/80 shadow-lg"></div>
                      <span>Bring valid ID proof for verification</span>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-white/80 shadow-lg"></div>
                      <span>Contact us for store location and timings</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Purchase History */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="h-1 w-8 sm:w-12 bg-gradient-to-r from-[#681412] to-[#92422B] rounded-full"></div>
            <h3 className="text-lg sm:text-xl font-bold text-[#681412] tracking-tight">Purchase History</h3>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-[#92422B]/30 via-[#92422B]/15 to-transparent hidden sm:block"></div>
          <Badge className="bg-gradient-to-r from-[#681412] to-[#92422B] text-white border-0 px-3 sm:px-4 py-1.5 text-xs font-semibold shadow-md self-start sm:self-auto">
            {purchases.length} Total
          </Badge>
        </div>
        <Card className="border border-[#92422B]/20 shadow-lg bg-white/60 backdrop-blur-sm overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-[#92422B]/10 via-[#92422B]/5 to-transparent border-b border-[#92422B]/20 px-4 sm:px-6 py-3 sm:py-4">
            <CardTitle className="text-[#681412] font-bold text-base sm:text-lg tracking-tight flex items-center gap-2">
              <div className="h-1 w-6 bg-gradient-to-r from-[#681412] to-[#92422B] rounded-full"></div>
              All Transactions
            </CardTitle>
          </CardHeader>
        <CardContent>
          {purchases.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#92422B]/20 to-[#681412]/20 mb-4">
                <Package className="h-10 w-10 text-[#92422B]" />
              </div>
              <h3 className="text-xl font-bold text-[#681412] mb-2">No purchases yet</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Start building your portfolio by purchasing gold or silver. Your investments will appear here.
              </p>
              <Button 
                onClick={() => {
                  window.location.href = '/dashboard?section=purchase';
                }}
                className="bg-gradient-to-r from-[#681412] to-[#92422B] hover:from-[#7a1a18] hover:to-[#a04d35] text-white shadow-lg"
              >
                Buy Gold/Silver
                <ArrowUpRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="inline-block min-w-full align-middle px-4 md:px-0">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-[#92422B]/10 to-[#681412]/10 border-b-2 border-[#92422B]/20">
                    <tr>
                      <th className="text-left p-3 md:p-4 text-xs md:text-sm font-bold text-[#681412] uppercase tracking-wider whitespace-nowrap">Date</th>
                      <th className="text-left p-3 md:p-4 text-xs md:text-sm font-bold text-[#681412] uppercase tracking-wider whitespace-nowrap">Transaction ID</th>
                      <th className="text-left p-3 md:p-4 text-xs md:text-sm font-bold text-[#681412] uppercase tracking-wider whitespace-nowrap">Type</th>
                      <th className="text-left p-3 md:p-4 text-xs md:text-sm font-bold text-[#681412] uppercase tracking-wider whitespace-nowrap">Purity</th>
                      <th className="text-left p-3 md:p-4 text-xs md:text-sm font-bold text-[#681412] uppercase tracking-wider whitespace-nowrap">Quantity</th>
                      <th className="text-left p-3 md:p-4 text-xs md:text-sm font-bold text-[#681412] uppercase tracking-wider whitespace-nowrap">Price/Gram</th>
                      <th className="text-left p-3 md:p-4 text-xs md:text-sm font-bold text-[#681412] uppercase tracking-wider whitespace-nowrap">Total</th>
                      <th className="text-left p-3 md:p-4 text-xs md:text-sm font-bold text-[#681412] uppercase tracking-wider whitespace-nowrap">Status</th>
                      <th className="text-left p-3 md:p-4 text-xs md:text-sm font-bold text-[#681412] uppercase tracking-wider whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {purchases.map((purchase, index) => (
                      <motion.tr 
                        key={purchase.id} 
                        className="border-b border-[#92422B]/10 hover:bg-[#92422B]/5 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                      <td className="p-3 md:p-4 text-sm md:text-base text-gray-700 font-medium whitespace-nowrap">
                        {new Date(purchase.createdAt).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </td>
                      <td className="p-3 md:p-4 whitespace-nowrap">
                        <span className="font-mono text-xs md:text-sm font-bold text-[#681412]">
                          {purchase.transactionId || purchase.id}
                        </span>
                      </td>
                      <td className="p-3 md:p-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-2 capitalize font-semibold text-[#681412] text-sm md:text-base">
                          <Coins className="h-3 w-3 md:h-4 md:w-4" />
                          {purchase.type}
                        </span>
                      </td>
                      <td className="p-3 md:p-4 whitespace-nowrap">
                        <span className="px-2 md:px-3 py-1 bg-[#92422B]/10 text-[#681412] rounded-full text-xs font-bold uppercase">
                          {purchase.purity}
                        </span>
                      </td>
                      <td className="p-3 md:p-4 text-sm md:text-base text-gray-700 font-semibold whitespace-nowrap">{purchase.quantity} g</td>
                      <td className="p-3 md:p-4 text-sm md:text-base text-gray-700 font-medium whitespace-nowrap">
                        {formatCurrency(purchase.pricePerGram)}
                      </td>
                      <td className="p-3 md:p-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#681412] text-base md:text-lg">
                            {formatCurrency(purchase.finalAmount || purchase.totalAmount)}
                          </span>
                          {purchase.couponCode && purchase.discountAmount && purchase.discountAmount > 0 && (
                            <span className="text-xs text-green-600 font-semibold">
                              🎁 {purchase.couponCode} - Saved {formatCurrency(purchase.discountAmount)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3 md:p-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 md:px-3 py-1.5 rounded-full text-xs font-bold ${
                            purchase.status === 'delivered'
                              ? 'bg-green-100 text-green-800 border border-green-200'
                              : purchase.status === 'paid'
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          }`}
                        >
                          {purchase.status}
                        </span>
                      </td>
                      <td className="p-3 md:p-4 whitespace-nowrap">
                        {purchase.status === 'paid' && (() => {
                          const refundRequest = getRefundRequestForPurchase(purchase.id);
                          if (refundRequest) {
                            // Show refund request status badge
                            const statusColors: Record<string, string> = {
                              pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                              approved: 'bg-blue-100 text-blue-800 border-blue-300',
                              processed: 'bg-green-100 text-green-800 border-green-300',
                              rejected: 'bg-red-100 text-red-800 border-red-300',
                              cancelled: 'bg-gray-100 text-gray-800 border-gray-300',
                            };
                            return (
                              <Badge className={statusColors[refundRequest.status] || statusColors.pending}>
                                <Clock className="h-3 w-3 mr-1" />
                                Refund {refundRequest.status.charAt(0).toUpperCase() + refundRequest.status.slice(1)}
                              </Badge>
                            );
                          }
                          // Show refund button if no refund request exists
                          return (
                            <Button
                              onClick={() => handleRequestRefund(purchase)}
                              variant="outline"
                              size="sm"
                              className="text-xs h-8 border-[#681412] text-[#681412] hover:bg-[#681412] hover:text-white"
                            >
                              <RotateCcw className="h-3 w-3 mr-1" />
                              Refund
                            </Button>
                          );
                        })()}
                        {purchase.status === 'refunded' && (
                          <Badge className="bg-gray-100 text-gray-600 border-gray-300">
                            Refunded
                          </Badge>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
          )}
        </CardContent>
        </Card>
      </div>

      {/* Refund Request Dialog */}
      <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-[#681412]" />
              Request Refund
            </DialogTitle>
            <DialogDescription>
              Submit a refund request for your purchase. Refunds are processed according to our refund policy.
            </DialogDescription>
          </DialogHeader>

          {loadingRefundCalc ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#681412]"></div>
              <span className="ml-3 text-gray-600">Calculating refund eligibility...</span>
            </div>
          ) : refundCalculation && selectedPurchase ? (
            <div className="space-y-4">
              {/* Purchase Details */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-[#681412] mb-2">Purchase Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="col-span-2">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="ml-2 font-bold text-[#681412] font-mono text-base">
                      {refundCalculation.purchase?.transactionId || selectedPurchase.transactionId || selectedPurchase.id}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <span className="ml-2 font-medium capitalize">{selectedPurchase.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Purity:</span>
                    <span className="ml-2 font-medium">{selectedPurchase.purity}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Quantity:</span>
                    <span className="ml-2 font-medium">{selectedPurchase.quantity} g</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Original Amount:</span>
                    <span className="ml-2 font-medium">{formatCurrency(selectedPurchase.finalAmount || selectedPurchase.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Refund Eligibility */}
              {refundCalculation.refundCalculation?.isWithin24Hours ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-900 mb-1">✅ Full Refund Eligible</h4>
                      <p className="text-sm text-green-800 mb-2">
                        Your purchase is within 24 hours. You are eligible for a full refund of{' '}
                        <span className="font-bold">{formatCurrency(refundCalculation.refundCalculation.originalAmount)}</span>.
                      </p>
                      <p className="text-xs text-green-700">
                        Refund will be processed through your original payment method.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-yellow-900 mb-1">⚠️ Market Price-Based Refund</h4>
                      <p className="text-sm text-yellow-800 mb-2">
                        Your purchase is more than 24 hours old. Refund will be calculated based on current market price.
                      </p>
                      <div className="space-y-1 text-xs text-yellow-700">
                        <div className="flex justify-between">
                          <span>Current Market Price:</span>
                          <span className="font-semibold">
                            {formatCurrency(refundCalculation.refundCalculation?.currentMarketPrice || 0)}/gram
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estimated Refund Amount:</span>
                          <span className="font-bold">
                            {formatCurrency(refundCalculation.refundCalculation?.calculatedRefundAmount || 0)}
                          </span>
                        </div>
                        {refundCalculation.refundCalculation?.deductions && (
                          <div className="mt-2 pt-2 border-t border-yellow-300">
                            <p className="font-semibold mb-1">Deductions:</p>
                            <div className="space-y-0.5">
                              <div className="flex justify-between">
                                <span>Market Price Variation:</span>
                                <span>{formatCurrency(refundCalculation.refundCalculation.deductions.marketPriceVariation || 0)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Government Taxes (3%):</span>
                                <span>{formatCurrency(refundCalculation.refundCalculation.deductions.governmentTaxes || 0)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Handling Charges (2%):</span>
                                <span>{formatCurrency(refundCalculation.refundCalculation.deductions.handlingCharges || 0)}</span>
                              </div>
                              <div className="flex justify-between font-bold pt-1 border-t border-yellow-300">
                                <span>Total Deductions:</span>
                                <span>{formatCurrency(refundCalculation.refundCalculation.deductions.total || 0)}</span>
                              </div>
                            </div>
                          </div>
                        )}
                        <p className="mt-2 text-xs italic">
                          Note: Any price fluctuation after 24 hours will be borne by you.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Support Channel Selection */}
              <div className="space-y-2">
                <Label htmlFor="supportChannel" className="text-sm font-semibold">
                  Support Channel <span className="text-red-500">*</span>
                </Label>
                <Select value={supportChannel} onValueChange={setSupportChannel}>
                  <SelectTrigger id="supportChannel" className="h-12">
                    <SelectValue placeholder="Select support channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="support-ticket">Support Ticket</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-600">
                  Refund requests must be submitted via official support channels only.
                </p>
              </div>

              {/* Support Reference (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="supportReference" className="text-sm font-semibold">
                  Support Reference (Optional)
                </Label>
                <Input
                  id="supportReference"
                  placeholder="e.g., Ticket #12345, Call ID, etc."
                  value={supportReference}
                  onChange={(e) => setSupportReference(e.target.value)}
                  className="h-12"
                />
                <p className="text-xs text-gray-600">
                  If you have a support ticket number or reference, please provide it here.
                </p>
              </div>

              {/* Refund Policy Notice */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-xs text-blue-800">
                    <p className="font-semibold mb-1">Refund Policy:</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li>Full refund available within 24 hours of purchase</li>
                      <li>After 24 hours, refund based on current market price</li>
                      <li>Price fluctuations after 24 hours are borne by customer</li>
                      <li>Refunds processed through original payment method</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRefundDialogOpen(false);
                setSelectedPurchase(null);
                setSupportChannel('');
                setSupportReference('');
                setRefundCalculation(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitRefundRequest}
              disabled={!supportChannel || submittingRefund || loadingRefundCalc}
              className="bg-gradient-to-r from-[#681412] to-[#92422B] text-white hover:opacity-90"
            >
              {submittingRefund ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Submit Refund Request
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
