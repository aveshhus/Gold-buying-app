'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import AdminLayout from '@/components/admin/admin-layout';
import { toast } from 'sonner';

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      toast.error('Please login to continue');
      return;
    }

    if (user?.role !== 'admin') {
      router.push('/dashboard');
      toast.error('Admin access required');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return <AdminLayout />;
}
