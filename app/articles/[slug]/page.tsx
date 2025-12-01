import { notFound } from "next/navigation";
import Container from "@/components/layout/container";
import ArticleDetail from "@/components/blog/article-detail";
import { getArticleBySlug } from "@/lib/api";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { Article } from "@/lib/types";

// Mock article data - fallback for development when Supabase is not configured
const mockArticles: Record<string, Article> = {
  "good-taste-software-development": {
    id: "1",
    title: "Good Taste in Software Development",
    slug: "good-taste-software-development",
    content: `
"Good taste" in software development is a concept that Linus Torvalds has often spoken about. It's not just about writing code that works—it's about writing code that is elegant, maintainable, and shows a deep understanding of the problem domain.

When we talk about good taste in code, we're talking about solutions that are not just functional, but beautiful in their simplicity and effectiveness. Good taste manifests in several ways:

## Data Structure Driven Design

One of the key principles Torvalds emphasizes is data-driven design. Instead of writing complex control flow with lots of if-else statements, a programmer with good taste will often look for a data structure that can represent the problem more elegantly.

For example, instead of writing a series of conditional checks, you might use a lookup table. Instead of complex state machines, you might use a configuration object that describes the behavior.

## Elimination of Special Cases

Code with good taste tends to have fewer special cases. When you find yourself writing lots of exceptional handling, it's often a sign that your data structure or algorithm could be improved.

Consider error handling. Poor taste might involve checking for errors at every step:
\`\`\`
// Bad taste
result = step1()
if result.error:
    return result.error
result = step2(result.data)
if result.error:
    return result.error
\`\`\`

While good taste might use a monadic pattern or other techniques that compose elegantly:
\`\`\`
// Good taste
return step1()
    .and_then(step2)
    .and_then(step3)
\`\`\`

## Simplicity and Pragmatism

Perhaps most importantly, good taste values simplicity. Complex solutions might be impressive, but they're rarely the best choice. A programmer with good taste will choose the simplest solution that adequately solves the problem.

This doesn't mean oversimplifying. It means finding the right level of abstraction—no more complex than necessary, but no simpler than required.

## The Practical Impact

Code written with good taste is easier to:
- Understand and read
- Modify and extend
- Debug when things go wrong
- Test thoroughly

It leads to systems that are more robust and maintainable over time. In a world where software systems become increasingly complex, the importance of good taste cannot be overstated.

## Cultivating Good Taste

Good taste isn't something you're born with—it's developed through experience and exposure to well-designed systems. Reading high-quality code, working with experienced developers, and constantly questioning your own assumptions are all ways to develop better taste.

The key is to always be asking: "Is there a simpler, more elegant way to solve this problem?"
    `,
    excerpt:
      'Exploring Linus Torvalds\' philosophy of "good taste" in code and how it applies to modern software development.',
    published_at: "2024-01-15T10:00:00Z",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    status: "published",
    view_count: 42,
    reading_time: 8,
  },
  "neo-brutalism-anti-design": {
    id: "2",
    title: "Neo-Brutalism: The Anti-Design Movement",
    slug: "neo-brutalism-anti-design",
    content: `
Neo-Brutalism represents a fascinating counter-movement in digital design. While mainstream UI design trends toward ever more subtle gradients, rounded corners, and minimalist aesthetics, Neo-Brutalism embraces the opposite: hard edges, bold borders, and unapologetic visibility.

## What is Neo-Brutalism?

Neo-Brutalism in digital design draws inspiration from the Brutalist architecture movement of the mid-20th century. Like its architectural counterpart, it emphasizes:
- Raw, honest display of materials (in digital terms: pixels, borders, shadows)
- Bold geometric forms
- High contrast
- Functional over decorative elements
- Exposed structure and "how it works" visibility

## The Philosophy Behind the Brutality

At its core, Neo-Brutalism is about honesty in design. It rejects the trend of hiding UI elements behind subtle gradients and soft shadows. Instead, it embraces the digital nature of the interface:

**Hard Shadows**: Instead of soft, natural-looking shadows, Neo-Brutalism uses hard, pixel-perfect shadows that clearly say "this is a digital interface."

**Thick Borders**: Rather than subtle dividers, it uses bold borders that create clear visual hierarchy.

**High Contrast**: Black and white dominate, with occasional bold accent colors.

## Why Choose Neo-Brutalism?

1. **Accessibility**: High contrast and clear visual hierarchy make interfaces more accessible
2. **Performance**: Fewer gradients and effects mean better performance
3. **Clarity**: Users always know what they can interact with
4. **Memorability**: Stand out from the sea of minimalist interfaces
5. **Honesty**: Acknowledges the digital nature of the interface

## Implementing Neo-Brutalism

The core principles translate directly to CSS:
- Use hard shadows: \`box-shadow: 4px 4px 0px rgba(0,0,0,1)\`
- Apply thick borders: \`border: 4px solid black\`
- Embrace hover states with subtle translations
- Use monospace fonts for headers
- Maintain high contrast ratios

## The Future of Interface Design

Neo-Brutalism isn't for everyone or every project. But as we move toward a future where digital interfaces are increasingly homogeneous, movements like Neo-Brutalism remind us that there are alternative approaches to design.

It challenges us to think about why we make certain design choices and whether the current trends are always the best solution. Sometimes, the most brutal approach is actually the most honest and effective.
    `,
    excerpt:
      "How Neo-Brutalism challenges conventional UI design and brings honesty back to digital interfaces.",
    published_at: "2024-01-10T14:30:00Z",
    created_at: "2024-01-10T14:30:00Z",
    updated_at: "2024-01-10T14:30:00Z",
    status: "published",
    view_count: 128,
    reading_time: 6,
  },
};

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

// Enable ISR for 1 hour (articles don't change as frequently as the list)
export const revalidate = 3600;

export default async function ArticlePage({ params }: ArticlePageProps) {
  const resolvedParams = await params;
  const useRealData = isSupabaseConfigured();
  let article: Article | null = null;

  if (useRealData) {
    article = await getArticleBySlug(resolvedParams.slug);
  }

  // Fallback to mock data if real data not available
  if (!article) {
    article = mockArticles[resolvedParams.slug] || null;
  }

  if (!article) {
    notFound();
  }

  return (
    <Container size="md">
      <div className="py-1 md:py-2">
        <ArticleDetail article={article} />
      </div>
    </Container>
  );
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const resolvedParams = await params;
  const useRealData = isSupabaseConfigured();
  let article: Article | null = null;

  if (useRealData) {
    article = await getArticleBySlug(resolvedParams.slug);
  }

  // Fallback to mock data if real data not available
  if (!article) {
    article = mockArticles[resolvedParams.slug] || null;
  }

  if (!article) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
    };
  }

  return {
    title: `${article.title} | Podcast Story`,
    description:
      article.excerpt ||
      article.description ||
      "An extraordinary long-form story from a world-class podcast.",
    openGraph: {
      title: article.title,
      description:
        article.excerpt ||
        article.description ||
        "An extraordinary long-form story from a world-class podcast.",
      type: "article",
      publishedTime: article.published_at,
      modifiedTime: article.updated_at,
    },
  };
}
