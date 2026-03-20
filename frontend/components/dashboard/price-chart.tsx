'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { SectionHeader } from '@/components/ui/section-header';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { usePriceStore } from '@/store/usePriceStore';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, RefreshCw, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { componentStyles, gradients } from '@/lib/design-system';

interface PriceHistory {
  time: string;
  gold24k: number;
  gold22k: number;
  silver: number;
}

export default function PriceChart() {
  const { prices, isLoading } = usePriceStore();
  const [history, setHistory] = useState<PriceHistory[]>([]);
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  useEffect(() => {
    if (prices) {
      const newPoint: PriceHistory = {
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        gold24k: prices.gold24k,
        gold22k: prices.gold22k,
        silver: prices.silver,
      };

      setHistory((prev) => {
        const updated = [...prev, newPoint];
        // Keep last 30 points for 24h view
        return updated.slice(-30);
      });
    }
  }, [prices]);

  // Generate mock historical data for demo
  const generateHistoricalData = () => {
    const data: PriceHistory[] = [];
    const now = new Date();
    const baseGold24k = prices?.gold24k || 12742;
    const baseGold22k = prices?.gold22k || 11685;
    const baseSilver = prices?.silver || 150.56;

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 60 * 60 * 1000);
      const variation = (Math.random() - 0.5) * 200;
      data.push({
        time: date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        gold24k: baseGold24k + variation,
        gold22k: baseGold22k + variation * 0.916,
        silver: baseSilver + (Math.random() - 0.5) * 10,
      });
    }
    return data;
  };

  const chartData = history.length > 0 ? history : generateHistoricalData();

  const gold24kChange = chartData.length > 1
    ? ((chartData[chartData.length - 1].gold24k - chartData[0].gold24k) / chartData[0].gold24k) * 100
    : 0;

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-10">
      <PageHeader
        title="Price Trends"
        description="Real-time price movements and historical data analysis"
        badge={{
          label: '24K Change',
          value: gold24kChange !== 0 ? `${gold24kChange > 0 ? '+' : ''}${gold24kChange.toFixed(2)}%` : '0%',
          icon: gold24kChange > 0 ? TrendingUp : TrendingDown,
        }}
      />

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-4 sm:mb-6">
          <SectionHeader title="Price Charts" />
          <Button
            variant="outline"
            size="sm"
            className="min-h-[44px] touch-manipulation w-full sm:w-auto bg-white/80 hover:bg-white border-[#92422B]/20 text-[#681412]"
            onClick={() => setHistory([])}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
        <Card className={componentStyles.table.container}>
          <CardHeader className={`${componentStyles.table.header} px-4 sm:px-6 py-3 sm:py-4`}>
            <CardTitle className={`${componentStyles.table.headerTitle} text-base sm:text-lg`}>
              <div className="h-1 w-6 bg-gradient-to-r from-[#681412] to-[#92422B] rounded-full"></div>
              Historical Price Data
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6 pb-4 sm:pb-6">
            <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as any)}>
              <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/60 border border-[#92422B]/20">
                <TabsTrigger value="1h" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#681412] data-[state=active]:to-[#92422B] data-[state=active]:text-white">1H</TabsTrigger>
                <TabsTrigger value="24h" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#681412] data-[state=active]:to-[#92422B] data-[state=active]:text-white">24H</TabsTrigger>
                <TabsTrigger value="7d" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#681412] data-[state=active]:to-[#92422B] data-[state=active]:text-white">7D</TabsTrigger>
                <TabsTrigger value="30d" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#681412] data-[state=active]:to-[#92422B] data-[state=active]:text-white">30D</TabsTrigger>
              </TabsList>

          <TabsContent value={timeRange} className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorGold24k" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffd700" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ffd700" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorGold22k" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e6c200" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#e6c200" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorSilver" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6c757d" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6c757d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" stroke="#92422B" />
                <XAxis
                  dataKey="time"
                  stroke="#681412"
                  fontSize={12}
                />
                <YAxis
                  stroke="#681412"
                  fontSize={12}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #92422B',
                    borderRadius: '8px',
                    color: '#681412',
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="gold24k"
                  stroke="#ffd700"
                  strokeWidth={2}
                  fill="url(#colorGold24k)"
                  name="24K Gold"
                />
                <Area
                  type="monotone"
                  dataKey="gold22k"
                  stroke="#e6c200"
                  strokeWidth={2}
                  fill="url(#colorGold22k)"
                  name="22K Gold"
                />
                <Area
                  type="monotone"
                  dataKey="silver"
                  stroke="#6c757d"
                  strokeWidth={2}
                  fill="url(#colorSilver)"
                  name="Silver"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
        </CardContent>
        </Card>
      </div>
    </div>
  );
}
