'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/check');
      const data = await response.json();

      if (data.authenticated) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Redirect to login with current page as return URL
        const currentPath = window.location.pathname + window.location.search;
        router.push(`/admin/login?redirect=${encodeURIComponent(currentPath)}`);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      router.push('/admin/login');
    }
  };

  if (isAuthenticated === null) {
    // Loading state
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-4 border-4 border-black bg-gray-100">
              <Shield className="w-8 h-8 text-black animate-pulse" />
            </div>
          </div>
          <p className="text-lg font-mono font-black">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    // Will redirect automatically
    return null;
  }

  return <>{children}</>;
}