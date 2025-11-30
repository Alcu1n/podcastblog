// Core data structures following Good Taste principles

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published';
  view_count?: number;
  reading_time?: number;
  // Additional fields from stories table
  url?: string;
  meta?: any;
  description?: string;
  categories?: string[];
}

// API response types
export interface ArticleListResponse {
  articles: Article[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// Component props interfaces
export interface ArticleListItemProps {
  article: Article;
  variant?: 'default' | 'featured';
  className?: string;
}

export interface ArticleListProps {
  articles: Article[];
  loading?: boolean;
  error?: string | null;
  className?: string;
}

export interface ArticleDetailProps {
  article: Article;
}

// Search and pagination types
export interface SearchParams {
  query?: string;
  page?: string;
  limit?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

// Error types
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Utility types
export type ArticleStatus = Article['status'];
export type ArticleSortBy = 'published_at' | 'created_at' | 'title' | 'view_count';
export type SortOrder = 'asc' | 'desc';