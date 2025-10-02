'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/classname.util'

export default function Header() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === '/') return pathname === path;
    return pathname.startsWith(path);
  }

  const navItems = [
    { name: 'Beranda', path: '/' },
    { name: 'Manajemen Admin', path: '/admin' },
  ]

  return (
    <header className="bg-white sticky top-0 z-40 border-b border-gray-200 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex-shrink-0 flex items-center">
            
              <span className="text-2xl font-bold text-slate-800 hidden sm:block">
                Antri.Q
              </span>
            
          </div>

          <nav className="flex items-center space-x-2 sm:space-x-4">
            {navItems.map(item => (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive(item.path) 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-500 hover:bg-gray-100'
                )}
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/login"
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors border',
                isActive('/login')
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'text-blue-600 bg-white border-blue-500 hover:bg-blue-50'
              )}
            >
              Login
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}