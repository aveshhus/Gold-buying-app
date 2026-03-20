'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, XCircle, RefreshCw, DollarSign } from 'lucide-react';

type FilterStatus = 'all' | 'pending' | 'approved' | 'processed' | 'rejected';

interface RefundRequest {
  id: string;
  purchaseId: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed' | 'cancelled';
  isWithin24Hours: boolean;
  originalAmount: number;
  currentMarketPrice: number;
  calculatedRefundAmount: number;
  deductions?: {
    marketPriceVariation: number;
    governmentTaxes: number;
    handlingCharges: number;
    total: number;
  };
  supportChannel?: string;
  supportReference?: string;
  adminNotes?: string;
  requestTimestamp: string;
  processedAt?: string;
}

export default function AdminRefunds() {
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'process' | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [refundTransactionId, setRefundTransactionId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadRefundRequests();
  }, []);

  const loadRefundRequests = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAdminRefunds();
      if (response.error) {
        console.error('Refunds API Error:', response.error);
        toast.error(response.error);
        setRefundRequests([]);
      } else if (response.data) {
        // Handle both array and object responses
        const refundsData = Array.isArray(response.data) 
          ? response.data 
          : (Array.isArray(response.data.data) ? response.data.data : []);
        setRefundRequests(refundsData);
      } else {
        setRefundRequests([]);
      }
    } catch (error) {
      console.error('Error loading refund requests:', error);
      toast.error('Failed to load refund requests');
      setRefundRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (refund: RefundRequest, type: 'approve' | 'reject' | 'process') => {
    setSelectedRefund(refund);
    setActionType(type);
    setAdminNotes('');
    setRefundTransactionId('');
    setActionModalVisible(true);
  };

  const confirmAction = async () => {
    if (!selectedRefund || !actionType) return;

    setIsProcessing(true);
    
    // Store current state for potential rollback
    const currentRefunds = [...refundRequests];
    const refundIndex = currentRefunds.findIndex(r => r.id === selectedRefund.id);
    const originalRefund = refundIndex >= 0 ? { ...currentRefunds[refundIndex] } : null;
    
    // Determine new status based on action
    let newStatus: RefundRequest['status'] = selectedRefund.status;
    if (actionType === 'approve') {
      newStatus = 'approved';
    } else if (actionType === 'reject') {
      newStatus = 'rejected';
    } else if (actionType === 'process') {
      newStatus = 'processed';
    }

    // Store values before closing modal
    const tempSelectedRefund = selectedRefund;
    const tempActionType = actionType;
    const tempAdminNotes = adminNotes;
    const tempRefundTransactionId = refundTransactionId;

    // Update UI immediately (optimistic update) - use functional update to ensure latest state
    setRefundRequests(prevRefunds => {
      const index = prevRefunds.findIndex(r => r.id === tempSelectedRefund.id);
      if (index >= 0) {
        const updated = [...prevRefunds];
        updated[index] = {
          ...updated[index],
          status: newStatus,
          adminNotes: tempAdminNotes || updated[index].adminNotes,
          processedAt: tempActionType === 'process' ? new Date().toISOString() : updated[index].processedAt,
        };
        return updated;
      }
      return prevRefunds;
    });

    try {
      let response;
      if (tempActionType === 'approve') {
        response = await api.approveRefund(tempSelectedRefund.id, tempAdminNotes);
      } else if (tempActionType === 'reject') {
        response = await api.rejectRefund(tempSelectedRefund.id, tempAdminNotes);
      } else if (tempActionType === 'process') {
        // Transaction ID is optional for processing
        response = await api.processRefund(
          tempSelectedRefund.id, 
          tempRefundTransactionId?.trim() || undefined, 
          tempAdminNotes
        );
      }

      // Check for error - if error, revert optimistic update
      if (response?.error) {
        console.error(`Refund ${tempActionType} error:`, response.error);
        // Revert optimistic update using functional update
        setRefundRequests(prevRefunds => {
          const index = prevRefunds.findIndex(r => r.id === tempSelectedRefund.id);
          if (index >= 0 && originalRefund) {
            const reverted = [...prevRefunds];
            reverted[index] = originalRefund;
            return reverted;
          }
          return prevRefunds;
        });
        toast.error(response.error || `Failed to ${tempActionType} refund request`, {
          duration: 5000,
        });
        setIsProcessing(false);
        return;
      }

      // Success - update the specific refund request with server response
      console.log('Refund action success response:', response);
      
      const actionMessages: Record<string, string> = {
        approve: 'Refund request approved successfully',
        reject: 'Refund request rejected',
        process: 'Refund processed successfully',
      };
      
      const successMessage = response?.data?.message || actionMessages[tempActionType] || `Refund ${tempActionType}ed successfully`;
      const refundAmount = response?.data?.refundRequest?.calculatedRefundAmount;
      
      console.log('Success message:', successMessage, 'Refund amount:', refundAmount);
      
      // Update the refund request with server response data if available (merge with optimistic update)
      if (response?.data?.refundRequest) {
        setRefundRequests(prevRefunds => {
          const index = prevRefunds.findIndex(r => r.id === tempSelectedRefund.id);
          if (index >= 0) {
            const updated = [...prevRefunds];
            updated[index] = {
              ...updated[index],
              ...response.data.refundRequest,
              status: newStatus,
              adminNotes: tempAdminNotes || updated[index].adminNotes,
              processedAt: tempActionType === 'process' ? new Date().toISOString() : updated[index].processedAt,
            };
            return updated;
          }
          return prevRefunds;
        });
      }
      
      // Close modal first
      setActionModalVisible(false);
      setSelectedRefund(null);
      setActionType(null);
      setAdminNotes('');
      setRefundTransactionId('');
      
      // Show success message (use double requestAnimationFrame to ensure modal is fully closed)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          console.log('Showing success toast:', successMessage);
          toast.success(successMessage, {
            description: refundAmount 
              ? `Refund amount: ${formatCurrency(refundAmount)}`
              : `Status updated to: ${newStatus}`,
            duration: 5000,
          });
        });
      });
      
      // Refresh data in background to ensure consistency (but don't wait for it)
      setTimeout(() => {
        loadRefundRequests().catch(err => {
          console.error('Background refresh failed:', err);
          // Ignore background refresh errors
        });
      }, 500);
    } catch (error: any) {
      console.error(`Error ${tempActionType}ing refund:`, error);
      // Revert optimistic update on error using functional update
      setRefundRequests(prevRefunds => {
        const index = prevRefunds.findIndex(r => r.id === tempSelectedRefund.id);
        if (index >= 0 && originalRefund) {
          const reverted = [...prevRefunds];
          reverted[index] = originalRefund;
          return reverted;
        }
        return prevRefunds;
      });
      toast.error(
        error.message || `Failed to ${tempActionType} refund request. Please try again.`,
        {
          duration: 5000,
        }
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'approved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredRefunds = filterStatus === 'all'
    ? refundRequests
    : refundRequests.filter(r => r.status === filterStatus);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-[#681412]" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Refund Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(['all', 'pending', 'approved', 'processed', 'rejected'] as FilterStatus[]).map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className={filterStatus === status ? 'bg-[#681412] hover:bg-[#92422B]' : ''}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>

          {filteredRefunds.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No refund requests found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRefunds.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-[#681412]">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-[#681412]">Refund Request ID: {request.id}</p>
                            <p className="text-sm text-gray-600">Purchase ID: {request.purchaseId}</p>
                            <p className="text-sm font-semibold text-[#681412] font-mono">
                              Transaction ID: {request.transactionId || request.purchaseId}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Requested: {formatDate(request.requestTimestamp || request.id)}
                            </p>
                          </div>
                          <Badge className={getStatusColor(request.status)}>
                            {request.status.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-gray-600">Original Amount</p>
                            <p className="font-semibold text-lg">{formatCurrency(request.originalAmount || 0)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Refund Amount</p>
                            <p className="font-semibold text-lg text-green-600">
                              {formatCurrency(request.calculatedRefundAmount || 0)}
                            </p>
                          </div>
                        </div>

                        {request.isWithin24Hours ? (
                          <Badge className="mt-2 bg-green-100 text-green-800 border-green-200">
                            ✅ Full refund eligible (within 24 hours of purchase)
                          </Badge>
                        ) : (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm font-semibold text-yellow-900 mb-2">
                              ⚠️ Market Price-Based Refund (After 24 Hours)
                            </p>
                            <p className="text-xs text-yellow-800 mb-2">
                              Refund calculated based on current market price. Customer bears all price fluctuations after 24 hours.
                            </p>
                            {request.deductions && (
                              <div className="mt-2 space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-yellow-700">Market Price Variation:</span>
                                  <span className="font-semibold">{formatCurrency(request.deductions.marketPriceVariation || 0)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-yellow-700">Government Taxes:</span>
                                  <span className="font-semibold">{formatCurrency(request.deductions.governmentTaxes || 0)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-yellow-700">Handling Charges:</span>
                                  <span className="font-semibold">{formatCurrency(request.deductions.handlingCharges || 0)}</span>
                                </div>
                                <div className="flex justify-between pt-1 border-t border-yellow-300">
                                  <span className="text-yellow-900 font-semibold">Total Deductions:</span>
                                  <span className="font-bold text-yellow-900">{formatCurrency(request.deductions.total || 0)}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {request.supportChannel && (
                          <p className="text-sm text-gray-600 mt-2">
                            Support: {request.supportChannel}
                            {request.supportReference && ` - ${request.supportReference}`}
                          </p>
                        )}

                        {request.adminNotes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-semibold text-[#681412] mb-1">Admin Notes:</p>
                            <p className="text-sm text-gray-700">{request.adminNotes}</p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2">
                        {request.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => handleAction(request, 'approve')}
                              className="bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleAction(request, 'reject')}
                              variant="destructive"
                              size="sm"
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}

                        {request.status === 'approved' && (
                          <Button
                            onClick={() => handleAction(request, 'process')}
                            className="bg-blue-600 hover:bg-blue-700"
                            size="sm"
                          >
                            <DollarSign className="h-4 w-4 mr-2" />
                            Process Refund
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Modal */}
      <Dialog open={actionModalVisible} onOpenChange={setActionModalVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' && 'Approve Refund'}
              {actionType === 'reject' && 'Reject Refund'}
              {actionType === 'process' && 'Process Refund'}
            </DialogTitle>
            <DialogDescription>
              {selectedRefund && (
                <div className="mt-2 space-y-1">
                  <p>Purchase ID: {selectedRefund.purchaseId}</p>
                  <p>Refund Amount: {formatCurrency(selectedRefund.calculatedRefundAmount || 0)}</p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {actionType === 'process' && (
              <div>
                <Label htmlFor="transactionId">Refund Transaction ID (Optional)</Label>
                <Input
                  id="transactionId"
                  value={refundTransactionId}
                  onChange={(e) => setRefundTransactionId(e.target.value)}
                  placeholder="Enter transaction ID"
                />
              </div>
            )}

            <div>
              <Label htmlFor="adminNotes">Admin Notes</Label>
              <Textarea
                id="adminNotes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Enter notes..."
                rows={4}
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setActionModalVisible(false);
                  setSelectedRefund(null);
                  setActionType(null);
                  setAdminNotes('');
                  setRefundTransactionId('');
                }}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmAction}
                disabled={isProcessing}
                className="bg-[#681412] hover:bg-[#92422B]"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

