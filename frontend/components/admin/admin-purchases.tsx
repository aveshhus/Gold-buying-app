'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Purchase } from '@/types';
import { toast } from 'sonner';

export default function AdminPurchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }
    try {
      const response = await api.getAdminPurchases();
      if (response.data) {
        setPurchases(response.data);
      }
    } catch (error) {
      console.error('Error loading purchases:', error);
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  const handleUpdateStatus = async (purchaseId: string, status: string) => {
    // Optimistic update - update UI immediately
    setPurchases(prevPurchases => 
      prevPurchases.map(purchase => 
        purchase.id === purchaseId 
          ? { ...purchase, status: status as 'pending' | 'paid' | 'delivered' }
          : purchase
      )
    );
    
    setUpdatingIds(prev => new Set(prev).add(purchaseId));
    
    try {
      const response = await api.updatePurchaseStatus(purchaseId, status);
      if (response.error) {
        // Revert on error - silent refresh to restore original state
        loadPurchases(false);
        toast.error(response.error);
        return;
      }
      
      // Update with server response if available
      if (response.data?.purchase) {
        setPurchases(prevPurchases => 
          prevPurchases.map(purchase => 
            purchase.id === purchaseId 
              ? response.data.purchase
              : purchase
          )
        );
      } else {
        // Silent refresh from server to ensure consistency (no loading state)
        loadPurchases(false);
      }
      
      toast.success('Purchase status updated');
    } catch (error) {
      // Revert on error - silent refresh to restore original state
      loadPurchases(false);
      toast.error('Failed to update status');
    } finally {
      setUpdatingIds(prev => {
        const next = new Set(prev);
        next.delete(purchaseId);
        return next;
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">All Purchases</h2>
        <p className="text-sm md:text-base text-muted-foreground">Manage all customer purchases</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Purchase List</CardTitle>
        </CardHeader>
        <CardContent>
          {purchases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No purchases yet
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="inline-block min-w-full align-middle px-4 md:px-0">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Date</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">User</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Type</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Purity</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Quantity</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Amount</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Status</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {purchases.map((purchase) => (
                      <tr key={purchase.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 text-sm text-gray-900 whitespace-nowrap">{formatDate(purchase.createdAt)}</td>
                        <td className="p-3 text-sm font-mono text-gray-600 whitespace-nowrap">{purchase.userId.substring(0, 8)}...</td>
                        <td className="p-3 text-sm capitalize font-medium text-gray-900 whitespace-nowrap">{purchase.type}</td>
                        <td className="p-3 text-sm uppercase font-semibold text-gray-900 whitespace-nowrap">{purchase.purity}</td>
                        <td className="p-3 text-sm text-gray-900 whitespace-nowrap">{purchase.quantity} g</td>
                        <td className="p-3 text-sm font-bold text-gray-900 whitespace-nowrap">
                          {formatCurrency(purchase.totalAmount)}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-semibold ${
                              purchase.status === 'delivered'
                                ? 'bg-green-100 text-green-800'
                                : purchase.status === 'paid'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {purchase.status}
                          </span>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {purchase.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(purchase.id, 'paid')}
                              disabled={updatingIds.has(purchase.id)}
                              className="min-h-[44px] min-w-[100px] touch-manipulation"
                            >
                              {updatingIds.has(purchase.id) ? 'Updating...' : 'Mark Paid'}
                            </Button>
                          )}
                          {purchase.status === 'paid' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(purchase.id, 'delivered')}
                              disabled={updatingIds.has(purchase.id)}
                              className="min-h-[44px] min-w-[120px] touch-manipulation"
                            >
                              {updatingIds.has(purchase.id) ? 'Updating...' : 'Mark Delivered'}
                            </Button>
                          )}
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
