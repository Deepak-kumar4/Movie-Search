'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY


interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string
  release_date: string
  runtime?: number
  genres?: { id: number; name: string }[]
  vote_average?: number
  tagline?: string
}

export default function MovieDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [rating, setRating] = useState<number>(0)

  const localStorageKey = `rating-${id}`
  const movieCacheKey = `movie-${id}`

  useEffect(() => {
    const fetchMovie = async () => {
      const cached = localStorage.getItem(movieCacheKey)
      if (cached) {
        setMovie(JSON.parse(cached))
        return
      }

      try {
        const res = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`)
        const data = await res.json()
        if (data && !data.status_code) {
          setMovie(data)
          localStorage.setItem(movieCacheKey, JSON.stringify(data))
        }
      } catch (err) {
        console.error('Failed to fetch movie:', err)
      }
    }

    fetchMovie()

    const savedRating = localStorage.getItem(localStorageKey)
    if (savedRating) setRating(Number(savedRating))
  }, [id])

  const handleStarClick = (value: number) => {
    setRating(value)
    localStorage.setItem(localStorageKey, value.toString())
  }

  if (!movie) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 text-center text-red-600 font-semibold"
      >
        Loading...
      </motion.div>
    )
  }

  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* 🔙 Back Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded text-black dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
      >
        ← Back
      </motion.button>

      <motion.h1
        className="text-3xl font-bold mb-2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {movie.title}
      </motion.h1>

      {movie.tagline && (
        <motion.p
          className="text-center italic mb-4 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          "{movie.tagline}"
        </motion.p>
      )}

      <motion.div
        className="flex flex-col md:flex-row gap-6 bg-white dark:bg-gray-900 p-4 rounded-xl shadow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : '/no-image.jpg'
          }
          alt={movie.title}
          className="w-full md:w-64 object-cover rounded shadow"
          whileHover={{ scale: 1.02 }}
        />

        <div className="space-y-2 text-base text-gray-700 dark:text-gray-200">
          <p><strong>Year:</strong> {movie.release_date?.split('-')[0]}</p>
          <p><strong>Genre:</strong> {movie.genres?.map(g => g.name).join(', ')}</p>
          <p><strong>Rating:</strong> {movie.vote_average?.toFixed(1)}</p>
          {movie.runtime && <p><strong>Runtime:</strong> {movie.runtime} min</p>}
          <p><strong>Overview:</strong> {movie.overview}</p>
        </div>
      </motion.div>

      <motion.div
        className="mt-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow text-black dark:text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-semibold mb-2">Your Rating</h2>
        <div className="flex gap-2 text-3xl">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.span
              key={star}
              onClick={() => handleStarClick(star)}
              className={`cursor-pointer ${star <= rating ? 'text-yellow-400' : 'text-gray-400'}`}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 1.5 }}
            >
              ★
            </motion.span>
          ))}
        </div>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {rating > 0
            ? `You rated this ${rating} star${rating > 1 ? 's' : ''}.`
            : 'Click a star to rate this movie.'}
        </p>
      </motion.div>
    </motion.div>
  )
}











