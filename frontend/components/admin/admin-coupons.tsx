'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Plus, Trash2, Users, RefreshCw, Tag } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Coupon {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  applicableType: 'gold' | 'silver' | 'both';
  maxUses: number | null;
  usedCount: number;
  expiryDate: string | null;
  assignedUsers: string[];
  isActive: boolean;
  createdAt: string;
}

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: '',
    applicableType: 'both' as 'gold' | 'silver' | 'both',
    maxUses: '',
    expiryDate: '',
  });

  useEffect(() => {
    loadCoupons();
    loadUsers();
  }, []);

  const loadCoupons = async () => {
    setIsLoading(true);
    try {
      const response = await api.getAdminCoupons();
      
      if (response.error) {
        toast.error(response.error || 'Failed to load coupons');
        setCoupons([]);
        return;
      }
      
      setCoupons(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      console.error('Error loading coupons:', error);
      toast.error(error.message || 'Failed to load coupons');
      setCoupons([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await api.getAdminUsers();
      if (response.data) {
        setUsers(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleCreateCoupon = async () => {
    if (!formData.code || !formData.description || !formData.discountValue) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      const couponData: any = {
        code: formData.code,
        description: formData.description,
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue),
        applicableType: formData.applicableType,
      };

      if (formData.maxUses) {
        couponData.maxUses = parseInt(formData.maxUses);
      }

      if (formData.expiryDate) {
        couponData.expiryDate = formData.expiryDate;
      }

      const response = await api.createAdminCoupon(couponData);

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success('Coupon created successfully');
      setIsCreateDialogOpen(false);
      setFormData({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        applicableType: 'both',
        maxUses: '',
        expiryDate: '',
      });
      loadCoupons();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create coupon');
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    if (!confirm('Are you sure you want to deactivate this coupon?')) {
      return;
    }

    try {
      const response = await api.deleteAdminCoupon(couponId);

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success('Coupon deactivated successfully');
      loadCoupons();
    } catch (error: any) {
      toast.error(error.message || 'Failed to deactivate coupon');
    }
  };

  const handleAssignCoupon = async (selectedUserIds: string[]) => {
    if (!selectedCoupon || selectedUserIds.length === 0) {
      toast.error('Please select at least one user');
      return;
    }

    try {
      const response = await api.assignAdminCoupon(selectedCoupon.id, selectedUserIds);

      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success('Coupon assigned successfully');
      setIsAssignDialogOpen(false);
      setSelectedCoupon(null);
      loadCoupons();
    } catch (error: any) {
      toast.error(error.message || 'Failed to assign coupon');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Coupons & Offers</h2>
          <p className="text-sm md:text-base text-muted-foreground">Manage coupons and offers for users</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
              <DialogDescription>
                Create a new coupon code that users can apply during purchase
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="code">Coupon Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="FIRSTGOLD10"
                />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="10% off on first gold purchase"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="discountType">Discount Type *</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value: 'percentage' | 'fixed') =>
                      setFormData({ ...formData, discountType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="discountValue">Discount Value *</Label>
                  <Input
                    id="discountValue"
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    placeholder={formData.discountType === 'percentage' ? '10' : '500'}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="applicableType">Applicable To</Label>
                <Select
                  value={formData.applicableType}
                  onValueChange={(value: 'gold' | 'silver' | 'both') =>
                    setFormData({ ...formData, applicableType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">Both Gold & Silver</SelectItem>
                    <SelectItem value="gold">Gold Only</SelectItem>
                    <SelectItem value="silver">Silver Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxUses">Max Uses (Optional)</Label>
                  <Input
                    id="maxUses"
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                    placeholder="Leave empty for unlimited"
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                  <Input
                    id="expiryDate"
                    type="datetime-local"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCoupon}>Create Coupon</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Coupons</CardTitle>
        </CardHeader>
        <CardContent>
          {coupons.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No coupons created yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Code</th>
                    <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Description</th>
                    <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Discount</th>
                    <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Applicable</th>
                    <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Uses</th>
                    <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Assigned</th>
                    <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {coupons.map((coupon) => (
                    <tr key={coupon.id}>
                      <td className="p-3 whitespace-nowrap">
                        <Badge variant="outline" className="font-mono">{coupon.code}</Badge>
                      </td>
                      <td className="p-3">{coupon.description}</td>
                      <td className="p-3 whitespace-nowrap">
                        {coupon.discountType === 'percentage'
                          ? `${coupon.discountValue}%`
                          : `₹${coupon.discountValue}`}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <Badge variant="secondary">{coupon.applicableType}</Badge>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {coupon.usedCount} / {coupon.maxUses || '∞'}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {coupon.assignedUsers.length > 0 ? (
                          <Badge variant="outline">
                            <Users className="h-3 w-3 mr-1 inline" />
                            {coupon.assignedUsers.length}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Public</Badge>
                        )}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <Badge variant={coupon.isActive ? 'default' : 'secondary'}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedCoupon(coupon);
                              setIsAssignDialogOpen(true);
                            }}
                            disabled={!coupon.isActive}
                          >
                            <Users className="h-3 w-3 mr-1" />
                            Assign
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteCoupon(coupon.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign Coupon Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Coupon to Users</DialogTitle>
            <DialogDescription>
              Select users to assign the coupon "{selectedCoupon?.code}" to
            </DialogDescription>
          </DialogHeader>
          <AssignCouponDialog
            coupon={selectedCoupon}
            users={users}
            assignedUserIds={selectedCoupon?.assignedUsers || []}
            onAssign={handleAssignCoupon}
            onClose={() => {
              setIsAssignDialogOpen(false);
              setSelectedCoupon(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AssignCouponDialog({
  coupon,
  users,
  assignedUserIds,
  onAssign,
  onClose,
}: {
  coupon: Coupon | null;
  users: any[];
  assignedUserIds: string[];
  onAssign: (userIds: string[]) => void;
  onClose: () => void;
}) {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(assignedUserIds);

  const handleToggleUser = (userId: string) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter((id) => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const handleAssign = () => {
    onAssign(selectedUserIds);
  };

  return (
    <>
      <div className="max-h-96 overflow-y-auto space-y-2">
        {users.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">No users available</div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-50"
              onClick={() => handleToggleUser(user.id)}
            >
              <input
                type="checkbox"
                checked={selectedUserIds.includes(user.id)}
                onChange={() => handleToggleUser(user.id)}
                className="mr-2"
              />
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex justify-between items-center pt-4">
        <div className="text-sm text-muted-foreground">
          {selectedUserIds.length} user(s) selected
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAssign}>Assign Coupon</Button>
        </div>
      </div>
    </>
  );
}




