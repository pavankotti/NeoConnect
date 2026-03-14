

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {

    if (loading) return;


    if (!user) {
      router.push('/login');
      return;
    }


    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      router.push('/unauthorized');
      return;
    }
  }, [user, loading, router, allowedRoles]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }


  if (!user) {
    return null;
  }


  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null;
  }


  return <>{children}</>;
}
