'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY

// Predefined genre mapping from TMDB
const GENRE_MAP: { [key: number]: string } = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
}

export interface Movie {
  id: number
  title: string
  poster_path: string | null
  release_date: string
  genre_ids: number[]
  overview: string
}

export default function MovieList({
  query,
  genreId,
  year,
}: {
  query: string
  genreId: number | null
  year: string | null
}) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setMovies([])
    setPage(1)
    setHasMore(true)
  }, [query, genreId, year])

  useEffect(() => {
    const fetchMovies = async () => {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        query || 'batman'
      )}&page=${page}`
      const res = await fetch(url)
      const data = await res.json()

      let results: Movie[] = data.results || []

      // Filter by genre
      if (genreId) {
        results = results.filter((m) => m.genre_ids.includes(genreId))
      }

      // Filter by year
      if (year) {
        results = results.filter((m) => m.release_date?.startsWith(year))
      }

      setMovies((prev) => {
        const ids = new Set(prev.map((m) => m.id))
        const uniqueNew = results.filter((m) => !ids.has(m.id))
        return [...prev, ...uniqueNew]
      })

      if (results.length < 20) setHasMore(false)
    }

    fetchMovies()
  }, [query, genreId, year, page])

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMore) {
        setPage((prev) => prev + 1)
      }
    })
    if (loaderRef.current) observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [hasMore])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
      {movies.map((movie) => (
        <Link key={movie.id} href={`/movies/${movie.id}`}>
          <Card className="hover:scale-105 transition-transform">
            <CardContent className="p-0">
              <Image
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : '/no-image.jpg'
                }
                alt={movie.title}
                className="w-full h-72 object-cover rounded-t"
              />
              <div className="p-3">
                <h3 className="text-base font-semibold mb-1 truncate">{movie.title}</h3>
                <p className="text-xs text-muted-foreground mb-1">
                  {movie.release_date?.split('-')[0] || 'N/A'}
                </p>
                {/* Genres */}
                <p className="text-xs text-gray-600 dark:text-gray-300 mb-1 line-clamp-1">
                  {movie.genre_ids.map((id) => GENRE_MAP[id]).filter(Boolean).join(', ')}
                </p>
                {/* Overview */}
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                  {movie.overview || 'No description available.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
      <div ref={loaderRef} className="h-16 col-span-full text-center text-gray-400 pt-4">
        {hasMore ? 'Loading more...' : 'No more results'}
      </div>
    </div>
  )
}


