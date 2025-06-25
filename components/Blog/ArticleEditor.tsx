'use client'

import React, { useState } from 'react'
import { BlogFrontmatter } from './help/types'
import FileImporter from './FileImporter'

interface ArticleEditorProps {
  initialData?: {
    frontmatter: BlogFrontmatter
    content: string
  }
  onSave: (frontmatter: BlogFrontmatter, content: string) => Promise<void>
  onCancel: () => void
  isEditing?: boolean
}

export default function ArticleEditor({
  initialData,
  onSave,
  onCancel,
  isEditing = false
}: ArticleEditorProps) {
  const [frontmatter, setFrontmatter] = useState<BlogFrontmatter>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    author: '',
    tags: [],
    category: '',
    published: false,
    coverImage: '',
    ...initialData?.frontmatter
  })

  const [content, setContent] = useState(initialData?.content || '')
  const [tagInput, setTagInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [showFileImporter, setShowFileImporter] = useState(false)

  const handleTagAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!frontmatter.tags.includes(tagInput.trim())) {
        setFrontmatter(prev => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()]
        }))
      }
      setTagInput('')
    }
  }

  const handleTagRemove = (tagToRemove: string) => {
    setFrontmatter(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!frontmatter.title.trim() || !content.trim()) {
      alert('Please fill in the title and content')
      return
    }

    setIsLoading(true)
    try {
      await onSave(frontmatter, content)
    } catch (error) {
      console.error('Save failed:', error)
      alert('Save failed, please try again')
    } finally {
      setIsLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  // Handle file import
  const handleFileImport = (importedFrontmatter: BlogFrontmatter, importedContent: string) => {
    setFrontmatter(importedFrontmatter)
    setContent(importedContent)
    setShowFileImporter(false)
  }

  const commonCategories = ['Tutorial', 'Performance', 'Guide', 'News', 'Review']
  const commonTags = ['React', 'Next.js', 'JavaScript', 'TypeScript', 'Performance', 'Hooks', 'Web Development', 'Frontend', 'Backend', 'API']

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 text-center md:text-left">
            {isEditing ? 'Edit Article' : 'Add New Article'}
          </h1>
          <div className="flex gap-4 justify-center md:justify-start">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="md:px-4 md:py-2 px-2 py-1 bg-[#FCD535] flex items-center justify-center text-black/80 rounded hover:bg-[#FCD535]/80 transition-colors"
            >
              {previewMode ? 'Edit Mode' : 'Preview Mode'}
            </button>
            {!isEditing && (
              <button
                type="button"
                onClick={() => setShowFileImporter(true)}
                className="md:px-4 md:py-2 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Import .md file
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Metadata */}
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4">Article Information</h2>

                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={frontmatter.title}
                    onChange={(e) => setFrontmatter(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-[#FCD535] focus:outline-none"
                    placeholder="Enter article title"
                    required
                  />
                  {frontmatter.title && (
                    <p className="text-xs text-gray-400 mt-1">
                      URL: /blog/{generateSlug(frontmatter.title)}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={frontmatter.description}
                    onChange={(e) => setFrontmatter(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-[#FCD535] focus:outline-none"
                    placeholder="Enter article description"
                    rows={3}
                    required
                  />
                </div>

                {/* Author */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Author *
                  </label>
                  <input
                    type="text"
                    value={frontmatter.author}
                    onChange={(e) => setFrontmatter(prev => ({ ...prev, author: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-[#FCD535] focus:outline-none"
                    placeholder="Enter author name"
                    required
                  />
                </div>

                {/* Date */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Publish Date
                  </label>
                  <input
                    type="date"
                    value={frontmatter.date}
                    onChange={(e) => setFrontmatter(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-[#FCD535] focus:outline-none"
                  />
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={frontmatter.category}
                    onChange={(e) => setFrontmatter(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:border-[#FCD535] focus:outline-none"
                  >
                    <option value="">Select Category</option>
                    {commonCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={frontmatter.category}
                    onChange={(e) => setFrontmatter(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-[#FCD535] focus:outline-none mt-2"
                    placeholder="Or enter custom category"
                  />
                </div>

                {/* Cover Image */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={frontmatter.coverImage}
                    onChange={(e) => setFrontmatter(prev => ({ ...prev, coverImage: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-[#FCD535] focus:outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Publish Status */}
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={frontmatter.published}
                      onChange={(e) => setFrontmatter(prev => ({ ...prev, published: e.target.checked }))}
                      className="mr-2"
                    />
                    <span className="text-gray-300">Publish Now</span>
                  </label>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-4">Tags</h3>

                {/* Selected Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {frontmatter.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-[#FCD535] text-black/80 text-sm rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleTagRemove(tag)}
                        className="ml-2 text-white"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {/* Add Tags */}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagAdd}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-[#FCD535] focus:outline-none mb-2"
                  placeholder="Enter tags and press Enter"
                />

                {/* 常用标签 */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-400">Common Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (!frontmatter.tags.includes(tag)) {
                            setFrontmatter(prev => ({
                              ...prev,
                              tags: [...prev.tags, tag]
                            }))
                          }
                        }}
                        className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
                        disabled={frontmatter.tags.includes(tag)}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Content Editor */}
            <div className="space-y-6 min-h-[500px] ">
              <div className="bg-gray-800 rounded-lg border border-gray-700 h-full">
                <div className="flex flex-col h-full justify-between">
                  <div className="p-4 flex flex-col md:flex-row w-full justify-between border-b border-gray-700 gap-2">
                    <div className="flex flex-col w-fit">
                      <h3 className="text-lg font-bold text-white">Article Content</h3>
                      <p className="text-sm text-gray-400">Supports Markdown format</p>

                    </div>
                    {/* Action Buttons */}
                    <div className="flex w-fit  gap-4  border-gray-700">
                      <button
                        type="button"
                        onClick={onCancel}
                        className="md:px-6 md:py-3 px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="md:px-6 md:py-3 px-2 py-1 bg-[#FCD535] text-black/80 rounded hover:bg-[#FCD535]/80 transition-colors disabled:opacity-50"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Saving...' : (isEditing ? 'Update Article' : 'Publish Article')}
                      </button>
                    </div>
                  </div>

                  {previewMode ? (
                    <div className="p-6 prose prose-invert max-w-none ">
                      <div dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }} />
                    </div>
                  ) : (
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full h-full flex-1 px-6 py-4 bg-transparent text-white placeholder-gray-400 resize-none focus:outline-none"
                      placeholder="# Start writing...

使用 Markdown 语法编写你的文章内容。

## 示例标题

这是一个段落。你可以使用 **粗体** 和 *斜体* 文字。

- 列表项 1
- 列表项 2
- 列表项 3

```javascript
// 代码示例
console.log('Hello, World!');
```

> 这是一个引用块。"
                      required
                    />
                  )}
                </div>


              </div>

            </div>
          </div>


        </form>
      </div>

      {/* File import popup */}
      {showFileImporter && (
        <FileImporter
          onImport={handleFileImport}
          onClose={() => setShowFileImporter(false)}
        />
      )}
    </div>
  )
} 