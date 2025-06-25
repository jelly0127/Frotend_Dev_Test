'use client'

import React, { useState, useRef } from 'react'
import {
  parseMarkdownFile,
  extractTitleFromContent,
  generateDescriptionFromContent,
  validateMarkdownFile,
  readFileContent,
  ParsedMarkdownFile
} from './help/markdownParser'
import { BlogFrontmatter } from './help/types'
import classNames from 'classnames'

interface FileImporterProps {
  onImport: (frontmatter: BlogFrontmatter, content: string) => void
  onClose: () => void
}

export default function FileImporter({ onImport, onClose }: FileImporterProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string>('')
  const [parsedData, setParsedData] = useState<ParsedMarkdownFile | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file selection
  const handleFileSelect = async (file: File) => {
    setError('')
    setIsProcessing(true)

    try {
      // Validate file
      const validation = validateMarkdownFile(file)
      if (!validation.valid) {
        setError(validation.error || '文件验证失败')
        setIsProcessing(false)
        return
      }

      // Read file content
      const fileContent = await readFileContent(file)

      // Parse Markdown content
      const parsed = parseMarkdownFile(fileContent)

      // If no title, try to extract from content
      if (!parsed.frontmatter.title) {
        const extractedTitle = extractTitleFromContent(parsed.content)
        if (extractedTitle) {
          parsed.frontmatter.title = extractedTitle
        } else {
          // Use file name as title (remove extension)
          parsed.frontmatter.title = file.name.replace(/\.md$/i, '')
        }
      }

      // If no description, generate from content
      if (!parsed.frontmatter.description) {
        parsed.frontmatter.description = generateDescriptionFromContent(parsed.content)
      }

      setParsedData(parsed)
    } catch (err) {
      console.error('Error processing file:', err)
      setError('Error processing file, please try again')
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  // Confirm import
  const handleConfirmImport = () => {
    if (parsedData) {
      const frontmatter: BlogFrontmatter = {
        title: parsedData.frontmatter.title || '',
        description: parsedData.frontmatter.description || '',
        date: parsedData.frontmatter.date || new Date().toISOString().split('T')[0],
        author: parsedData.frontmatter.author || '',
        tags: parsedData.frontmatter.tags || [],
        category: parsedData.frontmatter.category || '',
        published: parsedData.frontmatter.published || false,
        coverImage: parsedData.frontmatter.coverImage || '',
      }

      onImport(frontmatter, parsedData.content)
    }
  }

  // Reset state
  const handleReset = () => {
    setParsedData(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Import Markdown File</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {!parsedData ? (
          <div>
            {/* File upload area */}
            <div
              className={classNames(
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                {
                  'border-blue-500 bg-blue-500/10': isDragOver,
                  'border-gray-600 hover:border-gray-500': !isDragOver
                }
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="mb-4">
                <svg
                  className="w-12 h-12 text-gray-400 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-white mb-2">
                  Drag and drop .md file here, or click to select file
                </p>
                <p className="text-gray-400 text-sm">
                  Supports Markdown files with frontmatter, maximum 5MB
                </p>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Select File'}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".md"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-500 rounded text-red-300">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Preview parsed result */}
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-3">Preview parsed result</h3>

                {!parsedData.hasValidFrontmatter && (
                  <div className="mb-3 p-2 bg-yellow-900/30 border border-yellow-500 rounded text-yellow-300 text-sm">
                    ⚠️ No frontmatter detected in the file, basic information has been automatically generated
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Title</label>
                    <div className="p-2 bg-gray-600 rounded text-white text-sm">
                      {parsedData.frontmatter.title || '(Not set)'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Author</label>
                    <div className="p-2 bg-gray-600 rounded text-white text-sm">
                      {parsedData.frontmatter.author || '(Not set)'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Category</label>
                    <div className="p-2 bg-gray-600 rounded text-white text-sm">
                      {parsedData.frontmatter.category || '(Not set)'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Publish Status</label>
                    <div className="p-2 bg-gray-600 rounded text-white text-sm">
                      {parsedData.frontmatter.published ? 'Published' : 'Draft'}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-300 mb-1">Description</label>
                  <div className="p-2 bg-gray-600 rounded text-white text-sm">
                    {parsedData.frontmatter.description || '(Not set)'}
                  </div>
                </div>

                {parsedData.frontmatter.tags && parsedData.frontmatter.tags.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm text-gray-300 mb-1">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {parsedData.frontmatter.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm text-gray-300 mb-1">Content Preview</label>
                  <div className="p-3 bg-gray-600 rounded text-white text-sm max-h-32 overflow-y-auto">
                    {parsedData.content.substring(0, 200)}
                    {parsedData.content.length > 200 && '...'}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  Re-select
                </button>
                <button
                  onClick={handleConfirmImport}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  Confirm Import
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 