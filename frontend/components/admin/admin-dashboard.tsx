'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { AdminStats } from '@/types';
import { TrendingUp, Users, ShoppingCart, Package } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAdminStats();
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = stats
    ? [
        {
          title: 'Total Users',
          value: stats.totalUsers,
          icon: Users,
        },
        {
          title: 'Total Purchases',
          value: stats.totalPurchases,
          icon: ShoppingCart,
        },
        {
          title: 'Total Revenue',
          value: formatCurrency(stats.totalRevenue),
          icon: TrendingUp,
        },
        {
          title: 'Delivered',
          value: stats.deliveredPurchases,
          icon: Package,
        },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-sm md:text-base text-muted-foreground">Overview of platform statistics</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="bg-[#92422B] text-white border-0 shadow-lg"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">
                  {card.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{card.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

        {stats && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="bg-[#92422B] text-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Gold Holdings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-white">
                <span>24K Gold:</span>
                <span className="font-semibold">{stats.totalGold24k.toFixed(2)} g</span>
              </div>
              <div className="flex justify-between text-white">
                <span>22K Gold:</span>
                <span className="font-semibold">{stats.totalGold22k.toFixed(2)} g</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#92422B] text-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Silver Holdings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.totalSilver.toFixed(2)} g
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#92422B] text-white border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">Pending Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {stats.pendingPurchases}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
