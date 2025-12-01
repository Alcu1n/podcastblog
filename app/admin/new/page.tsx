import { Metadata } from 'next';
import ArticleForm from '@/components/admin/article-form';
import AuthGuard from '@/components/admin/auth-guard';

export const metadata: Metadata = {
  title: 'Create New Article',
  description: 'Create a new article for the blog',
};

export default function NewArticlePage() {
  return (
    <AuthGuard>
      <ArticleForm mode="create" />
    </AuthGuard>
  );
}