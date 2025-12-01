import Link from 'next/link';
import { H3, CaptionText, BodyText } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { Article } from '@/lib/types';

interface ArticleItemProps {
  article: Article;
  variant?: 'default' | 'featured';
  className?: string;
}

export default function ArticleItem({
  article,
  variant = 'default',
  className
}: ArticleItemProps) {
  const isFeatured = variant === 'featured';

  return (
    <article className={cn(
      'group relative bg-white transition-all duration-100',
      'border-l-8 border-l-black',
      'border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]',
      'hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)]',
      'hover:bg-[#FAF7F0]', // Comfortable beige background on hover
      isFeatured ? 'p-8' : 'p-6',
      className
    )}>
      <div className="space-y-4">
        {/* Meta information */}
        <div className="inline-flex items-center bg-yellow-100 border-2 border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] px-4 py-2">
          <CaptionText className="font-normal">
            {format(new Date(article.published_at), 'MMM dd, yyyy')}
          </CaptionText>
          {article.reading_time && (
            <>
              <span className="mx-3 text-black font-bold">•</span>
              <CaptionText className="font-normal">
                {article.reading_time} min read
              </CaptionText>
            </>
          )}
        </div>

        {/* Title */}
        <Link
          href={`/articles/${article.slug}`}
          className="block group-hover:text-red-500 transition-colors"
        >
          <H3 className={cn(
            'group-hover:underline decoration-4 underline-offset-4',
            isFeatured ? 'text-3xl' : 'text-2xl'
          )}>
            {article.title}
          </H3>
        </Link>

        {/* Excerpt */}
        {article.excerpt && (
          <BodyText className="text-gray-700">
            {article.excerpt}
          </BodyText>
        )}

        {/* Call to action */}
        <div className="flex items-center justify-between">
          <Link href={`/articles/${article.slug}`}>
            <Button variant="secondary" size="sm">
              Read More
              <span className="ml-2">→</span>
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}