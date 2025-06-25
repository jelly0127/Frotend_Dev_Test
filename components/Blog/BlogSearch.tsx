import React, { useState } from 'react';
import Link from 'next/link';
import SearchBar from './SearchBar';
import BlogCard from './BlogCard';
import { BlogPost } from './help/types';
import { searchPosts } from './help/markdown';

interface BlogSearchProps {
  posts?: BlogPost[];
}

const BlogSearch = ({ }: BlogSearchProps) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (newQuery: string) => {
    setQuery(newQuery);
    setIsLoading(true);
    const results = await searchPosts(newQuery);
    setSearchResults(results);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="container mx-auto px-4 py-12">
        {/* Back to Blog */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-[#FCD535] hover:text-[#FCD535]/80 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blog
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Search Articles
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Find the perfect article for your needs. Search through our entire collection of tutorials, guides, and insights.
          </p>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar
              placeholder="Search articles, tutorials, and more..."
              onSearch={handleSearch}
              initialQuery={query}
            />
          </div>
        </div>

        {/* Search Results */}
        {query && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              {isLoading ? 'Searching...' : `Search Results for "${query}"`}
            </h2>
            <p className="text-gray-400">
              {!isLoading && `Found ${searchResults.length} article${searchResults.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FCD535]"></div>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-4">No Results Found</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">
              We couldn&apos;t find any articles matching &quot;{query}&quot;. Try adjusting your search terms or browse our categories.
            </p>
            <Link
              href="/blog"
              className="inline-block px-6 py-3 bg-[#FCD535] text-black/80 rounded-lg hover:bg-[#FCD535]/80 transition-colors"
            >
              Browse All Articles
            </Link>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-2xl font-bold text-white mb-4">Start Your Search</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Enter your search terms above to find relevant articles, tutorials, and guides.
            </p>
          </div>
        )}

        {/* Popular Search Terms */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-bold text-white mb-6">Popular Search Terms</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {['React', 'Next.js', 'JavaScript', 'TypeScript', 'Performance', 'Hooks'].map((term) => (
              <button
                key={term}
                onClick={() => handleSearch(term)}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSearch;