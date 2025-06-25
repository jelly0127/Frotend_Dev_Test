import React from 'react'
import { Metadata } from 'next'

import {
  getPostBySlug,
  getAllPosts,
  getRelatedPosts
} from '@/components/Blog/help/markdown'

import BlogDetails from '@/components/Blog/BlogDetails'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Generate metadata for each post
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | Blog`,
    description: post.description,
    keywords: post.tags.join(', '),
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: post.coverImage ? [{ url: post.coverImage, alt: post.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post, 3)

  return (
    <BlogDetails post={post} relatedPosts={relatedPosts} />
  )
} 