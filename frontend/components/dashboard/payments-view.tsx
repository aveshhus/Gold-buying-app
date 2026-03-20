'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/ui/stat-card';
import { PageHeader } from '@/components/ui/page-header';
import { SectionHeader } from '@/components/ui/section-header';
import { InfoCard } from '@/components/ui/info-card';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Payment } from '@/types';
import { toast } from 'sonner';
import { CreditCard, Wallet, Smartphone, Building2, Info, CheckCircle2, Clock, AlertCircle, ArrowUpRight, Package, Coins } from 'lucide-react';
import { componentStyles, animations } from '@/lib/design-system';

export default function PaymentsView() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setIsLoading(true);
    try {
      const response = await api.getPayments();
      if (response.data) {
        setPayments(response.data);
      }
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkPaid = async (paymentId: string) => {
    try {
      const response = await api.updatePayment(paymentId, 'completed');
      if (response.error) {
        toast.error(response.error);
        return;
      }
      toast.success('Payment marked as completed');
      loadPayments();
    } catch (error) {
      toast.error('Failed to update payment');
    }
  };

  const totalPaid = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const completedCount = payments.filter(p => p.status === 'completed').length;
  const pendingCount = payments.filter(p => p.status === 'pending').length;

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

  return (
    <div className="space-y-10">
      <PageHeader
        title="Payment History"
        description="View and manage your payments, track payment status, and view payment methods"
        badge={{
          label: 'Total Payments',
          value: payments.length,
          icon: Package,
        }}
      />

      {/* Payment Stats */}
      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Paid"
          value={formatCurrency(totalPaid)}
          description={`${completedCount} payment${completedCount !== 1 ? 's' : ''}`}
          icon={CheckCircle2}
          index={0}
          showPulseDot
          pulseDotColor="green"
        />
        <StatCard
          title="Pending"
          value={formatCurrency(totalPending)}
          description={`${pendingCount} payment${pendingCount !== 1 ? 's' : ''}`}
          icon={Clock}
          index={1}
        />
        <StatCard
          title="Total Payments"
          value={payments.length}
          description="All transactions"
          icon={CreditCard}
          index={2}
        />
        <StatCard
          title="Total Amount"
          value={formatCurrency(totalPaid + totalPending)}
          description="Combined"
          icon={Wallet}
          index={3}
        />
      </div>

      {/* Payment Methods Info */}
      <InfoCard
        title="Accepted Payment Methods"
        icon={Info}
        items={[
          { text: 'UPI - Fast and secure instant payments' },
          { text: 'Credit/Debit Cards - All major cards accepted' },
          { text: 'Net Banking - Direct bank transfers' },
          { text: 'Digital Wallets - Quick and convenient' },
          { text: 'All payments are secure and encrypted. Your payment information is never stored.' },
        ]}
        delay={0.4}
        hoverDirection="left"
      />

      {/* Payment History Table */}
      <div>
        <SectionHeader
          title="All Payments"
          badge={payments.length}
        />
        <Card className={componentStyles.table.container}>
          <CardHeader className={componentStyles.table.header}>
            <CardTitle className={componentStyles.table.headerTitle}>
              <div className="h-1 w-6 bg-gradient-to-r from-[#681412] to-[#92422B] rounded-full"></div>
              Payment Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <div className={componentStyles.emptyState.container}>
                <div className={componentStyles.emptyState.iconContainer}>
                  <CreditCard className="h-10 w-10 text-[#92422B]" />
                </div>
                <h3 className={componentStyles.emptyState.title}>No payments yet</h3>
                <p className={componentStyles.emptyState.description}>
                  Complete a purchase to see your payment history here
                </p>
                <Button
                  onClick={() => {
                    window.location.href = '/dashboard?section=purchase';
                  }}
                  className={componentStyles.emptyState.button}
                >
                  Make a Purchase
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="inline-block min-w-full align-middle px-4 md:px-0">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={componentStyles.table.thead}>
                      <tr>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Date</th>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Purchase ID</th>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Amount</th>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Status</th>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments.map((payment, index) => (
                        <motion.tr
                          key={payment.id}
                          className={`${componentStyles.table.tbody} hover:bg-gray-50 transition-colors`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <td className={`${componentStyles.table.td} whitespace-nowrap`}>{formatDate(payment.createdAt)}</td>
                        <td className={`${componentStyles.table.td} whitespace-nowrap`}>
                          <span className="font-mono text-xs md:text-sm">{payment.purchaseId.substring(0, 8)}...</span>
                        </td>
                        <td className={`${componentStyles.table.td} whitespace-nowrap`}>
                          <span className="font-bold text-[#681412] text-base md:text-lg">
                            {formatCurrency(payment.amount)}
                          </span>
                        </td>
                        <td className={`${componentStyles.table.td} whitespace-nowrap`}>
                          <span
                            className={`inline-flex items-center px-2.5 md:px-3 py-1.5 rounded-full text-xs font-bold ${
                              payment.status === 'completed'
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                        <td className={`${componentStyles.table.td} whitespace-nowrap`}>
                          {payment.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkPaid(payment.id)}
                              className="bg-gradient-to-r from-[#681412] to-[#92422B] hover:from-[#7a1a18] hover:to-[#a04d35] text-white border-0 min-h-[44px] touch-manipulation"
                            >
                              Mark Paid
                            </Button>
                          )}
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
    </div>
  );
}
