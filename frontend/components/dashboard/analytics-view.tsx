'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { PageHeader } from '@/components/ui/page-header';
import { SectionHeader } from '@/components/ui/section-header';
import { api } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Purchase } from '@/types';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  BarChart3,
  PieChart,
} from 'lucide-react';
import { componentStyles, decorative, animations, gradients } from '@/lib/design-system';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

export default function AnalyticsView() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const accountAge = purchases.length > 0 
    ? Math.floor((new Date().getTime() - new Date(purchases[0].createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await api.getPurchases();
      if (response.data) {
        setPurchases(response.data);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate analytics
  const totalInvested = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalQuantity = purchases.reduce((sum, p) => sum + p.quantity, 0);
  const avgPurchaseValue = purchases.length > 0 ? totalInvested / purchases.length : 0;

  // Monthly breakdown
  const monthlyData = purchases.reduce((acc, purchase) => {
    const month = new Date(purchase.createdAt).toLocaleDateString('en-IN', {
      month: 'short',
      year: 'numeric',
    });
    if (!acc[month]) {
      acc[month] = { month, amount: 0, count: 0 };
    }
    acc[month].amount += purchase.totalAmount;
    acc[month].count += 1;
    return acc;
  }, {} as Record<string, { month: string; amount: number; count: number }>);

  const monthlyChartData = Object.values(monthlyData).slice(-6);

  // Type distribution
  const typeDistribution = purchases.reduce(
    (acc, purchase) => {
      const key = `${purchase.type}-${purchase.purity}`;
      if (!acc[key]) {
        acc[key] = { name: `${purchase.type.toUpperCase()} ${purchase.purity.toUpperCase()}`, value: 0 };
      }
      acc[key].value += purchase.quantity;
      return acc;
    },
    {} as Record<string, { name: string; value: number }>
  );

  const pieData = Object.values(typeDistribution);
  const COLORS = ['#ffd700', '#e6c200', '#6c757d', '#f59e0b', '#10b981'];

  const stats = [
    {
      title: 'Total Invested',
      value: formatCurrency(totalInvested),
      icon: DollarSign,
      change: '+12.5%',
      trend: 'up',
    },
    {
      title: 'Total Holdings',
      value: `${totalQuantity.toFixed(2)} g`,
      icon: Package,
      change: '+8.2%',
      trend: 'up',
    },
    {
      title: 'Avg Purchase',
      value: formatCurrency(avgPurchaseValue),
      icon: BarChart3,
      change: '+5.1%',
      trend: 'up',
    },
    {
      title: 'Total Orders',
      value: purchases.length.toString(),
      icon: PieChart,
      change: '+15.3%',
      trend: 'up',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-10">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
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

  const totalInvestedAmount = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const avgPurchaseSize = purchases.length > 0 ? totalInvestedAmount / purchases.length : 0;
  const largestPurchase = purchases.length > 0 
    ? purchases.reduce((max, p) => p.totalAmount > max.totalAmount ? p : max, purchases[0])
    : null;

  return (
    <div className="space-y-10">
      <PageHeader
        title="Analytics & Insights"
        description="Detailed analysis of your investment portfolio, trends, and performance metrics"
        badge={{
          label: 'Total Orders',
          value: purchases.length,
          icon: Package,
        }}
      />

      {/* Main Stats Grid */}
      <div>
        <SectionHeader title="Investment Overview" />
        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                description={`${stat.change} vs last month`}
                icon={Icon}
                index={index}
              />
            );
          })}
        </div>
      </div>

      {/* Additional Insights */}
      <div>
        <SectionHeader title="Investment Insights" />
        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Average Purchase Size"
            value={formatCurrency(avgPurchaseSize)}
            description="Per transaction"
            icon={BarChart3}
            index={0}
          />
          <StatCard
            title="Largest Purchase"
            value={largestPurchase ? formatCurrency(largestPurchase.totalAmount) : '--'}
            description={largestPurchase ? `${largestPurchase.quantity}g ${largestPurchase.type}` : 'No purchases'}
            icon={Package}
            index={1}
          />
          <StatCard
            title="Investment Frequency"
            value={purchases.length > 0 
              ? `${Math.round(purchases.length / Math.max(1, accountAge / 30))} per month`
              : '--'}
            description="Average"
            icon={TrendingUp}
            index={2}
          />
        </div>
      </div>

      {/* Charts */}
      <div>
        <SectionHeader title="Visual Analytics" />
        <div className="grid gap-6 md:grid-cols-2">
          {/* Monthly Spending */}
          <Card className={componentStyles.table.container}>
            <CardHeader className={componentStyles.table.header}>
              <CardTitle className={componentStyles.table.headerTitle}>
                <div className="h-1 w-6 bg-gradient-to-r from-[#681412] to-[#92422B] rounded-full"></div>
                Monthly Investment Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" stroke="#92422B" />
                  <XAxis dataKey="month" stroke="#681412" />
                  <YAxis stroke="#681412" />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #92422B',
                      borderRadius: '8px',
                      color: '#681412',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="amount" fill="#92422B" name="Investment (₹)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Type Distribution */}
          <Card className={componentStyles.table.container}>
            <CardHeader className={componentStyles.table.header}>
              <CardTitle className={componentStyles.table.headerTitle}>
                <div className="h-1 w-6 bg-gradient-to-r from-[#681412] to-[#92422B] rounded-full"></div>
                Portfolio Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
