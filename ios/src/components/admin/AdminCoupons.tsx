import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { api } from '../../api/client';
import Toast from 'react-native-toast-message';
import { formatDate } from '../../utils';

interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  applicableType: 'gold' | 'silver' | 'both';
  maxUses: number | null;
  usedCount: number;
  expiryDate: string | null;
  assignedUsers: string[];
  isActive: boolean;
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    applicableType: 'both' as 'gold' | 'silver' | 'both',
    maxUses: '',
    expiryDate: '',
  });

  useEffect(() => {
    loadCoupons();
    loadUsers();
  }, []);

  const loadCoupons = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAdminCoupons();
      if (response.data) {
        setCoupons(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error loading coupons:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load coupons',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await api.getAdminUsers();
      if (response.data) {
        setUsers(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleCreateCoupon = async () => {
    if (!formData.code || !formData.description || !formData.discountValue) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill all required fields',
      });
      return;
    }

    try {
      const couponData: any = {
        code: formData.code.toUpperCase(),
        description: formData.description,
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        applicableType: formData.applicableType,
      };

      if (formData.maxUses) {
        couponData.maxUses = parseInt(formData.maxUses);
      }

      if (formData.expiryDate) {
        couponData.expiryDate = formData.expiryDate;
      }

      const response = await api.createCoupon(couponData);

      if (response.error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.error,
        });
        return;
      }

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Coupon created successfully',
      });

      setIsCreateModalVisible(false);
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        applicableType: 'both',
        maxUses: '',
        expiryDate: '',
      });
      loadCoupons();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to create coupon',
      });
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    Alert.alert(
      'Deactivate Coupon',
      'Are you sure you want to deactivate this coupon?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await api.deleteCoupon(couponId);
              if (response.error) {
                Toast.show({
                  type: 'error',
                  text1: 'Error',
                  text2: response.error,
                });
                return;
              }

              Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Coupon deactivated successfully',
              });
              loadCoupons();
            } catch (error: any) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error.message || 'Failed to deactivate coupon',
              });
            }
          },
        },
      ]
    );
  };

  const handleAssignCoupon = async (selectedUserIds: string[]) => {
    if (!selectedCoupon || selectedUserIds.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select at least one user',
      });
      return;
    }

    try {
      const response = await api.assignCoupon(selectedCoupon.id, selectedUserIds);
      if (response.error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.error,
        });
        return;
      }

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Coupon assigned successfully',
      });

      setIsAssignModalVisible(false);
      setSelectedCoupon(null);
      loadCoupons();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to assign coupon',
      });
    }
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
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadCoupons} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Coupons & Offers</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setIsCreateModalVisible(true)}
        >
          <Text style={styles.createButtonText}>+ Create</Text>
        </TouchableOpacity>
      </View>

      {coupons.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No coupons created yet</Text>
        </View>
      ) : (
        coupons.map((coupon) => (
          <View key={coupon.id} style={styles.couponCard}>
            <View style={styles.couponHeader}>
              <View style={styles.couponCodeContainer}>
                <Text style={styles.couponCode}>{coupon.code}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    coupon.isActive ? styles.activeBadge : styles.inactiveBadge,
                  ]}
                >
                  <Text style={styles.statusText}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteCoupon(coupon.id)}
              >
                <Text style={styles.deleteButtonText}>🗑️</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.couponDescription}>{coupon.description}</Text>

            <View style={styles.couponDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Discount:</Text>
                <Text style={styles.detailValue}>
                  {coupon.discountType === 'percentage'
                    ? `${coupon.discountValue}%`
                    : `₹${coupon.discountValue}`}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Applicable:</Text>
                <Text style={styles.detailValue}>{coupon.applicableType}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Uses:</Text>
                <Text style={styles.detailValue}>
                  {coupon.usedCount} / {coupon.maxUses || '∞'}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Assigned:</Text>
                <Text style={styles.detailValue}>
                  {coupon.assignedUsers.length > 0
                    ? `${coupon.assignedUsers.length} user(s)`
                    : 'Public'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.assignButton}
              onPress={() => {
                setSelectedCoupon(coupon);
                setIsAssignModalVisible(true);
              }}
              disabled={!coupon.isActive}
            >
              <Text style={styles.assignButtonText}>Assign to Users</Text>
            </TouchableOpacity>
          </View>
        ))
      )}

      {/* Create Coupon Modal */}
      <Modal
        visible={isCreateModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Coupon</Text>

            <TextInput
              style={styles.input}
              placeholder="Coupon Code (e.g., FIRSTGOLD10)"
              value={formData.code}
              onChangeText={(text) => setFormData({ ...formData, code: text.toUpperCase() })}
              autoCapitalize="characters"
            />

            <TextInput
              style={styles.input}
              placeholder="Description"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
            />

            <View style={styles.row}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  formData.discountType === 'percentage' && styles.typeButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, discountType: 'percentage' })}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    formData.discountType === 'percentage' && styles.typeButtonTextActive,
                  ]}
                >
                  Percentage
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  formData.discountType === 'fixed' && styles.typeButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, discountType: 'fixed' })}
              >
                <Text
                  style={[
                    styles.typeButtonText,
                    formData.discountType === 'fixed' && styles.typeButtonTextActive,
                  ]}
                >
                  Fixed Amount
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder={formData.discountType === 'percentage' ? 'Discount %' : 'Discount Amount'}
              value={formData.discountValue}
              onChangeText={(text) => setFormData({ ...formData, discountValue: text })}
              keyboardType="numeric"
            />

            <View style={styles.row}>
              <TouchableOpacity
                style={[
                  styles.applicableButton,
                  formData.applicableType === 'both' && styles.applicableButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, applicableType: 'both' })}
              >
                <Text
                  style={[
                    styles.applicableButtonText,
                    formData.applicableType === 'both' && styles.applicableButtonTextActive,
                  ]}
                >
                  Both
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.applicableButton,
                  formData.applicableType === 'gold' && styles.applicableButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, applicableType: 'gold' })}
              >
                <Text
                  style={[
                    styles.applicableButtonText,
                    formData.applicableType === 'gold' && styles.applicableButtonTextActive,
                  ]}
                >
                  Gold
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.applicableButton,
                  formData.applicableType === 'silver' && styles.applicableButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, applicableType: 'silver' })}
              >
                <Text
                  style={[
                    styles.applicableButtonText,
                    formData.applicableType === 'silver' && styles.applicableButtonTextActive,
                  ]}
                >
                  Silver
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Max Uses (optional)"
              value={formData.maxUses}
              onChangeText={(text) => setFormData({ ...formData, maxUses: text })}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsCreateModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createModalButton]}
                onPress={handleCreateCoupon}
              >
                <Text style={styles.createModalButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Assign Coupon Modal */}
      <AssignCouponModal
        visible={isAssignModalVisible}
        coupon={selectedCoupon}
        users={users}
        assignedUserIds={selectedCoupon?.assignedUsers || []}
        onAssign={handleAssignCoupon}
        onClose={() => {
          setIsAssignModalVisible(false);
          setSelectedCoupon(null);
        }}
      />
    </ScrollView>
  );
}

function AssignCouponModal({
  visible,
  coupon,
  users,
  assignedUserIds,
  onAssign,
  onClose,
}: {
  visible: boolean;
  coupon: Coupon | null;
  users: any[];
  assignedUserIds: string[];
  onAssign: (userIds: string[]) => void;
  onClose: () => void;
}) {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(assignedUserIds);

  useEffect(() => {
    setSelectedUserIds(assignedUserIds);
  }, [assignedUserIds]);

  const handleToggleUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const handleAssign = () => {
    onAssign(selectedUserIds);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Assign Coupon: {coupon?.code}
          </Text>
          <Text style={styles.modalSubtitle}>Select users to assign this coupon to</Text>

          <ScrollView style={styles.userList}>
            {users.length === 0 ? (
              <Text style={styles.emptyText}>No users available</Text>
            ) : (
              users.map((user) => (
                <TouchableOpacity
                  key={user.id}
                  style={[
                    styles.userItem,
                    selectedUserIds.includes(user.id) && styles.userItemSelected,
                  ]}
                  onPress={() => handleToggleUser(user.id)}
                >
                  <Text style={styles.checkbox}>
                    {selectedUserIds.includes(user.id) ? '✓' : '○'}
                  </Text>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>

          <Text style={styles.selectedCount}>
            {selectedUserIds.length} user(s) selected
          </Text>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.createModalButton]}
              onPress={handleAssign}
            >
              <Text style={styles.createModalButtonText}>Assign</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D5BAA7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    padding: 20,
    backgroundColor: '#681412',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  createButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#681412',
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#92422B',
  },
  couponCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  couponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  couponCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  couponCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#681412',
    fontFamily: 'monospace',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeBadge: {
    backgroundColor: '#D4EDDA',
  },
  inactiveBadge: {
    backgroundColor: '#F8D7DA',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#155724',
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  couponDescription: {
    fontSize: 14,
    color: '#92422B',
    marginBottom: 12,
  },
  couponDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 12,
    color: '#92422B',
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#681412',
  },
  assignButton: {
    backgroundColor: '#681412',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  assignButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#681412',
    marginBottom: 16,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#92422B',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E79A66',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  typeButton: {
    flex: 1,
    padding: 12,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#681412',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  applicableButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E79A66',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  applicableButtonActive: {
    backgroundColor: '#681412',
    borderColor: '#681412',
  },
  applicableButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#681412',
  },
  applicableButtonTextActive: {
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    color: '#681412',
    fontWeight: '600',
  },
  createModalButton: {
    backgroundColor: '#681412',
  },
  createModalButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  userList: {
    maxHeight: 300,
    marginBottom: 12,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E79A66',
    borderRadius: 8,
    marginBottom: 8,
  },
  userItemSelected: {
    backgroundColor: '#F5E6D3',
    borderColor: '#681412',
  },
  checkbox: {
    fontSize: 20,
    marginRight: 12,
    color: '#681412',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#681412',
  },
  userEmail: {
    fontSize: 12,
    color: '#92422B',
  },
  selectedCount: {
    fontSize: 12,
    color: '#92422B',
    textAlign: 'center',
    marginBottom: 8,
  },
});

