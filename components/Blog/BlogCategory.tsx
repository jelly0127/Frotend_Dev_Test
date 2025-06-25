import React from 'react';
import Link from 'next/link';
import { BlogPost } from './help/types';
import BlogCard from './BlogCard';
import classNames from 'classnames';

const BlogCategory = ({ category, posts, relatedTags, allCategories }: { category: string, posts: BlogPost[], relatedTags: string[], allCategories: string[] }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="container mx-auto px-4 py-12">
        {/* Back to Blog */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-[#FCD535 ] hover:text-[#FCD535]/80 transition-colors"
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
          <div className="inline-flex items-center mb-4">
            <span className="text-2xl mr-3">📁</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white capitalize">
              {category}
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {posts.length} article{posts.length !== 1 ? 's' : ''} in the &quot;{category}&quot; category
          </p>
        </div>

        {/* Articles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        {/* Related Tags */}
        {relatedTags.length > 0 && (
          <div className="border-t border-gray-700 pt-12 mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Popular Tags in {category}
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {relatedTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tags/${tag.toLowerCase()}`}
                  className="px-4 py-2 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Categories */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-white mb-6">All Categories</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {allCategories.map((cat) => (
              <Link
                key={cat}
                href={`/blog/categories/${cat.toLowerCase()}`}
                className={classNames(
                  'px-4 py-2 rounded-full transition-colors',
                  {
                    'bg-[#FCD535] text-black/80': cat.toLowerCase() === category.toLowerCase(),
                    'bg-gray-700 text-gray-300 hover:bg-gray-600': cat.toLowerCase() !== category.toLowerCase()
                  }
                )}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCategory;