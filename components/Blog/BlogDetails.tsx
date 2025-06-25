import { BlogPost } from './help/types';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from './help/dateUtils';
import BlogCard from './BlogCard';

const BlogDetails = ({ post, relatedPosts }: { post: BlogPost, relatedPosts: BlogPost[] }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <article className="container mx-auto px-4 py-12 max-w-7xl">
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

        {/* Article Header */}
        <header className="mb-12">
          {/* Category */}
          {post.category && (
            <div className="mb-4">
              <Link
                href={`/blog/categories/${post.category.toLowerCase()}`}
                className="inline-block px-3 py-1 text-sm font-semibold text-[#FCD535] bg-[#FCD535]/30 rounded-full hover:bg-[#FCD535]/50 transition-colors"
              >
                {post.category}
              </Link>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            {post.description}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-400 mb-8">
            <div className="flex items-center">
              <span className="font-medium">By {post.author}</span>
            </div>
            <div className="flex items-center">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </div>
            <div className="flex items-center">
              <span>{post.readingTime}</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tags/${tag.toLowerCase()}`}
                  className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative h-64 md:h-96 lg:h-[500px] rounded-lg overflow-hidden mb-12">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </header>

        {/* Article Content */}
        <div
          className="prose prose-lg prose-invert max-w-none mb-16
                     prose-headings:text-white 
                     prose-p:text-gray-300 prose-p:leading-relaxed
                     prose-a:text-[#FCD535] prose-a:no-underline hover:prose-a:text-[#FCD535]/80 hover:prose-a:underline
                     prose-strong:text-white
                     prose-code:text-[#FCD535] prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded
                     prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700
                     prose-blockquote:border-l-[#FCD535] prose-blockquote:bg-gray-800/50 prose-blockquote:text-gray-300
                     prose-ul:text-gray-300 prose-ol:text-gray-300
                     prose-li:text-gray-300"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share Buttons */}
        <div className="border-t border-gray-700 pt-8 mb-16">
          <h3 className="text-lg font-semibold text-white mb-4">Share this article</h3>
          <div className="flex gap-4">
            <button className="flex items-center px-4 py-2 bg-[#FCD535] text-black/80 rounded hover:bg-[#FCD535]/80 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
              Twitter
            </button>
            <button className="flex items-center px-4 py-2 bg-[#FCD535] text-black/80 rounded hover:bg-[#FCD535]/80 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
            <button className="flex items-center px-4 py-2 bg-[#FCD535] text-black/80 rounded hover:bg-[#FCD535]/80 transition-colors">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </button>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-gray-700 pt-16">
            <h2 className="text-3xl font-bold text-white mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
};

export default BlogDetails;