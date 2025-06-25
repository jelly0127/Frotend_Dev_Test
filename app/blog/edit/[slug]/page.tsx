'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { notFound } from 'next/navigation'
import ArticleEditor from '@/components/Blog/ArticleEditor'
import { BlogFrontmatter } from '@/components/Blog/help/types'
import { getArticleRaw, saveArticle } from '@/components/Blog/help/fileManager'

interface Props {
  params: Promise<{ slug: string }>
}

export default function EditArticlePage({ params }: Props) {
  const router = useRouter()
  const [initialData, setInitialData] = useState<{
    frontmatter: BlogFrontmatter
    content: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadArticle()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadArticle = async () => {
    try {
      const { slug } = await params
      const result = await getArticleRaw(slug)

      if (result.success && result.frontmatter && result.content !== undefined) {
        setInitialData({
          frontmatter: result.frontmatter,
          content: result.content
        })
      } else {
        console.error(' load article failed:', result.error)
        notFound()
      }
    } catch (error) {
      console.error('load article failed:', error)
      notFound()
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (frontmatter: BlogFrontmatter, content: string) => {
    try {
      const { slug } = await params
      const result = await saveArticle(frontmatter, content, slug)

      if (result.success) {
        alert('article updated successfully')
        // if the title changed, the slug will also change, need to jump to the new URL
        if (result.slug !== slug) {
          router.push(`/blog/${result.slug}`)
        } else {
          router.push(`/blog/${slug}`)
        }
      } else {
        alert(`save failed: ${result.error}`)
      }
    } catch (error) {
      console.error('save article failed:', error)
      alert('save failed, please try again')
    }
  }

  const handleCancel = async () => {
    if (confirm('are you sure to cancel? the unsaved changes will be lost.')) {
      const { slug } = await params
      router.push(`/blog/${slug}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">loading...</div>
      </div>
    )
  }

  if (!initialData) {
    notFound()
  }

  return (
    <ArticleEditor
      initialData={initialData}
      onSave={handleSave}
      onCancel={handleCancel}
      isEditing={true}
    />
  )
} 