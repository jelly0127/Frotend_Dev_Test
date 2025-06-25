'use client'

import React from 'react';
import Link from 'next/link';
import SearchBar from './SearchBar';
import { BlogPost } from './help/types';
import BlogCard from './BlogCard';

interface BlogProps {
  posts: BlogPost[];
  categories: string[];
  tags: string[];
  featuredPost: BlogPost;
  regularPosts: BlogPost[];
}

const Blog = ({ posts, categories, tags, featuredPost, regularPosts }: BlogProps) => {
  return (
    <div className="min-h-screen h-full">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1"></div>
            <div className="flex-1 text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Our Blog
              </h1>
            </div>
            <div className="flex-1 flex justify-end">
              <div className="flex gap-2">
                <Link
                  href="/blog/add"
                  className="px-4 py-2 bg-[#FCD535] text-black/80 rounded hover:bg-[#FCD535]/80 transition-colors text-sm"
                >
                  ✍️ Add Article
                </Link>
                <Link
                  href="/blog/manage"
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm"
                >
                  📝 Manage
                </Link>
              </div>
            </div>
          </div>


          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar placeholder="Search articles, tutorials, and more..." />
          </div>
        </div>

        {/* Categories and Tags Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link
              href="/blog"
              className="px-4 py-2 bg-[#FCD535] text-black/80 rounded-full hover:bg-[#FCD535]/80 transition-colors"
            >
              All Posts ({posts.length})
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/blog/categories/${category.toLowerCase()}`}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>

          {/* Popular Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2">
              <span className="text-gray-400 text-sm mr-2">Popular tags:</span>
              {tags.slice(0, 8).map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tags/${tag.toLowerCase()}`}
                  className="text-sm px-3 py-1 bg-gray-800 text-gray-300 rounded hover:bg-gray-700 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Featured Article</h2>
            <BlogCard post={featuredPost} featured={true} />
          </div>
        )}

        {/* Recent Posts */}
        {regularPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* No Posts Message */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-white mb-4">No Posts Yet</h2>
            <p className="text-gray-400 max-w-md mx-auto">
              We&apos;re working on creating amazing content for you.
              Check back soon for the latest articles and tutorials!
            </p>
          </div>
        )}

        {/* Newsletter Subscription */}
        {/* <div className="mt-16 bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-4">
            Stay Updated
          </h3>
          <p className="text-gray-300 mb-6 max-w-md mx-auto">
            Subscribe to our newsletter to get the latest articles delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Blog;