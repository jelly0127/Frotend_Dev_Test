'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import ArticleEditor from '@/components/Blog/ArticleEditor'
import { BlogFrontmatter } from '@/components/Blog/help/types'
import { saveArticle } from '@/components/Blog/help/fileManager'

export default function AddArticlePage() {
  const router = useRouter()

  const handleSave = async (frontmatter: BlogFrontmatter, content: string) => {
    try {
      const result = await saveArticle(frontmatter, content)

      if (result.success) {
        alert('save success')
        router.push(`/blog/${result.slug}`)
      } else {
        alert(`save failed: ${result.error}`)
      }
    } catch (error) {
      console.error('save article failed:', error)
      alert('save failed, please try again')
    }
  }

  const handleCancel = () => {
    if (confirm('are you sure to cancel? the unsaved content will be lost.')) {
      router.push('/blog')
    }
  }

  return (
    <ArticleEditor
      onSave={handleSave}
      onCancel={handleCancel}
      isEditing={false}
    />
  )
} 