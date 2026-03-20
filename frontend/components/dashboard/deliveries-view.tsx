'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/ui/stat-card';
import { PageHeader } from '@/components/ui/page-header';
import { SectionHeader } from '@/components/ui/section-header';
import { InfoCard } from '@/components/ui/info-card';
import { api } from '@/lib/api';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Purchase, Delivery } from '@/types';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Package, Truck, MapPin, Clock, CheckCircle2, AlertCircle, Info, Phone, Mail, Coins } from 'lucide-react';
import { componentStyles, decorative, animations, gradients } from '@/lib/design-system';

export default function DeliveriesView() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [pendingPurchases, setPendingPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [currentPurchaseId, setCurrentPurchaseId] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    setIsLoading(true);
    try {
      const [deliveriesRes, purchasesRes] = await Promise.all([
        api.getDeliveries(),
        api.getPurchases(),
      ]);

      if (deliveriesRes.data) {
        setDeliveries(deliveriesRes.data);
      }

      if (purchasesRes.data) {
        const paid = purchasesRes.data.filter((p: Purchase) => p.status === 'paid');
        setPendingPurchases(paid);
      }
    } catch (error) {
      console.error('Error loading deliveries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetDelivery = async (purchaseId: string) => {
    try {
      const response = await api.generateOTP(purchaseId);
      if (response.error) {
        toast.error(response.error);
        return;
      }

      if (response.data) {
        setCurrentPurchaseId(purchaseId);
        setGeneratedOTP(response.data.otp || '');
        setOtpModalOpen(true);
        toast.success('OTP generated! Check your phone/email.');
      }
    } catch (error) {
      toast.error('Failed to generate OTP');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPurchaseId) return;

    try {
      const response = await api.verifyOTP(currentPurchaseId, otp);
      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success('Delivery completed successfully!');
      setOtpModalOpen(false);
      setOtp('');
      setCurrentPurchaseId(null);
      loadDeliveries();
    } catch (error) {
      toast.error('Failed to verify OTP');
    }
  };

  // Separate gold and silver deliveries
  const goldDeliveries = deliveries.filter(d => d.type === 'gold');
  const silverDeliveries = deliveries.filter(d => d.type === 'silver');
  const goldPending = pendingPurchases.filter(p => p.type === 'gold');
  const silverPending = pendingPurchases.filter(p => p.type === 'silver');
  
  const totalGoldDelivered = goldDeliveries.reduce((sum, d) => sum + d.quantity, 0);
  const totalSilverDelivered = silverDeliveries.reduce((sum, d) => sum + d.quantity, 0);
  const totalGoldPending = goldPending.reduce((sum, p) => sum + p.quantity, 0);
  const totalSilverPending = silverPending.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <div className="space-y-10">
      <PageHeader
        title="My Deliveries"
        description="Manage your gold and silver deliveries, track orders, and schedule pickups"
        badge={{
          label: 'Total Deliveries',
          value: deliveries.length,
          icon: Package,
        }}
      />

      {/* Coin Charges Notice */}
      <div className="bg-gradient-to-r from-yellow-400 to-amber-400 border-2 border-orange-500 rounded-lg p-4 shadow-lg flex items-center justify-center gap-3 animate-pulse">
        <Coins className="h-6 w-6 text-[#681412]" />
        <span className="text-lg font-bold text-[#681412] uppercase tracking-wide">
          Coin Charges Applied
        </span>
      </div>

      {/* Delivery Stats - Gold */}
      <div>
        <SectionHeader title="Gold Delivery Summary" />
        <div className="grid gap-5 md:grid-cols-3">
          <StatCard
            title="Gold Delivered"
            value={`${totalGoldDelivered.toFixed(4)} g`}
            description={`${goldDeliveries.length} item${goldDeliveries.length !== 1 ? 's' : ''}`}
            icon={CheckCircle2}
            index={0}
            showPulseDot
            pulseDotColor="green"
          />
          <StatCard
            title="Gold Ready for Pickup"
            value={`${totalGoldPending.toFixed(4)} g`}
            description={`${goldPending.length} item${goldPending.length !== 1 ? 's' : ''}`}
            icon={Clock}
            index={1}
          />
          <StatCard
            title="Total Gold Purchased"
            value={`${(totalGoldDelivered + totalGoldPending).toFixed(4)} g`}
            description="Delivered + Pending"
            icon={Package}
            index={2}
          />
        </div>
      </div>

      {/* Delivery Stats - Silver */}
      <div>
        <SectionHeader title="Silver Delivery Summary" />
        <div className="grid gap-5 md:grid-cols-3">
          <StatCard
            title="Silver Delivered"
            value={`${totalSilverDelivered.toFixed(4)} g`}
            description={`${silverDeliveries.length} item${silverDeliveries.length !== 1 ? 's' : ''}`}
            icon={CheckCircle2}
            index={0}
            showPulseDot
            pulseDotColor="green"
          />
          <StatCard
            title="Silver Ready for Pickup"
            value={`${totalSilverPending.toFixed(4)} g`}
            description={`${silverPending.length} item${silverPending.length !== 1 ? 's' : ''}`}
            icon={Clock}
            index={1}
          />
          <StatCard
            title="Total Silver Purchased"
            value={`${(totalSilverDelivered + totalSilverPending).toFixed(4)} g`}
            description="Delivered + Pending"
            icon={Package}
            index={2}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="grid gap-5 md:grid-cols-2">
        <InfoCard
          title="How to Get Delivery:"
          icon={Info}
          items={[
            { text: '1. Make sure your payment is completed' },
            { text: '2. Come to the shop with valid ID' },
            { text: '3. Click "Get Delivery" button below' },
            { text: '4. Enter the OTP you receive (via SMS/Email)' },
            { text: '5. Complete delivery verification' },
            { text: '6. Collect your gold/silver and receipt' },
          ]}
          delay={0.2}
          hoverDirection="left"
        />

        <InfoCard
          title="Delivery Benefits:"
          icon={CheckCircle2}
          items={[
            { text: 'Secure OTP verification' },
            { text: 'Digital receipt provided' },
            { text: 'Instant delivery confirmation' },
          ]}
          delay={0.3}
          hoverDirection="right"
        />
      </div>

      {/* Store Information */}
      <div>
        <SectionHeader title="Store Information" />
        <Card className="border border-[#92422B]/20 shadow-lg bg-white/60 backdrop-blur-sm overflow-hidden hover:shadow-xl transition-shadow duration-300">
          <CardHeader className={componentStyles.table.header}>
            <CardTitle className={componentStyles.table.headerTitle}>
              <div className="h-1 w-6 bg-gradient-to-r from-[#681412] to-[#92422B] rounded-full"></div>
              Visit Our Store
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-sm sm:text-base text-[#681412] flex items-center gap-2">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
                  Main Store
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 mb-1 break-words">
                  123 Gold Street, Mumbai, Maharashtra 400001
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-3 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>+91 1800-XXX-XXXX</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span>9 AM - 7 PM</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-sm sm:text-base text-[#681412]">Need Help?</h4>
                <p className="text-xs sm:text-sm text-gray-700 mb-3">
                  Contact our support team for delivery assistance
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white/80 hover:bg-white border-[#92422B]/20 text-[#681412] min-h-[44px] touch-manipulation w-full sm:w-auto"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Support
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white/80 hover:bg-white border-[#92422B]/20 text-[#681412] min-h-[44px] touch-manipulation w-full sm:w-auto"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gold Ready for Pickup */}
      <div>
        <SectionHeader 
          title="Gold Ready for Pickup" 
          badge={goldPending.length > 0 ? `${goldPending.length} Item${goldPending.length !== 1 ? 's' : ''}` : undefined}
        />
        <Card className={componentStyles.table.container}>
          <CardHeader className={componentStyles.table.header}>
            <CardTitle className={componentStyles.table.headerTitle}>
              <div className="h-1 w-6 bg-gradient-to-r from-[#681412] to-[#92422B] rounded-full"></div>
              Pending Gold Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {goldPending.length === 0 ? (
              <div className={componentStyles.emptyState.container}>
                <div className={componentStyles.emptyState.iconContainer}>
                  <Package className="h-10 w-10 text-[#92422B]" />
                </div>
                <h3 className={componentStyles.emptyState.title}>No gold items ready for delivery</h3>
                <p className={componentStyles.emptyState.description}>
                  Complete payment for your gold purchases to make them ready for pickup
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    window.location.href = '/dashboard?section=payments';
                  }}
                  className="bg-white/80 hover:bg-white border-[#92422B]/20 text-[#681412]"
                >
                  View Payments
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="inline-block min-w-full align-middle px-4 md:px-0">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={componentStyles.table.thead}>
                      <tr>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Date</th>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Purity</th>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Quantity</th>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Status</th>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {goldPending.map((purchase, index) => (
                        <motion.tr
                          key={purchase.id}
                          className={`${componentStyles.table.tbody} hover:bg-gray-50 transition-colors`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <td className={`${componentStyles.table.td} whitespace-nowrap`}>{formatDate(purchase.createdAt)}</td>
                          <td className={`${componentStyles.table.td} whitespace-nowrap`}>
                            <span className="px-2.5 md:px-3 py-1 bg-[#92422B]/10 text-[#681412] rounded-full text-xs font-bold uppercase">
                              {purchase.purity}
                            </span>
                          </td>
                          <td className={`${componentStyles.table.td} whitespace-nowrap`}>
                            <span className="font-semibold text-[#681412] text-sm md:text-base">{purchase.quantity} g</span>
                          </td>
                          <td className={`${componentStyles.table.td} whitespace-nowrap`}>
                            <span className="inline-flex items-center px-2.5 md:px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                              Ready for Pickup
                            </span>
                          </td>
                          <td className={`${componentStyles.table.td} whitespace-nowrap`}>
                            <Button
                              size="sm"
                              onClick={() => handleGetDelivery(purchase.id)}
                              className={`${gradients.button} ${gradients.buttonHover} text-white border-0 min-h-[44px] touch-manipulation`}
                            >
                              Get Delivery
                            </Button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Silver Ready for Pickup */}
      <div>
        <SectionHeader 
          title="Silver Ready for Pickup" 
          badge={silverPending.length > 0 ? `${silverPending.length} Item${silverPending.length !== 1 ? 's' : ''}` : undefined}
        />
        <Card className={componentStyles.table.container}>
          <CardHeader className={componentStyles.table.header}>
            <CardTitle className={componentStyles.table.headerTitle}>
              <div className="h-1 w-6 bg-gradient-to-r from-[#681412] to-[#92422B] rounded-full"></div>
              Pending Silver Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {silverPending.length === 0 ? (
              <div className={componentStyles.emptyState.container}>
                <div className={componentStyles.emptyState.iconContainer}>
                  <Package className="h-10 w-10 text-[#92422B]" />
                </div>
                <h3 className={componentStyles.emptyState.title}>No silver items ready for delivery</h3>
                <p className={componentStyles.emptyState.description}>
                  Complete payment for your silver purchases to make them ready for pickup
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    window.location.href = '/dashboard?section=payments';
                  }}
                  className="bg-white/80 hover:bg-white border-[#92422B]/20 text-[#681412]"
                >
                  View Payments
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="inline-block min-w-full align-middle px-4 md:px-0">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={componentStyles.table.thead}>
                      <tr>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Date</th>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Quantity</th>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Status</th>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {silverPending.map((purchase, index) => (
                        <motion.tr
                          key={purchase.id}
                          className={`${componentStyles.table.tbody} hover:bg-gray-50 transition-colors`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <td className={`${componentStyles.table.td} whitespace-nowrap`}>{formatDate(purchase.createdAt)}</td>
                          <td className={`${componentStyles.table.td} whitespace-nowrap`}>
                            <span className="font-semibold text-[#681412] text-sm md:text-base">{purchase.quantity} g</span>
                          </td>
                          <td className={`${componentStyles.table.td} whitespace-nowrap`}>
                            <span className="inline-flex items-center px-2.5 md:px-3 py-1.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                              Ready for Pickup
                            </span>
                          </td>
                          <td className={`${componentStyles.table.td} whitespace-nowrap`}>
                            <Button
                              size="sm"
                              onClick={() => handleGetDelivery(purchase.id)}
                              className={`${gradients.button} ${gradients.buttonHover} text-white border-0 min-h-[44px] touch-manipulation`}
                            >
                              Get Delivery
                            </Button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Gold Delivered Items */}
      <div>
        <SectionHeader 
          title="Gold Delivered" 
          badge={goldDeliveries.length > 0 ? `${goldDeliveries.length} Delivered` : undefined}
          badgeVariant="success"
        />
        <Card className={componentStyles.table.container}>
          <CardHeader className={componentStyles.table.header}>
            <CardTitle className={componentStyles.table.headerTitle}>
              <div className="h-1 w-6 bg-gradient-to-r from-[#681412] to-[#92422B] rounded-full"></div>
              Completed Gold Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {goldDeliveries.length === 0 ? (
              <div className={componentStyles.emptyState.container}>
                <div className={componentStyles.emptyState.iconContainer}>
                  <Truck className="h-10 w-10 text-[#92422B]" />
                </div>
                <h3 className={componentStyles.emptyState.title}>No gold deliveries yet</h3>
                <p className={componentStyles.emptyState.description}>
                  Your delivered gold items will appear here after you complete pickup
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="inline-block min-w-full align-middle px-4 md:px-0">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={componentStyles.table.thead}>
                      <tr>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Delivery Date</th>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Purity</th>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Quantity</th>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {goldDeliveries.map((delivery, index) => (
                        <motion.tr
                          key={delivery.id}
                          className={`${componentStyles.table.tbody} hover:bg-gray-50 transition-colors`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <td className={`${componentStyles.table.td} whitespace-nowrap`}>{formatDate(delivery.deliveredAt)}</td>
                          <td className={`${componentStyles.table.td} whitespace-nowrap`}>
                            <span className="px-2.5 md:px-3 py-1 bg-[#92422B]/10 text-[#681412] rounded-full text-xs font-bold uppercase">
                              {delivery.purity}
                            </span>
                          </td>
                          <td className={`${componentStyles.table.td} whitespace-nowrap`}>
                            <span className="font-semibold text-[#681412] text-sm md:text-base">{delivery.quantity} g</span>
                          </td>
                          <td className={`${componentStyles.table.td} whitespace-nowrap`}>
                            <span className="inline-flex items-center px-2.5 md:px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                              Delivered
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Silver Delivered Items */}
      <div>
        <SectionHeader 
          title="Silver Delivered" 
          badge={silverDeliveries.length > 0 ? `${silverDeliveries.length} Delivered` : undefined}
          badgeVariant="success"
        />
        <Card className={componentStyles.table.container}>
          <CardHeader className={componentStyles.table.header}>
            <CardTitle className={componentStyles.table.headerTitle}>
              <div className="h-1 w-6 bg-gradient-to-r from-[#681412] to-[#92422B] rounded-full"></div>
              Completed Silver Deliveries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {silverDeliveries.length === 0 ? (
              <div className={componentStyles.emptyState.container}>
                <div className={componentStyles.emptyState.iconContainer}>
                  <Truck className="h-10 w-10 text-[#92422B]" />
                </div>
                <h3 className={componentStyles.emptyState.title}>No silver deliveries yet</h3>
                <p className={componentStyles.emptyState.description}>
                  Your delivered silver items will appear here after you complete pickup
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="inline-block min-w-full align-middle px-4 md:px-0">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={componentStyles.table.thead}>
                      <tr>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Delivery Date</th>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Quantity</th>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {silverDeliveries.map((delivery, index) => (
                        <motion.tr
                          key={delivery.id}
                          className={`${componentStyles.table.tbody} hover:bg-gray-50 transition-colors`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <td className={`${componentStyles.table.td} whitespace-nowrap`}>{formatDate(delivery.deliveredAt)}</td>
                          <td className={`${componentStyles.table.td} whitespace-nowrap`}>
                            <span className="font-semibold text-[#681412] text-sm md:text-base">{delivery.quantity} g</span>
                          </td>
                          <td className={`${componentStyles.table.td} whitespace-nowrap`}>
                            <span className="inline-flex items-center px-2.5 md:px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                              Delivered
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* OTP Modal */}
      <Dialog open={otpModalOpen} onOpenChange={setOtpModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify OTP for Delivery</DialogTitle>
            <DialogDescription>
              Enter the 6-digit OTP sent to your registered phone/email
            </DialogDescription>
          </DialogHeader>
          {generatedOTP && (
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">
                For testing (remove in production):
              </p>
              <p className="text-2xl font-bold font-mono">{generatedOTP}</p>
            </div>
          )}
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="otp" className="text-sm font-medium">
                OTP
              </label>
              <Input
                id="otp"
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="text-center text-2xl font-mono tracking-widest"
                required
              />
            </div>
            <Button 
              type="submit" 
              className={`w-full ${gradients.button} ${gradients.buttonHover} text-white shadow-lg`}
            >
              Verify & Complete Delivery
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
