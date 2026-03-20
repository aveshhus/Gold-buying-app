'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Delivery } from '@/types';

type FilterType = 'all' | 'today' | 'week' | 'custom';

export default function AdminDeliveries() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAdminDeliveries();
      if (response.data) {
        setDeliveries(response.data);
      }
    } catch (error) {
      console.error('Error loading deliveries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter function based on date
  const filterByDate = (items: Delivery[]) => {
    if (filter === 'all' || filter === 'custom') return items;

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    return items.filter(item => {
      const itemDate = new Date(item.deliveredAt || Date.now());
      
      if (filter === 'today') {
        return itemDate >= todayStart;
      } else if (filter === 'week') {
        return itemDate >= weekStart;
      }
      
      return true;
    });
  };

  // Apply filters and separate gold and silver deliveries
  const filteredDeliveries = filterByDate(deliveries);
  const goldDeliveries = filteredDeliveries.filter(d => d.type === 'gold');
  const silverDeliveries = filteredDeliveries.filter(d => d.type === 'silver');
  
  const totalCount = filteredDeliveries.length;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Deliveries ({totalCount})</h2>
        <p className="text-sm md:text-base text-muted-foreground">View all delivery records separated by gold and silver</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-sm md:text-base font-semibold transition-all whitespace-nowrap min-w-[80px] ${
            filter === 'all'
              ? 'bg-[#681412] text-white shadow-sm'
              : 'bg-white border border-[#E79A66] text-[#681412] hover:bg-gray-50'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('today')}
          className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-sm md:text-base font-semibold transition-all whitespace-nowrap min-w-[80px] ${
            filter === 'today'
              ? 'bg-[#681412] text-white shadow-sm'
              : 'bg-white border border-[#E79A66] text-[#681412] hover:bg-gray-50'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setFilter('week')}
          className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-sm md:text-base font-semibold transition-all whitespace-nowrap min-w-[100px] ${
            filter === 'week'
              ? 'bg-[#681412] text-white shadow-sm'
              : 'bg-white border border-[#E79A66] text-[#681412] hover:bg-gray-50'
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => setFilter('custom')}
          className={`px-4 md:px-6 py-2 md:py-2.5 rounded-full text-sm md:text-base font-semibold transition-all whitespace-nowrap min-w-[120px] ${
            filter === 'custom'
              ? 'bg-[#681412] text-white shadow-sm'
              : 'bg-white border border-[#E79A66] text-[#681412] hover:bg-gray-50'
          }`}
        >
          Custom Range
        </button>
      </div>

      {/* Gold Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🥇</span>
            Gold Deliveries
            {goldDeliveries.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({goldDeliveries.length} {goldDeliveries.length === 1 ? 'delivery' : 'deliveries'})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {goldDeliveries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No gold deliveries yet
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="inline-block min-w-full align-middle px-4 md:px-0">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Delivery Date</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">User ID</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Purity</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {goldDeliveries.map((delivery) => (
                      <tr key={delivery.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 text-sm text-gray-900 whitespace-nowrap">{formatDate(delivery.deliveredAt)}</td>
                        <td className="p-3 text-sm font-mono text-gray-600 whitespace-nowrap">
                          {delivery.userId.substring(0, 8)}...
                        </td>
                        <td className="p-3 text-sm uppercase font-semibold text-gray-900 whitespace-nowrap">{delivery.purity}</td>
                        <td className="p-3 text-sm font-medium text-gray-900 whitespace-nowrap">{delivery.quantity} g</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Silver Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🥉</span>
            Silver Deliveries
            {silverDeliveries.length > 0 && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({silverDeliveries.length} {silverDeliveries.length === 1 ? 'delivery' : 'deliveries'})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {silverDeliveries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No silver deliveries yet
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="inline-block min-w-full align-middle px-4 md:px-0">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Delivery Date</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">User ID</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Quantity</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {silverDeliveries.map((delivery) => (
                      <tr key={delivery.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 text-sm text-gray-900 whitespace-nowrap">{formatDate(delivery.deliveredAt)}</td>
                        <td className="p-3 text-sm font-mono text-gray-600 whitespace-nowrap">
                          {delivery.userId.substring(0, 8)}...
                        </td>
                        <td className="p-3 text-sm font-medium text-gray-900 whitespace-nowrap">{delivery.quantity} g</td>
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
