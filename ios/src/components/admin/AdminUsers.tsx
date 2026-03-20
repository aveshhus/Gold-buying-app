import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity, Modal, Alert, TextInput } from 'react-native';
import { api } from '../../api/client';
import { User } from '../../types';
import Toast from 'react-native-toast-message';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [isOfferModalVisible, setIsOfferModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateOffer, setShowCreateOffer] = useState(false);
  const [newOffer, setNewOffer] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    applicableType: 'both' as 'gold' | 'silver' | 'both',
  });

  useEffect(() => {
    loadUsers();
    loadCoupons();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAdminUsers();
      if (response.data) {
        setUsers(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCoupons = async () => {
    try {
      const response = await api.getAdminCoupons();
      if (response.data) {
        setCoupons(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error loading coupons:', error);
    }
  };

  const handleGiveOffer = (user: User) => {
    setSelectedUser(user);
    setIsOfferModalVisible(true);
  };

  const handleDeleteUser = (user: User) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete "${user.name}" (${user.email})?\n\nThis will permanently delete:\n- User account\n- All purchases\n- All payments\n- All deliveries\n- All notifications\n\nThis action cannot be undone!`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // Final confirmation
            Alert.alert(
              'Final Confirmation',
              `Delete "${user.name}" permanently?`,
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: async () => {
                    setDeleting(user.id);
                    try {
                      const response = await api.deleteUser(user.id);
                      if (response.error) {
                        Toast.show({
                          type: 'error',
                          text1: 'Error',
                          text2: response.error || 'Failed to delete user',
                        });
                        return;
                      }

                      Toast.show({
                        type: 'success',
                        text1: 'Success',
                        text2: response.data?.message || `User ${user.name} deleted successfully`,
                      });
                      loadUsers(); // Reload users list
                    } catch (error: any) {
                      Toast.show({
                        type: 'error',
                        text1: 'Error',
                        text2: error.message || 'Failed to delete user. Please try again.',
                      });
                    } finally {
                      setDeleting(null);
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  const handleAssignCoupon = async (couponId: string) => {
    if (!selectedUser) return;

    try {
      const response = await api.assignCoupon(couponId, [selectedUser.id]);
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
        text2: `Offer assigned to ${selectedUser.name}`,
      });

      setIsOfferModalVisible(false);
      setSelectedUser(null);
      setShowCreateOffer(false);
      loadCoupons();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to assign offer',
      });
    }
  };

  const handleCreateAndAssignOffer = async () => {
    if (!selectedUser) return;

    if (!newOffer.code || !newOffer.description || !newOffer.discountValue) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill all required fields',
      });
      return;
    }

    // Validate discount value
    const discountValueNum = parseFloat(newOffer.discountValue.trim());
    if (isNaN(discountValueNum) || discountValueNum <= 0) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid discount value',
      });
      return;
    }

    if (newOffer.discountType === 'percentage' && discountValueNum > 100) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Percentage discount cannot exceed 100%',
      });
      return;
    }

    try {
      // First create the coupon
      const createResponse = await api.createCoupon({
        code: newOffer.code.toUpperCase().trim(),
        description: newOffer.description.trim(),
        discountType: newOffer.discountType,
        discountValue: discountValueNum,
        applicableType: newOffer.applicableType,
      });

      if (createResponse.error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: createResponse.error,
        });
        return;
      }

      // Extract coupon ID from response
      // Response structure: { data: { message: '...', coupon: { id: '...', ... } } }
      const couponId = createResponse.data?.coupon?.id;
      
      if (!couponId) {
        console.error('Create coupon response:', createResponse);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to create coupon. Please try again.',
        });
        return;
      }

      // Then assign it to the user
      const assignResponse = await api.assignCoupon(couponId, [selectedUser.id]);
      if (assignResponse.error) {
        Toast.show({
          type: 'warning',
          text1: 'Warning',
          text2: `Coupon created but failed to assign: ${assignResponse.error}. You can assign it manually.`,
        });
        // Don't return here - coupon was created successfully
      } else {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: `Offer "${newOffer.code}" created and assigned to ${selectedUser.name}`,
        });
      }

      setIsOfferModalVisible(false);
      setSelectedUser(null);
      setShowCreateOffer(false);
      setNewOffer({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        applicableType: 'both',
      });
      loadCoupons();
    } catch (error: any) {
      console.error('Create offer error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to create and assign offer. Please check your connection and try again.',
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
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadUsers} />}
    >
      {users.map((user) => (
        <View key={user.id} style={styles.userCard}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userRole}>Role: {user.role}</Text>
            <Text style={styles.userKYC}>KYC: {user.kycVerified ? 'Verified' : 'Pending'}</Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.offerButton}
                onPress={() => handleGiveOffer(user)}
              >
                <Text style={styles.offerButtonText}>🎁 Give Offer</Text>
              </TouchableOpacity>
              {user.role !== 'admin' && (
                <TouchableOpacity
                  style={[styles.deleteButton, deleting === user.id && styles.deleteButtonDisabled]}
                  onPress={() => handleDeleteUser(user)}
                  disabled={deleting === user.id}
                >
                  <Text style={styles.deleteButtonText}>
                    {deleting === user.id ? 'Deleting...' : '🗑️ Delete User'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      ))}

      {/* Offer Assignment Modal */}
      <Modal
        visible={isOfferModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setIsOfferModalVisible(false);
          setSelectedUser(null);
          setShowCreateOffer(false);
          setNewOffer({
            code: '',
            description: '',
            discountType: 'percentage',
            discountValue: '',
            applicableType: 'both',
          });
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Give Offer to {selectedUser?.name}
            </Text>

            {/* Toggle between existing coupons and create new */}
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[styles.toggleButton, !showCreateOffer && styles.toggleButtonActive]}
                onPress={() => setShowCreateOffer(false)}
              >
                <Text style={[styles.toggleText, !showCreateOffer && styles.toggleTextActive]}>
                  Select Existing
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleButton, showCreateOffer && styles.toggleButtonActive]}
                onPress={() => setShowCreateOffer(true)}
              >
                <Text style={[styles.toggleText, showCreateOffer && styles.toggleTextActive]}>
                  Create New
                </Text>
              </TouchableOpacity>
            </View>

            {!showCreateOffer ? (
              <>
                <Text style={styles.modalSubtitle}>Select a coupon/offer to assign:</Text>
                <ScrollView style={styles.couponList}>
                  {coupons.filter(c => c.isActive).length === 0 ? (
                    <Text style={styles.emptyText}>No active coupons available</Text>
                  ) : (
                    coupons.filter(c => c.isActive).map((coupon) => (
                      <TouchableOpacity
                        key={coupon.id}
                        style={styles.couponItem}
                        onPress={() => handleAssignCoupon(coupon.id)}
                      >
                        <View style={styles.couponInfo}>
                          <Text style={styles.couponCode}>{coupon.code}</Text>
                          <Text style={styles.couponDescription}>{coupon.description}</Text>
                          <Text style={styles.couponDiscount}>
                            {coupon.discountType === 'percentage'
                              ? `${coupon.discountValue}% OFF`
                              : `₹${coupon.discountValue} OFF`}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  )}
                </ScrollView>
              </>
            ) : (
              <ScrollView style={styles.createOfferForm}>
                <Text style={styles.modalSubtitle}>Create a new offer for this user:</Text>
                
                <Text style={styles.inputLabel}>Offer Code *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., WELCOME10"
                  value={newOffer.code}
                  onChangeText={(text) => setNewOffer({ ...newOffer, code: text.toUpperCase() })}
                  autoCapitalize="characters"
                />

                <Text style={styles.inputLabel}>Description *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g., 10% off on first gold purchase"
                  value={newOffer.description}
                  onChangeText={(text) => setNewOffer({ ...newOffer, description: text })}
                  multiline
                />

                <Text style={styles.inputLabel}>Discount Type *</Text>
                <View style={styles.row}>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      newOffer.discountType === 'percentage' && styles.typeButtonActive,
                    ]}
                    onPress={() => setNewOffer({ ...newOffer, discountType: 'percentage' })}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        newOffer.discountType === 'percentage' && styles.typeButtonTextActive,
                      ]}
                    >
                      Percentage
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.typeButton,
                      newOffer.discountType === 'fixed' && styles.typeButtonActive,
                    ]}
                    onPress={() => setNewOffer({ ...newOffer, discountType: 'fixed' })}
                  >
                    <Text
                      style={[
                        styles.typeButtonText,
                        newOffer.discountType === 'fixed' && styles.typeButtonTextActive,
                      ]}
                    >
                      Fixed Amount
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.inputLabel}>
                  Discount Value * ({newOffer.discountType === 'percentage' ? '%' : '₹'})
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder={newOffer.discountType === 'percentage' ? '10' : '500'}
                  value={newOffer.discountValue}
                  onChangeText={(text) => {
                    // Remove any non-numeric characters except decimal point
                    const cleaned = text.replace(/[^0-9.]/g, '');
                    setNewOffer({ ...newOffer, discountValue: cleaned });
                  }}
                  keyboardType="decimal-pad"
                />

                <Text style={styles.inputLabel}>Applicable To *</Text>
                <View style={styles.row}>
                  <TouchableOpacity
                    style={[
                      styles.applicableButton,
                      newOffer.applicableType === 'both' && styles.applicableButtonActive,
                    ]}
                    onPress={() => setNewOffer({ ...newOffer, applicableType: 'both' })}
                  >
                    <Text
                      style={[
                        styles.applicableButtonText,
                        newOffer.applicableType === 'both' && styles.applicableButtonTextActive,
                      ]}
                    >
                      Both
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.applicableButton,
                      newOffer.applicableType === 'gold' && styles.applicableButtonActive,
                    ]}
                    onPress={() => setNewOffer({ ...newOffer, applicableType: 'gold' })}
                  >
                    <Text
                      style={[
                        styles.applicableButtonText,
                        newOffer.applicableType === 'gold' && styles.applicableButtonTextActive,
                      ]}
                    >
                      Gold
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.applicableButton,
                      newOffer.applicableType === 'silver' && styles.applicableButtonActive,
                    ]}
                    onPress={() => setNewOffer({ ...newOffer, applicableType: 'silver' })}
                  >
                    <Text
                      style={[
                        styles.applicableButtonText,
                        newOffer.applicableType === 'silver' && styles.applicableButtonTextActive,
                      ]}
                    >
                      Silver
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={styles.createButton}
                  onPress={handleCreateAndAssignOffer}
                >
                  <Text style={styles.createButtonText}>Create & Assign Offer</Text>
                </TouchableOpacity>
              </ScrollView>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setIsOfferModalVisible(false);
                setSelectedUser(null);
                setShowCreateOffer(false);
                setNewOffer({
                  code: '',
                  description: '',
                  discountType: 'percentage',
                  discountValue: '',
                  applicableType: 'both',
                });
              }}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D5BAA7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, backgroundColor: '#681412' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  userCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#681412', marginBottom: 4 },
  userEmail: { fontSize: 14, color: '#92422B', marginBottom: 4 },
  userRole: { fontSize: 12, color: '#92422B', marginBottom: 4 },
  userKYC: { fontSize: 12, color: '#92422B', marginBottom: 12 },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  offerButton: {
    backgroundColor: '#681412',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  offerButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  deleteButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
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
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#92422B',
    marginBottom: 16,
  },
  couponList: {
    maxHeight: 400,
    marginBottom: 16,
  },
  couponItem: {
    backgroundColor: '#F5E6D3',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E79A66',
  },
  couponInfo: {
    flex: 1,
  },
  couponCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#681412',
    marginBottom: 4,
    fontFamily: 'monospace',
  },
  couponDescription: {
    fontSize: 14,
    color: '#92422B',
    marginBottom: 4,
  },
  couponDiscount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#681412',
  },
  emptyText: {
    fontSize: 14,
    color: '#92422B',
    textAlign: 'center',
    padding: 20,
  },
  closeButton: {
    backgroundColor: '#681412',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E79A66',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#681412',
    borderColor: '#681412',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#681412',
  },
  toggleTextActive: {
    color: '#fff',
  },
  createOfferForm: {
    maxHeight: 400,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#681412',
    marginTop: 12,
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E79A66',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
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
  createButton: {
    backgroundColor: '#681412',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

