'use client'

import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { setQuery } from '@/lib/searchSlice'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

export default function SearchInput() {
  const dispatch = useAppDispatch()
  const query = useAppSelector((state) => state.search.query)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setQuery(e.target.value))

    // Optional: Navigate to /movies automatically after typing
    if (e.target.value.length > 2) {
      router.push('/movies')
    }
  }

  return (
    <Input
      placeholder="Search movies..."
      value={query}
      onChange={handleChange}
      className="w-full max-w-md mx-auto"
    />
  )
}
