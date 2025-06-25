'use client'

import matter from 'gray-matter'
import { BlogFrontmatter } from './types'

export interface ParsedMarkdownFile {
  frontmatter: Partial<BlogFrontmatter>
  content: string
  hasValidFrontmatter: boolean
}

// parse markdown file content
export function parseMarkdownFile(fileContent: string): ParsedMarkdownFile {
  try {
    const { data, content } = matter(fileContent)
    
    // check if there is a valid frontmatter
    const hasValidFrontmatter = Object.keys(data).length > 0
    
    // build frontmatter object, provide default values
    const frontmatter: Partial<BlogFrontmatter> = {
      title: data.title || '',
      description: data.description || '',
      date: data.date || new Date().toISOString().split('T')[0],
      author: data.author || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      category: data.category || '',
      published: typeof data.published === 'boolean' ? data.published : false,
      coverImage: data.coverImage || '',
    }
    
    return {
      frontmatter,
      content: content.trim(),
      hasValidFrontmatter
    }
  } catch (error) {
    console.error('parse markdown file failed:', error)
    
    // if parse failed, return the whole content as the content
    return {
      frontmatter: {
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        author: '',
        tags: [],
        category: '',
        published: false,
        coverImage: '',
      },
      content: fileContent,
      hasValidFrontmatter: false
    }
  }
}

// extract title from content (if frontmatter is not valid)
export function extractTitleFromContent(content: string): string {
  // find the first # title
  const titleMatch = content.match(/^#\s+(.+)$/m)
  return titleMatch ? titleMatch[1].trim() : ''
}

// generate description from content (if frontmatter is not valid)
export function generateDescriptionFromContent(content: string): string {
  // remove title and empty line, take the first 150 characters as description
  const cleanContent = content
    .replace(/^#+\s+.+$/gm, '') // remove title
    .replace(/^\s*$/gm, '') // remove empty line
    .replace(/```[\s\S]*?```/g, '') // remove code block
    .replace(/`[^`]+`/g, '') // remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // remove link, keep text
    .replace(/[*_]{1,2}([^*_]+)[*_]{1,2}/g, '$1') // remove bold italic mark
    .trim()
  
  const firstParagraph = cleanContent.split('\n')[0] || ''
  return firstParagraph.length > 150 
    ? firstParagraph.substring(0, 150) + '...' 
    : firstParagraph
}

// validate file type
export function validateMarkdownFile(file: File): { valid: boolean; error?: string } {
  // check file extension
  if (!file.name.toLowerCase().endsWith('.md')) {
    return { valid: false, error: 'please select .md file' }
  }
  
  // check file size (limit to 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'file size cannot exceed 5MB' }
  }
  
  return { valid: true }
}

// read file content
export function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (event) => {
      const content = event.target?.result as string
      resolve(content)
    }
    
    reader.onerror = () => {
      reject(new Error('read file failed'))
    }
    
    reader.readAsText(file, 'utf-8')
  })
} 