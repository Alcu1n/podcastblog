import { H3, BodyText } from '@/components/ui/typography';
import ArticleItem from './article-item';
import type { Article } from '@/lib/types';

interface ArticleListProps {
  articles: Article[];
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export default function ArticleList({
  articles,
  loading,
  error,
  className
}: ArticleListProps) {
  if (error) {
    return (
      <div className="border-4 border-black bg-yellow-100 p-6 mb-8">
        <H3 className="mb-2">Error Loading Articles</H3>
        <BodyText>{error}</BodyText>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border-4 border-black bg-gray-100 p-6 animate-pulse">
            <div className="h-4 bg-gray-300 w-1/4 mb-4 rounded"></div>
            <div className="h-8 bg-gray-300 mb-4 rounded"></div>
            <div className="h-4 bg-gray-300 mb-2 rounded"></div>
            <div className="h-4 bg-gray-300 w-3/4 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="border-4 border-black bg-gray-100 p-12 text-center mb-8">
        <H3 className="mb-4">No Articles Found</H3>
        <BodyText>Check back later for new content.</BodyText>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {articles.map((article, index) => {
        // Make the first article featured if it exists
        const variant = index === 0 ? 'featured' : 'default';
        return (
          <ArticleItem
            key={article.id}
            article={article}
            variant={variant}
          />
        );
      })}
    </div>
  );
}