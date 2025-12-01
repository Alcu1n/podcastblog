import Container from "@/components/layout/container";
import ArticleList from "@/components/blog/article-list";
import { H1, H3, BodyText } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { getArticles } from "@/lib/api";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Article } from "@/lib/types";

// Mock data fallback for development when Supabase is not configured
const mockArticles: Article[] = [
  {
    id: "1",
    title: "Good Taste in Software Development",
    slug: "good-taste-software-development",
    content: "Content here...",
    excerpt:
      'Exploring Linus Torvalds\' philosophy of "good taste" in code and how it applies to modern software development.',
    published_at: "2024-01-15T10:00:00Z",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    status: "published",
    view_count: 42,
    reading_time: 8,
  },
  {
    id: "2",
    title: "Neo-Brutalism: The Anti-Design Movement",
    slug: "neo-brutalism-anti-design",
    content: "Content here...",
    excerpt:
      "How Neo-Brutalism challenges conventional UI design and brings honesty back to digital interfaces.",
    published_at: "2024-01-10T14:30:00Z",
    created_at: "2024-01-10T14:30:00Z",
    updated_at: "2024-01-10T14:30:00Z",
    status: "published",
    view_count: 128,
    reading_time: 6,
  },
  {
    id: "3",
    title: "Data Structures Over Control Flow",
    slug: "data-structures-control-flow",
    content: "Content here...",
    excerpt:
      "Why manipulating data structures is superior to manipulating control flow in complex systems.",
    published_at: "2024-01-05T09:15:00Z",
    created_at: "2024-01-05T09:15:00Z",
    updated_at: "2024-01-05T09:15:00Z",
    status: "published",
    view_count: 89,
    reading_time: 12,
  },
  {
    id: "4",
    title: "The Art of API Design",
    slug: "art-api-design",
    content: "Content here...",
    excerpt:
      "Principles for creating APIs that developers actually enjoy using and maintaining.",
    published_at: "2023-12-28T16:45:00Z",
    created_at: "2023-12-28T16:45:00Z",
    updated_at: "2023-12-28T16:45:00Z",
    status: "published",
    view_count: 156,
    reading_time: 10,
  },
];

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

// Enable ISR for 5 minutes
export const revalidate = 300;

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1", 10);
  const useRealData = isSupabaseConfigured();

  let articles = mockArticles;
  let totalCount = mockArticles.length;
  let totalPages = Math.ceil(totalCount / 10);
  let error = null;

  if (useRealData) {
    try {
      const result = await getArticles(page, 10);
      articles = result.articles;
      totalCount = result.totalCount;
      totalPages = result.totalPages;
    } catch (err) {
      console.error(
        "Failed to fetch articles from Supabase, using mock data:",
        err,
      );
      error = "Failed to load articles from database. Showing sample content.";
    }
  }

  return (
    <Container size="md">
      <div className="py-4 md:py-8">
        {/* Hero section */}
        <header className="mb-12 border-b-8 border-black pb-8">
          <div className="max-w-3xl">
            <H1 className="mb-4 leading-tight">
              <span className="block">Long Stories</span>
              <span className="block text-red-500">From Podcasts</span>
            </H1>

            <div className="bg-gray-50 border-l-4 border-black p-4 mb-6">
              <BodyText className="text-lg font-medium">
                A curated collection of extraordinary long-form stories from the
                world's best podcasts.
              </BodyText>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white font-mono">
                Long Reads
              </span>
              <span className="text-gray-500 font-mono">
                Updated weekly with compelling stories
              </span>
            </div>
          </div>
        </header>

        {/* Article list */}
        <section className="mb-12">
          <ArticleList articles={articles} loading={false} error={error} />
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="flex justify-center space-x-4">
            {page > 1 && (
              <a
                href={`?page=${page - 1}`}
                className="inline-flex items-center justify-center px-6 py-3 font-mono font-bold text-black border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all duration-100 bg-white"
              >
                ← Previous
              </a>
            )}

            <span className="inline-flex items-center justify-center px-6 py-3 font-mono font-bold text-black border-4 border-black">
              Page {page} of {totalPages}
            </span>

            {page < totalPages && (
              <a
                href={`?page=${page + 1}`}
                className="inline-flex items-center justify-center px-6 py-3 font-mono font-bold text-black border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] transition-all duration-100 bg-white"
              >
                Next →
              </a>
            )}
          </nav>
        )}
      </div>
    </Container>
  );
}
