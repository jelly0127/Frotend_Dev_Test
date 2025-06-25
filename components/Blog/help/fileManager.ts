'use server'

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { BlogFrontmatter } from './types'

const postsDirectory = path.join(process.cwd(), 'posts')

// 确保 posts 目录存在
export async function ensurePostsDirectory(): Promise<void> {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
  }
}

// 生成文件名 slug
export async function generateSlug(title: string): Promise<string> {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .trim()
}

// 保存文章
export async function saveArticle(
  frontmatter: BlogFrontmatter, 
  content: string,
  slug?: string
): Promise<{ success: boolean; slug: string; error?: string }> {
  try {
    await ensurePostsDirectory()

    const articleSlug = slug || await generateSlug(frontmatter.title)
    const fileName = `${articleSlug}.md`
    const filePath = path.join(postsDirectory, fileName)

    // 检查文件是否已存在（如果不是编辑模式）
    if (!slug && fs.existsSync(filePath)) {
      return {
        success: false,
        slug: articleSlug,
        error: '文件名已存在，请修改标题或手动指定文件名'
      }
    }

    // 构建 frontmatter
    const frontmatterString = matter.stringify(content, {
      ...frontmatter,
      date: frontmatter.date || new Date().toISOString().split('T')[0]
    })

    // 写入文件
    fs.writeFileSync(filePath, frontmatterString, 'utf8')

    return {
      success: true,
      slug: articleSlug
    }
  } catch (error) {
    console.error('保存文章失败:', error)
    return {
      success: false,
      slug: '',
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

// 删除文章
export async function deleteArticle(slug: string): Promise<{ success: boolean; error?: string }> {
  try {
    const filePath = path.join(postsDirectory, `${slug}.md`)
    
    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        error: '文章不存在'
      }
    }

    fs.unlinkSync(filePath)

    return {
      success: true
    }
  } catch (error) {
    console.error('删除文章失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

// 重命名文章
export async function renameArticle(
  oldSlug: string, 
  newSlug: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const oldPath = path.join(postsDirectory, `${oldSlug}.md`)
    const newPath = path.join(postsDirectory, `${newSlug}.md`)

    if (!fs.existsSync(oldPath)) {
      return {
        success: false,
        error: '原文章不存在'
      }
    }

    if (fs.existsSync(newPath)) {
      return {
        success: false,
        error: '新文件名已存在'
      }
    }

    fs.renameSync(oldPath, newPath)

    return {
      success: true
    }
  } catch (error) {
    console.error('重命名文章失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

// 获取文章原始内容（用于编辑）
export async function getArticleRaw(slug: string): Promise<{
  success: boolean
  frontmatter?: BlogFrontmatter
  content?: string
  error?: string
}> {
  try {
    const filePath = path.join(postsDirectory, `${slug}.md`)
    
    if (!fs.existsSync(filePath)) {
      return {
        success: false,
        error: '文章不存在'
      }
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      success: true,
      frontmatter: data as BlogFrontmatter,
      content
    }
  } catch (error) {
    console.error('获取文章失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
}

// 获取所有文章列表（用于管理）
export async function getAllArticlesForManagement(): Promise<{
  success: boolean
  articles?: Array<{
    slug: string
    title: string
    description: string
    author: string
    date: string
    category: string
    published: boolean
    tags: string[]
  }>
  error?: string
}> {
  try {
    await ensurePostsDirectory()

    const fileNames = fs.readdirSync(postsDirectory).filter(name => name.endsWith('.md'))
    
    const articles = fileNames.map(fileName => {
      const slug = fileName.replace(/\.md$/, '')
      const filePath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data } = matter(fileContents)
      
      return {
        slug,
        title: data.title || '无标题',
        description: data.description || '',
        author: data.author || '未知作者',
        date: data.date || '',
        category: data.category || '未分类',
        published: data.published || false,
        tags: data.tags || []
      }
    })

    // 按日期排序（最新的在前）
    articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return {
      success: true,
      articles
    }
  } catch (error) {
    console.error('获取文章列表失败:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : '未知错误'
    }
  }
} 