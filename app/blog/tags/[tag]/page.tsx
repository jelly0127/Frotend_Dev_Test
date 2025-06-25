import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostsByTag, getAllTags } from '@/components/Blog/help/markdown'
import BlogTag from '@/components/Blog/BlogTag'

interface Props {
  params: Promise<{ tag: string }>
}

// Generate static params for all tags
export async function generateStaticParams() {
  const tags = await getAllTags()
  return tags.map((tag) => ({
    tag: tag.toLowerCase(),
  }))
}

// Generate metadata for each tag page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag: tagParam } = await params
  const tag = decodeURIComponent(tagParam)
  const posts = await getPostsByTag(tag)

  if (posts.length === 0) {
    return {
      title: 'Tag Not Found',
    }
  }

  return {
    title: `${tag} Articles | Blog`,
    description: `Explore all articles tagged with "${tag}". Find tutorials, guides, and insights related to ${tag}.`,
    keywords: `${tag}, articles, tutorials, blog`,
    openGraph: {
      title: `${tag} Articles | Blog`,
      description: `Explore all articles tagged with "${tag}". Find tutorials, guides, and insights related to ${tag}.`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${tag} Articles | Blog`,
      description: `Explore all articles tagged with "${tag}". Find tutorials, guides, and insights related to ${tag}.`,
    },
  }
}

export default async function TagPage({ params }: Props) {
  const { tag: tagParam } = await params
  const tag = decodeURIComponent(tagParam)
  const posts = await getPostsByTag(tag)
  const allTags = await getAllTags()

  if (posts.length === 0) {
    notFound()
  }

  // Get related tags (other tags that appear in the same posts)
  const relatedTags = Array.from(
    new Set(
      posts
        .flatMap(post => post.tags)
        .filter(t => t.toLowerCase() !== tag.toLowerCase())
    )
  ).slice(0, 6)

  return (
    <BlogTag tag={tag} posts={posts} relatedTags={relatedTags} allTags={allTags} />
  )
} 