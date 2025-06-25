'use client'

import React, { useState, useEffect } from 'react'
import { FaFileWord } from "react-icons/fa";
import { IoMdCloudDownload } from "react-icons/io";
interface TheoryContent {
  title: string
  content: string
  readingTime: string
  wordCount: number
}

const Theory = () => {
  const [theoryContent, setTheoryContent] = useState<TheoryContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/theory/Frontend_Developer_Aptitude_Test')

        if (!response.ok) {
          throw new Error('Failed to fetch content')
        }

        const data = await response.json()
        setTheoryContent(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  const handleDownload = () => {
    // create a download link
    const link = document.createElement('a')
    link.href = '/Formatted_Frontend_Developer_Aptitude_Test.docx'
    link.download = 'Formatted_Frontend_Developer_Aptitude_Test.docx'
    link.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FCD535] mx-auto mb-4"></div>
              <p className="text-gray-300">Loading content...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-400">
            <p>Error loading content: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen h-full">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {theoryContent?.title || 'Frontend Developer Aptitude Test'}
          </h1>
          <p className="text-gray-300 mb-4">
            This is a collection of answers to theoretical questions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <div className="text-gray-400 text-sm">
              {theoryContent?.readingTime}
            </div>
            {/* <div className="text-gray-400 text-sm">
              {theoryContent?.wordCount} words
            </div> */}
          </div>
          <div className='flex items-center justify-center mb-6'>
            <FaFileWord className="text-6xl" />
          </div>
          <div className='flex items-center justify-center mb-6'>
            <button
              onClick={handleDownload}
              className="bg-[#FCD535] flex items-center justify-center text-black/80 px-6 py-3 rounded-md font-semibold hover:bg-[#FCD535]/80 transition-colors"
            >
              <IoMdCloudDownload className="text-2xl" />
              <span className='ml-2'>
                Download Word Document
              </span>
            </button>
          </div>

        </div>

        {/* {theoryContent && (
          <article
            className="prose prose-lg prose-invert max-w-none
                       prose-headings:text-white prose-headings:font-bold
                       prose-h1:text-4xl prose-h1:mb-8 prose-h1:text-[#FCD535]
                       prose-h2:text-2xl prose-h2:mb-6 prose-h2:mt-12 prose-h2:text-[#FCD535]
                       prose-h3:text-xl prose-h3:mb-4 prose-h3:mt-8 prose-h3:text-white
                       prose-h4:text-lg prose-h4:mb-3 prose-h4:mt-6 prose-h4:text-white
                       prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                       prose-a:text-[#FCD535] prose-a:no-underline hover:prose-a:text-[#FCD535]/80 hover:prose-a:underline
                       prose-strong:text-white prose-strong:font-semibold
                       prose-em:text-gray-200
                       prose-code:text-[#FCD535] prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
                       prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700 prose-pre:rounded-lg prose-pre:p-4
                       prose-blockquote:border-l-4 prose-blockquote:border-[#FCD535] prose-blockquote:bg-gray-800/50 prose-blockquote:text-gray-300 prose-blockquote:pl-6 prose-blockquote:py-2
                       prose-ul:text-gray-300 prose-ol:text-gray-300
                       prose-li:text-gray-300 prose-li:mb-2
                       prose-table:text-gray-300
                       prose-th:text-white prose-th:bg-gray-800
                       prose-td:border-gray-700
                       prose-hr:border-gray-700"
            dangerouslySetInnerHTML={{ __html: theoryContent.content }}
          />
        )} */}

      </div>
    </div>
  )
}

export default Theory