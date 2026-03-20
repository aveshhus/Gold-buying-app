import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { api } from '../../api/client';
import { formatDate } from '../../utils';
import { Delivery } from '../../types';

type FilterType = 'all' | 'today' | 'week' | 'custom';

export default function AdminDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAdminDeliveries();
      if (response.data) {
        setDeliveries(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error loading deliveries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter function based on date
  const filterByDate = (items: Delivery[]) => {
    if (filter === 'all' || filter === 'custom') return items;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    return items.filter(item => {
      const itemDate = new Date(item.deliveredAt || item.createdAt || Date.now());
      
      if (filter === 'today') {
        return itemDate >= todayStart;
      } else if (filter === 'week') {
        return itemDate >= weekStart;
      }
      
      return true;
    });
  };

  const filteredDeliveries = filterByDate(deliveries);
  const totalCount = filteredDeliveries.length;

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
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ flexGrow: 0 }}>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'all' && styles.filterTabActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterTabText, filter === 'all' && styles.filterTabTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'today' && styles.filterTabActive]}
            onPress={() => setFilter('today')}
          >
            <Text style={[styles.filterTabText, filter === 'today' && styles.filterTabTextActive]}>
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'week' && styles.filterTabActive]}
            onPress={() => setFilter('week')}
          >
            <Text style={[styles.filterTabText, filter === 'week' && styles.filterTabTextActive]}>
              This Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterTab, filter === 'custom' && styles.filterTabActive]}
            onPress={() => setFilter('custom')}
          >
            <Text style={[styles.filterTabText, filter === 'custom' && styles.filterTabTextActive]}>
              Custom Range
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {filteredDeliveries.map((delivery) => (
        <View key={delivery.id} style={styles.deliveryCard}>
          <Text style={styles.deliveryType}>{delivery.type.toUpperCase()} {delivery.purity}</Text>
          <Text style={styles.deliveryQuantity}>{delivery.quantity}g</Text>
          <Text style={styles.deliveryDate}>Delivered: {formatDate(delivery.deliveredAt)}</Text>
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
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabActive: {
    backgroundColor: '#681412',
    borderColor: '#681412',
  },
  filterTabText: {
    fontSize: 14,
    color: '#92422B',
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  deliveryCard: { backgroundColor: '#fff', margin: 16, padding: 16, borderRadius: 12 },
  deliveryType: { fontSize: 18, fontWeight: 'bold', color: '#681412', marginBottom: 4 },
  deliveryQuantity: { fontSize: 16, color: '#92422B', marginBottom: 4 },
  deliveryDate: { fontSize: 12, color: '#92422B' },
});

