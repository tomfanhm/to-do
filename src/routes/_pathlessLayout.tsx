import { Outlet, createFileRoute } from "@tanstack/react-router"

import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"

export const Route = createFileRoute("/_pathlessLayout")({
  component: PathlessLayoutComponent,
})

function PathlessLayoutComponent() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <Outlet />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}
