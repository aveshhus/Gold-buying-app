'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Shield,
  TrendingUp,
  Lock,
  Zap,
  Award,
  Users,
  BarChart3,
  CreditCard,
  Package,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Clock,
  Gem,
  Sparkle,
  Heart,
  FileCheck,
  Lightbulb,
  Facebook,
  Instagram,
  Globe,
} from 'lucide-react';
import LoginModal from '@/components/auth/login-modal';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import Logo from '@/components/ui/logo';
import { usePriceStore } from '@/store/usePriceStore';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function LandingPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { prices, setPrices, setLoading } = usePriceStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    loadPrices();
    const interval = setInterval(loadPrices, 30000); // Refresh every 30s
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

  const features = [
    {
      icon: TrendingUp,
      title: 'Real-Time Pricing',
      description: 'Live gold and silver prices updated every 30 seconds. Get the best rates in the market.',
      color: 'from-[#E79A66] to-[#92422B]', // Beige to Khaki
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'Bank-level security with KYC verification. Your investments are safe and protected.',
      color: 'from-[#681412] to-[#92422B]', // Maroon to Khaki
    },
    {
      icon: BarChart3,
      title: 'Portfolio Tracking',
      description: 'Monitor your gold and silver holdings with detailed analytics and value tracking.',
      color: 'from-[#92422B] to-[#E79A66]', // Khaki to Beige
    },
    {
      icon: CreditCard,
      title: 'Easy Payments',
      description: 'Multiple payment options with instant confirmation. Secure and hassle-free.',
      color: 'from-[#681412] to-[#E79A66]', // Maroon to Beige
    },
    {
      icon: Package,
      title: 'Fast Delivery',
      description: 'Get physical delivery at our store with OTP verification. Quick and secure pickup.',
      color: 'from-[#E79A66] to-[#D5BAA7]', // Beige to Light Beige
    },
    {
      icon: Zap,
      title: 'Instant Updates',
      description: 'Real-time notifications for price changes, order status, and delivery updates.',
      color: 'from-[#92422B] to-[#681412]', // Khaki to Maroon
    },
  ];

  const benefits = [
    '995 Pure Gold & Silver',
    'Transparent Pricing',
    'KYC Verified Platform',
    '24/7 Customer Support',
    'Secure Storage Options',
    'Competitive Rates',
  ];

  const stats = [
    { value: '10,000+', label: 'Happy Customers' },
    { value: '₹50Cr+', label: 'Transactions' },
    { value: '995', label: 'Purity Guaranteed' },
    { value: '24/7', label: 'Support Available' },
  ];

  return (
    <div className="min-h-screen bg-[#D5BAA7]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b bg-[#681412] backdrop-blur supports-[backdrop-filter]:bg-[#681412] py-2">
        <div className="container flex h-20 items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Logo variant="primary" size="md" />
          </div>
          <div className="hidden lg:flex items-center gap-6">
            {prices && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/70">24K:</span>
                  <span className="text-sm font-semibold text-white">{formatCurrency(prices.gold24k)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/70">22K:</span>
                  <span className="text-sm font-semibold text-white">{formatCurrency(prices.gold22k)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/70">Silver:</span>
                  <span className="text-sm font-semibold text-white">{formatCurrency(prices.silver)}</span>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setShowLoginModal(true)}
              className="hidden sm:flex text-white hover:text-white hover:bg-white/10 px-4"
            >
              Sign In
            </Button>
            <Button
              onClick={() => setShowLoginModal(true)}
              className="shadow-lg px-6"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 rounded-full border border-[#E79A66]/30 bg-[#D5BAA7]/30 px-4 py-2 text-sm text-[#681412] mb-6"
            >
              <Sparkles className="h-4 w-4" />
              <span>Heritage of Excellence Since Generations</span>
            </motion.div>
            
            <h1 className="text-4xl font-serif font-bold tracking-tight sm:text-6xl md:text-7xl mb-6">
              <span className="bg-gradient-to-r from-[#681412] via-[#92422B] to-[#E79A66] bg-clip-text text-transparent">
                Shree Omji Saraf
              </span>
              <br />
              <span className="text-[#681412] font-sans">Timeless Elegance & Craftsmanship</span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground sm:text-xl mb-8 font-serif italic">
              Welcome to Shree Omji Saraf, a distinguished name in the Indian jewelry industry, where timeless tradition meets modern elegance. Based in the heart of India, our brand is renowned for crafting exquisite pieces in silver, gold, and diamonds, each designed to capture the essence of beauty and sophistication. With a legacy of excellence and a commitment to quality, Shree Omji Saraf stands as a testament to the rich heritage of Indian craftsmanship.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => setShowLoginModal(true)}
                className="text-lg px-8 py-6 h-auto"
              >
                Start Trading Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-lg px-8 py-6 h-auto"
              >
                Learn More
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-[#681412]">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-6xl"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to invest in precious metals with confidence and ease.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <div className="h-full border-2 rounded-lg border-border bg-card p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} mb-4`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="container px-4 py-20 bg-muted/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Your Trust, Our Commitment
            </h2>
            <p className="text-lg text-muted-foreground">
              We ensure the highest standards in every transaction
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="h-5 w-5 text-primary-600 flex-shrink-0" />
                <span className="text-lg">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Our Story Section */}
      <section className="container px-4 py-20 bg-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 font-serif italic">
              Our Story
            </h2>
          </div>
          <div className="rounded-lg border bg-card p-8 md:p-12">
            <p className="text-lg text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
              Founded with a vision to celebrate the artistry of jewelry making, Shree Omji Saraf has been a 
              trusted name for generations. Our journey began in the vibrant city of Jaipur, where the art of 
              jewelry crafting has been passed down through centuries. Over the years, we have evolved, 
              embracing contemporary designs while honoring traditional techniques, creating a unique blend 
              that appeals to both classic and modern tastes.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Our Craftsmanship Section */}
      <section className="container px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Our Craftsmanship
            </h2>
          </div>
          <div className="rounded-lg border bg-card p-8 md:p-12">
            <div className="flex justify-center mb-6">
              <Gem className="h-12 w-12 text-[#681412]" />
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
              Our commitment to quality is reflected in our craftsmanship. At Shree Omji Saraf, each piece is 
              crafted by skilled artisans who bring years of experience and expertise to their work. We use only 
              the finest materials, ensuring that every piece of jewelry is not only beautiful but also enduring.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Our Values Section */}
      <section className="container px-4 py-20 bg-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-6xl"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 font-serif">
              Our <span className="italic">Values</span>
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-lg border-2 border-[#681412]/20 bg-card p-6 text-center"
            >
              <Award className="h-10 w-10 text-[#681412] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 font-serif italic">Quality</h3>
              <p className="text-muted-foreground">
                We believe in delivering only the best. Every piece of jewelry undergoes rigorous quality checks 
                to ensure it meets our high standards.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-lg border-2 border-[#681412]/20 bg-card p-6 text-center"
            >
              <Heart className="h-10 w-10 text-[#681412] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 font-serif italic">Integrity</h3>
              <p className="text-muted-foreground">
                Trust and transparency are at the core of our business. We are committed to ethical practices 
                and honest dealings with our customers.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="rounded-lg border-2 border-[#681412]/20 bg-card p-6 text-center"
            >
              <Lightbulb className="h-10 w-10 text-[#681412] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 font-serif italic">Innovation</h3>
              <p className="text-muted-foreground">
                While we honor tradition, we are always looking to innovate, bringing fresh ideas and designs 
                to our collections.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Why Choose Us Section */}
      <section className="container px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-6xl"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Why Choose Us?
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-lg border bg-card p-6"
            >
              <FileCheck className="h-10 w-10 text-[#681412] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Authenticity</h3>
              <p className="text-muted-foreground">
                Our jewelry comes with a certificate of authenticity, guaranteeing the quality and purity of 
                each piece.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-lg border bg-card p-6"
            >
              <Users className="h-10 w-10 text-[#681412] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Customer Service</h3>
              <p className="text-muted-foreground">
                We pride ourselves on our exceptional customer service, offering personalized assistance to help 
                you find the perfect piece.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="rounded-lg border bg-card p-6"
            >
              <Award className="h-10 w-10 text-[#681412] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Heritage</h3>
              <p className="text-muted-foreground">
                With a rich legacy in jewelry making, we bring years of expertise and tradition to every piece 
                we create.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Jewelry Collections Section */}
      <section className="container px-4 py-20 bg-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-6xl"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Our Collections
            </h2>
            <p className="text-lg text-muted-foreground">
              At Shree Omji Saraf, we offer an extensive range of jewelry, each piece crafted with precision and passion
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-lg border bg-card p-6"
            >
              <Sparkle className="h-10 w-10 text-[#E79A66] mb-4" />
              <h3 className="text-xl font-semibold mb-3">Gold Jewelry</h3>
              <p className="text-muted-foreground">
                Our gold collection features an array of stunning designs, from intricate traditional motifs to sleek 
                modern styles. Whether you're looking for a statement piece or everyday elegance, our gold jewelry is 
                designed to enhance every occasion.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-lg border bg-card p-6"
            >
              <Gem className="h-10 w-10 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Silver Jewelry</h3>
              <p className="text-muted-foreground">
                Discover the beauty of our silver jewelry, known for its versatility and charm. From elegant earrings 
                to ornate necklaces, our silver pieces are perfect for those who appreciate understated elegance and 
                contemporary flair.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="rounded-lg border bg-card p-6"
            >
              <Sparkles className="h-10 w-10 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold mb-3">Diamond Jewelry</h3>
              <p className="text-muted-foreground">
                Our diamond collection is a celebration of luxury and brilliance. Each piece is meticulously crafted 
                to highlight the natural beauty of diamonds, offering a dazzling array of options for those seeking 
                something truly special.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 border-0 text-white rounded-lg p-12">
              <h2 className="text-3xl font-bold mb-4 sm:text-4xl">
                Ready to Start Investing?
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of satisfied customers and start your precious metals 
                investment journey today. Secure, transparent, and trusted.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  onClick={() => setShowLoginModal(true)}
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-6 h-auto"
                >
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  onClick={() => setShowLoginModal(true)}
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 text-lg px-8 py-6 h-auto"
                >
                  Sign In
                </Button>
              </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container px-4 py-12">
          {/* Main Footer Content - 6 Columns */}
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-8">
            {/* Column 1: Business Description */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">💎</span>
                <span className="font-bold text-base">Shree Omji Saraf</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A distinguished name in the Indian jewelry industry, where timeless tradition meets modern elegance. 
                Crafting exquisite pieces in silver, gold, and diamonds with a legacy of excellence.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="font-semibold mb-4 text-sm">Quick Links</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="hover:text-foreground transition-colors cursor-pointer">Live Prices</li>
                <li className="hover:text-foreground transition-colors cursor-pointer">Portfolio</li>
                <li className="hover:text-foreground transition-colors cursor-pointer">Buy Gold/Silver</li>
                <li className="hover:text-foreground transition-colors cursor-pointer">Delivery</li>
              </ul>
            </div>

            {/* Column 3: Visit Us */}
            <div>
              <h3 className="font-semibold mb-4 text-sm flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#681412]" />
                Visit Us
              </h3>
              <div className="text-xs text-muted-foreground leading-relaxed">
                <p>
                  Vaishali Nagar<br />
                  Jaipur, Rajasthan<br />
                  India
                </p>
              </div>
            </div>

            {/* Column 4: Contact Us */}
            <div>
              <h3 className="font-semibold mb-4 text-sm">Contact Us</h3>
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Phone className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-[#681412]" />
                  <a href="tel:+919799089292" className="hover:text-[#681412] transition-colors">
                    +91 97990 89292
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-[#681412]" />
                  <a href="mailto:shreeomjisaraf@gmail.com" className="hover:text-[#681412] transition-colors break-all">
                    shreeomjisaraf@gmail.com
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Globe className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-[#681412]" />
                  <a href="https://www.shreeomjisaraf.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#681412] transition-colors break-all">
                    www.shreeomjisaraf.com
                  </a>
                </li>
                <li className="flex items-center gap-2 pt-1">
                  <a href="https://facebook.com/shreeomjisaraf" target="_blank" rel="noopener noreferrer" className="hover:text-[#681412] transition-colors">
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a href="https://instagram.com/shreeomjisaraf" target="_blank" rel="noopener noreferrer" className="hover:text-[#681412] transition-colors">
                    <Instagram className="h-4 w-4" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 5: Support */}
            <div>
              <h3 className="font-semibold mb-4 text-sm">Support</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <a href="/about-us" className="hover:text-[#681412] transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/contact-us" className="hover:text-[#681412] transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/address" className="hover:text-[#681412] transition-colors">
                    Address
                  </a>
                </li>
                <li>
                  <a href="/contact-us" className="hover:text-[#681412] transition-colors">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 6: Legal */}
            <div>
              <h3 className="font-semibold mb-4 text-sm">Legal</h3>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <a href="/terms" className="hover:text-[#681412] transition-colors">
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a href="/refund-policy" className="hover:text-[#681412] transition-colors">
                    Refund Policy
                  </a>
                </li>
                <li>
                  <a href="/charge-back" className="hover:text-[#681412] transition-colors">
                    Chargeback Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-[#681412] transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-muted-foreground text-center md:text-left">
                © 2024 Shree Omji Saraf. All rights reserved.
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">Follow us:</span>
                <div className="flex gap-2">
                  <a href="https://facebook.com/shreeomjisaraf" target="_blank" rel="noopener noreferrer" className="hover:text-[#681412] transition-colors">
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a href="https://instagram.com/shreeomjisaraf" target="_blank" rel="noopener noreferrer" className="hover:text-[#681412] transition-colors">
                    <Instagram className="h-4 w-4" />
                  </a>
                </div>
                <span className="text-xs text-muted-foreground">@SHREEOMJISARAF</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
    </div>
  );
}
