import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { api } from '../../api/client';
import { formatCurrency, formatDate } from '../../utils';
import { Payment } from '../../types';

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAdminPayments();
      if (response.data) {
        setPayments(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setIsLoading(false);
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
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadPayments} />}
    >
      {payments.map((payment) => (
        <View key={payment.id} style={styles.paymentCard}>
          <Text style={styles.paymentAmount}>{formatCurrency(payment.amount)}</Text>
          <Text style={styles.paymentStatus}>Status: {payment.status}</Text>
          <Text style={styles.paymentDate}>{formatDate(payment.createdAt)}</Text>
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
  paymentCard: { backgroundColor: '#fff', margin: 16, padding: 16, borderRadius: 12 },
  paymentAmount: { fontSize: 20, fontWeight: 'bold', color: '#681412', marginBottom: 4 },
  paymentStatus: { fontSize: 14, color: '#92422B', marginBottom: 4 },
  paymentDate: { fontSize: 12, color: '#92422B' },
});

