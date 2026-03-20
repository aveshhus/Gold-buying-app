'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { User } from '@/types';
import { CheckCircle2, XCircle, RefreshCw, Shield, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminKYCVerification() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<{
    pendingVerification: number;
    verificationRequired: number;
    actionRequired: number;
    totalWithKYC: number;
    incompleteKYC: number;
    verifiedKYC: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verifying, setVerifying] = useState<string | null>(null);

  useEffect(() => {
    loadKYCQueue();
    loadKYCStats();
  }, []);

  const loadKYCQueue = async () => {
    try {
      const response = await api.getKYCQueue();
      if (response.data) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Error loading KYC queue:', error);
      toast.error('Failed to load KYC queue');
    }
  };

  const loadKYCStats = async () => {
    setIsLoading(true);
    try {
      const response = await api.getKYCStats();
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading KYC stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyKYC = async (userId: string, verified: boolean) => {
    if (!confirm(verified ? 
      'Are you sure you want to verify this user\'s KYC documents?' : 
      'Are you sure you want to reject this user\'s KYC verification?')) {
      return;
    }

    setVerifying(userId);
    try {
      const response = await api.verifyKYC(userId, verified);
      if (response.data) {
        toast.success(response.data.message);
        loadKYCQueue();
        loadKYCStats();
      }
    } catch (error: any) {
      console.error('Error verifying KYC:', error);
      toast.error(error.message || 'Failed to verify KYC');
    } finally {
      setVerifying(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">KYC Verification Queue</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Review and verify user KYC documents (PAN & Aadhaar)
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-[#92422B] text-white border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Pending Verification
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats ? stats.pendingVerification : users.length}
            </div>
            <p className="text-xs text-white/80 mt-1">
              Users with complete KYC awaiting verification
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#92422B] text-white border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Verification Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats ? stats.verificationRequired : '-'}
            </div>
            <p className="text-xs text-white/80 mt-1">
              Users with KYC documents (complete or incomplete)
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#92422B] text-white border-0 shadow-lg">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Action Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {stats ? stats.actionRequired : users.length}
            </div>
            <p className="text-xs text-white/80 mt-1">
              Ready for immediate review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* KYC Queue Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending KYC Verifications</CardTitle>
          <CardDescription>
            Review user KYC documents and verify or reject them
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">All Clear!</h3>
              <p className="text-muted-foreground">
                No pending KYC verifications at the moment.
              </p>
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
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Submitted</th>
                      <th className="text-left p-3 text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 text-sm font-semibold text-gray-900 whitespace-nowrap">{user.name}</td>
                        <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{user.email}</td>
                        <td className="p-3 text-sm text-gray-600 whitespace-nowrap">{user.phone || '-'}</td>
                        <td className="p-3 whitespace-nowrap">
                          <code className="text-xs md:text-sm bg-gray-50 px-2 py-1 rounded font-mono border border-gray-200">
                            {user.pan}
                          </code>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <code className="text-xs md:text-sm bg-gray-50 px-2 py-1 rounded font-mono border border-gray-200">
                            {user.aadhaar}
                          </code>
                        </td>
                        <td className="p-3 text-sm text-gray-600 whitespace-nowrap">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleVerifyKYC(user.id, true)}
                              disabled={verifying === user.id}
                              className="min-h-[44px] touch-manipulation"
                            >
                              {verifying === user.id ? (
                                <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                              ) : (
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                              )}
                              Verify
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleVerifyKYC(user.id, false)}
                              disabled={verifying === user.id}
                              className="min-h-[44px] touch-manipulation"
                            >
                              <XCircle className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
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

      {/* Verification Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            KYC Verification Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong>PAN Card:</strong> Verify format (ABCDE1234F) and ensure it matches the user's name
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Aadhaar:</strong> Verify 12-digit format (starts with 2-9) and ensure it's valid
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Document Matching:</strong> Ensure PAN and Aadhaar belong to the same person
              </div>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong>Rejection:</strong> Only reject if documents are clearly invalid or don't match
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

