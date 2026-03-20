import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { api } from '../api/client';
import { formatCurrency } from '../utils';

interface RefundEligibilityCardProps {
  purchaseId: string;
  purchaseDate: string;
  purchaseAmount: number;
  purchaseStatus: string;
}

export default function RefundEligibilityCard({
  purchaseId,
  purchaseDate,
  purchaseAmount,
  purchaseStatus,
}: RefundEligibilityCardProps) {
  const [refundInfo, setRefundInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only fetch refund eligibility for paid purchases
    if (purchaseStatus === 'paid') {
      loadRefundEligibility();
    }
  }, [purchaseId, purchaseStatus]);

  const loadRefundEligibility = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.calculateRefund(purchaseId);
      if (response.error) {
        // Don't show error if refund already exists or purchase not eligible
        if (response.error.includes('already exists') || response.error.includes('not eligible')) {
          setRefundInfo(null);
        } else {
          setError(response.error);
        }
      } else if (response.data) {
        setRefundInfo(response.data);
      } else {
        // Handle direct response (not wrapped in data)
        setRefundInfo(response);
      }
    } catch (err: any) {
      console.error('Error loading refund eligibility:', err);
      setError('Failed to load refund information');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Request Refund',
      'To request a refund, please contact our support team:\n\n📧 Email: support@shreeomjisaraf.com\n📞 Phone: +91-XXXXX-XXXXX\n💬 Chat: Available in app\n\nPlease mention your Purchase ID: ' + purchaseId,
      [{ text: 'OK' }]
    );
  };

  // Don't show card if purchase is not paid or already refunded/delivered
  if (purchaseStatus !== 'paid' || purchaseStatus === 'refunded' || purchaseStatus === 'delivered') {
    return null;
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#681412" />
        <Text style={styles.loadingText}>Checking refund eligibility...</Text>
      </View>
    );
  }

  if (error && !refundInfo) {
    return null; // Don't show card if there's an error
  }

  if (!refundInfo) {
    return null; // Don't show card if no refund info available
  }

  const refundCalculation = refundInfo.refundCalculation || refundInfo;
  const isWithin24Hours = refundCalculation?.isWithin24Hours || false;
  const hoursRemaining = refundCalculation?.hoursSincePurchase 
    ? Math.max(0, 24 - refundCalculation.hoursSincePurchase) 
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>💰 Refund Eligibility</Text>
        {isWithin24Hours && hoursRemaining > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              ⏰ {Math.floor(hoursRemaining)}h {Math.floor((hoursRemaining % 1) * 60)}m left
            </Text>
          </View>
        )}
      </View>

      {isWithin24Hours ? (
        <View style={styles.fullRefundSection}>
          <Text style={styles.fullRefundText}>
            ✅ Full refund eligible within 24 hours
          </Text>
          <Text style={styles.refundAmount}>
            Refund Amount: {formatCurrency(refundCalculation?.originalAmount || purchaseAmount)}
          </Text>
          <Text style={styles.note}>
            Request refund via support channels to get full amount back
          </Text>
        </View>
      ) : (
        <View style={styles.marketPriceSection}>
          <Text style={styles.marketPriceText}>
            ⚠️ Refund based on current market price
          </Text>
          <View style={styles.amountRow}>
            <Text style={styles.label}>Original Amount:</Text>
            <Text style={styles.value}>{formatCurrency(refundCalculation?.originalAmount || purchaseAmount)}</Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.label}>Current Market Value:</Text>
            <Text style={styles.value}>
              {formatCurrency((refundCalculation?.currentMarketPrice || 0) * (refundInfo?.purchase?.quantity || 0))}
            </Text>
          </View>
          {refundCalculation?.deductions && refundCalculation.deductions.total > 0 && (
            <View style={styles.deductionsSection}>
              <Text style={styles.deductionsTitle}>Deductions:</Text>
              {refundCalculation.deductions.marketPriceVariation > 0 && (
                <Text style={styles.deductionItem}>
                  • Market Price Variation: {formatCurrency(refundCalculation.deductions.marketPriceVariation)}
                </Text>
              )}
              {refundCalculation.deductions.governmentTaxes > 0 && (
                <Text style={styles.deductionItem}>
                  • Government Taxes (3%): {formatCurrency(refundCalculation.deductions.governmentTaxes)}
                </Text>
              )}
              {refundCalculation.deductions.handlingCharges > 0 && (
                <Text style={styles.deductionItem}>
                  • Handling Charges (2%): {formatCurrency(refundCalculation.deductions.handlingCharges)}
                </Text>
              )}
              <Text style={styles.totalDeduction}>
                Total Deductions: {formatCurrency(refundCalculation.deductions.total)}
              </Text>
            </View>
          )}
          <View style={styles.finalAmountRow}>
            <Text style={styles.finalLabel}>Final Refund Amount:</Text>
            <Text style={styles.finalAmount}>
              {formatCurrency(refundCalculation?.calculatedRefundAmount || 0)}
            </Text>
          </View>
          <Text style={styles.note}>
            Price fluctuations after 24 hours are borne by customer
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.contactButton} onPress={handleContactSupport}>
        <Text style={styles.contactButtonText}>📞 Contact Support for Refund</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#681412',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#681412',
  },
  badge: {
    backgroundColor: '#E79A66',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  loadingText: {
    fontSize: 12,
    color: '#92422B',
    marginTop: 8,
    textAlign: 'center',
  },
  fullRefundSection: {
    marginBottom: 12,
  },
  fullRefundText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22c55e',
    marginBottom: 8,
  },
  marketPriceSection: {
    marginBottom: 12,
  },
  marketPriceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f59e0b',
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    color: '#92422B',
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: '#681412',
  },
  deductionsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  deductionsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#92422B',
    marginBottom: 6,
  },
  deductionItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  totalDeduction: {
    fontSize: 13,
    fontWeight: '600',
    color: '#dc2626',
    marginTop: 6,
  },
  finalAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 2,
    borderTopColor: '#681412',
  },
  finalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#681412',
  },
  finalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#681412',
  },
  refundAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22c55e',
    marginTop: 8,
  },
  note: {
    fontSize: 11,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  contactButton: {
    backgroundColor: '#681412',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

