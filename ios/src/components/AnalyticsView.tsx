import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { api } from '../api/client';
import { formatCurrency } from '../utils';
import { Purchase } from '../types';
import TaglineMarquee from './TaglineMarquee';

export default function AnalyticsView() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await api.getPurchases();
      if (response.data) {
        setPurchases(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPurchases = purchases.length;
  const totalSpent = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const avgPurchase = totalPurchases > 0 ? totalSpent / totalPurchases : 0;

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#681412" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TaglineMarquee />
      <View style={styles.stats}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Purchases</Text>
          <Text style={styles.statValue}>{totalPurchases}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Total Spent</Text>
          <Text style={styles.statValue}>{formatCurrency(totalSpent)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Avg Purchase</Text>
          <Text style={styles.statValue}>{formatCurrency(avgPurchase)}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D5BAA7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, backgroundColor: '#681412' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  stats: { padding: 16, gap: 12 },
  statCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, alignItems: 'center' },
  statLabel: { fontSize: 14, color: '#92422B', marginBottom: 8 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#681412' },
});

