import { useEffect } from "react"
import { Outlet, createFileRoute } from "@tanstack/react-router"

import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { cleanupAuth, initializeAuth } from "@/stores/auth-store"
import { cleanupTasks } from "@/stores/task-store"

export const Route = createFileRoute("/_pathlessLayout")({
  component: PathlessLayoutComponent,
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
