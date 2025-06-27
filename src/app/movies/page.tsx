'use client'

import { useState } from 'react'
import FilterBar from '@/components/FilterBar'
import MovieList from '@/components/MovieList'

export default function MoviesPage() {
  const [query, setQuery] = useState('')
  const [genreId, setGenreId] = useState<number | null>(null)
  const [year, setYear] = useState<string | null>(null)

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen px-4 py-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-red-600 mb-4 text-center">MovieBox</h1>

      <FilterBar
        query={query}
        setQuery={setQuery}
        genreId={genreId}
        setGenreId={setGenreId}
        year={year}
        setYear={setYear}
      />

      <MovieList query={query} genreId={genreId} year={year} />
    </div>
  )
}












