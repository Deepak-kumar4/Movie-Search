'use client'

import './globals.css'
import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/lib/store'
import ThemeProvider from '@/components/ThemeProvider'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider store={store}>
          <ThemeProvider>{children}</ThemeProvider>
        </Provider>
      </body>
    </html>
  )
}

