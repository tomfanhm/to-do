import { createFileRoute } from "@tanstack/react-router"

import { Header } from "@/components/header"
import { ProtectedRoute } from "@/components/protected-route"

export const Route = createFileRoute("/_pathlessLayout/")({
  component: App,
  ssr: false, // Disable SSR for this route
})

function App() {
  return (
    <ProtectedRoute>
      <Header />
      <div className="mx-auto flex max-w-7xl flex-1 overflow-hidden p-6 lg:px-8">
        <main className="flex-1 overflow-y-auto"></main>
      </div>
    </ProtectedRoute>
  )
}
