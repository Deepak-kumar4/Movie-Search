'use client'

import { useEffect, useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY


interface Movie {
  id: number
  title: string
  poster_path: string | null
}

interface Genre {
  id: number
  name: string
}

export default function FilterBar({
  query,
  setQuery,
  genreId,
  setGenreId,
  year,
  setYear,
}: {
  query: string
  setQuery: (val: string) => void
  genreId: number | null
  setGenreId: (val: number | null) => void
  year: string | null
  setYear: (val: string | null) => void
}) {
  const [genres, setGenres] = useState<Genre[]>([])
  const [suggestions, setSuggestions] = useState<Movie[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Genre list fetch
  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}`)
      .then((res) => res.json())
      .then((data) => setGenres(data.genres || []))
  }, [])

  // Movie title suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim()) {
        setSuggestions([])
        return
      }

      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
      )
      const data = await res.json()
      setSuggestions(data.results?.slice(0, 6) || [])
    }

    const timer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timer)
  }, [query])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6 flex-wrap">
      {/* AutoComplete Movie Search */}
      <div className="relative w-full sm:w-64" ref={dropdownRef}>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a movie..."
          onFocus={() => setShowDropdown(true)}
        />
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute z-50 w-full bg-white dark:bg-gray-800 shadow-md rounded mt-1 max-h-80 overflow-y-auto">
            {suggestions.map((movie) => (
              <Link
                key={movie.id}
                href={`/movies/${movie.id}`}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                      : '/no-image.jpg'
                  }
                  alt={movie.title}
                  className="w-10 h-14 object-cover rounded"
                />
                <span className="text-sm font-medium text-black dark:text-white truncate">
                  {movie.title}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Genre Dropdown */}
      <select
        value={genreId ?? ''}
        onChange={(e) => setGenreId(e.target.value ? Number(e.target.value) : null)}
        className="px-3 py-2 rounded border bg-white dark:bg-gray-800 text-sm"
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>

      {/* Year Dropdown */}
      <select
        value={year ?? ''}
        onChange={(e) => setYear(e.target.value || null)}
        className="px-3 py-2 rounded border bg-white dark:bg-gray-800 text-sm w-28"
      >
        <option value="">All Years</option>
        {Array.from({ length: 26 }, (_, i) => 2000 + i).map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  )
}


