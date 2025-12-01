import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleForm from '@/components/admin/article-form';
import AuthGuard from '@/components/admin/auth-guard';
import { getArticleById } from '@/lib/api';

interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: EditArticlePageProps): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `Edit: ${article.title}`,
    description: `Edit article: ${article.title}`,
  };
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  return (
    <AuthGuard>
      <ArticleForm mode="edit" article={article} />
    </AuthGuard>
  );
}