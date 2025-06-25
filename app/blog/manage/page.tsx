'use client'

import React, { useState, useEffect } from 'react'
import { getAllArticlesForManagement } from '@/components/Blog/help/fileManager'
import BlogManage from '@/components/Blog/BlogManage'
import { BlogPost } from '@/components/Blog/help/types'

interface Article {
  slug: string
  title: string
  description: string
  author: string
  date: string
  category: string
  published: boolean
  tags: string[]
}

export default function ManageArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    setLoading(true)
    try {
      const result = await getAllArticlesForManagement()
      if (result.success && result.articles) {
        setArticles(result.articles)
      } else {
        console.error('load article failed:', result.error)
      }
    } catch (error) {
      console.error('load article failed:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">loading...</div>
      </div>
    )
  }

  return (
    <BlogManage articles={articles as BlogPost[]} />
  )
} 