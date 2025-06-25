'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { searchPosts } from '@/components/Blog/help/markdown'
import { BlogPost } from '@/components/Blog/help/types'
import BlogSearch from '@/components/Blog/BlogSearch'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const [searchResults, setSearchResults] = useState<BlogPost[]>([])

  useEffect(() => {
    const performSearch = async () => {
      if (query) {
        try {
          const results = await searchPosts(query)
          setSearchResults(results)
        } catch (error) {
          console.error('Search error:', error)
          setSearchResults([])
        }
      } else {
        setSearchResults([])
      }
    }

    performSearch()
  }, [query])

  return (
    <BlogSearch posts={searchResults} />
  )
} 