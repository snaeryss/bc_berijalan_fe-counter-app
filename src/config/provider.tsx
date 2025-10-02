'use client'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react'
import { getQueryClient } from './query.config'
import { SSEProvider } from '@/components/organisms/SSEProvider'

const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = getQueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <SSEProvider>{children}</SSEProvider>
      
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default Provider
