import { supabase, createSupabaseAdminClient, handleSupabaseError } from './supabase';
import type {
  Article,
  ArticleListResponse,
  PaginationParams,
  ArticleFormData,
  ArticleCreateInput,
  ArticleUpdateInput,
  AdminActionResponse,
  FormErrors
} from './types';

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
    published_at: story.meta?.published_at || story.created_at,
    created_at: story.created_at,
    updated_at: story.meta?.updated_at || story.created_at,
    status: story.status || 'draft',
    view_count: story.meta?.view_count || 0,
    reading_time: calculateReadingTime(story.content),
    url: story.url,
    meta: story.meta,
    description: story.description,
    categories: story.categories || '',
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
      .single();

    // If not found by URL, try matching slug from URL field
    if (error && (error.code === 'PGRST116' || error.code === '42703')) {
      const { data: allData, error: allError } = await client
        .from('stories')
        .select('*')
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

// Admin management functions

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Validate form data
export function validateArticleForm(data: ArticleFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.title.trim()) {
    errors.title = 'Title is required';
  } else if (data.title.length > 200) {
    errors.title = 'Title must be less than 200 characters';
  }

  if (!data.content.trim()) {
    errors.content = 'Content is required';
  }

  if (data.url && data.url.trim()) {
    // Basic URL validation
    const urlPattern = /^[a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]+$/;
    if (!urlPattern.test(data.url)) {
      errors.url = 'Invalid URL format';
    }
  }

  return errors;
}

// Create new article
export async function createArticle(data: ArticleCreateInput): Promise<AdminActionResponse> {
  const client = createSupabaseAdminClient();

  try {
    // Validate input data
    const errors = validateArticleForm(data);
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        error: Object.values(errors).join(', ')
      };
    }

    // Prepare article data
    const now = new Date().toISOString();
    const slug = data.slug || generateSlug(data.title);

    const articleData = {
      title: data.title.trim(),
      content: data.content.trim(),
      description: data.excerpt?.trim() || data.description?.trim(),
      status: data.status,
      url: data.url || slug,
      categories: data.categories || null,
      meta: {
        view_count: 0,
        created_at: now,
        updated_at: now,
        published_at: data.status === 'published' ? (data.published_at || now) : null
      },
      created_at: now
    };

    const { data: result, error } = await client
      .from('stories')
      .insert(articleData)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error);
    }

    return {
      success: true,
      data: mapStoryToArticle(result)
    };
  } catch (error) {
    console.error('Error creating article:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create article'
    };
  }
}

// Update existing article
export async function updateArticle(data: ArticleUpdateInput): Promise<AdminActionResponse> {
  const client = createSupabaseAdminClient();

  try {
    // Validate input data
    const formData = {
      title: data.title || '',
      content: data.content || '',
      excerpt: data.excerpt,
      status: data.status || 'draft',
      url: data.url,
      description: data.description,
      categories: data.categories || ''
    };

    const errors = validateArticleForm(formData);
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        error: Object.values(errors).join(', ')
      };
    }

    // Check if article exists
    const { data: existingArticle, error: fetchError } = await client
      .from('stories')
      .select('*')
      .eq('id', data.id)
      .single();

    if (fetchError || !existingArticle) {
      return {
        success: false,
        error: 'Article not found'
      };
    }

    // Prepare update data
    const now = new Date().toISOString();
    const updateData: any = {
      meta: {
        ...existingArticle.meta,
        updated_at: now
      }
    };

    // Only update provided fields
    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.content !== undefined) updateData.content = data.content.trim();
    if (data.excerpt !== undefined) updateData.description = data.excerpt.trim();
    if (data.description !== undefined) updateData.description = data.description.trim();
    if (data.status !== undefined) {
      updateData.status = data.status;
      // Store published_at in meta field
      const currentMeta = existingArticle.meta || {};
      updateData.meta = {
        ...updateData.meta,
        published_at: data.status === 'published' ? currentMeta.published_at || now : null
      };
    }
    if (data.url !== undefined) updateData.url = data.url;
    if (data.categories !== undefined) updateData.categories = data.categories || null;

    const { data: result, error } = await client
      .from('stories')
      .update(updateData)
      .eq('id', data.id)
      .select()
      .single();

    if (error) {
      handleSupabaseError(error);
    }

    return {
      success: true,
      data: mapStoryToArticle(result)
    };
  } catch (error) {
    console.error('Error updating article:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update article'
    };
  }
}

// Delete article
export async function deleteArticle(articleId: string): Promise<AdminActionResponse> {
  const client = createSupabaseAdminClient();

  try {
    // Check if article exists
    const { data: existingArticle, error: fetchError } = await client
      .from('stories')
      .select('title')
      .eq('id', articleId)
      .single();

    if (fetchError || !existingArticle) {
      return {
        success: false,
        error: 'Article not found'
      };
    }

    // Delete the article
    const { error } = await client
      .from('stories')
      .delete()
      .eq('id', articleId);

    if (error) {
      handleSupabaseError(error);
    }

    return {
      success: true
    };
  } catch (error) {
    console.error('Error deleting article:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete article'
    };
  }
}

// Get article by ID for editing
export async function getArticleById(articleId: string): Promise<Article | null> {
  const client = createSupabaseAdminClient();

  try {
    const { data, error } = await client
      .from('stories')
      .select('*')
      .eq('id', articleId)
      .single();

    if (error) {
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