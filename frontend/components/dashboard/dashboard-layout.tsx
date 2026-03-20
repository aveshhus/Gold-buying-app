'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  CreditCard, 
  Package, 
  User,
  LogOut,
  BarChart3,
  TrendingUp,
  Bell,
  Shield,
  FileText,
  HelpCircle,
  Menu,
  Info,
  Phone,
  MapPin,
  FileCheck,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';
import { usePriceStore } from '@/store/usePriceStore';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Purchase } from '@/types';
import PortfolioView from './portfolio-view';
import PurchaseView from './purchase-view';
import PaymentsView from './payments-view';
import DeliveriesView from './deliveries-view';
import ProfileView from './profile-view';
import AnalyticsView from './analytics-view';
import PriceChart from './price-chart';
import PriceAlerts from './price-alerts';
import SecurityCenter from '../security/security-center';
import TransactionLedger from '../transactions/transaction-ledger';
import HelpSupport from '../support/help-support';
import { AboutUsView, ContactUsView, AddressView, TermsView, RefundPolicyView, ChargeBackView } from './information-views';
import FloatingHelpButton from '../support/floating-help-button';
import { toast } from 'sonner';
import Logo from '@/components/ui/logo';
import NotificationBell from '@/components/notifications/notification-bell';
import Image from 'next/image';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { MobileBottomNav } from '@/components/ui/mobile-bottom-nav';

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

type Section = 'portfolio' | 'purchase' | 'payments' | 'deliveries' | 'profile' | 'analytics' | 'charts' | 'alerts' | 'security' | 'transactions' | 'support' | 'about-us' | 'contact-us' | 'address' | 'terms' | 'refund-policy' | 'charge-back';

interface DashboardLayoutProps {
  initialSection?: string | null;
}

export default function DashboardLayout({ initialSection }: DashboardLayoutProps) {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const { prices, setPrices, setLoading } = usePriceStore();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [activeSection, setActiveSection] = useState<Section>(
    (initialSection as Section) || 'portfolio'
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  useEffect(() => {
    loadPrices();
    loadPurchases();
    loadProfilePhoto();
    const priceInterval = setInterval(loadPrices, 30000); // Refresh every 30s
    return () => clearInterval(priceInterval);
  }, []);

  // Listen for profile photo updates (from ProfileView component)
  useEffect(() => {
    const handleProfilePhotoUpdate = () => {
      loadProfilePhoto();
    };
    
    window.addEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);
    return () => {
      window.removeEventListener('profilePhotoUpdated', handleProfilePhotoUpdate);
    };
  }, []);

  const loadProfilePhoto = async () => {
    try {
      const response = await api.getCurrentUser();
      if (response.data?.profilePhoto) {
        let photoUrl = response.data.profilePhoto;
        // Convert relative URL to absolute if needed
        if (photoUrl.startsWith('/uploads/')) {
          photoUrl = `http://localhost:3001${photoUrl}`;
        }
        // Add cache busting
        const baseUrl = photoUrl.split('?')[0];
        const timestamp = Date.now();
        const random = Math.random();
        setProfilePhoto(`${baseUrl}?t=${timestamp}&v=${random}`);
      } else {
        setProfilePhoto(null);
      }
    } catch (error) {
      console.error('Error loading profile photo:', error);
    }
  };

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

  const loadPurchases = async () => {
    try {
      const response = await api.getPurchases();
      if (response.data) {
        setPurchases(response.data);
      }
    } catch (error) {
      console.error('Error loading purchases:', error);
    }
  };

  // Calculate portfolio summary - include both "paid" and "delivered" purchases (user owns these)
  const portfolioPurchases = purchases.filter((p) => p.status === 'paid' || p.status === 'delivered');
  const gold24kTotal = portfolioPurchases
    .filter((p) => p.type === 'gold' && p.purity === '24k')
    .reduce((sum, p) => sum + p.quantity, 0);
  const gold22kTotal = portfolioPurchases
    .filter((p) => p.type === 'gold' && p.purity === '22k')
    .reduce((sum, p) => sum + p.quantity, 0);
  const silverTotal = portfolioPurchases
    .filter((p) => p.type === 'silver')
    .reduce((sum, p) => sum + p.quantity, 0);
  
  const gold24kValue = prices ? gold24kTotal * prices.gold24k : 0;
  const gold22kValue = prices ? gold22kTotal * prices.gold22k : 0;
  const silverValue = prices ? silverTotal * prices.silver : 0;
  const totalPortfolioValue = gold24kValue + gold22kValue + silverValue;
  const totalGrams = gold24kTotal + gold22kTotal + silverTotal;

  const handleLogout = () => {
    clearAuth();
    router.push('/');
    toast.success('Logged out successfully');
  };

  const menuItems = [
    { id: 'portfolio' as Section, label: 'Portfolio', icon: LayoutDashboard },
    { id: 'charts' as Section, label: 'Price Charts', icon: TrendingUp },
    { id: 'alerts' as Section, label: 'Price Alerts', icon: Bell },
    { id: 'purchase' as Section, label: 'Buy Gold/Silver', icon: ShoppingCart },
    { id: 'analytics' as Section, label: 'Analytics', icon: BarChart3 },
    { id: 'payments' as Section, label: 'Payments', icon: CreditCard },
    { id: 'transactions' as Section, label: 'Transactions', icon: FileText },
    { id: 'deliveries' as Section, label: 'Deliveries', icon: Package },
    { id: 'security' as Section, label: 'Security', icon: Shield },
    { id: 'support' as Section, label: 'Help & Support', icon: HelpCircle },
    { id: 'profile' as Section, label: 'Profile', icon: User },
  ];

  const handleSectionChange = (section: Section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  // WhatsApp number - update this with your actual WhatsApp number
  const whatsappNumber = '919799089292'; // Format: country code + number without + or spaces
  const whatsappMessage = encodeURIComponent('Hello! I need help with my account.');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#D5BAA7] via-[#E79A66]/20 to-[#D5BAA7]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-[#92422B]/30 bg-gradient-to-r from-[#681412] via-[#7a1a18] to-[#681412] shadow-2xl backdrop-blur-md supports-[backdrop-filter]:bg-[#681412]/98">
        <div className="container mx-auto flex h-20 md:h-24 items-center justify-between px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-2 md:gap-4 min-w-0 flex-shrink-0">
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
              <SheetContent side="left" className="mobile-safe-area flex flex-col h-full">
                <SheetHeader className="pb-6 border-b border-gray-200/50 flex-shrink-0">
                  <div className="flex items-center justify-center mb-4">
                    <Image 
                      src="/Secondary.png" 
                      alt="Shree Omji Saraf" 
                      width={140}
                      height={50}
                      className="h-12 w-auto object-contain"
                      priority
                    />
                  </div>
                  <SheetTitle className="text-left text-2xl font-bold text-[#681412] tracking-tight">Dashboard</SheetTitle>
                  <p className="text-sm text-gray-500 mt-1">Manage your investments</p>
                </SheetHeader>
                <nav className="mt-6 space-y-1.5 flex-1 overflow-y-auto -webkit-overflow-scrolling-touch">
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
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2 px-4">Information</p>
                    {[
                      { id: 'about-us', label: 'About Us', icon: Info },
                      { id: 'contact-us', label: 'Contact Us', icon: Phone },
                      { id: 'address', label: 'Address', icon: MapPin },
                      { id: 'terms', label: 'Terms & Conditions', icon: FileCheck },
                      { id: 'refund-policy', label: 'Refund Policy', icon: RotateCcw },
                      { id: 'charge-back', label: 'Chargeback Policy', icon: AlertTriangle },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <motion.button
                          key={item.id}
                          onClick={() => {
                            router.push(`/${item.id}`);
                            setMobileMenuOpen(false);
                          }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all duration-200 text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                        >
                          <div className="p-2 rounded-lg bg-gray-100">
                            <Icon className="h-5 w-5 text-[#92422B]" />
                          </div>
                          <span className="font-semibold text-sm text-gray-700">{item.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
            {/* Mobile Logo - Secondary.png */}
            <div className="md:hidden flex items-center justify-center">
              <Image 
                src="/Secondary.png" 
                alt="Shree Omji Saraf" 
                width={140}
                height={50}
                className="h-10 w-auto object-contain"
                priority
              />
            </div>
            {/* Desktop Logo - Primary.png */}
            <div className="hidden md:flex items-center justify-center">
              <Image 
                src="/Primary.png" 
                alt="Shree Omji Saraf" 
                width={240}
                height={90}
                className="h-20 md:h-24 lg:h-28 w-auto object-contain"
                priority
              />
            </div>
            <div className="hidden md:block h-8 w-px bg-white/20 flex-shrink-0"></div>
            <div className="hidden md:block min-w-0">
              <p className="text-xs text-white/60 font-medium leading-tight">Dashboard</p>
              <p className="text-sm text-white font-semibold leading-tight">Investment Portfolio</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-3 flex-1 justify-center max-w-2xl mx-4">
            {prices && (
              <div className="flex items-center gap-2.5 px-3.5 py-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-white/80 font-medium whitespace-nowrap">24K:</span>
                  <span className="text-sm font-bold text-white whitespace-nowrap">{formatCurrency(prices.gold24k)}</span>
                </div>
                <div className="h-4 w-px bg-white/30 flex-shrink-0"></div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-white/80 font-medium whitespace-nowrap">22K:</span>
                  <span className="text-sm font-bold text-white whitespace-nowrap">{formatCurrency(prices.gold22k)}</span>
                </div>
                <div className="h-4 w-px bg-white/30 flex-shrink-0"></div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-white/80 font-medium whitespace-nowrap">Silver:</span>
                  <span className="text-sm font-bold text-white whitespace-nowrap">{formatCurrency(prices.silver)}</span>
                </div>
              </div>
            )}
            {totalPortfolioValue > 0 && (
              <div className="flex items-center gap-2.5 px-3.5 py-2 bg-[#92422B]/30 rounded-lg backdrop-blur-sm border border-[#92422B]/40 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-white/80 flex-shrink-0" />
                  <span className="text-xs text-white/80 font-medium whitespace-nowrap">Portfolio:</span>
                  <span className="text-sm font-bold text-white whitespace-nowrap">{formatCurrency(totalPortfolioValue)}</span>
                </div>
                <div className="h-4 w-px bg-white/30 flex-shrink-0"></div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-white/80 font-medium whitespace-nowrap">Holdings:</span>
                  <span className="text-sm font-bold text-white whitespace-nowrap">{totalGrams.toFixed(2)} g</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 md:gap-2.5 flex-shrink-0">
            <NotificationBell />
            <div 
              onClick={() => setActiveSection('profile')}
              className="hidden sm:flex items-center gap-2 px-2 md:px-3 py-1.5 bg-white/10 rounded-lg border border-white/10 flex-shrink-0 cursor-pointer hover:bg-white/20 transition-colors"
            >
              {profilePhoto ? (
                <div className="h-7 w-7 md:h-8 md:w-8 rounded-full overflow-hidden border border-white/20 flex-shrink-0 bg-gray-100">
                  <img
                    key={profilePhoto}
                    src={profilePhoto}
                    alt={user?.name || 'User'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to default avatar on error
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="h-full w-full bg-[#92422B] flex items-center justify-center"><svg class="h-3.5 w-3.5 md:h-4 md:w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></div>';
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-[#92422B] flex items-center justify-center flex-shrink-0">
                  <User className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                </div>
              )}
              <span className="text-xs md:text-sm text-white font-medium whitespace-nowrap max-w-[80px] md:max-w-[120px] truncate">{user?.name}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout} 
              className="text-white hover:bg-white/10 rounded-lg transition-all flex-shrink-0"
            >
              <LogOut className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>
        </div>
        {/* Mobile Prices & Portfolio Row */}
        <div className="md:hidden border-t border-white/10 bg-[#681412]/95">
          <div className="container mx-auto px-4 py-2.5">
            <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide pb-1">
              {prices && (
                <>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 flex-shrink-0">
                    <span className="text-[10px] text-white/70 font-medium whitespace-nowrap">24K:</span>
                    <span className="text-xs font-bold text-white whitespace-nowrap">{formatCurrency(prices.gold24k)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 flex-shrink-0">
                    <span className="text-[10px] text-white/70 font-medium whitespace-nowrap">22K:</span>
                    <span className="text-xs font-bold text-white whitespace-nowrap">{formatCurrency(prices.gold22k)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/10 rounded-lg backdrop-blur-sm border border-white/10 flex-shrink-0">
                    <span className="text-[10px] text-white/70 font-medium whitespace-nowrap">Silver:</span>
                    <span className="text-xs font-bold text-white whitespace-nowrap">{formatCurrency(prices.silver)}</span>
                  </div>
                </>
              )}
              {totalPortfolioValue > 0 && (
                <>
                  <div className="h-6 w-px bg-white/20 flex-shrink-0"></div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#92422B]/30 rounded-lg backdrop-blur-sm border border-[#92422B]/40 flex-shrink-0">
                    <Package className="h-3 w-3 text-white/80 flex-shrink-0" />
                    <span className="text-[10px] text-white/70 font-medium whitespace-nowrap">Portfolio:</span>
                    <span className="text-xs font-bold text-white whitespace-nowrap">{formatCurrency(totalPortfolioValue)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#92422B]/30 rounded-lg backdrop-blur-sm border border-[#92422B]/40 flex-shrink-0">
                    <span className="text-[10px] text-white/70 font-medium whitespace-nowrap">Holdings:</span>
                    <span className="text-xs font-bold text-white whitespace-nowrap">{totalGrams.toFixed(2)}g</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container flex gap-4 md:gap-8 p-4 md:p-8 pb-20 md:pb-8">
        {/* Sidebar */}
        <aside className="hidden md:block w-80 shrink-0">
          <div className="sticky top-28">
            <nav className="space-y-2 p-4 bg-white/60 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-2xl">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <motion.button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-left transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#681412] to-[#92422B] text-white shadow-lg scale-[1.02]'
                        : 'text-gray-700 hover:bg-white/80 hover:text-[#681412] hover:shadow-md'
                    }`}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-[#92422B]'}`} />
                    <span className={`font-medium ${isActive ? 'text-white' : 'text-gray-700'}`}>{item.label}</span>
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
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2 px-5">Information</p>
                {[
                  { id: 'about-us', label: 'About Us', icon: Info },
                  { id: 'contact-us', label: 'Contact Us', icon: Phone },
                  { id: 'address', label: 'Address', icon: MapPin },
                  { id: 'terms', label: 'Terms & Conditions', icon: FileCheck },
                  { id: 'refund-policy', label: 'Refund Policy', icon: RotateCcw },
                  { id: 'charge-back', label: 'Chargeback Policy', icon: AlertTriangle },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveSection(item.id as Section)}
                      className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl text-left transition-all duration-300 ${
                        activeSection === item.id
                          ? 'bg-white/80 text-[#681412] shadow-md'
                          : 'text-gray-700 hover:bg-white/80 hover:text-[#681412] hover:shadow-md'
                      }`}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="h-5 w-5 text-[#92422B]" />
                      <span className="font-medium text-gray-700">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 w-full md:w-auto">
          {/* Running Tagline */}
          <div className="w-full mb-4 md:mb-6">
            <div className="bg-gradient-to-r from-[#681412] via-[#92422B] to-[#681412] text-white py-3 md:py-4 overflow-hidden relative rounded-xl">
              <div className="flex animate-marquee whitespace-nowrap">
                <div className="flex items-center gap-8 px-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-sm md:text-base font-semibold">
                      ✨ Here, you don't buy digital gold you buy real, physical gold and silver. ✨
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white/50 backdrop-blur-md rounded-2xl border-2 border-white/30 shadow-2xl p-4 md:p-8"
          >
            {activeSection === 'portfolio' && <PortfolioView />}
            {activeSection === 'charts' && <PriceChart />}
            {activeSection === 'alerts' && <PriceAlerts />}
            {activeSection === 'purchase' && <PurchaseView />}
            {activeSection === 'analytics' && <AnalyticsView />}
            {activeSection === 'payments' && <PaymentsView />}
            {activeSection === 'transactions' && <TransactionLedger />}
            {activeSection === 'deliveries' && <DeliveriesView />}
            {activeSection === 'security' && <SecurityCenter />}
            {activeSection === 'support' && <HelpSupport />}
            {activeSection === 'profile' && <ProfileView />}
            {activeSection === 'about-us' && <AboutUsView />}
            {activeSection === 'contact-us' && <ContactUsView />}
            {activeSection === 'address' && <AddressView />}
            {activeSection === 'terms' && <TermsView />}
            {activeSection === 'refund-policy' && <RefundPolicyView />}
            {activeSection === 'charge-back' && <ChargeBackView />}
          </motion.div>
        </main>
      </div>

      {/* Floating Help Button - Available on all pages */}
      <FloatingHelpButton currentSection={activeSection} />

      {/* WhatsApp Floating Button */}
      <motion.a
        href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-24 right-6 z-50 h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-shadow"
        aria-label="Contact us on WhatsApp"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </motion.a>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
      />
    </div>
  );
}
