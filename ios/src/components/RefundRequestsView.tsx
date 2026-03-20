import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { api } from '../api/client';
import { formatCurrency } from '../utils';
import Toast from 'react-native-toast-message';

export default function RefundRequestsView() {
  const [refundRequests, setRefundRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRefundRequests();
  }, []);

  const loadRefundRequests = async () => {
    setIsLoading(true);
    try {
      const response = await api.getRefunds();
      if (response.error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.error,
        });
      } else if (response.data) {
        setRefundRequests(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error loading refund requests:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load refund requests',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
        return '#22c55e';
      case 'approved':
        return '#3b82f6';
      case 'pending':
        return '#f59e0b';
      case 'rejected':
        return '#dc2626';
      default:
        return '#666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed':
        return '✅';
      case 'approved':
        return '✓';
      case 'pending':
        return '⏳';
      case 'rejected':
        return '❌';
      default:
        return '•';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#681412" />
        <Text style={styles.loadingText}>Loading refund requests...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={loadRefundRequests} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Refund Requests</Text>
        <Text style={styles.subtitle}>
          Track your refund request status
        </Text>
      </View>

      {refundRequests.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No refund requests</Text>
          <Text style={styles.emptySubtext}>
            You haven't submitted any refund requests yet
          </Text>
        </View>
      ) : (
        refundRequests.map((request) => (
          <View key={request.id} style={styles.refundCard}>
            <View style={styles.refundHeader}>
              <View>
                <Text style={styles.refundId}>Purchase ID: {request.purchaseId}</Text>
                <Text style={styles.refundDate}>
                  Requested: {new Date(request.requestTimestamp || request.createdAt).toLocaleDateString()}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
                <Text style={styles.statusText}>
                  {getStatusIcon(request.status)} {request.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.amountSection}>
              <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>Original Amount:</Text>
                <Text style={styles.amountValue}>
                  {formatCurrency(request.originalAmount || 0)}
                </Text>
              </View>
              <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>Refund Amount:</Text>
                <Text style={[styles.amountValue, styles.refundAmount]}>
                  {formatCurrency(request.calculatedRefundAmount || 0)}
                </Text>
              </View>
            </View>

            {request.isWithin24Hours && (
              <View style={styles.infoBadge}>
                <Text style={styles.infoText}>
                  ✅ Full refund (within 24 hours)
                </Text>
              </View>
            )}

            {!request.isWithin24Hours && request.deductions && request.deductions.total > 0 && (
              <View style={styles.deductionsSection}>
                <Text style={styles.deductionsTitle}>Deductions:</Text>
                {request.deductions.marketPriceVariation > 0 && (
                  <Text style={styles.deductionItem}>
                    • Market Price Variation: {formatCurrency(request.deductions.marketPriceVariation)}
                  </Text>
                )}
                {request.deductions.governmentTaxes > 0 && (
                  <Text style={styles.deductionItem}>
                    • Government Taxes: {formatCurrency(request.deductions.governmentTaxes)}
                  </Text>
                )}
                {request.deductions.handlingCharges > 0 && (
                  <Text style={styles.deductionItem}>
                    • Handling Charges: {formatCurrency(request.deductions.handlingCharges)}
                  </Text>
                )}
              </View>
            )}

            {request.supportChannel && (
              <View style={styles.supportInfo}>
                <Text style={styles.supportLabel}>
                  Support Channel: {request.supportChannel}
                </Text>
                {request.supportReference && (
                  <Text style={styles.supportRef}>
                    Reference: {request.supportReference}
                  </Text>
                )}
              </View>
            )}

            {request.adminNotes && (
              <View style={styles.adminNotes}>
                <Text style={styles.adminNotesTitle}>Admin Notes:</Text>
                <Text style={styles.adminNotesText}>{request.adminNotes}</Text>
              </View>
            )}

            {request.processedAt && (
              <Text style={styles.processedDate}>
                Processed: {new Date(request.processedAt).toLocaleDateString()}
              </Text>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D5BAA7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D5BAA7',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#92422B',
  },
  header: {
    padding: 16,
    backgroundColor: '#681412',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#E79A66',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#681412',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#92422B',
    textAlign: 'center',
  },
  refundCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  refundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  refundId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#681412',
  },
  refundDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  amountSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 14,
    color: '#92422B',
  },
  amountValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#681412',
  },
  refundAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  infoBadge: {
    backgroundColor: '#dcfce7',
    padding: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  infoText: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '600',
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
  supportInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  supportLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  supportRef: {
    fontSize: 12,
    color: '#92422B',
    fontWeight: '500',
  },
  adminNotes: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  adminNotesTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#681412',
    marginBottom: 6,
  },
  adminNotesText: {
    fontSize: 12,
    color: '#666',
  },
  processedDate: {
    fontSize: 11,
    color: '#666',
    marginTop: 12,
    fontStyle: 'italic',
  },
});

