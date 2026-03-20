import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { api } from '../api/client';
import { formatDate } from '../utils';
import { Delivery, Purchase } from '../types';
import Toast from 'react-native-toast-message';
import TaglineMarquee from './TaglineMarquee';

export default function DeliveriesView() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [pendingPurchases, setPendingPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [otpInput, setOtpInput] = useState<{ [key: string]: string }>({});
  const [generatedOTP, setGeneratedOTP] = useState<{ [key: string]: string }>({});
  const [otpModalOpen, setOtpModalOpen] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    setIsLoading(true);
    try {
      const [deliveriesRes, purchasesRes] = await Promise.all([
        api.getDeliveries(),
        api.getPurchases(),
      ]);

      if (deliveriesRes.data) {
        setDeliveries(Array.isArray(deliveriesRes.data) ? deliveriesRes.data : []);
      }

      if (purchasesRes.data) {
        const paid = purchasesRes.data.filter((p: Purchase) => p.status === 'paid');
        setPendingPurchases(Array.isArray(paid) ? paid : []);
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load deliveries' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetDelivery = async (purchaseId: string) => {
    try {
      const response = await api.generateOTP(purchaseId);
      if (response.error) {
        Toast.show({ type: 'error', text1: 'Error', text2: response.error });
        return;
      }

      if (response.data) {
        setGeneratedOTP({ ...generatedOTP, [purchaseId]: response.data.otp || '' });
        setOtpModalOpen({ ...otpModalOpen, [purchaseId]: true });
        Toast.show({
          type: 'success',
          text1: 'OTP Generated',
          text2: 'Check your phone/email for the OTP',
        });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to generate OTP' });
    }
  };

  const handleVerifyOTP = async (purchaseId: string) => {
    const otp = otpInput[purchaseId];
    if (!otp || otp.length !== 6) {
      Toast.show({ type: 'error', text1: 'Invalid OTP', text2: 'Please enter 6-digit OTP' });
      return;
    }

    try {
      const response = await api.verifyOTP(purchaseId, otp);
      if (response.error) {
        Toast.show({ type: 'error', text1: 'Verification Failed', text2: response.error });
        return;
      }
      Toast.show({ type: 'success', text1: 'Success', text2: 'Delivery verified successfully!' });
      setOtpInput({ ...otpInput, [purchaseId]: '' });
      setOtpModalOpen({ ...otpModalOpen, [purchaseId]: false });
      loadDeliveries();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to verify OTP' });
    }
  };

  // Separate gold and silver deliveries
  const goldDeliveries = deliveries.filter(d => d.type === 'gold');
  const silverDeliveries = deliveries.filter(d => d.type === 'silver');
  const goldPending = pendingPurchases.filter(p => p.type === 'gold');
  const silverPending = pendingPurchases.filter(p => p.type === 'silver');

  const totalGoldDelivered = goldDeliveries.reduce((sum, d) => sum + d.quantity, 0);
  const totalSilverDelivered = silverDeliveries.reduce((sum, d) => sum + d.quantity, 0);
  const totalGoldPending = goldPending.reduce((sum, p) => sum + p.quantity, 0);
  const totalSilverPending = silverPending.reduce((sum, p) => sum + p.quantity, 0);



  const handleCallSupport = () => {
    Linking.openURL('tel:+911234567890');
  };

  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@goldapp.com');
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#681412" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadDeliveries} />}
    >
      <TaglineMarquee />

      {/* Coin Charges Notice */}
      <View style={styles.coinChargesBanner}>
        <Text style={styles.coinChargesIcon}>💰</Text>
        <Text style={styles.coinChargesText}>Coin Charges Applied</Text>
      </View>

      {/* Gold Delivery Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gold Delivery Summary</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>GOLD DELIVERED</Text>
            <Text style={styles.summaryValue}>{totalGoldDelivered.toFixed(4)} g</Text>
            <Text style={styles.summaryDescription}>
              {goldDeliveries.length} item{goldDeliveries.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>GOLD READY FOR PICKUP</Text>
            <Text style={styles.summaryValue}>{totalGoldPending.toFixed(4)} g</Text>
            <Text style={styles.summaryDescription}>
              {goldPending.length} item{goldPending.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>TOTAL GOLD PURCHASED</Text>
            <Text style={styles.summaryValue}>
              {(totalGoldDelivered + totalGoldPending).toFixed(4)} g
            </Text>
            <Text style={styles.summaryDescription}>Delivered + Pending</Text>
          </View>
        </View>
      </View>

      {/* Silver Delivery Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Silver Delivery Summary</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>SILVER DELIVERED</Text>
            <Text style={styles.summaryValue}>{totalSilverDelivered.toFixed(4)} g</Text>
            <Text style={styles.summaryDescription}>
              {silverDeliveries.length} item{silverDeliveries.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>SILVER READY FOR PICKUP</Text>
            <Text style={styles.summaryValue}>{totalSilverPending.toFixed(4)} g</Text>
            <Text style={styles.summaryDescription}>
              {silverPending.length} item{silverPending.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>TOTAL SILVER PURCHASED</Text>
            <Text style={styles.summaryValue}>
              {(totalSilverDelivered + totalSilverPending).toFixed(4)} g
            </Text>
            <Text style={styles.summaryDescription}>Delivered + Pending</Text>
          </View>
        </View>
      </View>

      {/* Instructions */}
      <View style={styles.instructionsRow}>
        <View style={styles.instructionCard}>
          <Text style={styles.instructionTitle}>How to Get Delivery:</Text>
          <Text style={styles.instructionItem}>1. Make sure your payment is completed</Text>
          <Text style={styles.instructionItem}>2. Come to the shop with valid ID</Text>
          <Text style={styles.instructionItem}>3. Click "Get Delivery" button below</Text>
          <Text style={styles.instructionItem}>4. Enter the OTP you receive (via SMS/Email)</Text>
          <Text style={styles.instructionItem}>5. Complete delivery verification</Text>
          <Text style={styles.instructionItem}>6. Collect your gold/silver and receipt</Text>
        </View>

        <View style={styles.instructionCard}>
          <Text style={styles.instructionTitle}>Delivery Benefits:</Text>
          <Text style={styles.instructionItem}>• Secure OTP verification</Text>
          <Text style={styles.instructionItem}>• 99.9% purity guaranteed</Text>
          <Text style={styles.instructionItem}>• Digital receipt provided</Text>
          <Text style={styles.instructionItem}>• Instant delivery confirmation</Text>
        </View>
      </View>

      {/* Store Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Store Information</Text>
        <View style={styles.storeRow}>
          <View style={styles.storeCard}>
            <Text style={styles.storeCardTitle}>Visit Our Store:</Text>
            <Text style={styles.storeAddress}>
              Main Store: 123 Gold Street, Mumbai, Maharashtra avenue
            </Text>
            <Text style={styles.storeTimings}>Timings: Mon-Sun, 9 AM - 7 PM</Text>
          </View>
          <View style={styles.storeCard}>
            <Text style={styles.storeCardTitle}>Need Help?:</Text>
            <Text style={styles.storeAddress}>
              Contact our support team for delivery assistance
            </Text>
            <View style={styles.contactButtons}>
              <TouchableOpacity style={styles.contactButton} onPress={handleCallSupport}>
                <Text style={styles.contactButtonText}>📞 Call support</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton} onPress={handleEmailSupport}>
                <Text style={styles.contactButtonText}>✉️ Email</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Gold Ready for Pickup */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gold Ready for Pickup</Text>
        <Text style={styles.sectionSubtitle}>Pending Gold Deliveries</Text>
        {goldPending.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>
              No gold items ready for delivery. Complete payment for your gold purchases to make
              them ready for pickup.
            </Text>
            <TouchableOpacity style={styles.viewPaymentsButton}>
              <Text style={styles.viewPaymentsText}>View Payments</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.tableCard}>
            {goldPending.map((purchase) => (
              <View key={purchase.id} style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text style={styles.tableHeader}>DATE</Text>
                  <Text style={styles.tableValue}>{formatDate(purchase.createdAt)}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.tableHeader}>QUANTITY</Text>
                  <Text style={styles.tableValue}>{purchase.quantity}g</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.tableHeader}>STATUS</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Ready for Pickup</Text>
                  </View>
                </View>
                <View style={styles.tableCell}>
                  <TouchableOpacity
                    style={styles.getDeliveryButton}
                    onPress={() => handleGetDelivery(purchase.id)}
                  >
                    <Text style={styles.getDeliveryText}>Get Delivery</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* OTP Modal for Gold */}
        {goldPending.map((purchase) =>
          otpModalOpen[purchase.id] ? (
            <View key={`modal-${purchase.id}`} style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Enter OTP</Text>
                {generatedOTP[purchase.id] && (
                  <Text style={styles.otpDisplay}>OTP: {generatedOTP[purchase.id]}</Text>
                )}
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter 6-digit OTP"
                  value={otpInput[purchase.id] || ''}
                  onChangeText={(text) =>
                    setOtpInput({
                      ...otpInput,
                      [purchase.id]: text.replace(/\D/g, '').slice(0, 6),
                    })
                  }
                  keyboardType="number-pad"
                  maxLength={6}
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() =>
                      setOtpModalOpen({ ...otpModalOpen, [purchase.id]: false })
                    }
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.verifyButton]}
                    onPress={() => handleVerifyOTP(purchase.id)}
                  >
                    <Text style={styles.verifyButtonText}>Verify</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : null
        )}
      </View>

      {/* Silver Ready for Pickup */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Silver Ready for Pickup</Text>
        <Text style={styles.sectionSubtitle}>Pending Silver Deliveries</Text>
        {silverPending.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>
              No silver items ready for delivery. Complete payment for your silver purchases to
              make them ready for pickup.
            </Text>
            <TouchableOpacity style={styles.viewPaymentsButton}>
              <Text style={styles.viewPaymentsText}>View Payments</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.tableCard}>
            {silverPending.map((purchase) => (
              <View key={purchase.id} style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <Text style={styles.tableHeader}>DATE</Text>
                  <Text style={styles.tableValue}>{formatDate(purchase.createdAt)}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.tableHeader}>QUANTITY</Text>
                  <Text style={styles.tableValue}>{purchase.quantity}g</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text style={styles.tableHeader}>STATUS</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Ready for Pickup</Text>
                  </View>
                </View>
                <View style={styles.tableCell}>
                  <TouchableOpacity
                    style={styles.getDeliveryButton}
                    onPress={() => handleGetDelivery(purchase.id)}
                  >
                    <Text style={styles.getDeliveryText}>Get Delivery</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* OTP Modal for Silver */}
        {silverPending.map((purchase) =>
          otpModalOpen[purchase.id] ? (
            <View key={`modal-${purchase.id}`} style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Enter OTP</Text>
                {generatedOTP[purchase.id] && (
                  <Text style={styles.otpDisplay}>OTP: {generatedOTP[purchase.id]}</Text>
                )}
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter 6-digit OTP"
                  value={otpInput[purchase.id] || ''}
                  onChangeText={(text) =>
                    setOtpInput({
                      ...otpInput,
                      [purchase.id]: text.replace(/\D/g, '').slice(0, 6),
                    })
                  }
                  keyboardType="number-pad"
                  maxLength={6}
                />
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() =>
                      setOtpModalOpen({ ...otpModalOpen, [purchase.id]: false })
                    }
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.verifyButton]}
                    onPress={() => handleVerifyOTP(purchase.id)}
                  >
                    <Text style={styles.verifyButtonText}>Verify</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : null
        )}
      </View>

      {/* Gold Delivered */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gold Delivered</Text>
        <Text style={styles.sectionSubtitle}>Completed Gold Deliveries</Text>
        {goldDeliveries.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>
              No gold deliveries yet. Your delivered gold items will appear here after you complete
              pickup.
            </Text>
          </View>
        ) : (
          <View style={styles.tableCard}>
            {goldDeliveries.map((delivery) => (
              <View key={delivery.id} style={styles.deliveryRow}>
                <Text style={styles.deliveryInfo}>
                  {formatDate(delivery.deliveredAt)} - {delivery.quantity}g {delivery.type}{' '}
                  {delivery.purity}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Silver Delivered */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Silver Delivered</Text>
        <Text style={styles.sectionSubtitle}>Completed Silver Deliveries</Text>
        {silverDeliveries.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyText}>
              No silver deliveries yet. Your delivered silver items will appear here after you
              complete pickup.
            </Text>
          </View>
        ) : (
          <View style={styles.tableCard}>
            {silverDeliveries.map((delivery) => (
              <View key={delivery.id} style={styles.deliveryRow}>
                <Text style={styles.deliveryInfo}>
                  {formatDate(delivery.deliveredAt)} - {delivery.quantity}g {delivery.type}{' '}
                  {delivery.purity}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D5BAA7',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D5BAA7',
  },
  header: {
    padding: 20,
    backgroundColor: '#681412',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#681412',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#92422B',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: '#681412',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  summaryDescription: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  instructionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  instructionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#681412',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  instructionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  instructionItem: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 8,
    lineHeight: 18,
  },
  storeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  storeCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  storeCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#681412',
    marginBottom: 8,
  },
  storeAddress: {
    fontSize: 12,
    color: '#92422B',
    marginBottom: 8,
    lineHeight: 18,
  },
  storeTimings: {
    fontSize: 12,
    color: '#92422B',
  },
  contactButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  contactButton: {
    flex: 1,
    backgroundColor: '#681412',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  tableCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E79A66',
  },
  tableCell: {
    flex: 1,
    marginRight: 8,
  },
  tableHeader: {
    fontSize: 10,
    fontWeight: '600',
    color: '#92422B',
    marginBottom: 4,
  },
  tableValue: {
    fontSize: 12,
    color: '#681412',
    fontWeight: '500',
  },
  statusBadge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  getDeliveryButton: {
    backgroundColor: '#681412',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  getDeliveryText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: '#92422B',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  viewPaymentsButton: {
    backgroundColor: '#681412',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  viewPaymentsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  deliveryRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E79A66',
  },
  deliveryInfo: {
    fontSize: 14,
    color: '#681412',
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
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#681412',
    marginBottom: 16,
    textAlign: 'center',
  },
  otpDisplay: {
    fontSize: 16,
    fontWeight: '600',
    color: '#681412',
    marginBottom: 16,
    textAlign: 'center',
    backgroundColor: '#F5E6D3',
    padding: 12,
    borderRadius: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E79A66',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: 4,
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
    backgroundColor: '#92422B',
  },
  verifyButton: {
    backgroundColor: '#681412',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  coinChargesBanner: {
    backgroundColor: '#FFD700',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFA500',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  coinChargesIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  coinChargesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#681412',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
