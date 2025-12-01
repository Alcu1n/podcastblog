// Core data structures following Good Taste principles

export type ArticleCategory =
  | 'True Crime'
  | 'Historical Chronicles'
  | 'Extraordinary Lives'
  | 'The Unexplained'
  | 'Adventure & Survival'
  | 'Cultural Touchstones';

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  'True Crime',
  'Historical Chronicles',
  'Extraordinary Lives',
  'The Unexplained',
  'Adventure & Survival',
  'Cultural Touchstones'
];

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published' | 'podcast';
  category?: ArticleCategory;
  view_count?: number;
  reading_time?: number;
  // Additional fields from stories table
  url?: string;
  meta?: any;
  description?: string;
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

// Admin management types
export interface ArticleFormData {
  title: string;
  content: string;
  excerpt?: string;
  status: ArticleStatus;
  category?: ArticleCategory;
  url?: string;
  description?: string;
}

export interface ArticleCreateInput extends ArticleFormData {
  // Optional: auto-generated fields
  slug?: string;
  published_at?: string;
}

export interface ArticleUpdateInput extends Partial<ArticleFormData> {
  id: string;
  updated_at?: string;
}

export interface AdminActionResponse {
  success: boolean;
  data?: Article;
  error?: string;
}

// Admin component props
export interface ArticleFormProps {
  article?: Article; // For editing mode
  onSubmit: (data: ArticleFormData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export interface ArticleAdminListProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (articleId: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  loading?: boolean;
}

// Form validation types
export interface FormErrors {
  title?: string;
  content?: string;
  slug?: string;
  url?: string;
}

// Utility types
export type ArticleStatus = Article['status'];
export type ArticleSortBy = 'published_at' | 'created_at' | 'title' | 'view_count';
export type SortOrder = 'asc' | 'desc';