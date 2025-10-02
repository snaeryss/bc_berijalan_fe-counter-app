'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/utils/classname.util'

interface NavItemProps {
  href: string
  icon: string
  label: string
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label }) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm',
        isActive 
          ? 'bg-blue-100 text-blue-700 font-semibold' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      <span className="material-symbols-outlined text-base">{icon}</span>
      <span>{label}</span>
    </Link>
  )
}

interface NavCategoryProps {
  title: string
}

const NavCategory: React.FC<NavCategoryProps> = ({ title }) => (
  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mt-6 mb-2">
    {title}
  </h3>
)

const Nav: React.FC<{ className?: string }> = ({ className }) => {
  const pathname = usePathname()
  const isManagementPageActive = pathname.startsWith('/counter-manager') || pathname.startsWith('/queue-management');

  const [isManagementOpen, setIsManagementOpen] = useState(isManagementPageActive);

  return (
    <nav className={cn('flex flex-col', className)}>
      <NavCategory title="Main Menu" />
      <div className="flex flex-col space-y-1">
        <NavItem href="/" icon="home" label="Beranda" />
        <NavItem href="/queue-ticket" icon="confirmation_number" label="Ambil Antrian" />
        <NavItem href="/queue-display" icon="list_alt" label="Display Antrian" />
        <NavItem href="/queue-status" icon="search" label="Cek Status" />
      </div>

      <NavCategory title="Manajemen Admin" />
      <div className="flex flex-col space-y-1">
        <NavItem href="/admin" icon="shield_person" label="Manajemen Admin" />
        <NavItem href="/counter-operator" icon="support_agent" label="Operator Counter" />

        <div>
          <button
            onClick={() => setIsManagementOpen(!isManagementOpen)}
            className={cn(
              'w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md transition-colors text-sm',
              isManagementPageActive
                ? 'bg-blue-100 text-blue-700 font-semibold'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-base">settings</span>
              <span>Manajemen</span>
            </div>
            <span className={cn(
              'material-symbols-outlined text-base transition-transform',
              isManagementOpen && 'rotate-180'
            )}>
              expand_more
            </span>
          </button>

          {isManagementOpen && (
            <div className="mt-1 pl-6 space-y-1 border-l-2 border-gray-200 ml-4">
              <NavItem href="/counter-manager" icon="store" label="Manajemen Counter" />
              <NavItem href="/queue-management" icon="receipt_long" label="Manajemen Antrian" />
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Nav