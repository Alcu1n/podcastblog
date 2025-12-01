import { Metadata } from 'next';
import { Suspense } from 'react';
import AdminLogin from '@/components/admin/admin-login';

export const metadata: Metadata = {
  title: 'Admin Login',
  description: 'Login to access the admin panel',
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-black border-t-transparent"></div>
          <p className="mt-4 font-mono">Loading...</p>
        </div>
      </div>
    }>
      <AdminLogin />
    </Suspense>
  );
}