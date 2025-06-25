import React, { useState } from 'react';
import Link from 'next/link';
import { BlogPost } from './help/types';
import { deleteArticle } from './help/fileManager';
import classNames from 'classnames';

const BlogManage = ({ articles }: { articles: BlogPost[] }) => {
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArticles, setFilteredArticles] = useState(articles);

  const handleDelete = (slug: string, title: string) => {
    if (confirm(`Are you sure you want to delete the article "${title}"?`)) {
      deleteArticle(slug);
      setFilteredArticles(filteredArticles.filter(a => a.slug !== slug));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="md:container mx-auto px-4 py-12 w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-2 justify-between items-center mb-6">
            <h1 className="text-2xl md:text-4xl font-bold text-white">Article Management</h1>
            <div className="flex gap-4 justify-center md:justify-start">
              <Link
                href="/blog/add"
                className="md:px-6 md:py-3 px-2 py-1 bg-[#FCD535] flex items-center justify-center text-black/80 rounded hover:bg-[#FCD535]/80 transition-colors"
              >
                Add New
              </Link>
              <Link
                href="/blog"
                className="md:px-6 md:py-3 px-2 py-1 bg-gray-300 flex items-center justify-center text-black/80 rounded hover:bg-[#FCD535]/80 transition-colors"
              >
                Back
              </Link>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-2xl font-bold text-white">{articles.length}</div>
              <div className="text-gray-400">Total Articles</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-xl md:text-2xl font-bold text-green-400">
                {articles.filter(a => a.published).length}
              </div>
              <div className="text-gray-400">Published</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-xl md:text-2xl font-bold text-yellow-400">
                {articles.filter(a => !a.published).length}
              </div>
              <div className="text-gray-400">Draft</div>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="text-xl md:text-2xl font-bold text-blue-400">
                {new Set(articles.map(a => a.category)).size}
              </div>
              <div className="text-gray-400">Category Count</div>
            </div>
          </div>

          {/* Filter and Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={classNames(
                  'md:px-4 md:py-2 px-2 py-1 rounded transition-colors text-sm md:text-base',
                  {
                    'bg-[#FCD535] text-black/80': filter === 'all',
                    'bg-gray-700 text-gray-300 hover:bg-gray-600': filter !== 'all'
                  }
                )}
              >
                All ({articles.length})
              </button>
              <button
                onClick={() => setFilter('published')}
                className={classNames(
                  'md:px-4 md:py-2 px-2 py-1 rounded transition-colors',
                  {
                    'bg-[#FCD535] text-black/80': filter === 'published',
                    'bg-gray-700 text-gray-300 hover:bg-gray-600': filter !== 'published'
                  }
                )}
              >
                Published ({articles.filter(a => a.published).length})
              </button>
              <button
                onClick={() => setFilter('draft')}
                className={classNames(
                  'px-4 py-2 rounded transition-colors',
                  {
                    'bg-[#FCD535] text-black/80': filter === 'draft',
                    'bg-gray-700 text-gray-300 hover:bg-gray-600': filter !== 'draft'
                  }
                )}
              >
                Draft ({articles.filter(a => !a.published).length})
              </button>
            </div>

            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search articles by title, description, author or category..."
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Article List */}
        <div className="space-y-4">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {searchTerm ? 'No matching articles found' : 'No articles yet'}
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm ? 'Try adjusting the search criteria' : 'Start creating your first article!'}
              </p>
              {!searchTerm && (
                <Link
                  href="/blog/add"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Add New Article
                </Link>
              )}
            </div>
          ) : (
            filteredArticles.map(article => (
              <div
                key={article.slug}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">
                        <Link
                          href={`/blog/${article.slug}`}
                          className="hover:text-blue-400 transition-colors"
                        >
                          {article.title}
                        </Link>
                      </h3>
                      <span
                        className={classNames(
                          'md:px-2 md:py-1 px-1 py-0.5  text-xs rounded',
                          {
                            'bg-green-600 text-white': article.published,
                            'bg-yellow-600 text-white': !article.published
                          }
                        )}
                      >
                        {article.published ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <p className="text-gray-300 mb-3 line-clamp-2">
                      {article.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                      <span>Author: {article.author}</span>
                      <span>Date: {article.date}</span>
                      <span>Category: {article.category}</span>
                      <div className="flex gap-1">
                        {article.tags.slice(0, 3).map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                        {article.tags.length > 3 && (
                          <span className="text-gray-500 text-xs">
                            +{article.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 md:ml-4 ml-0">
                    <Link
                      href={`/blog/${article.slug}`}
                      className="md:px-3 md:py-2 px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      View
                    </Link>
                    <Link
                      href={`/blog/edit/${article.slug}`}
                      className="md:px-3 md:py-2 px-2 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(article.slug, article.title)}
                      className="md:px-3 md:py-2 px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogManage;