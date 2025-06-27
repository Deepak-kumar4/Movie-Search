'use client'

import { useEffect, useState, ReactNode } from 'react'

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light'
    setTheme(saved)
    document.documentElement.classList.toggle('dark', saved === 'dark')
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          className="p-2 rounded-full border shadow-md bg-white dark:bg-gray-800"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
      {children}
    </>
  )
}
