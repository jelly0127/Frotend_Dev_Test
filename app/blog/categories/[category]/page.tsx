import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostsByCategory, getAllCategories } from '@/components/Blog/help/markdown'
import BlogCategory from '@/components/Blog/BlogCategory'

interface Props {
  params: Promise<{ category: string }>
}

// Generate static params for all categories
export async function generateStaticParams() {
  const categories = await getAllCategories()
  return categories.map((category) => ({
    category: category.toLowerCase(),
  }))
}

// Generate metadata for each category page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categoryParam } = await params
  const category = decodeURIComponent(categoryParam)
  const posts = await getPostsByCategory(category)

  if (posts.length === 0) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category} Articles | Blog`,
    description: `Explore all articles in the "${category}" category. Find tutorials, guides, and insights related to ${category}.`,
    keywords: `${category}, articles, tutorials, blog`,
    openGraph: {
      title: `${category} Articles | Blog`,
      description: `Explore all articles in the "${category}" category. Find tutorials, guides, and insights related to ${category}.`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${category} Articles | Blog`,
      description: `Explore all articles in the "${category}" category. Find tutorials, guides, and insights related to ${category}.`,
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category: categoryParam } = await params
  const category = decodeURIComponent(categoryParam)
  const posts = await getPostsByCategory(category)
  const allCategories = await getAllCategories()

  if (posts.length === 0) {
    notFound()
  }

  // Get related categories based on tags from posts in this category
  const relatedTags = Array.from(
    new Set(posts.flatMap(post => post.tags))
  ).slice(0, 8)

  return (
    <BlogCategory category={category} posts={posts} relatedTags={relatedTags} allCategories={allCategories} />
  )
} 