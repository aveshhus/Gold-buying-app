import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { api } from '../../api/client';
import { User } from '../../types';
import Toast from 'react-native-toast-message';

export default function AdminKYC() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadKYCQueue();
  }, []);

  const loadKYCQueue = async () => {
    setIsLoading(true);
    try {
      const response = await api.getKYCQueue();
      if (response.data) {
        setUsers(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error loading KYC queue:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyKYC = async (userId: string, verified: boolean) => {
    try {
      const response = await api.verifyKYC(userId, verified);
      if (response.error) {
        Toast.show({ type: 'error', text1: 'Failed', text2: response.error });
        return;
      }
      Toast.show({ type: 'success', text1: 'Success', text2: verified ? 'KYC verified!' : 'KYC rejected' });
      loadKYCQueue();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to verify KYC' });
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
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadKYCQueue} />}
    >
      {users.map((user) => (
        <View key={user.id} style={styles.userCard}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userKYC}>PAN: {user.pan || 'N/A'}</Text>
          <Text style={styles.userKYC}>Aadhaar: {user.aadhaar || 'N/A'}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.verifyButton, styles.approveButton]}
              onPress={() => handleVerifyKYC(user.id, true)}
            >
              <Text style={styles.verifyButtonText}>Approve</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.verifyButton, styles.rejectButton]}
              onPress={() => handleVerifyKYC(user.id, false)}
            >
              <Text style={styles.verifyButtonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D5BAA7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, backgroundColor: '#681412' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  userCard: { backgroundColor: '#fff', margin: 16, padding: 16, borderRadius: 12 },
  userName: { fontSize: 18, fontWeight: 'bold', color: '#681412', marginBottom: 4 },
  userEmail: { fontSize: 14, color: '#92422B', marginBottom: 4 },
  userKYC: { fontSize: 12, color: '#92422B', marginBottom: 4 },
  buttonRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  verifyButton: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  approveButton: { backgroundColor: '#22c55e' },
  rejectButton: { backgroundColor: '#ef4444' },
  verifyButtonText: { color: '#fff', fontWeight: '600' },
});

