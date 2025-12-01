'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import {
  createArticle,
  updateArticle,
  validateArticleForm
} from '@/lib/api';
import {
  type Article,
  type ArticleFormData,
  type FormErrors,
  type ArticleCategory,
  ARTICLE_CATEGORIES
} from '@/lib/types';

interface ArticleFormProps {
  mode: 'create' | 'edit';
  article?: Article;
}

export default function ArticleForm({ mode, article }: ArticleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [preview, setPreview] = useState(false);

  // Form state
  const [formData, setFormData] = useState<ArticleFormData>({
    title: article?.title || '',
    content: article?.content || '',
    excerpt: article?.excerpt || '',
    status: article?.status || 'draft',
    category: article?.category || undefined,
    url: article?.url || '',
    description: article?.description || ''
  });

  // Update form when article changes (for edit mode)
  useEffect(() => {
    if (article && mode === 'edit') {
      setFormData({
        title: article.title || '',
        content: article.content || '',
        excerpt: article.excerpt || '',
        status: article.status || 'draft',
        category: article.category || undefined,
        url: article.url || '',
        description: article.description || ''
      });
    }
  }, [article, mode]);

  const handleInputChange = (
    field: keyof ArticleFormData,
    value: string | string[]
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field if it exists
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Validate form
      const validationErrors = validateArticleForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setLoading(false);
        return;
      }

      let result;
      if (mode === 'create') {
        result = await createArticle({
          ...formData,
          slug: formData.url || undefined
        });
      } else {
        result = await updateArticle({
          id: article!.id,
          ...formData
        });
      }

      if (result.success) {
        router.push('/admin');
        router.refresh();
      } else {
        alert(`Failed to ${mode === 'create' ? 'create' : 'update'} article: ${result.error}`);
      }
    } catch (error) {
      alert(`Error ${mode === 'create' ? 'creating' : 'updating'} article: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    setPreview(!preview);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b-4 border-black pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-mono font-black text-black mb-2">
                {mode === 'create' ? 'Create New Article' : `Edit: ${article?.title}`}
              </h1>
              <p className="text-lg text-gray-700">
                {mode === 'create' ? 'Write and publish your new article' : 'Make changes to your article'}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handlePreview}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black shadow-hard hover:translate-x-1 hover:translate-y-1 transition-transform"
              >
                {preview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {preview ? 'Edit' : 'Preview'}
              </button>
              <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 border-2 border-gray-400 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </Link>
            </div>
          </div>
        </div>

        {preview ? (
          // Preview mode
          <div className="border-4 border-black bg-white p-8 shadow-hard">
            <h1 className="text-4xl font-mono font-black text-black mb-4">
              {formData.title || 'Untitled Article'}
            </h1>
            {formData.excerpt && (
              <div className="text-xl text-gray-700 mb-6 border-l-4 border-black pl-4">
                {formData.excerpt}
              </div>
            )}
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                {formData.content || 'No content yet...'}
              </div>
            </div>
            <div className="mt-8 pt-6 border-t-2 border-gray-300">
              <span className={`px-3 py-1 text-sm font-mono font-bold border-2 ${
                formData.status === 'published'
                  ? 'bg-green-100 border-green-500 text-green-700'
                  : 'bg-yellow-100 border-yellow-500 text-yellow-700'
              }`}>
                {formData.status.toUpperCase()}
              </span>
            </div>
          </div>
        ) : (
          // Form mode
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-mono font-bold text-black mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-4 py-3 border-2 border-black bg-white font-sans text-black focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                  errors.title ? 'border-red-500 bg-red-50' : ''
                }`}
                placeholder="Enter article title..."
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 font-mono">{errors.title}</p>
              )}
            </div>

            {/* URL/Slug */}
            <div>
              <label className="block text-sm font-mono font-bold text-black mb-2">
                URL / Slug
              </label>
              <input
                type="text"
                value={formData.url}
                onChange={(e) => handleInputChange('url', e.target.value)}
                className={`w-full px-4 py-3 border-2 border-black bg-white font-sans text-black focus:outline-none focus:ring-4 focus:ring-blue-300 ${
                  errors.url ? 'border-red-500 bg-red-50' : ''
                }`}
                placeholder="article-url (optional, will be auto-generated from title)"
              />
              {errors.url && (
                <p className="mt-1 text-sm text-red-600 font-mono">{errors.url}</p>
              )}
              <p className="mt-1 text-xs text-gray-600 font-mono">
                Leave empty to auto-generate from title
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-mono font-bold text-black mb-2">
                Excerpt / Description
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => handleInputChange('excerpt', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-black bg-white font-sans text-black focus:outline-none focus:ring-4 focus:ring-blue-300 resize-none"
                placeholder="Brief description of the article..."
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-mono font-bold text-black mb-2">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={20}
                className={`w-full px-4 py-3 border-2 border-black bg-white font-sans text-black focus:outline-none focus:ring-4 focus:ring-blue-300 resize-none font-mono ${
                  errors.content ? 'border-red-500 bg-red-50' : ''
                }`}
                placeholder="Write your article content here..."
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600 font-mono">{errors.content}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-mono font-bold text-black mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value as 'draft' | 'published' | 'podcast')}
                className="w-full px-4 py-3 border-2 border-black bg-white font-sans text-black focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="podcast">Podcast</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-mono font-bold text-black mb-2">
                Category
              </label>
              <select
                value={formData.category || ''}
                onChange={(e) => handleInputChange('category', e.target.value as ArticleCategory || undefined)}
                className="w-full px-4 py-3 border-2 border-black bg-white font-sans text-black focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                <option value="">Select a category</option>
                {ARTICLE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t-4 border-black">
              <Link
                href="/admin"
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 border-2 border-gray-400 text-gray-700 hover:bg-gray-200 transition-colors font-mono font-bold"
              >
                <X className="w-4 h-4" />
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-black text-white border-2 border-black shadow-hard hover:translate-x-1 hover:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed transition-transform font-mono font-bold"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : (mode === 'create' ? 'Create Article' : 'Update Article')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}