'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { User } from '@/types';
import { CheckCircle2, XCircle, RefreshCw, Gift, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showCreateOffer, setShowCreateOffer] = useState(false);
  const [newOffer, setNewOffer] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    applicableType: 'both' as 'gold' | 'silver' | 'both',
  });

  useEffect(() => {
    loadUsers();
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      const response = await api.getAdminCoupons();
      if (response.data) {
        setCoupons(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error loading coupons:', error);
    }
  };

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      console.log('🔍 Loading admin users...');
      const response = await api.getAdminUsers();
      console.log('📥 Admin users API response:', response);
      
      if (response.error) {
        console.error('❌ Admin users API error:', response.error);
        toast.error(response.error || 'Failed to load users');
        setUsers([]);
        return;
      }
      
      if (response.data) {
        console.log(`✅ Loaded ${response.data.length} users`);
        setUsers(Array.isArray(response.data) ? response.data : []);
      } else {
        console.warn('⚠️ No data in response, setting empty array');
        setUsers([]);
      }
    } catch (error: any) {
      console.error('❌ Error loading users:', error);
      toast.error(error.message || 'Failed to load users');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyKYC = async (userId: string, verified: boolean) => {
    if (!confirm(verified ? 
      'Are you sure you want to verify this user\'s KYC?' : 
      'Are you sure you want to reject this user\'s KYC?')) {
      return;
    }

    setVerifying(userId);
    try {
      const response = await api.verifyKYC(userId, verified);
      if (response.data) {
        toast.success(response.data.message);
        loadUsers();
      }
    } catch (error: any) {
      console.error('Error verifying KYC:', error);
      toast.error(error.message || 'Failed to verify KYC');
    } finally {
      setVerifying(null);
    }
  };

  const handleGiveOffer = (user: User) => {
    setSelectedUser(user);
    setIsOfferDialogOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    // Double confirmation for delete action
    const confirmMessage = `Are you sure you want to delete the user "${user.name}" (${user.email})?\n\nThis will permanently delete:\n- User account\n- All purchases\n- All payments\n- All deliveries\n- All notifications\n\nThis action cannot be undone!`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    // Second confirmation
    if (!confirm(`Final confirmation: Delete "${user.name}" permanently?`)) {
      return;
    }

    setDeleting(user.id);
    try {
      const response = await api.deleteUser(user.id);
      if (response.error) {
        toast.error(response.error || 'Failed to delete user');
        return;
      }

      toast.success(response.data?.message || `User ${user.name} deleted successfully`);
      loadUsers(); // Reload users list
    } catch (error: any) {
      console.error('Delete user error:', error);
      toast.error(error.message || 'Failed to delete user. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const handleAssignCoupon = async (couponId: string) => {
    if (!selectedUser) return;

    try {
      const response = await api.assignAdminCoupon(couponId, [selectedUser.id]);

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success(`Offer assigned to ${selectedUser.name} successfully`);
      setIsOfferDialogOpen(false);
      setSelectedUser(null);
      setShowCreateOffer(false);
      loadCoupons();
    } catch (error: any) {
      toast.error(error.message || 'Failed to assign offer');
    }
  };

  const handleCreateAndAssignOffer = async () => {
    if (!selectedUser) return;

    if (!newOffer.code || !newOffer.description || !newOffer.discountValue) {
      toast.error('Please fill all required fields');
      return;
    }

    // Validate discount value
    const discountValueNum = parseFloat(newOffer.discountValue);
    if (isNaN(discountValueNum) || discountValueNum <= 0) {
      toast.error('Please enter a valid discount value');
      return;
    }

    if (newOffer.discountType === 'percentage' && discountValueNum > 100) {
      toast.error('Percentage discount cannot exceed 100%');
      return;
    }

    try {
      // First create the coupon
      const createResponse = await api.createAdminCoupon({
        code: newOffer.code.toUpperCase().trim(),
        description: newOffer.description.trim(),
        discountType: newOffer.discountType,
        discountValue: discountValueNum,
        applicableType: newOffer.applicableType,
      });

      if (createResponse.error) {
        toast.error(createResponse.error);
        return;
      }

      // Extract coupon ID from response
      // Response structure: { data: { message: '...', coupon: { id: '...', ... } } }
      const couponId = createResponse.data?.coupon?.id;
      
      if (!couponId) {
        toast.error('Failed to create coupon. Please try again.');
        return;
      }

      // Then assign it to the user
      const assignResponse = await api.assignAdminCoupon(couponId, [selectedUser.id]);

      if (assignResponse.error) {
        toast.warning(`Coupon created but failed to assign: ${assignResponse.error}. You can assign it manually.`);
        // Don't return - coupon was created successfully
      } else {
        toast.success(`Offer "${newOffer.code}" created and assigned to ${selectedUser.name} successfully`);
      }

      setIsOfferDialogOpen(false);
      setSelectedUser(null);
      setShowCreateOffer(false);
      setNewOffer({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        applicableType: 'both',
      });
      loadCoupons();
    } catch (error: any) {
      console.error('Create offer error:', error);
      toast.error(error.message || 'Failed to create and assign offer. Please check your connection.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">All Users</h2>
        <p className="text-sm md:text-base text-muted-foreground">Manage platform users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users yet
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="inline-block min-w-full align-middle px-4 md:px-0">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Name</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Email</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Phone</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">PAN Card</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Aadhaar</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">KYC Status</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Joined</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 text-sm font-semibold text-gray-900 whitespace-nowrap">{user.name}</td>
                        <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{user.email}</td>
                        <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{user.phone || '-'}</td>
                        <td className="p-3 text-sm font-mono text-gray-600 whitespace-nowrap">{user.pan || '-'}</td>
                        <td className="p-3 text-sm font-mono text-gray-600 whitespace-nowrap">{user.aadhaar || '-'}</td>
                        <td className="p-3 whitespace-nowrap">
                          {user.kycVerified ? (
                            <Badge className="bg-green-100 text-green-800 border border-green-200">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border border-yellow-200">
                              Pending
                            </Badge>
                          )}
                        </td>
                        <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{formatDate(user.createdAt)}</td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGiveOffer(user)}
                              className="min-h-[44px] touch-manipulation text-xs border-[#681412] text-[#681412] hover:bg-[#681412] hover:text-white"
                            >
                              <Gift className="h-3 w-3 mr-1" />
                              Give Offer
                            </Button>
                            {!user.kycVerified && user.pan && user.aadhaar && (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() => handleVerifyKYC(user.id, true)}
                                  disabled={verifying === user.id}
                                  className="min-h-[44px] touch-manipulation text-xs"
                                >
                                  {verifying === user.id ? (
                                    <RefreshCw className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <>
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Verify
                                    </>
                                  )}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleVerifyKYC(user.id, false)}
                                  disabled={verifying === user.id}
                                  className="min-h-[44px] touch-manipulation text-xs"
                                >
                                  <XCircle className="h-3 w-3 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
                            {user.role !== 'admin' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteUser(user)}
                                disabled={deleting === user.id}
                                className="min-h-[44px] touch-manipulation text-xs bg-red-600 hover:bg-red-700"
                              >
                                {deleting === user.id ? (
                                  <RefreshCw className="h-3 w-3 animate-spin" />
                                ) : (
                                  <>
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Delete
                                  </>
                                )}
                              </Button>
                            )}
                          </div>
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

      {/* Give Offer Dialog */}
      <Dialog 
        open={isOfferDialogOpen} 
        onOpenChange={(open) => {
          setIsOfferDialogOpen(open);
          if (!open) {
            setShowCreateOffer(false);
            setNewOffer({
              code: '',
              description: '',
              discountType: 'percentage',
              discountValue: '',
              applicableType: 'both',
            });
          }
        }}
      >
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Give Offer to {selectedUser?.name}</DialogTitle>
            <DialogDescription>
              Select an existing coupon or create a new offer for this user
            </DialogDescription>
          </DialogHeader>

          {/* Toggle between existing coupons and create new */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={!showCreateOffer ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowCreateOffer(false)}
              className="flex-1"
            >
              Select Existing
            </Button>
            <Button
              variant={showCreateOffer ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowCreateOffer(true)}
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-1" />
              Create New
            </Button>
          </div>

          {!showCreateOffer ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {coupons.filter(c => c.isActive).length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No active coupons available
                </div>
              ) : (
                coupons.filter(c => c.isActive).map((coupon) => (
                  <Card
                    key={coupon.id}
                    className="cursor-pointer hover:bg-gray-50 border-[#E79A66]"
                    onClick={() => handleAssignCoupon(coupon.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-[#681412] font-mono">{coupon.code}</div>
                          <div className="text-sm text-gray-600">{coupon.description}</div>
                          <div className="text-sm font-semibold text-[#681412] mt-1">
                            {coupon.discountType === 'percentage'
                              ? `${coupon.discountValue}% OFF`
                              : `₹${coupon.discountValue} OFF`}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="offerCode">Offer Code *</Label>
                <Input
                  id="offerCode"
                  placeholder="e.g., WELCOME10"
                  value={newOffer.code}
                  onChange={(e) => setNewOffer({ ...newOffer, code: e.target.value.toUpperCase() })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="offerDescription">Description *</Label>
                <Input
                  id="offerDescription"
                  placeholder="e.g., 10% off on first gold purchase"
                  value={newOffer.description}
                  onChange={(e) => setNewOffer({ ...newOffer, description: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="discountType">Discount Type *</Label>
                <Select
                  value={newOffer.discountType}
                  onValueChange={(value: 'percentage' | 'fixed') =>
                    setNewOffer({ ...newOffer, discountType: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="discountValue">
                  Discount Value * ({newOffer.discountType === 'percentage' ? '%' : '₹'})
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  placeholder={newOffer.discountType === 'percentage' ? '10' : '500'}
                  value={newOffer.discountValue}
                  onChange={(e) => setNewOffer({ ...newOffer, discountValue: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="applicableType">Applicable To *</Label>
                <Select
                  value={newOffer.applicableType}
                  onValueChange={(value: 'gold' | 'silver' | 'both') =>
                    setNewOffer({ ...newOffer, applicableType: value })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">Both Gold & Silver</SelectItem>
                    <SelectItem value="gold">Gold Only</SelectItem>
                    <SelectItem value="silver">Silver Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleCreateAndAssignOffer}
                className="w-full bg-[#681412] hover:bg-[#92422B]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create & Assign Offer
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
