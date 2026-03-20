'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Payment } from '@/types';

export default function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAdminPayments();
      if (response.data) {
        setPayments(response.data);
      }
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">All Payments</h2>
        <p className="text-sm md:text-base text-muted-foreground">View all payment transactions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No payments yet
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="inline-block min-w-full align-middle px-4 md:px-0">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Date</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">User ID</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Purchase ID</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Amount</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 text-sm text-gray-900 whitespace-nowrap">{formatDate(payment.createdAt)}</td>
                        <td className="p-3 text-sm font-mono text-gray-600 whitespace-nowrap">
                          {payment.userId.substring(0, 8)}...
                        </td>
                        <td className="p-3 text-sm font-mono text-gray-600 whitespace-nowrap">
                          {payment.purchaseId.substring(0, 8)}...
                        </td>
                        <td className="p-3 text-sm font-bold text-gray-900 whitespace-nowrap">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-semibold ${
                              payment.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
