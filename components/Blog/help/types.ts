// Blog post interface
export interface BlogPost {
  slug: string
  title: string
  description: string
  content: string
  date: string
  author: string
  tags: string[]
  readingTime: string
  published: boolean
  coverImage?: string
  category?: string
}

// Blog frontmatter interface
export interface BlogFrontmatter {
  title: string
  description: string
  date: string
  author: string
  tags: string[]
  published: boolean
  coverImage?: string
  category?: string
}

// Blog metadata interface
export interface BlogMetadata {
  totalPosts: number
  totalPages: number
  currentPage: number
  postsPerPage: number
  tags: string[]
  categories: string[]
}

// SEO data interface
export interface SEOData {
  title: string
  description: string
  keywords: string
  ogImage?: string
  canonical?: string
} 