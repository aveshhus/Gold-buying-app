'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, FileText, Search, Filter, Calendar, ArrowUpRight } from 'lucide-react';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Purchase, Payment } from '@/types';
import { toast } from 'sonner';
import { PageHeader } from '@/components/ui/page-header';
import { SectionHeader } from '@/components/ui/section-header';
import { StatCard } from '@/components/ui/stat-card';
import { componentStyles } from '@/lib/design-system';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'redemption' | 'fee' | 'refund';
  date: string;
  amount: number;
  quantity?: number;
  metal?: string;
  status: string;
  description: string;
}

export default function TransactionLedger() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('all');

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const [purchasesRes, paymentsRes] = await Promise.all([
        api.getPurchases(),
        api.getPayments(),
      ]);

      console.log('Transactions API Response - Purchases:', purchasesRes);
      console.log('Transactions API Response - Payments:', paymentsRes);

      const txns: Transaction[] = [];

      if (purchasesRes.error) {
        console.error('Purchases API Error:', purchasesRes.error);
      } else if (purchasesRes.data && Array.isArray(purchasesRes.data)) {
        purchasesRes.data.forEach((purchase: Purchase) => {
          txns.push({
            id: purchase.id,
            type: 'buy',
            date: purchase.createdAt,
            amount: purchase.totalAmount,
            quantity: purchase.quantity,
            metal: `${purchase.type} ${purchase.purity}`,
            status: purchase.status,
            description: `Purchase of ${purchase.quantity}g ${purchase.type} ${purchase.purity}`,
          });
        });
      }

      if (paymentsRes.error) {
        console.error('Payments API Error:', paymentsRes.error);
      } else if (paymentsRes.data && Array.isArray(paymentsRes.data)) {
        paymentsRes.data.forEach((payment: Payment) => {
          txns.push({
            id: payment.id,
            type: payment.status === 'completed' ? 'buy' : 'fee',
            date: payment.createdAt,
            amount: payment.amount,
            status: payment.status,
            description: `Payment for purchase ${payment.purchaseId?.substring(0, 8) || 'N/A'}`,
          });
        });
      }

      // Sort by date (newest first)
      txns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      console.log('Final transactions array:', txns);
      setTransactions(txns);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || txn.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalAmount = filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0);
  const totalBuy = filteredTransactions
    .filter((txn) => txn.type === 'buy')
    .reduce((sum, txn) => sum + txn.amount, 0);

  const handleExportCSV = () => {
    const headers = ['Date', 'Type', 'Description', 'Amount', 'Quantity', 'Metal', 'Status'];
    const rows = filteredTransactions.map((txn) => [
      formatDate(txn.date),
      txn.type.toUpperCase(),
      txn.description,
      txn.amount.toString(),
      txn.quantity?.toString() || '',
      txn.metal || '',
      txn.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('CSV exported successfully!');
  };

  const handleExportPDF = () => {
    toast.info('PDF export feature coming soon!');
    // In production, use a library like jsPDF or pdfmake
  };

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-10">
      <PageHeader
        title="Transaction Ledger"
        description="Complete history of all your transactions, purchases, and payments"
      />

      {/* Summary Cards */}
      <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Transactions"
          value={filteredTransactions.length.toString()}
          description="All transaction types"
          icon={FileText}
          index={0}
        />
        <StatCard
          title="Total Amount"
          value={formatCurrency(totalAmount)}
          description="Combined value"
          icon={Download}
          index={1}
        />
        <StatCard
          title="Total Purchases"
          value={formatCurrency(totalBuy)}
          description="Buy transactions only"
          icon={FileText}
          index={2}
        />
      </div>

      {/* Filters & Export */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-4 sm:mb-6">
          <SectionHeader title="All Transactions" />
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportCSV}
              className="min-h-[44px] touch-manipulation w-full sm:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportPDF}
              className="min-h-[44px] touch-manipulation w-full sm:w-auto"
            >
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        <Card className={componentStyles.table.container}>
          <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6 pb-4 sm:pb-6">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 sm:h-10 text-base sm:text-sm"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[180px] h-12 sm:h-10 text-base sm:text-sm">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                  <SelectItem value="redemption">Redemption</SelectItem>
                  <SelectItem value="fee">Fees</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Transactions Table */}
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#92422B]/20 to-[#681412]/20 mb-4">
                  <FileText className="h-10 w-10 text-[#92422B]" />
                </div>
                <h3 className="text-xl font-bold text-[#681412] mb-2">
                  {searchTerm || filterType !== 'all' 
                    ? 'No transactions found' 
                    : 'No purchases yet'}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm || filterType !== 'all' 
                    ? 'Try adjusting your search or filters to find transactions.'
                    : 'Start building your portfolio by purchasing gold or silver. Your transactions will appear here.'}
                </p>
                {!searchTerm && filterType === 'all' && (
                  <Button 
                    onClick={() => {
                      window.location.href = '/dashboard?section=purchase';
                    }}
                    className="bg-gradient-to-r from-[#681412] to-[#92422B] hover:from-[#7a1a18] hover:to-[#a04d35] text-white shadow-lg"
                  >
                    Buy Gold/Silver
                    <ArrowUpRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="inline-block min-w-full align-middle px-4 md:px-0">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={componentStyles.table.thead}>
                      <tr>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Date</th>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Type</th>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Description</th>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Quantity</th>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Amount</th>
                        <th className={`${componentStyles.table.th} whitespace-nowrap`}>Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredTransactions.map((txn) => (
                        <motion.tr
                          key={txn.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`${componentStyles.table.tbody} border-b border-gray-100`}
                        >
                          <td className={`${componentStyles.table.td} whitespace-nowrap text-xs sm:text-sm`}>
                            {formatDate(txn.date)}
                          </td>
                          <td className={`${componentStyles.table.td} whitespace-nowrap`}>
                            <span
                              className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-semibold ${
                                txn.type === 'buy'
                                  ? 'bg-green-100 text-green-800'
                                  : txn.type === 'sell'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {txn.type.toUpperCase()}
                            </span>
                          </td>
                          <td className={`${componentStyles.table.td} text-xs sm:text-sm break-words max-w-[200px] sm:max-w-none`}>
                            {txn.description}
                          </td>
                          <td className={`${componentStyles.table.td} whitespace-nowrap text-xs sm:text-sm font-medium`}>
                            {txn.quantity ? `${txn.quantity} g` : '-'}
                          </td>
                          <td className={`${componentStyles.table.td} whitespace-nowrap text-xs sm:text-sm font-semibold`}>
                            <span className={txn.type === 'buy' ? 'text-green-700' : 'text-gray-700'}>
                              {txn.type === 'buy' ? '+' : '-'}
                              {formatCurrency(Math.abs(txn.amount))}
                            </span>
                          </td>
                          <td className={`${componentStyles.table.td} whitespace-nowrap`}>
                            <span
                              className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-semibold ${
                                txn.status === 'completed' || txn.status === 'paid'
                                  ? 'bg-green-100 text-green-800'
                                  : txn.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {txn.status}
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
    </div>
  );
}
