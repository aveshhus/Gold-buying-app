import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { api } from '../api/client';
import { usePriceStore } from '../store/priceStore';
import { formatCurrency } from '../utils';
import { Purchase } from '../types';
import Toast from 'react-native-toast-message';
import TaglineMarquee from './TaglineMarquee';
import RefundEligibilityCard from './RefundEligibilityCard';

export default function PortfolioView() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { prices, setPrices, setLoading } = usePriceStore();

  useEffect(() => {
    loadData();
    loadPrices();
    // Refresh prices every 30 seconds
    const priceInterval = setInterval(loadPrices, 30000);
    return () => clearInterval(priceInterval);
  }, []);

  const loadPrices = async () => {
    try {
      setLoading(true);
      const response = await api.getPrices();
      if (response.data) {
        setPrices(response.data);
      }
    } catch (error) {
      console.error('Error loading prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await api.getPurchases();
      if (response.data) {
        setPurchases(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load portfolio',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate totals - ALL purchases (digital gold) - matching web version
  const allGoldPurchases = purchases.filter((p) => p.type === 'gold');
  const allSilverPurchases = purchases.filter((p) => p.type === 'silver');
  
  // Total quantity purchased (all statuses)
  const totalGoldPurchased = allGoldPurchases.reduce((sum, p) => sum + p.quantity, 0);
  const totalSilverPurchased = allSilverPurchases.reduce((sum, p) => sum + p.quantity, 0);
  const totalQuantityPurchased = totalGoldPurchased + totalSilverPurchased;

  // Total amount paid (only paid/delivered purchases)
  const paidPurchases = purchases.filter((p) => p.status === 'paid' || p.status === 'delivered');
  const totalAmountPaid = paidPurchases.reduce((sum, p) => sum + (p.finalAmount || p.totalAmount), 0);

  // Total delivered quantity (only delivered purchases)
  const deliveredPurchases = purchases.filter((p) => p.status === 'delivered');
  const totalDeliveredGold = deliveredPurchases
    .filter((p) => p.type === 'gold')
    .reduce((sum, p) => sum + p.quantity, 0);
  const totalDeliveredSilver = deliveredPurchases
    .filter((p) => p.type === 'silver')
    .reduce((sum, p) => sum + p.quantity, 0);
  const totalDeliveredQuantity = totalDeliveredGold + totalDeliveredSilver;

  // Breakdown by purity - for purchased (all statuses)
  const gold24kPurchased = allGoldPurchases
    .filter((p) => p.purity === '24k')
    .reduce((sum, p) => sum + p.quantity, 0);
  const gold22kPurchased = allGoldPurchases
    .filter((p) => p.purity === '22k')
    .reduce((sum, p) => sum + p.quantity, 0);
  
  // Breakdown by purity - for delivered
  const gold24kDelivered = deliveredPurchases
    .filter((p) => p.type === 'gold' && p.purity === '24k')
    .reduce((sum, p) => sum + p.quantity, 0);
  const gold22kDelivered = deliveredPurchases
    .filter((p) => p.type === 'gold' && p.purity === '22k')
    .reduce((sum, p) => sum + p.quantity, 0);
  const silverDelivered = totalDeliveredSilver;

  // For portfolio value calculation - use paid/delivered purchases only (what user actually owns)
  const portfolioPurchases = purchases.filter(
    (p) => p.status === 'paid' || p.status === 'delivered'
  );

  const gold24kTotal = portfolioPurchases
    .filter((p) => p.type === 'gold' && p.purity === '24k')
    .reduce((sum, p) => sum + p.quantity, 0);
  const gold22kTotal = portfolioPurchases
    .filter((p) => p.type === 'gold' && p.purity === '22k')
    .reduce((sum, p) => sum + p.quantity, 0);
  const silverTotal = portfolioPurchases
    .filter((p) => p.type === 'silver')
    .reduce((sum, p) => sum + p.quantity, 0);

  // Calculate current values based on current market prices
  const gold24kValue = prices ? gold24kTotal * prices.gold24k : 0;
  const gold22kValue = prices ? gold22kTotal * prices.gold22k : 0;
  const silverValue = prices ? silverTotal * prices.silver : 0;
  const totalPortfolioValue = gold24kValue + gold22kValue + silverValue;
  const totalGrams = gold24kTotal + gold22kTotal + silverTotal;

  // Calculate total invested amount (sum of all paid/delivered purchase amounts)
  const totalInvestedAmount = portfolioPurchases.reduce(
    (sum, p) => sum + (p.finalAmount || p.totalAmount),
    0
  );

  // Calculate gain/loss
  const gainLossAmount = totalPortfolioValue - totalInvestedAmount;
  const gainLossPercentage = totalInvestedAmount > 0 
    ? (gainLossAmount / totalInvestedAmount) * 100 
    : 0;
  const hasGain = gainLossAmount >= 0;

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
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={loadData} />
      }
    >
      <TaglineMarquee />

      {/* Live Prices Card */}
      {prices && (
        <View style={styles.priceCard}>
          <View style={styles.priceRow}>
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>24K Gold</Text>
              <Text style={styles.priceValue}>{formatCurrency(prices.gold24k)}/g</Text>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>22K Gold</Text>
              <Text style={styles.priceValue}>{formatCurrency(prices.gold22k)}/g</Text>
            </View>
            <View style={styles.priceDivider} />
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Silver</Text>
              <Text style={styles.priceValue}>{formatCurrency(prices.silver)}/g</Text>
            </View>
          </View>
        </View>
      )}

      {/* Header Section - matching web version */}
      <View style={styles.headerSection}>
        <View style={styles.headerTitleContainer}>
          <View style={styles.headerDot} />
          <Text style={styles.headerTitle}>Your Gold & Silver Holdings</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Track your digital gold & silver investments, payments, and deliveries
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Total Portfolio Value</Text>
        <Text style={styles.summaryValue}>{formatCurrency(totalPortfolioValue)}</Text>
        <Text style={styles.summarySubtext}>Total Holdings: {totalGrams.toFixed(2)}g</Text>
        
        {/* Gain/Loss Section */}
        {totalInvestedAmount > 0 && (
          <>
            <View style={styles.gainLossDivider} />
            <View style={styles.gainLossRow}>
              <Text style={styles.gainLossLabel}>Invested Amount:</Text>
              <Text style={styles.gainLossInvested}>{formatCurrency(totalInvestedAmount)}</Text>
            </View>
            <View style={styles.gainLossRow}>
              <Text style={styles.gainLossLabel}>Gain/Loss:</Text>
              <View style={styles.gainLossValueContainer}>
                <Text style={[
                  styles.gainLossAmount,
                  hasGain ? styles.gainAmount : styles.lossAmount
                ]}>
                  {hasGain ? '+' : ''}{formatCurrency(gainLossAmount)}
                </Text>
                <Text style={[
                  styles.gainLossPercentage,
                  hasGain ? styles.gainPercentage : styles.lossPercentage
                ]}>
                  ({hasGain ? '+' : ''}{gainLossPercentage.toFixed(2)}%)
                </Text>
              </View>
            </View>
          </>
        )}
      </View>

      {/* Current Value Breakdown Section */}
      <View style={styles.breakdownSection}>
        <Text style={styles.sectionTitle}>Current Value Breakdown</Text>
        <View style={styles.breakdownCard}>
          {prices && (
            <>
              {/* 24K Gold Breakdown */}
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownLeft}>
                  <Text style={styles.breakdownLabel}>24K Gold</Text>
                  <Text style={styles.breakdownSubtext}>
                    {gold24kTotal.toFixed(4)}g × {formatCurrency(prices.gold24k)}/g = {formatCurrency(gold24kValue)}
                  </Text>
                </View>
                <View style={styles.breakdownRight}>
                  <Text style={styles.breakdownValue}>{formatCurrency(gold24kValue)}</Text>
                </View>
              </View>

              {/* 22K Gold Breakdown */}
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownLeft}>
                  <Text style={styles.breakdownLabel}>22K Gold</Text>
                  <Text style={styles.breakdownSubtext}>
                    {gold22kTotal.toFixed(4)}g × {formatCurrency(prices.gold22k)}/g = {formatCurrency(gold22kValue)}
                  </Text>
                </View>
                <View style={styles.breakdownRight}>
                  <Text style={styles.breakdownValue}>{formatCurrency(gold22kValue)}</Text>
                </View>
              </View>

              {/* Silver Breakdown */}
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownLeft}>
                  <Text style={styles.breakdownLabel}>Silver</Text>
                  <Text style={styles.breakdownSubtext}>
                    {silverTotal.toFixed(4)}g × {formatCurrency(prices.silver)}/g = {formatCurrency(silverValue)}
                  </Text>
                </View>
                <View style={styles.breakdownRight}>
                  <Text style={styles.breakdownValue}>{formatCurrency(silverValue)}</Text>
                </View>
              </View>

              {/* Total Separator */}
              <View style={styles.breakdownDivider} />

              {/* Total Value */}
              <View style={styles.breakdownRow}>
                <View style={styles.breakdownLeft}>
                  <Text style={styles.breakdownTotalLabel}>Total Value</Text>
                </View>
                <View style={styles.breakdownRight}>
                  <Text style={styles.breakdownTotalValue}>{formatCurrency(totalPortfolioValue)}</Text>
                </View>
              </View>
            </>
          )}
          {!prices && (
            <Text style={styles.loadingText}>Loading current prices...</Text>
          )}
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>24K Gold</Text>
          <Text style={styles.statValue}>{gold24kTotal.toFixed(2)}g</Text>
          <Text style={styles.statAmount}>{formatCurrency(gold24kValue)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>22K Gold</Text>
          <Text style={styles.statValue}>{gold22kTotal.toFixed(2)}g</Text>
          <Text style={styles.statAmount}>{formatCurrency(gold22kValue)}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.statCardFull]}>
          <Text style={styles.statLabel}>Silver</Text>
          <Text style={styles.statValue}>{silverTotal.toFixed(2)}g</Text>
          <Text style={styles.statAmount}>{formatCurrency(silverValue)}</Text>
        </View>
      </View>

      <View style={styles.purchasesSection}>
        <Text style={styles.sectionTitle}>Recent Purchases</Text>
        {purchases.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No purchases yet</Text>
            <Text style={styles.emptySubtext}>Start buying gold or silver to see your portfolio</Text>
          </View>
        ) : (
          purchases.slice(0, 10).map((purchase) => (
            <View key={purchase.id}>
              <View style={styles.purchaseCard}>
                <View style={styles.purchaseHeader}>
                  <Text style={styles.purchaseType}>
                    {purchase.type.toUpperCase()} {purchase.purity}
                  </Text>
                  <Text style={styles.purchaseStatus}>{purchase.status}</Text>
                </View>
                <Text style={styles.purchaseQuantity}>
                  {purchase.quantity}g - {formatCurrency(purchase.totalAmount || purchase.finalAmount || purchase.totalAmount)}
                </Text>
                {purchase.couponCode && (
                  <View style={styles.couponAppliedBadge}>
                    <Text style={styles.couponAppliedText}>
                      🎁 Offer {purchase.couponCode} applied - Saved {formatCurrency(purchase.discountAmount || 0)}
                    </Text>
                  </View>
                )}
              </View>
              <RefundEligibilityCard
                purchaseId={purchase.id}
                purchaseDate={purchase.createdAt}
                purchaseAmount={purchase.finalAmount || purchase.totalAmount}
                purchaseStatus={purchase.status}
              />
            </View>
          ))
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
  },
  priceCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceLabel: {
    fontSize: 12,
    color: '#92422B',
    marginBottom: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#681412',
    textAlign: 'center',
  },
  priceDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E5E5',
    marginHorizontal: 8,
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(146, 66, 43, 0.2)',
    marginBottom: 16,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#681412',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#681412',
    flex: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#92422B',
    fontWeight: '500',
    marginLeft: 16,
    marginTop: 4,
  },
  header: {
    padding: 20,
    backgroundColor: '#681412',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    color: '#92422B',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#681412',
    marginBottom: 4,
  },
  summarySubtext: {
    fontSize: 14,
    color: '#92422B',
  },
  gainLossDivider: {
    height: 1,
    backgroundColor: '#E79A66',
    marginVertical: 12,
    width: '100%',
  },
  gainLossRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
  },
  gainLossLabel: {
    fontSize: 14,
    color: '#92422B',
    fontWeight: '500',
  },
  gainLossInvested: {
    fontSize: 16,
    color: '#681412',
    fontWeight: '600',
  },
  gainLossValueContainer: {
    alignItems: 'flex-end',
  },
  gainLossAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  gainAmount: {
    color: '#16A34A', // Green for gains
  },
  lossAmount: {
    color: '#DC2626', // Red for losses
  },
  gainLossPercentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  gainPercentage: {
    color: '#16A34A', // Green for gains
  },
  lossPercentage: {
    color: '#DC2626', // Red for losses
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCardFull: {
    flex: 1,
  },
  statLabel: {
    fontSize: 14,
    color: '#92422B',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#681412',
    marginBottom: 4,
  },
  statAmount: {
    fontSize: 16,
    color: '#92422B',
  },
  purchasesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#681412',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#92422B',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#92422B',
    opacity: 0.7,
    textAlign: 'center',
  },
  purchaseCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  purchaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  purchaseType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#681412',
  },
  purchaseStatus: {
    fontSize: 12,
    color: '#92422B',
    textTransform: 'capitalize',
  },
  purchaseQuantity: {
    fontSize: 14,
    color: '#92422B',
  },
  breakdownSection: {
    padding: 16,
  },
  breakdownCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  breakdownLeft: {
    flex: 1,
    marginRight: 12,
  },
  breakdownLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#681412',
    marginBottom: 4,
  },
  breakdownSubtext: {
    fontSize: 12,
    color: '#92422B',
    opacity: 0.8,
  },
  breakdownRight: {
    alignItems: 'flex-end',
  },
  breakdownValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#681412',
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: '#E79A66',
    marginVertical: 8,
  },
  breakdownTotalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#681412',
  },
  breakdownTotalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#681412',
  },
  loadingText: {
    fontSize: 14,
    color: '#92422B',
    textAlign: 'center',
    padding: 20,
  },
  offersSection: {
    padding: 16,
  },
  offerCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E79A66',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  offerCardDisabled: {
    opacity: 0.6,
    borderColor: '#ccc',
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  offerCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  offerCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#681412',
    fontFamily: 'monospace',
  },
  offerDiscount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16A34A',
  },
  offerDescription: {
    fontSize: 14,
    color: '#92422B',
    marginBottom: 8,
  },
  offerDetails: {
    gap: 4,
    marginBottom: 8,
  },
  offerDetailText: {
    fontSize: 12,
    color: '#92422B',
    opacity: 0.8,
  },
  offerAction: {
    backgroundColor: '#D4EDDA',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#16A34A',
  },
  offerActionText: {
    fontSize: 12,
    color: '#155724',
    fontWeight: '600',
    textAlign: 'center',
  },
  usedBadge: {
    backgroundColor: '#F8D7DA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  usedBadgeText: {
    fontSize: 10,
    color: '#721C24',
    fontWeight: '600',
  },
  appliedCouponsSection: {
    padding: 16,
  },
  appliedCouponCard: {
    backgroundColor: '#D4EDDA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#16A34A',
  },
  appliedCouponHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appliedCouponCode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#155724',
    fontFamily: 'monospace',
  },
  appliedCouponStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16A34A',
  },
  appliedCouponInfo: {
    fontSize: 14,
    color: '#155724',
    marginBottom: 4,
  },
  appliedCouponDiscount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16A34A',
  },
  couponAppliedBadge: {
    backgroundColor: '#D4EDDA',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#16A34A',
  },
  couponAppliedText: {
    fontSize: 12,
    color: '#155724',
    fontWeight: '600',
  },
});

