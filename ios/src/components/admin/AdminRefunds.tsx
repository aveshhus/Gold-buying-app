import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { api } from '../../api/client';
import { formatCurrency } from '../../utils';
import Toast from 'react-native-toast-message';

export default function AdminRefunds() {
  const [refundRequests, setRefundRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedRefund, setSelectedRefund] = useState<any>(null);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'process' | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [refundTransactionId, setRefundTransactionId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadRefundRequests();
  }, []);

  const loadRefundRequests = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAdminRefunds();
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

  const handleAction = (refund: any, type: 'approve' | 'reject' | 'process') => {
    setSelectedRefund(refund);
    setActionType(type);
    setAdminNotes('');
    setRefundTransactionId('');
    setActionModalVisible(true);
  };

  const confirmAction = async () => {
    if (!selectedRefund || !actionType) return;

    setIsProcessing(true);
    try {
      let response;
      if (actionType === 'approve') {
        response = await api.approveRefund(selectedRefund.id, adminNotes);
      } else if (actionType === 'reject') {
        response = await api.rejectRefund(selectedRefund.id, adminNotes);
      } else if (actionType === 'process') {
        response = await api.processRefund(selectedRefund.id, refundTransactionId, adminNotes);
      }

      if (response?.error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.error,
        });
      } else {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `Refund ${actionType}ed successfully`,
        });
        setActionModalVisible(false);
        setSelectedRefund(null);
        setActionType(null);
        loadRefundRequests();
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to process refund',
      });
    } finally {
      setIsProcessing(false);
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

  const filteredRefunds = filterStatus === 'all'
    ? refundRequests
    : refundRequests.filter(r => r.status === filterStatus);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#681412" />
        <Text style={styles.loadingText}>Loading refund requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Refund Management</Text>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {['all', 'pending', 'approved', 'processed', 'rejected'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              filterStatus === status && styles.filterButtonActive,
            ]}
            onPress={() => setFilterStatus(status)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterStatus === status && styles.filterButtonTextActive,
              ]}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView}>
        {filteredRefunds.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No refund requests found</Text>
          </View>
        ) : (
          filteredRefunds.map((request) => (
            <View key={request.id} style={styles.refundCard}>
              <View style={styles.refundHeader}>
                <View>
                  <Text style={styles.refundId}>ID: {request.id}</Text>
                  <Text style={styles.purchaseId}>Purchase: {request.purchaseId}</Text>
                  <Text style={styles.refundDate}>
                    {new Date(request.requestTimestamp || request.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
                  <Text style={styles.statusText}>{request.status.toUpperCase()}</Text>
                </View>
              </View>

              <View style={styles.amountSection}>
                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>Original:</Text>
                  <Text style={styles.amountValue}>
                    {formatCurrency(request.originalAmount || 0)}
                  </Text>
                </View>
                <View style={styles.amountRow}>
                  <Text style={styles.amountLabel}>Refund:</Text>
                  <Text style={[styles.amountValue, styles.refundAmount]}>
                    {formatCurrency(request.calculatedRefundAmount || 0)}
                  </Text>
                </View>
              </View>

              {request.isWithin24Hours && (
                <Text style={styles.fullRefundBadge}>✅ Full refund (24h)</Text>
              )}

              {request.supportChannel && (
                <Text style={styles.supportInfo}>
                  Support: {request.supportChannel}
                  {request.supportReference && ` - ${request.supportReference}`}
                </Text>
              )}

              {request.adminNotes && (
                <View style={styles.adminNotes}>
                  <Text style={styles.adminNotesText}>{request.adminNotes}</Text>
                </View>
              )}

              {/* Action Buttons */}
              {request.status === 'pending' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={() => handleAction(request, 'approve')}
                  >
                    <Text style={styles.actionButtonText}>✓ Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleAction(request, 'reject')}
                  >
                    <Text style={styles.actionButtonText}>✗ Reject</Text>
                  </TouchableOpacity>
                </View>
              )}

              {request.status === 'approved' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.processButton]}
                  onPress={() => handleAction(request, 'process')}
                >
                  <Text style={styles.actionButtonText}>Process Refund</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Action Modal */}
      <Modal
        visible={actionModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setActionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {actionType === 'approve' && 'Approve Refund'}
              {actionType === 'reject' && 'Reject Refund'}
              {actionType === 'process' && 'Process Refund'}
            </Text>

            {selectedRefund && (
              <View style={styles.modalInfo}>
                <Text style={styles.modalInfoText}>
                  Purchase ID: {selectedRefund.purchaseId}
                </Text>
                <Text style={styles.modalInfoText}>
                  Refund Amount: {formatCurrency(selectedRefund.calculatedRefundAmount || 0)}
                </Text>
              </View>
            )}

            {actionType === 'process' && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Refund Transaction ID (Optional)</Text>
                <TextInput
                  style={styles.input}
                  value={refundTransactionId}
                  onChangeText={setRefundTransactionId}
                  placeholder="Enter transaction ID"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Admin Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={adminNotes}
                onChangeText={setAdminNotes}
                placeholder="Enter notes..."
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setActionModalVisible(false);
                  setSelectedRefund(null);
                  setActionType(null);
                }}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmAction}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalButtonText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
  },
  filterButtonActive: {
    backgroundColor: '#681412',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#92422B',
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
  purchaseId: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  refundDate: {
    fontSize: 11,
    color: '#999',
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
    marginBottom: 6,
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
  fullRefundBadge: {
    fontSize: 12,
    color: '#22c55e',
    fontWeight: '600',
    marginTop: 8,
  },
  supportInfo: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  adminNotes: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  adminNotesText: {
    fontSize: 12,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: '#22c55e',
  },
  rejectButton: {
    backgroundColor: '#dc2626',
  },
  processButton: {
    backgroundColor: '#3b82f6',
    marginTop: 12,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#681412',
    marginBottom: 16,
  },
  modalInfo: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#681412',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  confirmButton: {
    backgroundColor: '#681412',
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#681412',
  },
});

