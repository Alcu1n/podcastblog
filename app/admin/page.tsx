import { Metadata } from 'next';
import AdminDashboard from '@/components/admin/admin-dashboard';
import AuthGuard from '@/components/admin/auth-guard';

export const metadata: Metadata = {
  title: 'Admin - Article Management',
  description: 'Manage articles - create, edit, delete, and view content',
};

export default function AdminPage() {
  return (
    <AuthGuard>
      <AdminDashboard />
    </AuthGuard>
  );
}