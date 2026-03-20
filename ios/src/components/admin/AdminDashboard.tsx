import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { api } from '../../api/client';
import { formatCurrency } from '../../utils';
import { AdminStats } from '../../types';
import { usePriceStore } from '../../store/priceStore';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { prices } = usePriceStore();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAdminStats();
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
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
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadStats} />}
    >
      {prices && (
        <View style={styles.priceHeader}>
          <Text style={styles.priceText}>
            24K: {formatCurrency(prices.gold24k)} | 22K: {formatCurrency(prices.gold22k)} | Silver: {formatCurrency(prices.silver)}
          </Text>
        </View>
      )}
      {stats && (
        <View style={styles.stats}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Users</Text>
            <Text style={styles.statValue}>{stats.totalUsers}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Revenue</Text>
            <Text style={styles.statValue}>{formatCurrency(stats.totalRevenue)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Purchases</Text>
            <Text style={styles.statValue}>{stats.totalPurchases}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Pending Purchases</Text>
            <Text style={styles.statValue}>{stats.pendingPurchases}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#D5BAA7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  priceHeader: {
    backgroundColor: '#681412',
    padding: 16,
    paddingHorizontal: 20,
  },
  priceText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  stats: { padding: 16, gap: 12 },
  statCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12 },
  statLabel: { fontSize: 14, color: '#92422B', marginBottom: 8 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#681412' },
});

