import React from 'react'
import { Metadata } from 'next'
import { getAllPosts, getAllTags, getAllCategories } from '@/components/Blog/help/markdown'

import Blog from '@/components/Blog/Blog'

export const metadata: Metadata = {
  title: 'Blog | Latest Articles & Tutorials',
  description: 'Explore our latest articles, tutorials, and insights on web development, technology, and programming.',
  keywords: 'blog, articles, tutorials, web development, programming, technology',
  openGraph: {
    title: 'Blog | Latest Articles & Tutorials',
    description: 'Explore our latest articles, tutorials, and insights on web development, technology, and programming.',
    type: 'website',
    url: '/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Latest Articles & Tutorials',
    description: 'Explore our latest articles, tutorials, and insights on web development, technology, and programming.',
  },
}

export default async function BlogPage() {
  const posts = await getAllPosts()
  const tags = await getAllTags()
  const categories = await getAllCategories()
  const featuredPost = posts[0] // Most recent post as featured
  const regularPosts = posts.slice(1)

  return (
    <div className="w-full h-full">
      <Blog posts={posts} categories={categories} tags={tags} featuredPost={featuredPost} regularPosts={regularPosts} />
    </div>
  )
} 