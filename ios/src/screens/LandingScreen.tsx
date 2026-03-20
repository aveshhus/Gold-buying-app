import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { usePriceStore } from '../store/priceStore';
import { api } from '../api/client';
import { formatCurrency } from '../utils';

export default function LandingScreen() {
  const navigation = useNavigation();
  const { prices, setPrices, setLoading } = usePriceStore();

  useEffect(() => {
    loadPrices();
    const interval = setInterval(loadPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadPrices = async () => {
    setLoading(true);
    try {
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>💎 Shree Omji Saraf</Text>
        <View style={styles.priceRow}>
          {prices && (
            <>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>24K:</Text>
                <Text style={styles.priceValue}>{formatCurrency(prices.gold24k)}</Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>22K:</Text>
                <Text style={styles.priceValue}>{formatCurrency(prices.gold22k)}</Text>
              </View>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Silver:</Text>
                <Text style={styles.priceValue}>{formatCurrency(prices.silver)}</Text>
              </View>
            </>
          )}
        </View>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          Timeless Elegance{'\n'}& Craftsmanship
        </Text>
        <Text style={styles.heroSubtitle}>
          Shree Omji Saraf has been a beacon of elegance and craftsmanship for years,
          specializing in exquisite gold and diamond pieces.
        </Text>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Login' as never)}
        >
          <Text style={styles.ctaButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.features}>
        <Text style={styles.sectionTitle}>Why Choose Our Platform?</Text>
        {[
          { title: 'Real-Time Pricing', desc: 'Live gold and silver prices updated every 30 seconds.' },
          { title: 'Secure Transactions', desc: 'Bank-level security with KYC verification.' },
          { title: 'Portfolio Tracking', desc: 'Monitor your gold and silver holdings.' },
          { title: 'Easy Payments', desc: 'Multiple payment options with instant confirmation.' },
          { title: 'Fast Delivery', desc: 'Get physical delivery with OTP verification.' },
          { title: 'Instant Updates', desc: 'Real-time notifications for price changes.' },
        ].map((feature, index) => (
          <View key={index} style={styles.featureCard}>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDesc}>{feature.desc}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate('Login' as never)}
        >
          <Text style={styles.footerButtonText}>Start Trading Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D5BAA7',
  },
  header: {
    backgroundColor: '#681412',
    padding: 20,
    paddingTop: 60,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  priceItem: {
    alignItems: 'center',
    marginVertical: 8,
  },
  priceLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  hero: {
    padding: 30,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#681412',
    textAlign: 'center',
    marginBottom: 16,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#92422B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: '#681412',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  features: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#681412',
    marginBottom: 20,
    textAlign: 'center',
  },
  featureCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#681412',
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: 14,
    color: '#92422B',
    lineHeight: 20,
  },
  footer: {
    padding: 30,
    alignItems: 'center',
  },
  footerButton: {
    backgroundColor: '#681412',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 8,
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});










