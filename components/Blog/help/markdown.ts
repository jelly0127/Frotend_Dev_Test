'use server'

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import { BlogFrontmatter, BlogPost } from './types'

const postsDirectory = path.join(process.cwd(), 'posts')

// Get file names under /posts
function getPostSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  return fs.readdirSync(postsDirectory).filter(name => name.endsWith('.md'))
}

// Get post data by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const realSlug = slug.replace(/\.md$/, '')
    const fullPath = path.join(postsDirectory, `${realSlug}.md`)
    
    if (!fs.existsSync(fullPath)) {
      return null
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    // Process markdown content to HTML
    const processedContent = await remark()
      .use(remarkHtml)
      .process(content)
    const htmlContent = processedContent.toString()
    
    // Calculate reading time (average 200 words per minute)
    const wordCount = content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)
    
    const frontmatter = data as BlogFrontmatter
    
    return {
      slug: realSlug,
      title: frontmatter.title || 'Untitled',
      description: frontmatter.description || '',
      date: frontmatter.date || new Date().toISOString(),
      author: frontmatter.author || 'Anonymous',
      tags: frontmatter.tags || [],
      category: frontmatter.category || 'General',
      published: frontmatter.published !== false,
      coverImage: frontmatter.coverImage || '',
      content: htmlContent,
      readingTime: `${readingTime} min read`
    }
  } catch (error) {
    console.error(`Error reading post ${slug}:`, error)
    return null
  }
}

// Get all posts
export async function getAllPosts(): Promise<BlogPost[]> {
  const slugs = getPostSlugs()
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const post = await getPostBySlug(slug.replace(/\.md$/, ''))
      return post
    })
  )
  
  return posts
    .filter((post): post is BlogPost => post !== null && post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Get posts with pagination
export async function getPostsWithPagination(page: number = 1, limit: number = 6) {
  const allPosts = await getAllPosts()
  const totalPosts = allPosts.length
  const totalPages = Math.ceil(totalPosts / limit)
  const startIndex = (page - 1) * limit
  const posts = allPosts.slice(startIndex, startIndex + limit)

  return {
    posts,
    pagination: {
      currentPage: page,
      totalPages,
      totalPosts,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  }
}

// Get posts by tag
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter(post => 
    post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
  )
}

// Get posts by category
export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts()
  return allPosts.filter(post => 
    post.category && post.category.toLowerCase() === category.toLowerCase()
  )
}

// Get all tags
export async function getAllTags(): Promise<string[]> {
  const allPosts = await getAllPosts()
  const tags = allPosts.flatMap(post => post.tags)
  return Array.from(new Set(tags)).sort()
}

// Get all categories
export async function getAllCategories(): Promise<string[]> {
  const allPosts = await getAllPosts()
  const categories = allPosts
    .map(post => post.category)
    .filter((category): category is string => Boolean(category))
  return Array.from(new Set(categories)).sort()
}

// Get featured posts
export async function getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
  const allPosts = await getAllPosts()
  return allPosts.slice(0, limit)
}

// Get related posts
export async function getRelatedPosts(currentPost: BlogPost, limit: number = 3): Promise<BlogPost[]> {
  const allPosts = await getAllPosts()
  const filteredPosts = allPosts.filter((post) => post.slug !== currentPost.slug)
  
  // Find posts with similar tags or category
  const relatedPosts = filteredPosts.filter((post) => {
    const hasCommonTags = post.tags.some((tag) => currentPost.tags.includes(tag))
    const sameCategory = post.category && post.category === currentPost.category
    return hasCommonTags || sameCategory
  })

  // If not enough related posts, add random posts
  if (relatedPosts.length < limit) {
    const remainingPosts = filteredPosts.filter(
      (post) => !relatedPosts.includes(post)
    )
    relatedPosts.push(...remainingPosts.slice(0, limit - relatedPosts.length))
  }

  return relatedPosts.slice(0, limit)
}

// Search posts
export async function searchPosts(query: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts()
  const lowercaseQuery = query.toLowerCase()

  return allPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.description.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  )
} 