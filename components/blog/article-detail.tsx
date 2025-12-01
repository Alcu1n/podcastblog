'use client';

import { H1, BodyText, CaptionText } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Article } from '@/lib/types';
import { useRouter } from 'next/navigation';

// Suppress the className prop assertion error for development
// TODO: Investigate the proper way to handle this in react-markdown v10
if (process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Unexpected `className` prop')
    ) {
      return; // Suppress this specific error
    }
    originalError(...args);
  };
}

interface ArticleDetailProps {
  article: Article;
}

export default function ArticleDetail({ article }: ArticleDetailProps) {
  const router = useRouter();

  // Function to handle "Back to Articles"
  const handleBackToArticles = () => {
    router.push('/');
  };

  // Function to handle "Share on Twitter"
  const handleShareOnTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      `Check out this amazing story: ${article.title} - ${article.excerpt || ''}`
    )}&url=${encodeURIComponent(window.location.href)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  // Function to handle "Copy Link"
  const handleCopyLink = async () => {
    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      // You could add a toast notification here
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link:', err);
      alert('Failed to copy link. Please copy manually.');
    }
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8 border-b-8 border-black pb-8">
        {/* Meta information - Single Row with Status on Right */}
        <div className="mb-6 flex items-center justify-between">
          {/* Left: Date and Reading Time */}
          <div className="flex items-center gap-4 text-left">
            <div className="inline-flex items-center gap-1 px-3 py-2 text-xs font-mono bg-gray-100 border-2 border-black">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {format(new Date(article.published_at), 'MMM dd, yyyy')}
            </div>
            {article.reading_time && (
              <div className="inline-flex items-center gap-1 px-3 py-2 text-xs font-mono bg-gray-100 border-2 border-black">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                {article.reading_time} min read
              </div>
            )}
          </div>

          {/* Right: Status Badge */}
          <span className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold border-2 ${
            article.status === 'published'
              ? 'bg-green-100 border-green-500 text-green-700'
              : article.status === 'podcast'
              ? 'bg-blue-100 border-blue-500 text-blue-700'
              : 'bg-gray-100 border-gray-500 text-gray-700'
          }`}>
            <div className={`w-3 h-3 rounded-full ${
              article.status === 'published' ? 'bg-green-600' :
              article.status === 'podcast' ? 'bg-blue-600' : 'bg-gray-600'
            }`}></div>
            {article.status.toUpperCase()}
          </span>
        </div>

        {/* Title */}
        <H1 className="mb-6">
          {article.title}
        </H1>

        {/* Excerpt */}
        {article.excerpt && (
          <BodyText className="text-xl text-gray-700 border-l-4 border-black pl-4">
            {article.excerpt}
          </BodyText>
        )}
      </header>

    {/* Content */}
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Custom styling for heading elements
            h1: ({children}) => (
              <h1 className="font-mono font-bold text-black text-3xl md:text-4xl tracking-tight mb-6 mt-8">
                {children}
              </h1>
            ),
            h2: ({children}) => (
              <h2 className="font-mono font-bold text-black text-2xl md:text-3xl tracking-tight mb-4 mt-6">
                {children}
              </h2>
            ),
            h3: ({children}) => (
              <h3 className="font-mono font-bold text-black text-xl md:text-2xl tracking-tight mb-3 mt-5">
                {children}
              </h3>
            ),
            // Code styling with Neo-Brutalism
            pre: ({children}) => (
              <pre className="bg-gray-900 text-white p-4 overflow-x-auto border-4 border-black mb-6 mt-6">
                {children}
              </pre>
            ),
            code: ({className, children, ...props}) => {
              const match = /language-(\w+)/.exec(className || '');
              const isInline = !className && !match;

              if (isInline) {
                return (
                  <code className="bg-gray-200 px-2 py-1 font-mono text-sm border-2 border-black" {...props}>
                    {children}
                  </code>
                );
              }

              // For code blocks, return a code element with proper styling
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            // Blockquote styling
            blockquote: ({children}) => (
              <blockquote className="border-l-4 border-black pl-4 py-2 my-4 bg-gray-100 italic">
                {children}
              </blockquote>
            ),
            // Link styling
            a: ({href, children}) => (
              <a
                href={href}
                className="text-red-500 hover:text-red-700 underline border-b-2 border-transparent hover:border-red-500 transition-all"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            // List styling
            ul: ({children}) => (
              <ul className="list-disc list-inside space-y-2 mb-6">
                {children}
              </ul>
            ),
            ol: ({children}) => (
              <ol className="list-decimal list-inside space-y-2 mb-6">
                {children}
              </ol>
            ),
            li: ({children}) => (
              <li className="ml-4">
                {children}
              </li>
            ),
            // Paragraph styling
            p: ({children}) => (
              <p className="mb-4 font-sans text-gray-700 text-base md:text-lg leading-relaxed">
                {children}
              </p>
            ),
            // Horizontal rule
            hr: () => (
              <hr className="border-4 border-black my-8" />
            ),
          }}
        >
          {article.content}
        </ReactMarkdown>
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t-4 border-black">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Button variant="secondary" onClick={handleBackToArticles}>
              ← Back to Articles
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleShareOnTwitter}>
              Share on Twitter
            </Button>
            <Button variant="ghost" onClick={handleCopyLink}>
              Copy Link
            </Button>
          </div>
        </div>

        {/* Article metadata */}
        <div className="mt-8 border-4 border-black bg-gray-100 p-6">
          <h3 className="font-mono font-bold text-lg mb-4">Article Info</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-mono font-bold">Published:</span>
              <span className="ml-2">{format(new Date(article.published_at), 'PPP')}</span>
            </div>
            <div>
              <span className="font-mono font-bold">Last Updated:</span>
              <span className="ml-2">{format(new Date(article.updated_at), 'PPP')}</span>
            </div>
            <div>
              <span className="font-mono font-bold">Status:</span>
              <span className="ml-2 capitalize">{article.status}</span>
            </div>
            <div>
              <span className="font-mono font-bold">Article ID:</span>
              <span className="ml-2">{article.id}</span>
            </div>
          </div>
        </div>
      </footer>
    </article>
  );
}