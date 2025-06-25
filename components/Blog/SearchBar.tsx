'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { IoSearchSharp } from "react-icons/io5";
interface SearchBarProps {
  placeholder?: string
  onSearch?: (query: string) => void
  initialQuery?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search articles...',
  onSearch,
  initialQuery = '',
}) => {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      if (onSearch) {
        onSearch(query.trim())
      } else {
        router.push(`/blog/search?q=${encodeURIComponent(query.trim())}`)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setQuery('')
      inputRef.current?.blur()
    }
  }

  const handleClear = () => {
    setQuery('')
    inputRef.current?.focus()
    if (onSearch) {
      onSearch('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pr-20 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#FCD535]/80 focus:!ring-[#FCD535]/80 active:ring-[#FCD535]/80"
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            aria-label="Clear search"
          >
          </button>
        )}

        {/* Search button */}
        <Button
          type="submit"
          size="sm"
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 px-3 bg-[#FCD535]/80 hover:bg-[#FCD535]/"
          disabled={!query.trim()}
        >
          <IoSearchSharp className='text-white' size={20} />

        </Button>
      </div>

      {/* Search suggestions or hints could go here */}
      {query && query.length > 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 text-sm text-gray-400">
          Press Enter to search for &quot;{query}&quot;
        </div>
      )}
    </form>
  )
}

export default SearchBar 