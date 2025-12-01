'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, RefreshCw, Eye, EyeOff, LogOut, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getArticles, deleteArticle } from '@/lib/api';
import { type Article } from '@/lib/types';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getArticles(1, 50); // Load more articles for admin
      setArticles(result.articles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (articleId: string, articleTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${articleTitle}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeletingId(articleId);
      const result = await deleteArticle(articleId);

      if (result.success) {
        // Remove article from local state
        setArticles(prev => prev.filter(article => article.id !== articleId));
      } else {
        alert(`Failed to delete article: ${result.error}`);
      }
    } catch (err) {
      alert(`Error deleting article: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }

    // Always redirect to login page
    router.push('/admin/login');
  };

  useEffect(() => {
    loadArticles();
  }, []);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b-4 border-black pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-mono font-black text-black mb-2">
                Article Management
              </h1>
              <p className="text-lg text-gray-700">
                Create, edit, and manage your blog articles
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2 mr-6">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-sm font-mono text-green-600">Authenticated</span>
              </div>
              <button
                onClick={loadArticles}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-black shadow-hard hover:translate-x-1 hover:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed transition-transform"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <Link
                href="/admin/new"
                className="flex items-center gap-2 px-4 py-2 bg-black text-white border-2 border-black shadow-hard hover:translate-x-1 hover:translate-y-1 transition-transform"
              >
                <Plus className="w-4 h-4" />
                New Article
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white border-2 border-red-600 shadow-hard hover:translate-x-1 hover:translate-y-1 transition-transform"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 border-4 border-red-500 bg-red-50">
            <p className="text-red-700 font-mono font-bold">Error: {error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && articles.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-lg font-mono">Loading articles...</p>
            </div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 border-4 border-dashed border-gray-400">
            <h3 className="text-xl font-mono font-bold mb-2">No articles found</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first article</p>
            <Link
              href="/admin/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white border-2 border-black shadow-hard hover:translate-x-1 hover:translate-y-1 transition-transform"
            >
              <Plus className="w-4 h-4" />
              Create Article
            </Link>
          </div>
        ) : (
          /* Articles List */
          <div className="space-y-4">
            <div className="border-2 border-gray-300 p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold">
                  Total Articles: {articles.length}
                </span>
                <span className="font-mono text-sm text-gray-600">
                  Published: {articles.filter(a => a.status === 'published').length} |
                  Draft: {articles.filter(a => a.status === 'draft').length}
                </span>
              </div>
            </div>

            {articles.map((article) => (
              <article
                key={article.id}
                className="border-2 border-black bg-white shadow-hard hover:shadow-hard-large transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-xl font-mono font-black text-black">
                          {article.title}
                        </h2>
                        <span className={`px-2 py-1 text-xs font-mono font-bold border-2 ${
                          article.status === 'published'
                            ? 'bg-green-100 border-green-500 text-green-700'
                            : 'bg-yellow-100 border-yellow-500 text-yellow-700'
                        }`}>
                          {article.status.toUpperCase()}
                        </span>
                      </div>
                      {article.excerpt && (
                        <p className="text-gray-700 mb-2 line-clamp-2">
                          {article.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-600 font-mono">
                        <span>
                          Created: {format(new Date(article.created_at), 'MMM d, yyyy')}
                        </span>
                        {article.published_at && article.status === 'published' && (
                          <span>
                            Published: {format(new Date(article.published_at), 'MMM d, yyyy')}
                          </span>
                        )}
                        {article.view_count !== undefined && (
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {article.view_count} views
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm font-mono text-gray-600">
                      {article.url && (
                        <span>URL: /articles/{article.url}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/edit/${article.id}`}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 border-2 border-blue-500 text-blue-700 hover:bg-blue-200 transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </Link>
                      {article.status === 'published' && (
                        <a
                          href={`/articles/${article.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 border-2 border-gray-500 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </a>
                      )}
                      <button
                        onClick={() => handleDelete(article.id, article.title)}
                        disabled={deletingId === article.id}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-red-100 border-2 border-red-500 text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        {deletingId === article.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}