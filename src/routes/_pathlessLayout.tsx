import { useEffect } from "react"
import { createFileRoute, Outlet } from "@tanstack/react-router"

import { Toaster } from "@/components/ui/sonner"
import { NotFound } from "@/components/not-found"
import { ThemeProvider } from "@/components/theme-provider"
import { cleanupAuth, initializeAuth } from "@/stores/auth-store"
import { cleanupTasks } from "@/stores/task-store"

export const Route = createFileRoute("/_pathlessLayout")({
  component: PathlessLayoutComponent,
  notFoundComponent: () => <NotFound />,
})

function PathlessLayoutComponent() {
  useEffect(() => {
    initializeAuth()

    return () => {
      cleanupAuth()
      cleanupTasks()
    }
  }, [])
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Outlet />
      <Toaster />
    </ThemeProvider>
  )
}
