import { BlogPost } from './help/types';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from './help/dateUtils';
import BlogCard from './BlogCard';
import { FaXTwitter } from 'react-icons/fa6';
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
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
          className="prose prose-lg prose-invert max-w-none mb-16 overflow-x-auto
                     prose-headings:text-white 
                     prose-p:text-gray-300 prose-p:leading-relaxed
                     prose-a:text-[#FCD535] prose-a:no-underline hover:prose-a:text-[#FCD535]/80 hover:prose-a:underline
                     prose-strong:text-white
                     prose-code:text-[#FCD535] prose-code:bg-gray-800 prose-code:px-1 prose-code:rounded
                     prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700 prose-pre:overflow-x-auto
                     prose-blockquote:border-l-[#FCD535] prose-blockquote:bg-gray-800/50 prose-blockquote:text-gray-300
                     prose-ul:text-gray-300 prose-ol:text-gray-300
                     prose-li:text-gray-300
                     prose-table:overflow-x-auto prose-table:block prose-table:whitespace-nowrap
                     "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share Buttons */}
        <div className="border-t border-gray-700 pt-8 mb-16">
          <h3 className="text-lg font-semibold text-white mb-4">Share this article</h3>
          <div className="flex gap-4">
            <button className="flex items-center md:px-4 md:py-2 px-2 py-1 bg-[#FCD535] text-black/80 rounded hover:bg-[#FCD535]/80 transition-colors">
              <FaXTwitter />
              Twitter
            </button>
            <button className="flex items-center md:px-4 md:py-2 px-2 py-1 bg-[#FCD535] text-black/80 rounded hover:bg-[#FCD535]/80 transition-colors">
              <FaFacebookF />
              Facebook
            </button>
            <button className="flex items-center md:px-4 md:py-2 px-2 py-1 bg-[#FCD535] text-black/80 rounded hover:bg-[#FCD535]/80 transition-colors">
              <FaLinkedinIn />
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