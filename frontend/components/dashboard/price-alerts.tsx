'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { SectionHeader } from '@/components/ui/section-header';
import { InfoCard } from '@/components/ui/info-card';
import { Bell, BellRing, X, TrendingUp, TrendingDown } from 'lucide-react';
import { usePriceStore } from '@/store/usePriceStore';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { componentStyles, gradients } from '@/lib/design-system';

interface Alert {
  id: string;
  type: 'gold24k' | 'gold22k' | 'silver';
  condition: 'above' | 'below';
  price: number;
  active: boolean;
}

export default function PriceAlerts() {
  const { prices } = usePriceStore();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [newAlert, setNewAlert] = useState({
    type: 'gold24k' as 'gold24k' | 'gold22k' | 'silver',
    condition: 'above' as 'above' | 'below',
    price: '',
  });

  // Check alerts against current prices
  useEffect(() => {
    if (!prices) return;

    alerts.forEach((alert) => {
      if (!alert.active) return;

      const currentPrice =
        alert.type === 'gold24k'
          ? prices.gold24k
          : alert.type === 'gold22k'
          ? prices.gold22k
          : prices.silver;

      const triggered =
        alert.condition === 'above'
          ? currentPrice >= alert.price
          : currentPrice <= alert.price;

      if (triggered) {
        toast.success(
          `Price Alert! ${alert.type.toUpperCase()} is now ${formatCurrency(currentPrice)}`,
          { duration: 5000 }
        );
        setAlerts((prev) =>
          prev.map((a) => (a.id === alert.id ? { ...a, active: false } : a))
        );
      }
    });
  }, [prices, alerts]);

  const handleCreateAlert = () => {
    if (!newAlert.price) {
      toast.error('Please enter a price');
      return;
    }

    const alert: Alert = {
      id: Date.now().toString(),
      type: newAlert.type,
      condition: newAlert.condition,
      price: parseFloat(newAlert.price),
      active: true,
    };

    setAlerts([...alerts, alert]);
    setNewAlert({ type: 'gold24k', condition: 'above', price: '' });
    setShowDialog(false);
    toast.success('Price alert created!');
  };

  const toggleAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    toast.success('Alert deleted');
  };

  const getCurrentPrice = (type: string) => {
    if (!prices) return 0;
    return type === 'gold24k'
      ? prices.gold24k
      : type === 'gold22k'
      ? prices.gold22k
      : prices.silver;
  };

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-10">
      <PageHeader
        title="Price Alerts"
        description="Get notified when prices reach your target. Never miss a buying opportunity."
        badge={{
          label: 'Active Alerts',
          value: alerts.filter(a => a.active).length,
          icon: BellRing,
        }}
      />

      {/* Info Card */}
      <InfoCard
        title="How Price Alerts Work"
        icon={Bell}
        items={[
          { text: 'Set alerts for 24K Gold, 22K Gold, or Silver' },
          { text: 'Choose to be notified when price goes above or below your target' },
          { text: 'Get instant notifications when your alert triggers' },
          { text: 'Manage all your alerts from one place' },
        ]}
        delay={0.1}
        hoverDirection="left"
      />

      {/* Alerts Section */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-4 sm:mb-6">
          <SectionHeader title="Your Alerts" />
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button 
                size="sm"
                className={`${gradients.button} ${gradients.buttonHover} text-white border-0 min-h-[44px] touch-manipulation w-full sm:w-auto`}
              >
                <Bell className="h-4 w-4 mr-2" />
                New Alert
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Price Alert</DialogTitle>
                <DialogDescription>
                  Set a price alert to get notified when the price reaches your target
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#681412]">Metal Type</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newAlert.type}
                    onChange={(e) =>
                      setNewAlert({ ...newAlert, type: e.target.value as any })
                    }
                  >
                    <option value="gold24k">24K Gold</option>
                    <option value="gold22k">22K Gold</option>
                    <option value="silver">Silver</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#681412]">Condition</label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newAlert.condition}
                    onChange={(e) =>
                      setNewAlert({ ...newAlert, condition: e.target.value as any })
                    }
                  >
                    <option value="above">Price goes above</option>
                    <option value="below">Price goes below</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#681412]">Target Price (₹)</label>
                  <Input
                    type="number"
                    placeholder="Enter target price"
                    value={newAlert.price}
                    onChange={(e) =>
                      setNewAlert({ ...newAlert, price: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Current: {formatCurrency(getCurrentPrice(newAlert.type))}
                  </p>
                </div>
                <Button 
                  onClick={handleCreateAlert} 
                  className={`w-full ${gradients.button} ${gradients.buttonHover} text-white shadow-lg`}
                >
                  Create Alert
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <Card className={componentStyles.table.container}>
          <CardHeader className={componentStyles.table.header}>
            <CardTitle className={componentStyles.table.headerTitle}>
              <div className="h-1 w-6 bg-gradient-to-r from-[#681412] to-[#92422B] rounded-full"></div>
              Alert Management
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <AnimatePresence>
              {alerts.length === 0 ? (
                <div className={componentStyles.emptyState.container}>
                  <div className={componentStyles.emptyState.iconContainer}>
                    <Bell className="h-10 w-10 text-[#92422B]" />
                  </div>
                  <h3 className={componentStyles.emptyState.title}>No price alerts yet</h3>
                  <p className={componentStyles.emptyState.description}>
                    Create your first alert to get notified when prices reach your target
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 rounded-lg border border-[#92422B]/20 bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <button
                          onClick={() => toggleAlert(alert.id)}
                          className={`p-2 rounded-full transition-colors ${
                            alert.active
                              ? 'bg-gradient-to-r from-[#681412] to-[#92422B] text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}
                        >
                          {alert.active ? (
                            <BellRing className="h-4 w-4" />
                          ) : (
                            <Bell className="h-4 w-4" />
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-[#681412] capitalize">
                              {alert.type === 'gold24k'
                                ? '24K Gold'
                                : alert.type === 'gold22k'
                                ? '22K Gold'
                                : 'Silver'}
                            </span>
                            {alert.condition === 'above' ? (
                              <TrendingUp className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-600" />
                            )}
                            <span className="text-sm text-gray-600">
                              {alert.condition === 'above' ? 'above' : 'below'}
                            </span>
                            <span className="font-bold text-[#681412] text-lg">
                              {formatCurrency(alert.price)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            Current: {formatCurrency(getCurrentPrice(alert.type))}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteAlert(alert.id)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
