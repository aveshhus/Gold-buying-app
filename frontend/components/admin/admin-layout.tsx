'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  Package,
  Users,
  Shield,
  LogOut,
  Bell,
  Menu,
  Tag,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { usePriceStore } from '@/store/usePriceStore';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import NotificationBell from '@/components/notifications/notification-bell';
import AdminDashboard from './admin-dashboard';
import AdminPurchases from './admin-purchases';
import AdminPayments from './admin-payments';
import AdminDeliveries from './admin-deliveries';
import AdminUsers from './admin-users';
import AdminKYCVerification from './admin-kyc-verification';
import AdminNotifications from './admin-notifications';
import AdminCoupons from './admin-coupons';
import AdminRefunds from './admin-refunds';
import AdminPrices from './admin-prices';
import Logo from '@/components/ui/logo';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

type Section = 'dashboard' | 'purchases' | 'payments' | 'deliveries' | 'users' | 'kyc' | 'notifications' | 'coupons' | 'refunds' | 'prices';

export default function AdminLayout() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const { prices, setPrices, setLoading } = usePriceStore();
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleLogout = () => {
    clearAuth();
    router.push('/');
    toast.success('Logged out successfully');
  };

  const menuItems = [
    { id: 'dashboard' as Section, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'purchases' as Section, label: 'Purchases', icon: ShoppingCart },
    { id: 'payments' as Section, label: 'Payments', icon: CreditCard },
    { id: 'deliveries' as Section, label: 'Deliveries', icon: Package },
        { id: 'users' as Section, label: 'Users', icon: Users },
        { id: 'kyc' as Section, label: 'KYC Verification', icon: Shield },
        { id: 'coupons' as Section, label: 'Coupons', icon: Tag },
        { id: 'refunds' as Section, label: 'Refunds', icon: DollarSign },
        { id: 'prices' as Section, label: 'Price Management', icon: TrendingUp },
        { id: 'notifications' as Section, label: 'Notifications', icon: Bell },
  ];

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#D5BAA7]">
      <header className="sticky top-0 z-50 w-full border-b bg-[#681412] backdrop-blur py-2">
        <div className="container flex h-16 md:h-20 items-center justify-between px-4 md:px-6 py-2 md:py-3">
          <div className="flex items-center gap-2 md:gap-4">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-white hover:bg-white/10"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="mobile-safe-area">
                <SheetHeader className="pb-6 border-b border-gray-200/50">
                  <SheetTitle className="text-left text-2xl font-bold text-[#681412] tracking-tight">Admin Menu</SheetTitle>
                  <p className="text-sm text-gray-500 mt-1">Navigate to different sections</p>
                </SheetHeader>
                <nav className="mt-6 space-y-1.5">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;

                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => handleSectionChange(item.id)}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-[#681412] to-[#92422B] text-white shadow-lg shadow-[#681412]/20'
                            : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
                          <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-[#92422B]'}`} />
                        </div>
                        <span className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-gray-700'}`}>{item.label}</span>
                        {isActive && (
                          <motion.div
                            className="ml-auto h-2 w-2 rounded-full bg-white"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
            <Logo variant="primary" size="md" />
            <p className="hidden sm:block text-xs text-white/80 font-serif italic">Admin Panel</p>
          </div>
          <div className="hidden lg:flex items-center gap-4 md:gap-6">
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
          <div className="flex items-center gap-2 md:gap-4">
            <NotificationBell />
            <span className="hidden sm:block text-xs md:text-sm text-white/90 truncate max-w-[100px] md:max-w-none">{user?.name}</span>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-white hover:bg-white/10">
              <LogOut className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container flex gap-4 md:gap-6 p-4 md:p-6">
        <aside className="hidden md:block w-64 shrink-0">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 min-w-0 w-full md:w-auto">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === 'dashboard' && <AdminDashboard />}
            {activeSection === 'purchases' && <AdminPurchases />}
            {activeSection === 'payments' && <AdminPayments />}
            {activeSection === 'deliveries' && <AdminDeliveries />}
            {activeSection === 'users' && <AdminUsers />}
            {activeSection === 'kyc' && <AdminKYCVerification />}
            {activeSection === 'coupons' && <AdminCoupons />}
            {activeSection === 'refunds' && <AdminRefunds />}
            {activeSection === 'prices' && <AdminPrices />}
            {activeSection === 'notifications' && <AdminNotifications />}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
