'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { RefreshCw, TrendingUp, Coins, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
// Using button-based toggle instead of Switch component

export default function AdminPrices() {
  const [priceMode, setPriceMode] = useState<'live' | 'manual'>('live');
  const [manualPrices, setManualPrices] = useState({
    gold24k: 0,
    gold22k: 0,
    silver: 0,
  });
  const [currentPrices, setCurrentPrices] = useState({
    gold24k: 0,
    gold22k: 0,
    silver: 0,
    lastUpdated: '',
    source: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    loadSettings();
    loadCurrentPrices();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAdminPriceSettings();
      if (response.data) {
        setPriceMode(response.data.priceMode);
        setManualPrices({
          gold24k: response.data.manualPrices.gold24k || 0,
          gold22k: response.data.manualPrices.gold22k || 0,
          silver: response.data.manualPrices.silver || 0,
        });
        if (response.data.manualPrices.lastUpdated) {
          setLastUpdated(new Date(response.data.manualPrices.lastUpdated).toLocaleString());
        }
      }
    } catch (error: any) {
      console.error('Error loading price settings:', error);
      toast.error(error.message || 'Failed to load price settings');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCurrentPrices = async () => {
    try {
      const response = await api.getPrices();
      if (response.data) {
        setCurrentPrices({
          gold24k: response.data.gold24k || 0,
          gold22k: response.data.gold22k || 0,
          silver: response.data.silver || 0,
          lastUpdated: response.data.lastUpdated || '',
          source: (response.data as any).source || 'unknown',
        });
      }
    } catch (error) {
      console.error('Error loading current prices:', error);
    }
  };

  const handleModeToggle = (isManual: boolean) => {
    const newMode = isManual ? 'manual' : 'live';
    setPriceMode(newMode);
    
    // If switching to manual and prices are 0, copy current prices
    if (newMode === 'manual' && manualPrices.gold24k === 0) {
      setManualPrices({
        gold24k: currentPrices.gold24k,
        gold22k: currentPrices.gold22k,
        silver: currentPrices.silver,
      });
    }
  };

  const handleSave = async () => {
    if (priceMode === 'manual') {
      // Validate manual prices
      if (manualPrices.gold24k <= 0 || manualPrices.gold22k <= 0 || manualPrices.silver <= 0) {
        toast.error('Please enter valid prices for all metals (must be greater than 0)');
        return;
      }
    }

    setIsSaving(true);
    try {
      const response = await api.updateAdminPriceSettings({
        priceMode,
        manualPrices: priceMode === 'manual' ? manualPrices : undefined,
      });

      if (response.error) {
        toast.error(response.error || 'Failed to update price settings');
        return;
      }

      toast.success('Price settings updated successfully!');
      setLastUpdated(new Date().toLocaleString());
      await loadCurrentPrices(); // Reload to show updated prices
    } catch (error: any) {
      console.error('Error saving price settings:', error);
      toast.error(error.message || 'Failed to update price settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-[#681412]" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Price Management</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Manage gold and silver prices - switch between live API prices or set manual prices
        </p>
      </div>

      {/* Current Prices Display */}
      <Card className="bg-[#92422B] text-white border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Current Market Prices
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={loadCurrentPrices}
              className="bg-white/10 hover:bg-white/20 border-white/30 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-white/80 mb-1">24K Gold</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(currentPrices.gold24k)}
              </p>
              <p className="text-xs text-white/60">per gram</p>
            </div>
            <div>
              <p className="text-sm text-white/80 mb-1">22K Gold</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(currentPrices.gold22k)}
              </p>
              <p className="text-xs text-white/60">per gram</p>
            </div>
            <div>
              <p className="text-sm text-white/80 mb-1">Silver</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(currentPrices.silver)}
              </p>
              <p className="text-xs text-white/60">per gram</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20">
            <p className="text-xs text-white/60">
              Source: {currentPrices.source || 'Unknown'} | 
              Last Updated: {currentPrices.lastUpdated ? new Date(currentPrices.lastUpdated).toLocaleString() : 'N/A'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Price Mode Toggle */}
      <Card className="border border-[#92422B]/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#681412]" />
            Price Mode Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex-1">
              <Label htmlFor="price-mode" className="text-base font-semibold">
                Price Mode
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                {priceMode === 'live' 
                  ? 'Prices are fetched from live API automatically'
                  : 'Prices are set manually by admin'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={priceMode === 'live' ? 'default' : 'outline'}
                onClick={() => handleModeToggle(false)}
                className={`min-w-[100px] ${priceMode === 'live' ? 'bg-gradient-to-r from-[#681412] to-[#92422B] text-white' : ''}`}
              >
                Live API
              </Button>
              <Button
                type="button"
                variant={priceMode === 'manual' ? 'default' : 'outline'}
                onClick={() => handleModeToggle(true)}
                className={`min-w-[100px] ${priceMode === 'manual' ? 'bg-gradient-to-r from-[#681412] to-[#92422B] text-white' : ''}`}
              >
                Manual
              </Button>
            </div>
          </div>

          {priceMode === 'live' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Live API Mode Active
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Prices are automatically fetched from the configured API. 
                    Users will see real-time market prices.
                  </p>
                </div>
              </div>
            </div>
          )}

          {priceMode === 'manual' && (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">
                      Manual Mode Active
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                      Prices are set manually. Users will see the prices you enter below.
                      Make sure to update prices regularly to reflect market changes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="gold24k" className="text-sm font-semibold">
                    24K Gold (₹ per gram)
                  </Label>
                  <Input
                    id="gold24k"
                    type="number"
                    step="0.01"
                    min="0"
                    value={manualPrices.gold24k || ''}
                    onChange={(e) =>
                      setManualPrices({
                        ...manualPrices,
                        gold24k: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className="h-12 text-base"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setManualPrices({
                        ...manualPrices,
                        gold24k: currentPrices.gold24k,
                      })
                    }
                    className="w-full text-xs"
                  >
                    Use Current: {formatCurrency(currentPrices.gold24k)}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gold22k" className="text-sm font-semibold">
                    22K Gold (₹ per gram)
                  </Label>
                  <Input
                    id="gold22k"
                    type="number"
                    step="0.01"
                    min="0"
                    value={manualPrices.gold22k || ''}
                    onChange={(e) =>
                      setManualPrices({
                        ...manualPrices,
                        gold22k: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className="h-12 text-base"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setManualPrices({
                        ...manualPrices,
                        gold22k: currentPrices.gold22k,
                      })
                    }
                    className="w-full text-xs"
                  >
                    Use Current: {formatCurrency(currentPrices.gold22k)}
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="silver" className="text-sm font-semibold">
                    Silver (₹ per gram)
                  </Label>
                  <Input
                    id="silver"
                    type="number"
                    step="0.01"
                    min="0"
                    value={manualPrices.silver || ''}
                    onChange={(e) =>
                      setManualPrices({
                        ...manualPrices,
                        silver: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="0.00"
                    className="h-12 text-base"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setManualPrices({
                        ...manualPrices,
                        silver: currentPrices.silver,
                      })
                    }
                    className="w-full text-xs"
                  >
                    Use Current: {formatCurrency(currentPrices.silver)}
                  </Button>
                </div>
              </div>

              {lastUpdated && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>Last saved: {lastUpdated}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-[#681412] to-[#92422B] text-white hover:opacity-90 min-h-[48px]"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                loadSettings();
                loadCurrentPrices();
              }}
              className="min-h-[48px]"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

