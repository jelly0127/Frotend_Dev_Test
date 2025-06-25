'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { BlogPost } from './help/types'
import { formatDate } from './help/dateUtils'
import classNames from 'classnames'

interface BlogCardProps {
  post: BlogPost
  featured?: boolean
}

const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  return (
    <article
      className={classNames(
        'group bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-[#FCD535]/80 transition-all duration-300',
        {
          'md:col-span-2 lg:col-span-2': featured
        }
      )}
    >
      {/* Cover Image */}
      {post.coverImage && (
        <div className={classNames(
          'relative overflow-hidden bg-gray-700',
          {
            'h-64': featured,
            'h-48': !featured
          }
        )}>
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority={featured}
          />
        </div>
      )}

      <div className="p-6">
        {/* Category */}
        {post.category && (
          <div className="mb-3">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-[#FCD535] bg-[#FCD535]/30 rounded-full">
              {post.category}
            </span>
          </div>
        )}

        {/* Title */}
        <h2
          className={classNames(
            'font-bold text-white mb-3 group-hover:text-[#FCD535] transition-colors',
            {
              'text-2xl md:text-3xl': featured,
              'text-xl': !featured
            }
          )}
        >
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h2>

        {/* Description */}
        <p className={classNames(
          'text-gray-300 mb-4 leading-relaxed',
          {
            'text-lg': featured,
            'text-base': !featured
          }
        )}>
          {post.description}
        </p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className={classNames(
            'flex flex-wrap gap-2 mb-4',
            {
              'text-sm': featured,
              'text-xs': !featured
            }
          )}>
            {post.tags.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/blog/tags/${tag.toLowerCase()}`}
                className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
              >
                #{tag}
              </Link>
            ))}
            {post.tags.length > 3 && (
              <span className={classNames(
                'text-xs text-gray-400',
                {
                  'text-sm': featured,
                  'text-xs': !featured
                }
              )}>
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Meta Info */}
        <div className={classNames(
          'flex items-center justify-between text-sm text-gray-400 mb-4',
          {
            'text-base': featured,
            'text-sm': !featured
          }
        )}>
          <div className="flex items-center space-x-4">
            <span>By {post.author}</span>
            <span>•</span>
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span>•</span>
            <span>{post.readingTime}</span>
          </div>
        </div>

        {/* Read More Button */}
        <Link href={`/blog/${post.slug}`}>
          <Button
            variant="outline"
            className={classNames(
              'w-full sm:w-auto bg-transparent border-gray-600 text-gray-300 hover:bg-[#FCD535]/80 hover:border-[#FCD535]/80 hover:text-white',
              {
                'text-base': featured,
                'text-sm': !featured
              }
            )}
          >
            Read More →
          </Button>
        </Link>
      </div>
    </article>
  )
}

export default BlogCard 