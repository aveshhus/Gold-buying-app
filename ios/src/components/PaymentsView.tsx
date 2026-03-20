import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { api } from '../api/client';
import { formatCurrency, formatDate } from '../utils';
import { Payment } from '../types';
import Toast from 'react-native-toast-message';
import TaglineMarquee from './TaglineMarquee';

export default function PaymentsView() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setIsLoading(true);
    try {
      const response = await api.getPayments();
      if (response.data) {
        setPayments(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load payments' });
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
      <TaglineMarquee />
      {payments.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No payments yet</Text>
        </View>
      ) : (
        payments.map((payment) => (
          <View key={payment.id} style={styles.paymentCard}>
            <View style={styles.paymentHeader}>
              <Text style={styles.paymentAmount}>{formatCurrency(payment.amount)}</Text>
              <Text style={[styles.paymentStatus, payment.status === 'completed' && styles.statusCompleted]}>
                {payment.status}
              </Text>
            </View>
            <Text style={styles.paymentDate}>{formatDate(payment.createdAt)}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D5BAA7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, backgroundColor: '#681412' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#92422B' },
  paymentCard: { backgroundColor: '#fff', margin: 16, padding: 16, borderRadius: 12 },
  paymentHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  paymentAmount: { fontSize: 20, fontWeight: 'bold', color: '#681412' },
  paymentStatus: { fontSize: 14, color: '#92422B', textTransform: 'capitalize' },
  statusCompleted: { color: '#22c55e' },
  paymentDate: { fontSize: 12, color: '#92422B' },
});

