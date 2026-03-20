'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Package, ShoppingCart, Award } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface QuickStatsProps {
  totalValue: number;
  totalGrams: number;
  totalPurchases: number;
  profitLoss: number;
  profitLossPercent: number;
}

export default function QuickStats({
  totalValue,
  totalGrams,
  totalPurchases,
  profitLoss,
  profitLossPercent,
}: QuickStatsProps) {
  const stats = [
    {
      title: 'Portfolio Value',
      value: formatCurrency(totalValue),
      icon: DollarSign,
      change: profitLossPercent,
    },
    {
      title: 'Total Holdings',
      value: `${totalGrams.toFixed(2)} g`,
      icon: Package,
      change: null,
    },
    {
      title: 'Total Purchases',
      value: totalPurchases.toString(),
      icon: ShoppingCart,
      change: null,
    },
    {
      title: 'Profit/Loss',
      value: formatCurrency(profitLoss),
      icon: profitLoss >= 0 ? TrendingUp : TrendingDown,
      change: profitLossPercent,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={stat.title}
            className="bg-[#92422B] text-white border-0 shadow-lg"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-white opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              {stat.change !== null && (
                <div className={`flex items-center gap-1 text-xs mt-1 ${stat.change >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                  {stat.change >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>{Math.abs(stat.change).toFixed(2)}%</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}




