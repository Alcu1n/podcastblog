import { supabase, createSupabaseAdminClient, handleSupabaseError } from './supabase';
import type { Article, ArticleListResponse, PaginationParams } from './types';

// Utility function to calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Helper function to map stories data to Article interface
function mapStoryToArticle(story: any): Article {
  return {
    id: story.id,
    title: story.title,
    slug: story.url?.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase() || story.id,
    content: story.content,
    excerpt: story.description,
    published_at: story.created_at,
    created_at: story.created_at,
    updated_at: story.created_at, // Assuming no updated_at in stories
    status: story.status,
    view_count: story.meta?.view_count || 0,
    reading_time: calculateReadingTime(story.content),
    url: story.url,
    meta: story.meta,
    description: story.description,
    categories: story.categories,
  };
}

// Server-side data fetching functions
export async function getArticles(
  page: number = 1,
  limit: number = 10
): Promise<ArticleListResponse> {
  const offset = (page - 1) * limit;
  const client = createSupabaseAdminClient();

  try {
    const { data: articles, error, count } = await client
      .from('stories')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      handleSupabaseError(error);
    }

    return {
      articles: (articles || []).map(mapStoryToArticle),
      totalCount: count || 0,
      currentPage: page,
      totalPages: Math.ceil((count || 0) / limit),
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    // Return empty result on error for now
    return {
      articles: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
    };
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const client = createSupabaseAdminClient();

  try {
    // Try direct URL match first
    let { data, error } = await client
      .from('stories')
      .select('*')
      .eq('url', slug)
      .eq('status', 'published')
      .single();

    // If not found by URL, try matching slug from URL field
    if (error && (error.code === 'PGRST116' || error.code === '42703')) {
      const { data: allData, error: allError } = await client
        .from('stories')
        .select('*')
        .eq('status', 'published')
        .limit(1000); // Get all stories to search

      if (!allError && allData) {
        const found = allData.find(story => {
          const storySlug = story.url?.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase();
          return storySlug === slug;
        });
        data = found || null;
        error = found ? null : allError;
      }
    }

    if (error) {
      // If article not found, return null instead of throwing error
      if (error.code === 'PGRST116') {
        return null;
      }
      handleSupabaseError(error);
    }

    return data ? mapStoryToArticle(data) : null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export async function searchArticles(
  query: string,
  page: number = 1,
  limit: number = 10
): Promise<ArticleListResponse> {
  if (!query.trim()) {
    return getArticles(page, limit);
  }

  const offset = (page - 1) * limit;
  const client = createSupabaseAdminClient();

  try {
    const { data: articles, error, count } = await client
      .from('stories')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%,description.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      handleSupabaseError(error);
    }

    return {
      articles: (articles || []).map(mapStoryToArticle),
      totalCount: count || 0,
      currentPage: page,
      totalPages: Math.ceil((count || 0) / limit),
    };
  } catch (error) {
    console.error('Error searching articles:', error);
    return {
      articles: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
    };
  }
}

// Client-side data fetching functions (for client components)
export async function getArticlesClient(
  page: number = 1,
  limit: number = 10
): Promise<ArticleListResponse> {
  const offset = (page - 1) * limit;

  try {
    const { data: articles, error, count } = await supabase
      .from('stories')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      handleSupabaseError(error);
    }

    return {
      articles: (articles || []).map(mapStoryToArticle),
      totalCount: count || 0,
      currentPage: page,
      totalPages: Math.ceil((count || 0) / limit),
    };
  } catch (error) {
    console.error('Error fetching articles:', error);
    return {
      articles: [],
      totalCount: 0,
      currentPage: page,
      totalPages: 0,
    };
  }
}

// Helper function to increment view count
export async function incrementViewCount(articleId: string): Promise<void> {
  const client = createSupabaseAdminClient();

  try {
    // Simple increment approach - get current value and increment
    const { data: currentArticle, error: fetchError } = await client
      .from('stories')
      .select('meta')
      .eq('id', articleId)
      .single();

    if (fetchError) {
      console.warn('Failed to fetch current view count:', fetchError);
      return;
    }

    // Assuming view count is stored in meta field
    const currentMeta = currentArticle?.meta || {};
    const newViewCount = (currentMeta.view_count || 0) + 1;

    const { error: updateError } = await client
      .from('stories')
      .update({ meta: { ...currentMeta, view_count: newViewCount } })
      .eq('id', articleId);

    if (updateError) {
      console.warn('Failed to increment view count:', updateError);
    }
  } catch (error) {
    console.warn('Failed to increment view count:', error);
  }
}