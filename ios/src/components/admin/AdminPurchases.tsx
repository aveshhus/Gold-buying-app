import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  RefreshControl, 
  TouchableOpacity,
  Modal,
  Platform,
  TextInput
} from 'react-native';
import { api } from '../../api/client';
import { formatCurrency, formatDate } from '../../utils';
import { Purchase } from '../../types';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';

type FilterType = 'all' | 'today' | 'week' | 'custom';

export default function AdminPurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAdminPurchases();
      if (response.data) {
        setPurchases(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error loading purchases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (purchaseId: string, status: string) => {
    try {
      const response = await api.updatePurchaseStatus(purchaseId, status);
      if (response.error) {
        Toast.show({ type: 'error', text1: 'Failed', text2: response.error });
        return;
      }
      Toast.show({ type: 'success', text1: 'Success', text2: 'Status updated!' });
      loadPurchases();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to update status' });
    }
  };

  // Filter purchases based on selected filter type
  const filteredPurchases = useMemo(() => {
    if (filterType === 'all') {
      return purchases;
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setHours(23, 59, 59, 999);

    let filterStart: Date;
    let filterEnd: Date = new Date(todayEnd);

    switch (filterType) {
      case 'today':
        filterStart = todayStart;
        filterEnd = todayEnd;
        break;
      case 'week':
        filterStart = new Date(todayStart);
        filterStart.setDate(filterStart.getDate() - 7);
        filterEnd = todayEnd;
        break;
      case 'custom':
        filterStart = new Date(startDate);
        filterStart.setHours(0, 0, 0, 0);
        filterEnd = new Date(endDate);
        filterEnd.setHours(23, 59, 59, 999);
        break;
      default:
        return purchases;
    }

    return purchases.filter((purchase) => {
      const purchaseDate = new Date(purchase.createdAt);
      return purchaseDate >= filterStart && purchaseDate <= filterEnd;
    });
  }, [purchases, filterType, startDate, endDate]);

  const handleFilterChange = (filter: FilterType) => {
    setFilterType(filter);
    if (filter === 'custom') {
      setShowCustomDateModal(true);
    }
  };

  const handleApplyCustomDateFilter = () => {
    if (startDate > endDate) {
      Toast.show({ type: 'error', text1: 'Invalid Date Range', text2: 'Start date must be before end date' });
      return;
    }
    setShowCustomDateModal(false);
    setFilterType('custom');
  };

  const handleClearFilter = () => {
    setFilterType('all');
    setShowCustomDateModal(false);
  };

  const formatDateForDisplay = (date: Date): string => {
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#681412" />
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadPurchases} />}
      >
        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            <TouchableOpacity
              style={[styles.filterButton, filterType === 'all' && styles.filterButtonActive]}
              onPress={() => handleFilterChange('all')}
            >
              <Text style={[styles.filterButtonText, filterType === 'all' && styles.filterButtonTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterType === 'today' && styles.filterButtonActive]}
              onPress={() => handleFilterChange('today')}
            >
              <Text style={[styles.filterButtonText, filterType === 'today' && styles.filterButtonTextActive]}>
                Today
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterType === 'week' && styles.filterButtonActive]}
              onPress={() => handleFilterChange('week')}
            >
              <Text style={[styles.filterButtonText, filterType === 'week' && styles.filterButtonTextActive]}>
                This Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterType === 'custom' && styles.filterButtonActive]}
              onPress={() => handleFilterChange('custom')}
            >
              <Text style={[styles.filterButtonText, filterType === 'custom' && styles.filterButtonTextActive]}>
                Custom Range
              </Text>
            </TouchableOpacity>
          </ScrollView>
          {filterType !== 'all' && (
            <TouchableOpacity style={styles.clearFilterButton} onPress={handleClearFilter}>
              <Text style={styles.clearFilterText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Info */}
        {filterType !== 'all' && (
          <View style={styles.filterInfo}>
            <Text style={styles.filterInfoText}>
              {filterType === 'today' && `Showing purchases from today`}
              {filterType === 'week' && `Showing purchases from last 7 days`}
              {filterType === 'custom' && `Showing purchases from ${formatDateForDisplay(startDate)} to ${formatDateForDisplay(endDate)}`}
            </Text>
          </View>
        )}

        {/* Purchases List */}
        {filteredPurchases.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No purchases found</Text>
            {filterType !== 'all' && (
              <TouchableOpacity onPress={handleClearFilter}>
                <Text style={styles.emptySubtext}>Clear filters to see all purchases</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredPurchases.map((purchase) => (
            <View key={purchase.id} style={styles.purchaseCard}>
              <Text style={styles.purchaseType}>{purchase.type.toUpperCase()} {purchase.purity}</Text>
              <Text style={styles.purchaseQuantity}>{purchase.quantity}g - {formatCurrency(purchase.totalAmount)}</Text>
              <Text style={styles.purchaseStatus}>Status: {purchase.status}</Text>
              <Text style={styles.purchaseDate}>{formatDate(purchase.createdAt)}</Text>
              {purchase.status === 'pending' && (
                <TouchableOpacity
                  style={styles.statusButton}
                  onPress={() => handleUpdateStatus(purchase.id, 'paid')}
                >
                  <Text style={styles.statusButtonText}>Mark as Paid</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Custom Date Range Modal */}
      <Modal
        visible={showCustomDateModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCustomDateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Date Range</Text>

            {/* Start Date */}
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>Start Date:</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Text style={styles.dateInputText}>{formatDateForDisplay(startDate)}</Text>
              </TouchableOpacity>
              {showStartDatePicker && (
                <>
                  {Platform.OS === 'android' ? (
                    <DateTimePicker
                      value={startDate}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowStartDatePicker(false);
                        if (event.type !== 'dismissed' && selectedDate) {
                          setStartDate(selectedDate);
                        }
                      }}
                    />
                  ) : (
                    <View>
                      <DateTimePicker
                        value={startDate}
                        mode="date"
                        display="spinner"
                        onChange={(event, selectedDate) => {
                          if (selectedDate) {
                            setStartDate(selectedDate);
                          }
                        }}
                      />
                      <TouchableOpacity
                        style={styles.datePickerDoneButton}
                        onPress={() => setShowStartDatePicker(false)}
                      >
                        <Text style={styles.datePickerDoneText}>Done</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </View>

            {/* End Date */}
            <View style={styles.dateInputContainer}>
              <Text style={styles.dateLabel}>End Date:</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowEndDatePicker(true)}
              >
                <Text style={styles.dateInputText}>{formatDateForDisplay(endDate)}</Text>
              </TouchableOpacity>
              {showEndDatePicker && (
                <>
                  {Platform.OS === 'android' ? (
                    <DateTimePicker
                      value={endDate}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowEndDatePicker(false);
                        if (event.type !== 'dismissed' && selectedDate) {
                          setEndDate(selectedDate);
                        }
                      }}
                    />
                  ) : (
                    <View>
                      <DateTimePicker
                        value={endDate}
                        mode="date"
                        display="spinner"
                        onChange={(event, selectedDate) => {
                          if (selectedDate) {
                            setEndDate(selectedDate);
                          }
                        }}
                      />
                      <TouchableOpacity
                        style={styles.datePickerDoneButton}
                        onPress={() => setShowEndDatePicker(false)}
                      >
                        <Text style={styles.datePickerDoneText}>Done</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </View>

            {/* Modal Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setShowCustomDateModal(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonApply]}
                onPress={handleApplyCustomDateFilter}
              >
                <Text style={styles.modalButtonTextApply}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D5BAA7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, backgroundColor: '#681412' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  filterContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    alignItems: 'center',
  },
  filterScroll: {
    flex: 1,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  filterButtonActive: {
    backgroundColor: '#681412',
    borderColor: '#681412',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#92422B',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  clearFilterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  clearFilterText: {
    fontSize: 14,
    color: '#681412',
    fontWeight: '600',
  },
  filterInfo: {
    padding: 12,
    backgroundColor: '#FFF9E6',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#681412',
  },
  filterInfoText: {
    fontSize: 13,
    color: '#92422B',
  },
  purchaseCard: { 
    backgroundColor: '#fff', 
    margin: 16, 
    padding: 16, 
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  purchaseType: { fontSize: 18, fontWeight: 'bold', color: '#681412', marginBottom: 4 },
  purchaseQuantity: { fontSize: 16, color: '#92422B', marginBottom: 4 },
  purchaseStatus: { fontSize: 14, color: '#92422B', marginBottom: 4 },
  purchaseDate: { fontSize: 12, color: '#92422B', marginBottom: 8 },
  statusButton: { backgroundColor: '#681412', padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  statusButtonText: { color: '#fff', fontWeight: '600' },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#92422B',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#681412',
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#681412',
    marginBottom: 20,
    textAlign: 'center',
  },
  dateInputContainer: {
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 14,
    color: '#92422B',
    marginBottom: 8,
    fontWeight: '500',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F9F9F9',
  },
  dateInputText: {
    fontSize: 16,
    color: '#681412',
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
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  modalButtonApply: {
    backgroundColor: '#681412',
  },
  modalButtonTextCancel: {
    fontSize: 16,
    color: '#92422B',
    fontWeight: '600',
  },
  modalButtonTextApply: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  datePickerDoneButton: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#681412',
    borderRadius: 8,
    alignItems: 'center',
  },
  datePickerDoneText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  dateInputFallback: {
    marginTop: 8,
  },
  dateInputLabel: {
    fontSize: 12,
    color: '#92422B',
    marginBottom: 4,
  },
  dateTextInput: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#F9F9F9',
    fontSize: 14,
    color: '#681412',
  },
});

