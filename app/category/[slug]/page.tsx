import { notFound } from "next/navigation";
import Container from "@/components/layout/container";
import ArticleList from "@/components/blog/article-list";
import { getArticlesByCategory } from "@/lib/api";
import { isSupabaseConfigured } from "@/lib/supabase";
import { ARTICLE_CATEGORIES, type ArticleCategory } from "@/lib/types";
import type { Article } from "@/lib/types";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

// Enable ISR for category pages (5 minutes)
export const revalidate = 300;

export default async function CategoryPage({
  params,
  searchParams
}: CategoryPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  // Decode the slug to get the category name
  const categoryName = decodeURIComponent(resolvedParams.slug);

  // Validate that this is a valid category
  if (!ARTICLE_CATEGORIES.includes(categoryName as ArticleCategory)) {
    notFound();
  }

  const page = parseInt(resolvedSearchParams.page || '1', 10);
  const useRealData = isSupabaseConfigured();

  let articles: Article[] = [];
  let totalCount = 0;

  if (useRealData) {
    try {
      const result = await getArticlesByCategory(categoryName, page, 10);
      articles = result.articles;
      totalCount = result.totalCount;
    } catch (error) {
      console.error('Error fetching category articles:', error);
      articles = [];
      totalCount = 0;
    }
  }

  return (
    <Container size="md">
      <div className="py-8">
        {/* Category Header */}
        <div className="mb-8 border-b-8 border-black pb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 text-sm font-mono font-bold border-2 bg-purple-100 border-purple-500 text-purple-700">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              {categoryName}
            </div>
            <div className="text-sm text-gray-600 font-mono">
              {totalCount} {totalCount === 1 ? 'article' : 'articles'} found
            </div>
          </div>

          <h1 className="text-4xl font-mono font-black text-black">
            {categoryName} Stories
          </h1>
          <p className="text-lg text-gray-700 mt-2">
            Discover extraordinary long-form stories in the {categoryName} category from world-class podcasts.
          </p>
        </div>

        {/* Articles List */}
        {articles.length > 0 ? (
          <ArticleList articles={articles} />
        ) : (
          <div className="text-center py-16 border-4 border-black bg-gray-50">
            <div className="text-6xl mb-4">📭</div>
            <h2 className="text-2xl font-mono font-bold text-black mb-2">
              No stories found
            </h2>
            <p className="text-gray-600 font-mono">
              No articles have been published in the {categoryName} category yet.
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const categoryName = decodeURIComponent(resolvedParams.slug);

  // Validate category
  if (!ARTICLE_CATEGORIES.includes(categoryName as ArticleCategory)) {
    return {
      title: "Category Not Found",
      description: "The requested category could not be found.",
    };
  }

  return {
    title: `${categoryName} Stories | Podcast Story`,
    description: `Discover extraordinary long-form stories in the ${categoryName} category from world-class podcasts.`,
    openGraph: {
      title: `${categoryName} Stories | Podcast Story`,
      description: `Discover extraordinary long-form stories in the ${categoryName} category from world-class podcasts.`,
      type: "website",
    },
  };
}

// Generate static params for all categories
export async function generateStaticParams() {
  return ARTICLE_CATEGORIES.map((category) => ({
    slug: encodeURIComponent(category),
  }));
}