'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import { toast } from 'sonner';

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();
  const [initialSection, setInitialSection] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      toast.error('Please login to continue');
      return;
    }

    if (user?.role === 'admin') {
      router.push('/admin');
    }

    // Check for section parameter in URL
    const section = searchParams.get('section');
    if (section) {
      setInitialSection(section);
    }
  }, [isAuthenticated, user, router, searchParams]);

  if (!isAuthenticated || user?.role === 'admin') {
    return null;
  }

  return <DashboardLayout initialSection={initialSection} />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
