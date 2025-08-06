'use client'

import { AccountChecker } from '@/components/account/account-ui'
import { AppFooter } from '@/components/app-footer'
import { AppHeader } from '@/components/app-header'
import { AppStatus } from '@/components/app-status'
import { ClusterChecker } from '@/components/cluster/cluster-ui'
import React from 'react'
import { ThemeProvider } from './theme-provider'
import { Toaster } from './ui/sonner'

export function AppLayout({
  children,
  links,
}: {
  children: React.ReactNode
  links: { label: string; path: string }[]
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="flex flex-col min-h-screen">
        <AppHeader links={links} />
        <main className="flex-grow container mx-auto p-4">
          <div className="space-y-4">
            <AppStatus />
            <ClusterChecker>
              <AccountChecker />
            </ClusterChecker>
            {children}
          </div>
        </main>
        <AppFooter />
      </div>
      <Toaster />
    </ThemeProvider>
  )
}
